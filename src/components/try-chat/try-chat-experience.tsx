"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
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
  Bot,
  ChevronRight,
  Cpu,
  Send,
  Shield,
  User,
} from "lucide-react";

type ChatRow = { role: "user" | "assistant"; content: string };

type StatusPayload = {
  configured: boolean;
  max: number;
  remaining: number;
  sent: number;
};

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
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  /** API unreachable / 502 — show single CTA to web.synaplan.com */
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    requestAnimationFrame(() => {
      scrollMessagesToBottom();
    });
  }, [rows, streaming, scrollMessagesToBottom]);

  useEffect(() => {
    if (!status?.configured) return;
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
  }, [status, t]);

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
        setRows((r) => r.slice(0, -2));
        setStatus((s) => (s ? { ...s, remaining: 0 } : s));
        return;
      }

      if (!res.ok || !ct.includes("event-stream") || !res.body) {
        await res.json().catch(() => null);
        setApiUnavailable(true);
        setRows((r) => r.slice(0, -2));
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
      setRows((r) => r.slice(0, -2));
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
    <div className="relative overflow-hidden bg-[#fff7fa]">
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
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left — hero copy (Figma: Live preview + headline stack) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f6e3f3] px-3 py-1.5 text-sm font-semibold text-[#002c92]">
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
              <div className="rounded-xl border border-[rgb(196_197_215/0.15)] bg-[#ffeffc] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <p className="text-sm font-semibold text-[#221823]">
                  {t("feature1Title")}
                </p>
                <p className="mt-1 text-sm text-[#434654]">{t("feature1Sub")}</p>
              </div>
              <div className="rounded-xl border border-[rgb(196_197_215/0.15)] bg-[#ffeffc] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <p className="text-sm font-semibold text-[#221823]">
                  {t("feature2Title")}
                </p>
                <p className="mt-1 text-sm text-[#434654]">{t("feature2Sub")}</p>
              </div>
            </div>
          </motion.div>

          {/* Right — glass chat (Figma: main demo card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="relative lg:sticky lg:top-28"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 z-0 hidden size-24 rotate-12 rounded-2xl border border-white/50 bg-gradient-to-br from-white to-[#f6e3f3] shadow-xl sm:block"
            />
            <div
              className={cn(
                "relative z-10 flex max-h-[min(640px,78vh)] flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 shadow-[0_25px_50px_-12px_rgba(0,44,146,0.08)] backdrop-blur-[10px]",
              )}
            >
              {/* Header */}
              <div className="border-b border-[rgb(196_197_215/0.1)] bg-white/40 px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#002c92] to-[#003fc7] shadow-sm">
                      <Bot className="size-5 text-white" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold tracking-tight text-[#221823]">
                        {t("panelLabel")}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className="size-1.5 shrink-0 rounded-full bg-emerald-500"
                          aria-hidden
                        />
                        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#434654]">
                          {t("systemOnline")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {status && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                        status.configured && !limitReached
                          ? "bg-[#dce1ff] text-[#001551]"
                          : "bg-amber-100 text-amber-900",
                      )}
                    >
                      {t("messagesLeft", { count: status.remaining })}
                    </span>
                  )}
                </div>
              </div>

              {!status?.configured && (
                <div className="border-b border-amber-200/60 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
                  {t("notConfigured")}
                </div>
              )}

              {/* Messages — scroll contained here so the page doesn’t jump */}
              <div
                ref={messagesScrollRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-gradient-to-b from-white/40 to-[#fff7fa]/30 px-4 py-5 sm:px-6"
              >
                <div className="flex flex-col gap-5">
                  <AnimatePresence initial={false}>
                    {rows.map((row, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={cn(
                          "flex gap-3",
                          row.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                            row.role === "user"
                              ? "bg-[#003fc7] text-white"
                              : "bg-[#f6e3f3] text-[#002c92]",
                          )}
                        >
                          {row.role === "user" ? (
                            <User className="size-4" aria-hidden />
                          ) : (
                            <Bot className="size-4" aria-hidden />
                          )}
                        </div>
                        <div
                          className={cn(
                            "min-w-0 max-w-[min(100%,22rem)]",
                            row.role === "user" ? "text-right" : "",
                          )}
                        >
                          <div
                            className={cn(
                              "inline-block rounded-2xl px-4 py-3 text-left text-sm leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
                              row.role === "user"
                                ? "rounded-tr-sm bg-[#002c92] text-white"
                                : "rounded-tl-sm border border-[rgb(196_197_215/0.12)] bg-white text-[#221823]",
                            )}
                          >
                            {row.content ||
                              (streaming && i === rows.length - 1 ? (
                                <span className="inline-flex gap-1">
                                  <span className="size-1.5 animate-bounce rounded-full bg-[#434654]/50 [animation-delay:-0.2s]" />
                                  <span className="size-1.5 animate-bounce rounded-full bg-[#434654]/50 [animation-delay:-0.1s]" />
                                  <span className="size-1.5 animate-bounce rounded-full bg-[#434654]/50" />
                                </span>
                              ) : null)}
                          </div>
                          {row.role === "assistant" &&
                            row.content &&
                            i === 0 &&
                            !streaming && (
                              <p className="mt-1.5 pl-1 text-left text-[10px] text-[#434654]">
                                {t("justNow")}
                              </p>
                            )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {showEndPanel && (
                <div className="border-t border-[rgb(196_197_215/0.12)] bg-gradient-to-b from-[#ffeffc]/90 to-white px-5 py-8 text-center sm:px-8">
                  <p className="text-sm font-semibold text-[#221823]">
                    {limitReached ? t("limitTitle") : t("unavailableTitle")}
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#434654]">
                    {limitReached ? t("limitBody") : t("unavailableBody")}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={LINKS.web}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "btn-figma-primary gap-2 rounded-xl border-0 px-8 text-base text-white shadow-none",
                      )}
                    >
                      {t("ctaWeb")}
                      <ArrowUpRight className="size-4" />
                    </a>
                    <a
                      href={LINKS.app}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "rounded-xl",
                      )}
                    >
                      {t("ctaRegister")}
                    </a>
                  </div>
                  <p className="mt-6 text-xs text-[#747686]">
                    <Link
                      href="/"
                      className="font-medium underline underline-offset-2 hover:text-[#002c92]"
                    >
                      {t("backHome")}
                    </Link>
                  </p>
                </div>
              )}

              {!showEndPanel && (
                <div className="border-t border-[rgb(196_197_215/0.1)] bg-white/60 px-4 pb-5 pt-4 sm:px-6">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void send();
                        }
                      }}
                      placeholder={t("placeholder")}
                      disabled={disabled}
                      rows={2}
                      className={cn(
                        "min-h-[3.25rem] w-full resize-none rounded-2xl border border-[rgb(196_197_215/0.2)] bg-white py-3.5 pl-5 pr-14 text-sm leading-relaxed text-[#221823] outline-none transition-[box-shadow,border-color]",
                        "placeholder:text-[#747686]/60",
                        "focus:border-[#002c92]/35 focus:ring-2 focus:ring-[#002c92]/15",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                    />
                    <button
                      type="button"
                      disabled={disabled || !input.trim()}
                      onClick={() => void send()}
                      className={cn(
                        "absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-[#002c92] to-[#003fc7] text-white shadow-[0_10px_15px_-3px_rgba(0,44,146,0.2)] transition-opacity",
                        "hover:opacity-95 disabled:pointer-events-none disabled:opacity-40",
                      )}
                      aria-label={streaming ? t("sending") : t("send")}
                    >
                      <Send className="size-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickChips.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setInput(chip.prompt);
                          textareaRef.current?.focus();
                        }}
                        className="rounded-lg bg-[#fbe8f9] px-3 py-1.5 text-xs font-medium text-[#434654] transition-colors hover:bg-[#f6e3f3] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

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
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f6e3f3] text-[#002c92]">
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
                className="relative rounded-[2rem] border border-[rgb(196_197_215/0.12)] bg-gradient-to-b from-white to-[#fff7fa]/80 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
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
          className="mx-auto mt-16 max-w-4xl rounded-[2rem] border border-[rgb(196_197_215/0.15)] bg-gradient-to-br from-[#f6e3f3]/50 to-white p-8 text-center sm:p-10"
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
              className="inline-flex items-baseline gap-1.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-[#f6e3f3]/60 hover:text-[#002c92]"
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
              className="inline-flex items-baseline gap-1.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-[#f6e3f3]/60 hover:text-[#002c92]"
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
              className="inline-flex items-baseline gap-1.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-[#f6e3f3]/60 hover:text-[#002c92]"
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
      </div>
    </div>
  );
}
