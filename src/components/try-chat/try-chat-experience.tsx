"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GithubIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import {
  formatGithubRepoStatNumber,
  type SynaplanGithubRepoStats,
} from "@/lib/github-synaplan-repo";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Cpu,
  Send,
  Shield,
} from "lucide-react";
import {
  TryChatDemoChatCard,
  type DemoStatusPayload,
} from "@/components/try-chat/try-chat-demo-chat-card";
import {
  TryChatFullscreenDemoToast,
  TryChatFullscreenModeBar,
  TryChatFullscreenRail,
  TryChatFullscreenTopBar,
} from "@/components/try-chat/try-chat-fullscreen-chrome";

type ChatRow = { role: "user" | "assistant"; content: string };

const DEMO_CHAT_ROWS_STORAGE_KEY = "synaplan-try-chat-rows-v1";

function parseStoredRows(raw: string | null): ChatRow[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const out: ChatRow[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === "object" &&
        "role" in item &&
        "content" in item &&
        typeof (item as ChatRow).content === "string"
      ) {
        const role = (item as ChatRow).role;
        if (role === "user" || role === "assistant") {
          out.push({ role, content: (item as ChatRow).content });
        }
      }
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

type StatusPayload = DemoStatusPayload;

export type TryChatExperienceProps = {
  githubRepo?: SynaplanGithubRepoStats | null;
};

function formatGithubRepoNumber(
  value: number | undefined,
  locale: string,
): string {
  if (value === undefined) return "\u2014";
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US").format(
    value,
  );
}

async function parseSSEStream(
  stream: ReadableStream<Uint8Array>,
  onChunk: (s: string) => void,
  onComplete: () => void,
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";
      for (const block of blocks) {
        const lines = block.split("\n");
        let data = "";
        for (const line of lines) {
          if (line.startsWith("data:")) {
            data += line.slice(5).trim();
          }
        }
        if (!data) continue;
        try {
          const j = JSON.parse(data) as Record<string, unknown>;
          if (typeof j.chunk === "string" && j.chunk.length > 0) {
            onChunk(j.chunk);
          }
          if (j.status === "complete") {
            onComplete();
          }
        } catch {
          /* ignore malformed line */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  onComplete();
}

export function TryChatExperience({
  githubRepo = null,
}: TryChatExperienceProps) {
  const t = useTranslations("tryChat");
  const locale = useLocale();
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  /** API unreachable / 502 — show single CTA to web.synaplan.com */
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const demoToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [demoToastVisible, setDemoToastVisible] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const showDemoToast = useCallback(() => {
    setDemoToastVisible(true);
    if (demoToastTimerRef.current) clearTimeout(demoToastTimerRef.current);
    demoToastTimerRef.current = setTimeout(() => {
      setDemoToastVisible(false);
      demoToastTimerRef.current = null;
    }, 6200);
  }, []);

  useEffect(() => {
    return () => {
      if (demoToastTimerRef.current) clearTimeout(demoToastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  const scrollMessagesToBottom = useCallback(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/demo-chat/status", { credentials: "include" });
        const j = (await res.json()) as StatusPayload;
        if (!cancelled) setStatus(j);
      } catch {
        if (!cancelled)
          setStatus({
            configured: false,
            max: 10,
            remaining: 0,
            sent: 0,
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stored = parseStoredRows(
      sessionStorage.getItem(DEMO_CHAT_ROWS_STORAGE_KEY),
    );
    if (stored) setRows(stored);
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    if (rows.length === 0) {
      sessionStorage.removeItem(DEMO_CHAT_ROWS_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(DEMO_CHAT_ROWS_STORAGE_KEY, JSON.stringify(rows));
  }, [rows, storageReady]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollMessagesToBottom();
    });
  }, [rows, streaming, scrollMessagesToBottom]);

  useEffect(() => {
    if (!status?.configured) return;
    if (!storageReady) return;
    if (status.remaining <= 0) {
      setLimitReached(true);
      setRows((r) =>
        r.length === 0
          ? [{ role: "assistant", content: t("limitWelcome") }]
          : r,
      );
      return;
    }
    setRows((r) =>
      r.length === 0 ? [{ role: "assistant", content: t("welcome") }] : r,
    );
  }, [status, t, storageReady]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming || !status?.configured) return;
    if (status.remaining <= 0) {
      setLimitReached(true);
      return;
    }

    setInput("");
    setRows((r) => [...r, { role: "user", content: text }]);
    setRows((r) => [...r, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/demo-chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text }),
      });

      const ct = res.headers.get("content-type") ?? "";

      if (res.status === 429) {
        setLimitReached(true);
        setRows((r) => {
          const next = [...r];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            next[next.length - 1] = {
              role: "assistant",
              content:
                last.content.trim().length > 0 ? last.content : t("limitInline"),
            };
          }
          return next;
        });
        setStatus((s) => (s ? { ...s, remaining: 0 } : s));
        return;
      }

      if (!res.ok || !ct.includes("event-stream") || !res.body) {
        await res.json().catch(() => null);
        setApiUnavailable(true);
        setRows((r) => {
          const next = [...r];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            next[next.length - 1] = {
              role: "assistant",
              content:
                last.content.trim().length > 0
                  ? last.content
                  : t("unavailableInline"),
            };
          }
          return next;
        });
        return;
      }

      await parseSSEStream(
        res.body,
        (chunk) => {
          setRows((r) => {
            const next = [...r];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return next;
          });
        },
        () => {},
      );

      const st = await fetch("/api/demo-chat/status", { credentials: "include" });
      const j = (await st.json()) as StatusPayload;
      setStatus(j);
    } catch {
      setApiUnavailable(true);
      setRows((r) => {
        const next = [...r];
        const last = next[next.length - 1];
        if (last?.role === "assistant") {
          next[next.length - 1] = {
            role: "assistant",
            content:
              last.content.trim().length > 0
                ? last.content
                : t("unavailableInline"),
          };
        }
        return next;
      });
    } finally {
      setStreaming(false);
    }
  };

  const disabled =
    !status?.configured ||
    streaming ||
    limitReached ||
    apiUnavailable ||
    (status?.remaining ?? 0) <= 0;

  const showEndPanel = limitReached || apiUnavailable;

  const quickChips: { label: string; prompt: string }[] = [
    { label: t("quickChip1"), prompt: t("quickPrompt1") },
    { label: t("quickChip2"), prompt: t("quickPrompt2") },
    { label: t("quickChip3"), prompt: t("quickPrompt3") },
  ];

  const bottomCards = [
    {
      icon: Shield,
      title: t("bottomCard1Title"),
      body: t("bottomCard1Body"),
    },
    {
      icon: Cpu,
      title: t("bottomCard2Title"),
      body: t("bottomCard2Body"),
    },
    {
      icon: BookOpen,
      title: t("bottomCard3Title"),
      body: t("bottomCard3Body"),
    },
  ];

  return (
    <div className="relative overflow-hidden bg-page-tint">
      {/* Soft brand glows — same language as homepage hero */}
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

      <div className="container-wide section-padding relative z-10 pb-20 pt-10 md:pb-28 md:pt-14">
        {!isFullscreen && (
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left — hero copy (Figma: Live preview + headline stack) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-soft-accent px-3 py-1.5 text-sm font-semibold text-[#002c92]">
              <span className="size-2 rounded-full bg-[#002c92]" aria-hidden />
              {t("heroEyebrow")}
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-[#221823] sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                {t("heroDisplay")}
              </h1>
              <p className="text-balance text-2xl font-semibold leading-snug text-[#002c92] sm:text-[1.65rem] lg:text-[1.85rem]">
                {t("title")}
              </p>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-[#434654]">
                {t("subtitle")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[rgb(196_197_215/0.15)] bg-chat-input-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <p className="text-sm font-semibold text-[#221823]">
                  {t("feature1Title")}
                </p>
                <p className="mt-1 text-sm text-[#434654]">{t("feature1Sub")}</p>
              </div>
              <div className="rounded-xl border border-[rgb(196_197_215/0.15)] bg-chat-input-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <p className="text-sm font-semibold text-[#221823]">
                  {t("feature2Title")}
                </p>
                <p className="mt-1 text-sm text-[#434654]">{t("feature2Sub")}</p>
              </div>
            </div>
          </motion.div>

          {/* Right — glass chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="relative lg:sticky lg:top-28"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 z-0 hidden size-24 rotate-12 rounded-2xl border border-white/50 bg-gradient-to-br from-white to-soft-accent shadow-xl sm:block"
            />
            <TryChatDemoChatCard
              variant="embedded"
              isFullscreen={false}
              onEnterFullscreen={() => setIsFullscreen(true)}
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
          </motion.div>
        </div>
        )}

        {!isFullscreen && (
        <>
        {/* Bottom feature grid — Figma three cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-20 grid max-w-6xl gap-6 md:grid-cols-3"
        >
          {bottomCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-[rgb(196_197_215/0.1)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-soft-accent text-[#002c92]">
                <card.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#221823]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#434654]">
                {card.body}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Extra narrative — docs/planning: product story, trust, next steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mx-auto mt-20 max-w-3xl text-center"
          aria-labelledby="try-chat-preview-heading"
        >
          <h2
            id="try-chat-preview-heading"
            className="text-2xl font-bold tracking-tight text-[#221823] sm:text-3xl"
          >
            {t("previewSectionTitle")}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-[#434654]">
            {t("previewSectionP1")}
          </p>
          <p className="mt-3 text-pretty text-base leading-relaxed text-[#434654]">
            {t("previewSectionP2")}
          </p>
          <p className="mt-6 text-sm font-medium text-[#747686]">
            {t("disclaimer")}
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="mx-auto mt-16 max-w-6xl"
          aria-labelledby="try-chat-steps-heading"
        >
          <h2
            id="try-chat-steps-heading"
            className="text-center text-2xl font-bold tracking-tight text-[#221823] sm:text-3xl"
          >
            {t("stepsSectionTitle")}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(
              [
                {
                  step: 1,
                  title: t("step1Title"),
                  body: t("step1Body"),
                },
                {
                  step: 2,
                  title: t("step2Title"),
                  body: t("step2Body"),
                },
                {
                  step: 3,
                  title: t("step3Title"),
                  body: t("step3Body"),
                },
              ] as const
            ).map((item) => (
              <div
                key={item.step}
                className="relative rounded-[2rem] border border-[rgb(196_197_215/0.12)] bg-gradient-to-b from-white to-page-tint/80 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <span
                  className="inline-flex size-10 items-center justify-center rounded-xl bg-[#002c92] text-sm font-bold text-white"
                  aria-hidden
                >
                  {item.step}
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#221823]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#434654]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          className="mx-auto mt-20 max-w-6xl"
          aria-labelledby="try-chat-explore-heading"
        >
          <h2
            id="try-chat-explore-heading"
            className="text-center text-2xl font-bold tracking-tight text-[#221823] sm:text-3xl"
          >
            {t("exploreSectionTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-base leading-relaxed text-[#434654]">
            {t("exploreSectionLead")}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Link
              href="/solutions/chat-widget"
              className="group flex flex-col rounded-[2rem] border border-[rgb(196_197_215/0.12)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-[#221823]">
                {t("exploreCard1Title")}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#434654]">
                {t("exploreCard1Body")}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#002c92]">
                {t("exploreCtaInternal")}
                <ChevronRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
            <Link
              href="/solutions/memories"
              className="group flex flex-col rounded-[2rem] border border-[rgb(196_197_215/0.12)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-[#221823]">
                {t("exploreCard2Title")}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#434654]">
                {t("exploreCard2Body")}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#002c92]">
                {t("exploreCtaInternal")}
                <ChevronRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
            <a
              href={LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-[2rem] border border-[rgb(196_197_215/0.12)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-[#221823]">
                {t("exploreCard3Title")}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#434654]">
                {t("exploreCard3Body")}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#002c92]">
                {t("exploreCtaDocs")}
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
            </a>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
          className="mx-auto mt-16 max-w-4xl rounded-[2rem] border border-[rgb(196_197_215/0.15)] bg-gradient-to-br from-soft-accent/50 to-white p-8 text-center sm:p-10"
          aria-labelledby="try-chat-trust-heading"
        >
          <h2
            id="try-chat-trust-heading"
            className="text-xl font-bold text-[#221823] sm:text-2xl"
          >
            {t("trustSectionTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-[#434654] sm:text-base">
            {t("trustSectionBody")}
          </p>
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-[#434654]"
            aria-label={t("trustStatsAria")}
          >
            <a
              href={`${LINKS.github}/stargazers`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-soft-accent/60 hover:text-[#002c92]"
            >
              <span className="text-lg font-bold tabular-nums text-[#221823]">
                {formatGithubRepoStatNumber(
                  githubRepo?.stars,
                  locale,
                )}
              </span>
              <span>{t("trustStatStars")}</span>
            </a>
            <span className="text-[#747686]" aria-hidden>
              —
            </span>
            <a
              href={`${LINKS.github}/forks`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-soft-accent/60 hover:text-[#002c92]"
            >
              <span className="text-lg font-bold tabular-nums text-[#221823]">
                {formatGithubRepoStatNumber(
                  githubRepo?.forks,
                  locale,
                )}
              </span>
              <span>{t("trustStatForks")}</span>
            </a>
            <span className="text-[#747686]" aria-hidden>
              —
            </span>
            <a
              href={`${LINKS.github}/blob/main/LICENSE`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-soft-accent/60 hover:text-[#002c92]"
            >
              <span className="text-lg font-bold tabular-nums text-[#221823]">
                {githubRepo?.licenseLabel ?? "\u2014"}
              </span>
              <span>{t("trustStatLicense")}</span>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "gap-2 rounded-xl border-[rgb(196_197_215/0.35)]",
              )}
            >
              <GithubIcon className="size-4" aria-hidden />
              {t("trustGithubCta")}
            </a>
            <a
              href={LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "gap-2 rounded-xl border-[rgb(196_197_215/0.35)]",
              )}
            >
              <BookOpen className="size-4" aria-hidden />
              {t("trustDocsCta")}
            </a>
          </div>
        </motion.section>
        </>
        )}
      </div>
      {portalReady &&
        isFullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex h-[100dvh] max-h-[100dvh] w-full flex-row overflow-hidden bg-gradient-to-br from-[#f6f4fb] to-[#eef2ff] pb-[env(safe-area-inset-bottom,0px)]">
            <TryChatFullscreenRail onDemoAction={showDemoToast} />
            <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
              <TryChatFullscreenTopBar
                onDemoAction={showDemoToast}
                onExit={() => setIsFullscreen(false)}
                localeLabel={locale.startsWith("de") ? "DE" : "EN"}
              />
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-1 pb-1 sm:px-3">
                <TryChatDemoChatCard
                  variant="fullscreenPortal"
                  isFullscreen
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
              <TryChatFullscreenModeBar onDemoAction={showDemoToast} />
            </div>
          </div>,
          document.body,
        )}
      <TryChatFullscreenDemoToast
        visible={demoToastVisible}
        onDismiss={() => setDemoToastVisible(false)}
      />
    </div>
  );
}
