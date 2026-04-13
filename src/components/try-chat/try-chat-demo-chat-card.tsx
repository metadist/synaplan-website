"use client";

import type { RefObject } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AssistantMarkdown } from "@/components/try-chat/assistant-markdown";
import {
  ArrowUpRight,
  Bot,
  Maximize2,
  Send,
  User,
} from "lucide-react";

export type DemoChatRow = { role: "user" | "assistant"; content: string };

export type DemoStatusPayload = {
  configured: boolean;
  max: number;
  remaining: number;
  sent: number;
};

export type TryChatDemoChatCardProps = {
  isFullscreen: boolean;
  onEnterFullscreen?: () => void;
  status: DemoStatusPayload | null;
  rows: DemoChatRow[];
  streaming: boolean;
  disabled: boolean;
  showEndPanel: boolean;
  limitReached: boolean;
  apiUnavailable: boolean;
  input: string;
  setInput: (v: string) => void;
  send: () => void | Promise<void>;
  messagesScrollRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  quickChips: { label: string; prompt: string }[];
  /** Outer shell: embedded vs portal (controls max-height / radius) */
  variant: "embedded" | "fullscreenPortal";
};

export function TryChatDemoChatCard({
  isFullscreen,
  onEnterFullscreen,
  status,
  rows,
  streaming,
  disabled,
  showEndPanel,
  limitReached,
  apiUnavailable,
  input,
  setInput,
  send,
  messagesScrollRef,
  textareaRef,
  quickChips,
  variant,
}: TryChatDemoChatCardProps) {
  const t = useTranslations("tryChat");

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-0 flex-col overflow-hidden",
        variant === "embedded" &&
          "max-h-[min(640px,78vh)] rounded-[2rem] border border-white/40 bg-white/70 shadow-[0_25px_50px_-12px_rgba(0,44,146,0.08)] backdrop-blur-[10px]",
        variant === "fullscreenPortal" &&
          "h-full min-h-0 flex-1 rounded-none border-0 bg-white/80 sm:rounded-2xl sm:border sm:border-[rgb(196_197_215/0.12)] sm:shadow-[0_20px_40px_-16px_rgba(0,44,146,0.12)]",
      )}
    >
      <div className="border-b border-[rgb(196_197_215/0.1)] bg-white/40 px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
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
          <div className="flex shrink-0 items-center gap-2">
            {!isFullscreen && onEnterFullscreen && (
              <button
                type="button"
                onClick={onEnterFullscreen}
                className="group flex h-10 items-center gap-2 rounded-full border border-[rgb(196_197_215/0.35)] bg-gradient-to-br from-white to-soft-accent/90 px-3 text-xs font-semibold text-[#002c92] shadow-[0_2px_14px_rgba(0,44,146,0.12)] transition-all hover:scale-[1.02] hover:border-[#002c92]/40 hover:shadow-[0_8px_28px_rgba(0,44,146,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002c92]/30"
                aria-label={t("fullscreenEnter")}
                title={t("fullscreenEnter")}
              >
                <Maximize2
                  className="size-4 shrink-0 transition-transform group-hover:scale-110"
                  aria-hidden
                />
                <span className="hidden sm:inline">{t("fullscreenEnter")}</span>
              </button>
            )}
            {status && (
              <div className="shrink-0 text-right">
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 text-xs font-medium",
                    status.configured && !limitReached && !apiUnavailable
                      ? "bg-[#dce1ff] text-[#001551]"
                      : "bg-amber-100 text-amber-900",
                  )}
                >
                  {t("messagesLeft", { count: status.remaining })}
                </span>
                <span className="mt-1 block max-w-[11rem] text-[10px] leading-tight text-[#747686] sm:max-w-none">
                  {t("messagesUsage", {
                    sent: status.sent,
                    max: status.max,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!status?.configured && (
        <div className="border-b border-amber-200/60 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
          {t("notConfigured")}
        </div>
      )}

      <div
        ref={messagesScrollRef}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-gradient-to-b from-white/40 to-page-tint/30 px-4 py-5 sm:px-6",
          isFullscreen && "px-4 sm:px-8",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-5",
            isFullscreen && "mx-auto w-full max-w-4xl",
          )}
        >
          <AnimatePresence initial={false}>
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex w-full gap-3",
                  row.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                    row.role === "user"
                      ? "bg-[#003fc7] text-white"
                      : "bg-soft-accent text-[#002c92]",
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
                    "min-w-0",
                    isFullscreen
                      ? "max-w-[min(100%,42rem)] flex-1"
                      : "max-w-[min(100%,22rem)]",
                    row.role === "user" ? "text-right" : "",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left text-sm leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
                      row.role === "user"
                        ? "inline-block rounded-tr-sm bg-[#002c92] text-white"
                        : "inline-block rounded-tl-sm border border-[rgb(196_197_215/0.12)] bg-white text-[#221823]",
                      isFullscreen &&
                        row.role === "user" &&
                        "max-w-full sm:max-w-[min(100%,36rem)]",
                      isFullscreen &&
                        row.role === "assistant" &&
                        "w-full max-w-none sm:max-w-[min(100%,42rem)]",
                    )}
                  >
                    {row.role === "assistant" ? (
                      row.content ? (
                        <AssistantMarkdown content={row.content} />
                      ) : streaming && i === rows.length - 1 ? (
                        <span className="inline-flex gap-1">
                          <span className="size-1.5 animate-bounce rounded-full bg-[#434654]/50 [animation-delay:-0.2s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-[#434654]/50 [animation-delay:-0.1s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-[#434654]/50" />
                        </span>
                      ) : null
                    ) : (
                      <span className="whitespace-pre-wrap">{row.content}</span>
                    )}
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
        <div className="shrink-0 border-t border-[rgb(196_197_215/0.12)] bg-gradient-to-b from-chat-input-bg/90 to-white px-5 py-5 text-center sm:px-8">
          <p className="text-sm font-semibold text-[#221823]">
            {limitReached ? t("limitTitle") : t("unavailableTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#434654]">
            {limitReached ? t("limitBody") : t("unavailableBody")}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
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
          <p className="mt-4 text-xs text-[#747686]">
            <Link
              href="/"
              className="font-medium underline underline-offset-2 hover:text-[#002c92]"
            >
              {t("backHome")}
            </Link>
          </p>
        </div>
      )}

      {status?.configured && (
        <div className="shrink-0 border-t border-[rgb(196_197_215/0.1)] bg-white/60 px-4 pb-5 pt-4 sm:px-6">
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
              placeholder={
                limitReached
                  ? t("placeholderLimit")
                  : apiUnavailable
                    ? t("placeholderUnavailable")
                    : t("placeholder")
              }
              disabled={disabled}
              rows={2}
              className={cn(
                "min-h-[3.25rem] w-full resize-none rounded-2xl border border-[rgb(196_197_215/0.5)] bg-white py-3.5 pl-5 pr-14 text-sm leading-relaxed text-[#221823] outline-none transition-[box-shadow,border-color]",
                "placeholder:text-[#747686]",
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
                className="rounded-lg bg-chat-bubble-user px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-soft-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
