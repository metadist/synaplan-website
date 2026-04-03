"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { ArrowRight, Send, Bot, User, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useMotionPerformance } from "@/contexts/motion-performance-context";
import { cn } from "@/lib/utils";

const STEPS = [
  { role: "bot" as const, msgKey: "bot0" },
  { role: "user" as const, msgKey: "user0" },
  { role: "bot" as const, msgKey: "bot1" },
  { role: "user" as const, msgKey: "user1" },
  { role: "bot" as const, msgKey: "bot2" },
  { role: "user" as const, msgKey: "user2" },
  { role: "bot" as const, msgKey: "bot3" },
  { role: "user" as const, msgKey: "user3" },
  { role: "bot" as const, msgKey: "bot4" },
] as const;

/** Pixels from bottom to count as “still following” new messages */
const PIN_THRESHOLD_PX = 72;

function typingDelayForIndex(index: number) {
  return STEPS[index]?.role === "bot" ? 2400 : 1700;
}

export function ChatWidgetPreview() {
  const t = useTranslations("chatPreview");
  const { allowHeavyEffects } = useMotionPerformance();
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  /** True while user is within PIN_THRESHOLD_PX of the bottom — only then auto-scroll */
  const pinnedToBottomRef = useRef(true);
  /** Typing demo was forced static while allowHeavyEffects was false (hydration / reduced). */
  const hadReducedMotionProfileRef = useRef(false);

  const updatePinnedFromScroll = useCallback(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    pinnedToBottomRef.current = dist <= PIN_THRESHOLD_PX;
  }, []);

  useLayoutEffect(() => {
    if (!allowHeavyEffects) {
      hadReducedMotionProfileRef.current = true;
      setVisibleCount(STEPS.length);
      setIsTyping(false);
      return;
    }
    if (hadReducedMotionProfileRef.current) {
      hadReducedMotionProfileRef.current = false;
      setVisibleCount(0);
      setIsTyping(true);
    }
  }, [allowHeavyEffects]);

  useEffect(() => {
    if (!allowHeavyEffects) return;
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

    return () => clearTimeout(typingTimer);
  }, [visibleCount, allowHeavyEffects]);

  /** Scroll down only if the user hasn’t scrolled up to read older lines */
  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el || !pinnedToBottomRef.current) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [visibleCount, isTyping]);

  const pending =
    visibleCount < STEPS.length ? STEPS[visibleCount] : null;
  const visibleMessages = STEPS.slice(0, visibleCount);
  const isComplete = visibleCount >= STEPS.length && !isTyping;

  return (
    <div className="relative isolate mx-auto w-full max-w-md [contain:layout]">
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-3xl border border-[rgb(196_197_215/0.15)] bg-page-tint/80 shadow-[0_25px_50px_-12px_rgb(0_0_0/0.25)] dark:border-white/10 dark:bg-zinc-900/80",
          allowHeavyEffects ? "backdrop-blur-[10px]" : "backdrop-blur-none",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 bg-[#002c92] px-3 py-3.5 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Bot className="size-4 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight text-white">
                {t("title")}
              </p>
              <p className="text-[10px] leading-tight text-white/60">
                {isComplete ? t("statusDone") : t("status")}
              </p>
            </div>
          </div>
          <MoreVertical className="size-4 shrink-0 text-white/70" aria-hidden />
        </div>

        <div
          ref={messagesScrollRef}
          onScroll={updatePinnedFromScroll}
          className="h-[min(380px,52vh)] min-h-0 shrink-0 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable] sm:h-[420px]"
        >
          <div className="flex flex-col gap-3 p-4">
            {visibleMessages.map((step, i) => (
              <div
                key={`${step.msgKey}-${i}`}
                className={cn(
                  "flex gap-2",
                  allowHeavyEffects && "chat-preview-msg-in",
                  step.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
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
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    step.role === "bot"
                      ? "rounded-tl-sm bg-chat-bubble-user text-foreground dark:bg-zinc-800 dark:text-zinc-100"
                      : "rounded-tr-sm border border-[rgb(0_44_146/0.1)] bg-[rgb(0_44_146/0.05)] text-[#002c92]"
                  }`}
                >
                  {t(step.msgKey)}
                </div>
              </div>
            ))}

            {isTyping && pending && (
              <div
                className={cn(
                  "flex gap-2",
                  allowHeavyEffects && "chat-preview-typing-in",
                  pending.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
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
                      ? "rounded-tl-sm bg-chat-bubble-user dark:bg-zinc-800"
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

            {isComplete && (
              <div className="flex justify-center pt-1">
                <Link
                  href="/try-chat"
                  className="btn-figma-primary inline-flex h-auto min-h-10 max-w-[95%] items-center justify-center gap-2 rounded-xl border-0 px-4 py-2.5 text-center text-sm font-semibold leading-snug text-white shadow-[0_10px_28px_-10px_rgb(0_44_146/0.4)] sm:px-5"
                >
                  <span className="text-balance">{t("ctaTryChat")}</span>
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[rgb(196_197_215/0.1)] bg-chat-input-bg p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[rgb(196_197_215/0.2)] bg-white px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="flex-1 truncate text-sm text-[#434654]/80">
              {t("placeholder")}
            </span>
            <Send className="size-[18px] shrink-0 text-[#434654]/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
