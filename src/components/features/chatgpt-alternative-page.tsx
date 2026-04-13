"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { LINKS } from "@/lib/constants"
import { GithubIcon } from "@/components/icons"
import type { SynaplanGithubRepoStats } from "@/lib/github-synaplan-repo"
import { Link } from "@/i18n/navigation"
import { ArrowRight, Brain, FileText, Globe, Lock, RefreshCw, Server } from "lucide-react"
import {
  TryChatDemoChatCard,
  type DemoChatRow,
  type DemoStatusPayload,
} from "@/components/try-chat/try-chat-demo-chat-card"

type ChatRow = DemoChatRow

const STORAGE_KEY = "synaplan-try-chat-rows-v1"

function parseStoredRows(raw: string | null): ChatRow[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    const out: ChatRow[] = []
    for (const item of parsed) {
      if (
        item &&
        typeof item === "object" &&
        "role" in item &&
        "content" in item &&
        typeof (item as ChatRow).content === "string"
      ) {
        const role = (item as ChatRow).role
        if (role === "user" || role === "assistant") {
          out.push({ role, content: (item as ChatRow).content })
        }
      }
    }
    return out.length > 0 ? out : null
  } catch {
    return null
  }
}

async function parseSSEStream(
  stream: ReadableStream<Uint8Array>,
  onChunk: (s: string) => void,
  onComplete: () => void,
) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split("\n\n")
      buffer = blocks.pop() ?? ""
      for (const block of blocks) {
        const lines = block.split("\n")
        let data = ""
        for (const line of lines) {
          if (line.startsWith("data:")) {
            data += line.slice(5).trim()
          }
        }
        if (!data) continue
        try {
          const j = JSON.parse(data) as Record<string, unknown>
          if (typeof j.chunk === "string" && j.chunk.length > 0) {
            onChunk(j.chunk)
          }
          if (j.status === "complete") {
            onComplete()
          }
        } catch {
          /* ignore malformed line */
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
  onComplete()
}

export type ChatGptAlternativePageProps = {
  githubRepo?: SynaplanGithubRepoStats | null
}

export function ChatGptAlternativePage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  githubRepo = null,
}: ChatGptAlternativePageProps) {
  const t = useTranslations("tryChat")
  const tc = useTranslations("chatgptAlt")
  const [status, setStatus] = useState<DemoStatusPayload | null>(null)
  const [rows, setRows] = useState<ChatRow[]>([])
  const [storageReady, setStorageReady] = useState(false)
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [apiUnavailable, setApiUnavailable] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollMessagesToBottom = useCallback(() => {
    const el = messagesScrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" })
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/demo-chat/status", { credentials: "include" })
        const j = (await res.json()) as DemoStatusPayload
        if (!cancelled) setStatus(j)
      } catch {
        if (!cancelled)
          setStatus({ configured: false, max: 10, remaining: 0, sent: 0 })
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const stored = parseStoredRows(sessionStorage.getItem(STORAGE_KEY))
    if (stored) setRows(stored)
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (!storageReady) return
    if (rows.length === 0) {
      sessionStorage.removeItem(STORAGE_KEY)
      return
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  }, [rows, storageReady])

  useEffect(() => {
    requestAnimationFrame(() => { scrollMessagesToBottom() })
  }, [rows, streaming, scrollMessagesToBottom])

  useEffect(() => {
    if (!status?.configured) return
    if (!storageReady) return
    if (status.remaining <= 0) {
      setLimitReached(true)
      setRows((r) => r.length === 0 ? [{ role: "assistant", content: t("limitWelcome") }] : r)
      return
    }
    setRows((r) => r.length === 0 ? [{ role: "assistant", content: t("welcome") }] : r)
  }, [status, t, storageReady])

  const send = async () => {
    const text = input.trim()
    if (!text || streaming || !status?.configured) return
    if (status.remaining <= 0) { setLimitReached(true); return }

    setInput("")
    setRows((r) => [...r, { role: "user", content: text }])
    setRows((r) => [...r, { role: "assistant", content: "" }])
    setStreaming(true)

    try {
      const res = await fetch("/api/demo-chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text }),
      })

      const ct = res.headers.get("content-type") ?? ""

      if (res.status === 429) {
        setLimitReached(true)
        setRows((r) => {
          const next = [...r]
          const last = next[next.length - 1]
          if (last?.role === "assistant")
            next[next.length - 1] = { role: "assistant", content: last.content.trim().length > 0 ? last.content : t("limitInline") }
          return next
        })
        setStatus((s) => (s ? { ...s, remaining: 0 } : s))
        return
      }

      if (!res.ok || !ct.includes("event-stream") || !res.body) {
        await res.json().catch(() => null)
        setApiUnavailable(true)
        setRows((r) => {
          const next = [...r]
          const last = next[next.length - 1]
          if (last?.role === "assistant")
            next[next.length - 1] = { role: "assistant", content: last.content.trim().length > 0 ? last.content : t("unavailableInline") }
          return next
        })
        return
      }

      await parseSSEStream(
        res.body,
        (chunk) => {
          setRows((r) => {
            const next = [...r]
            const last = next[next.length - 1]
            if (last?.role === "assistant")
              next[next.length - 1] = { ...last, content: last.content + chunk }
            return next
          })
        },
        () => {},
      )

      const st = await fetch("/api/demo-chat/status", { credentials: "include" })
      const j = (await st.json()) as DemoStatusPayload
      setStatus(j)
    } catch {
      setApiUnavailable(true)
      setRows((r) => {
        const next = [...r]
        const last = next[next.length - 1]
        if (last?.role === "assistant")
          next[next.length - 1] = { role: "assistant", content: last.content.trim().length > 0 ? last.content : t("unavailableInline") }
        return next
      })
    } finally {
      setStreaming(false)
    }
  }

  const disabled =
    !status?.configured || streaming || limitReached || apiUnavailable || (status?.remaining ?? 0) <= 0
  const showEndPanel = limitReached || apiUnavailable

  const quickChips: { label: string; prompt: string }[] = [
    { label: t("quickChip1"), prompt: t("quickPrompt1") },
    { label: t("quickChip2"), prompt: t("quickPrompt2") },
    { label: t("quickChip3"), prompt: t("quickPrompt3") },
  ]

  const features = [
    { icon: Globe, title: tc("f1Title"), desc: tc("f1Desc") },
    { icon: Lock, title: tc("f2Title"), desc: tc("f2Desc") },
    { icon: Server, title: tc("f3Title"), desc: tc("f3Desc") },
  ]

  return (
    <div className="relative overflow-hidden bg-page-tint">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-16 size-96 rounded-full bg-[#002c92]/35 blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-32 -right-16 size-80 rounded-full bg-[#003fc7]/30 blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,44,146,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,44,146,0.04) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      {/* Hero: pill badge + chat that sizes to its content */}
      <div className="container-wide section-padding relative z-10 pb-10 pt-8 md:pb-14 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex max-w-3xl flex-col items-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-soft-accent px-3 py-1.5 text-sm font-semibold text-[#002c92]">
            <span className="size-2 rounded-full bg-[#002c92]" aria-hidden />
            {tc("heroEyebrow")}
          </div>

          <div className="w-full">
            <TryChatDemoChatCard
              variant="embedded"
              isFullscreen={false}
              status={status}
              rows={rows}
              streaming={streaming}
              disabled={disabled}
              showEndPanel={showEndPanel}
              limitReached={limitReached}
              apiUnavailable={apiUnavailable}
              input={input}
              setInput={setInput}
              send={send}
              messagesScrollRef={messagesScrollRef}
              textareaRef={textareaRef}
              quickChips={quickChips}
            />
          </div>

          <a
            href={LINKS.web}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {tc("heroCta")}
            <ArrowRight className="size-3.5" />
          </a>
        </motion.div>
      </div>

      {/* SEO content below the chat */}
      <div className="relative z-10 bg-white">
        <div className="container-wide section-padding py-16 sm:py-20">
          {/* H1 + intro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-[#221823] sm:text-4xl lg:text-5xl">
              {tc("h1")}
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-[#434654]">
              {tc("intro")}
            </p>
          </motion.div>

          {/* Quick feature grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3"
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[rgb(196_197_215/0.15)] bg-page-tint p-7"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-soft-accent text-[#002c92]">
                  <f.icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#221823]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#434654]">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Deep-dive cards: Works with ChatGPT, Local RAG, Memory migration */}
          <div className="mx-auto mt-20 max-w-5xl space-y-10">
            {([
              {
                icon: RefreshCw,
                title: tc("worksWithTitle"),
                desc: tc("worksWithDesc"),
                linkText: tc("worksWithLink"),
                href: tc("worksWithHref"),
              },
              {
                icon: FileText,
                title: tc("ragTitle"),
                desc: tc("ragDesc"),
                linkText: tc("ragLink"),
                href: tc("ragHref"),
              },
              {
                icon: Brain,
                title: tc("memoriesTitle"),
                desc: tc("memoriesDesc"),
                linkText: tc("memoriesLink"),
                href: tc("memoriesHref"),
              },
            ] as const).map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex gap-6 rounded-2xl border border-[rgb(196_197_215/0.15)] bg-page-tint p-8 max-md:flex-col"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-soft-accent text-[#002c92]">
                  <card.icon className="size-5" aria-hidden />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#221823]">{card.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#434654]">{card.desc}</p>
                  <Link
                    href={card.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#002c92] hover:underline"
                  >
                    {card.linkText}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <GithubIcon className="size-4" />
              {tc("ctaPrimary")}
              <ArrowRight className="size-3.5" />
            </a>
            <a
              href={LINKS.web}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {tc("ctaSecondary")}
              <ArrowRight className="size-3.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
