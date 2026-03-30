"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, MoreVertical, RefreshCw, Send, User } from "lucide-react";
import { useTranslations } from "next-intl";

const STEPS = [
  { role: "bot" as const, key: "bot0" },
  { role: "user" as const, key: "user0" },
  { role: "bot" as const, key: "bot1" },
  { role: "user" as const, key: "user1" },
  { role: "bot" as const, key: "bot2" },
  { role: "user" as const, key: "user2" },
  { role: "bot" as const, key: "bot3" },
  { role: "user" as const, key: "user3" },
] as const;

const PIN_THRESHOLD_PX = 72;

function typingDelayForIndex(index: number) {
  return STEPS[index]?.role === "bot" ? 2200 : 1500;
}

export type ChatWidgetDemoScenario = "hub" | "trades" | "hospitality";

export function ChatWidgetLandingDemo({
  scenario,
  className = "",
}: {
  scenario: ChatWidgetDemoScenario;
  className?: string;
}) {
  const t = useTranslations("chatWidget");
  const tPreview = useTranslations("chatPreview");
  const ns = `demos.${scenario}` as const;

  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [runId, setRunId] = useState(0);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const pinnedToBottomRef = useRef(true);

  const updatePinnedFromScroll = useCallback(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    pinnedToBottomRef.current = dist <= PIN_THRESHOLD_PX;
  }, []);

  useEffect(() => {
    if (visibleCount >= STEPS.length) {
      setIsTyping(false);
      return;
    }
    const delay = typingDelayForIndex(visibleCount);
    setIsTyping(true);
    const typingTimer = window.setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((prev) => prev + 1);
    }, delay);
    return () => window.clearTimeout(typingTimer);
  }, [visibleCount, runId]);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el || !pinnedToBottomRef.current) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [visibleCount, isTyping]);

  const replay = () => {
    setVisibleCount(0);
    setIsTyping(true);
    setRunId((k) => k + 1);
    pinnedToBottomRef.current = true;
  };

  const pending =
    visibleCount < STEPS.length ? STEPS[visibleCount] : null;
  const visibleMessages = STEPS.slice(0, visibleCount);
  const isComplete = visibleCount >= STEPS.length && !isTyping;

  return (
    <div className={`relative isolate mx-auto w-full max-w-md [contain:layout] ${className}`}>
      <button
        type="button"
        onClick={replay}
        className="absolute -top-2 right-0 z-20 flex items-center gap-1.5 rounded-full border border-[#002c92]/20 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#002c92] shadow-sm backdrop-blur-sm transition hover:bg-[#f6e3f3] sm:-top-3"
      >
        <RefreshCw className="size-3.5" aria-hidden />
        {t("demos.replay")}
      </button>

      <div className="relative flex flex-col overflow-hidden rounded-3xl border border-[rgb(196_197_215/0.15)] bg-[rgb(255_247_250/0.85)] shadow-[0_25px_50px_-12px_rgb(0_0_0/0.22)] backdrop-blur-[10px]">
        <div className="flex shrink-0 items-center justify-between gap-2 bg-[#002c92] px-3 py-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Bot className="size-4 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold leading-tight text-white sm:text-sm">
                {tPreview("title")}
              </p>
              <p className="text-[10px] leading-tight text-white/60">
                {isComplete ? t(`${ns}.statusDone`) : t(`${ns}.statusOnline`)}
              </p>
            </div>
          </div>
          <MoreVertical className="size-4 shrink-0 text-white/70" aria-hidden />
        </div>

        <div
          ref={messagesScrollRef}
          onScroll={updatePinnedFromScroll}
          className="h-[min(320px,48vh)] min-h-0 shrink-0 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable] sm:h-[360px]"
        >
          <div className="flex flex-col gap-3 p-4">
            {visibleMessages.map((step, i) => (
              <div
                key={`${step.key}-${i}-${runId}`}
                className={`chat-preview-msg-in flex gap-2 ${
                  step.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                    step.role === "bot"
                      ? "bg-[#002c92]/10 text-[#002c92]"
                      : "bg-[rgb(0_44_146/0.05)] text-[#002c92]"
                  }`}
                >
                  {step.role === "bot" ? (
                    <Bot className="size-3.5" />
                  ) : (
                    <User className="size-3.5" />
                  )}
                </div>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    step.role === "bot"
                      ? "rounded-tl-sm bg-[#fbe8f9] text-[#221823]"
                      : "rounded-tr-sm border border-[rgb(0_44_146/0.1)] bg-[rgb(0_44_146/0.05)] text-[#002c92]"
                  }`}
                >
                  {t(`${ns}.${step.key}`)}
                </div>
              </div>
            ))}

            {isTyping && pending && (
              <div
                className={`chat-preview-typing-in flex gap-2 ${
                  pending.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                    pending.role === "bot"
                      ? "bg-[#002c92]/10 text-[#002c92]"
                      : "bg-[rgb(0_44_146/0.05)] text-[#002c92]"
                  }`}
                >
                  {pending.role === "bot" ? (
                    <Bot className="size-3.5" />
                  ) : (
                    <User className="size-3.5" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    pending.role === "bot"
                      ? "rounded-tl-sm bg-[#fbe8f9]"
                      : "rounded-tr-sm border border-[rgb(0_44_146/0.1)] bg-[rgb(0_44_146/0.05)]"
                  }`}
                >
                  <div className="flex gap-1.5">
                    <span className="chat-preview-dot size-1.5 rounded-full bg-[#434654]/50" />
                    <span className="chat-preview-dot size-1.5 rounded-full bg-[#434654]/50" />
                    <span className="chat-preview-dot size-1.5 rounded-full bg-[#434654]/50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[rgb(196_197_215/0.1)] bg-[#ffeffc] p-3.5">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[rgb(196_197_215/0.2)] bg-white px-3.5 py-2.5">
            <span className="flex-1 truncate text-xs text-[#434654]/80">
              {t(`${ns}.placeholder`)}
            </span>
            <Send className="size-[18px] shrink-0 text-[#434654]/60" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
