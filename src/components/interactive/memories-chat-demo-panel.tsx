"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  Brain,
  ChevronDown,
  Folder,
  Lock,
  MessageSquare,
  Mic,
  Moon,
  Plus,
  Send,
  Settings,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import { useMotionPerformance } from "@/contexts/motion-performance-context";
import { cn } from "@/lib/utils";

type MemoryLabelKey =
  | "memPref1"
  | "memPref2"
  | "memPref3"
  | "memPersonal1"
  | "memPersonal2"
  | "memPersonal3";

type MemoryBubbleShortKey =
  | "memPref1Short"
  | "memPref2Short"
  | "memPref3Short"
  | "memPersonal1Short"
  | "memPersonal2Short"
  | "memPersonal3Short";

type ChatLine = {
  id: string;
  role: "greeting" | "user" | "bot";
  text: string;
  memoryKey?: MemoryLabelKey;
};

const MEMORY_KEYS: MemoryLabelKey[] = [
  "memPref1",
  "memPref2",
  "memPref3",
  "memPersonal1",
  "memPersonal2",
  "memPersonal3",
];

const TOTAL_EXCHANGES = 6;

const USER_KEYS = [
  "demoChatUser1",
  "demoChatUser2",
  "demoChatUser3",
  "demoChatUser4",
  "demoChatUser5",
  "demoChatUser6",
] as const;

const BOT_KEYS = [
  "demoChatBot1",
  "demoChatBot2",
  "demoChatBot3",
  "demoChatBot4",
  "demoChatBot5",
  "demoChatBot6",
] as const;

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(() => resolve(), ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

const USER_BUBBLE =
  "rounded-2xl rounded-tr-md bg-[#002c92] px-4 py-3 text-sm leading-relaxed text-white shadow-[0_10px_28px_-10px_rgb(0_44_146/0.42)]";

const BOT_CARD =
  "rounded-2xl rounded-tl-md border border-slate-200/90 bg-white text-sm leading-relaxed text-slate-800 shadow-[0_12px_40px_-16px_rgb(15_23_42/0.12)]";

export function MemoriesChatDemoPanel({
  onRevealMemory,
}: {
  onRevealMemory: (labelKey: string) => void;
}) {
  const t = useTranslations("memoriesSection");
  const tChat = useTranslations("chatPreview");
  const { allowHeavyEffects } = useMotionPerformance();
  /** Avoid SSR/client class mismatch: context can update before hydration finishes. */
  const [motionEffectsReady, setMotionEffectsReady] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [typing, setTyping] = useState(false);

  const heavyEffects = motionEffectsReady && allowHeavyEffects;

  useEffect(() => {
    setMotionEffectsReady(true);
  }, []);

  useEffect(() => {
    const ac = new AbortController();

    const buildLines = (): ChatLine[] => {
      const greeting: ChatLine = {
        id: "g0",
        role: "greeting",
        text: t("demoChatGreetingShort"),
      };
      const rest: ChatLine[] = [];
      for (let i = 0; i < TOTAL_EXCHANGES; i++) {
        rest.push({
          id: `u${i + 1}`,
          role: "user",
          text: t(USER_KEYS[i]),
        });
        rest.push({
          id: `b${i + 1}`,
          role: "bot",
          text: t(BOT_KEYS[i]),
          memoryKey: MEMORY_KEYS[i],
        });
      }
      return [greeting, ...rest];
    };

    const run = async () => {
      if (reduceMotion) {
        const all = buildLines();
        setLines(all);
        for (const k of MEMORY_KEYS) onRevealMemory(k);
        return;
      }

      const greeting: ChatLine = {
        id: "g0",
        role: "greeting",
        text: t("demoChatGreetingShort"),
      };

      try {
        await sleep(600, ac.signal);
        setLines([greeting]);
        await sleep(1200, ac.signal);

        for (let i = 0; i < TOTAL_EXCHANGES; i++) {
          const userLine: ChatLine = {
            id: `u${i + 1}`,
            role: "user",
            text: t(USER_KEYS[i]),
          };
          const botLine: ChatLine = {
            id: `b${i + 1}`,
            role: "bot",
            text: t(BOT_KEYS[i]),
            memoryKey: MEMORY_KEYS[i],
          };

          await sleep(900 + i * 70, ac.signal);
          setLines((prev) => [...prev, userLine]);
          await sleep(450, ac.signal);

          setTyping(true);
          await sleep(2000 + i * 50, ac.signal);
          setTyping(false);
          setLines((prev) => [...prev, botLine]);
          await sleep(550, ac.signal);
          onRevealMemory(MEMORY_KEYS[i]);
          await sleep(800, ac.signal);
        }
      } catch {
        /* aborted */
      }
    };

    void run();
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRevealMemory, reduceMotion]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [lines, typing]);

  const modeChips: { key: string; label: string; Icon: typeof Sparkles }[] = [
    { key: "def", label: t("demoChatModeDefault"), Icon: Bot },
    { key: "ag", label: t("demoChatModeAgents"), Icon: Wrench },
    { key: "en", label: t("demoChatModeEnhance"), Icon: Sparkles },
    { key: "th", label: t("demoChatModeThinking"), Icon: Brain },
  ];

  const railIcons = [
    { Icon: Plus, label: "New" },
    { Icon: MessageSquare, label: "Chats" },
    { Icon: Folder, label: "Folders" },
    { Icon: Settings, label: "Settings" },
  ] as const;

  return (
    <div className="relative isolate mx-auto flex h-full min-h-0 w-full min-w-0 flex-col [contain:layout]">
      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/50 shadow-[0_32px_64px_-24px_rgb(15_23_42/0.18)] ring-1 ring-slate-950/[0.04] dark:border-slate-700/80 dark:bg-slate-900/30 dark:ring-white/[0.06]",
          heavyEffects ? "backdrop-blur-[12px]" : "backdrop-blur-none",
        )}
      >
        <div
          className="flex shrink-0 items-center gap-2 border-b border-slate-200/90 bg-gradient-to-b from-slate-200/95 to-slate-300/40 px-3 py-2 dark:border-slate-700/80 dark:from-slate-800/90 dark:to-slate-900/30"
          aria-hidden
        >
          <div className="flex gap-1.5 pl-0.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] shadow-inner ring-1 ring-slate-200/90 dark:bg-slate-950/40 dark:ring-slate-600/80 sm:text-xs">
            <Lock className="size-3 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate font-mono text-muted-foreground">
              {t("demoChatUrlBar")}
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside
            className="flex w-11 shrink-0 flex-col items-center gap-1 border-r border-slate-200/80 bg-white/90 py-3 dark:border-slate-700/80 dark:bg-slate-950/40 sm:w-12"
            aria-hidden
          >
            {railIcons.map(({ Icon, label }) => (
              <span
                key={label}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#002c92] dark:hover:bg-slate-800 dark:hover:text-[#93c5fd]"
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </span>
            ))}
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-slate-50/95 to-[#eef2f6]/90 dark:from-slate-950/80 dark:to-slate-950">
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/90 px-3 py-2.5 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/70 sm:px-4">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#002c92] to-[#1e4db8] text-[11px] font-bold text-white shadow-sm ring-1 ring-[rgb(0_44_146/0.2)]">
                  S
                </span>
                <span className="truncate text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                  {t("demoChatAppTitle")}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                <span className="hidden sm:inline">EN</span>
                <Moon className="size-3.5 text-slate-400" aria-hidden />
              </div>
            </header>

            <div
              ref={scrollRef}
              className="widget-embed-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-4 [scrollbar-gutter:stable] sm:px-4"
            >
              <div className="mx-auto flex max-w-xl flex-col gap-4">
                {lines.map((line, i) => (
                  <motion.div
                    key={line.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i === 0 ? 0 : 0.03 }}
                    className={cn(
                      "flex gap-2.5",
                      heavyEffects && "chat-preview-msg-in",
                      line.role === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900",
                        line.role === "user"
                          ? "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          : "bg-white text-[#002c92] shadow-sm ring-slate-200 dark:bg-slate-800 dark:text-[#93c5fd] dark:ring-slate-700",
                      )}
                    >
                      {line.role === "user" ? (
                        <User className="size-4" aria-hidden />
                      ) : (
                        <Bot className="size-4" aria-hidden />
                      )}
                    </div>

                    {line.role === "user" ? (
                      <div className={cn("max-w-[min(100%,22rem)]", USER_BUBBLE)}>
                        <p>{line.text}</p>
                      </div>
                    ) : (
                      <div className="min-w-0 max-w-[min(100%,24rem)] flex-1">
                        <div className={BOT_CARD}>
                          <div className="px-4 py-3.5">
                            <p className="text-[13px] leading-relaxed sm:text-sm">
                              {line.text}
                            </p>
                          </div>

                          {line.memoryKey ? (
                            <>
                              <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-700/80">
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between gap-2 rounded-lg bg-[rgb(0_44_146/0.07)] px-2.5 py-1.5 text-left text-[11px] font-medium text-[#002c92] dark:bg-[rgb(30_58_138/0.35)] dark:text-[#bfdbfe]"
                                  tabIndex={-1}
                                  aria-hidden
                                >
                                  <span className="flex items-center gap-1.5">
                                    <ChevronDown
                                      className="size-3.5 shrink-0 opacity-70"
                                      aria-hidden
                                    />
                                    {t("demoChatMemorySavedCount")}
                                  </span>
                                  <span className="rounded-md bg-white/90 px-1.5 py-0.5 font-mono text-[10px] text-[#002c92] shadow-sm dark:bg-slate-900/60 dark:text-[#bfdbfe]">
                                    {`[${t(
                                      `${line.memoryKey}Short` as MemoryBubbleShortKey,
                                    )}]`}
                                  </span>
                                </button>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-100 px-3 py-2 text-[10px] dark:border-slate-700/80">
                                <span className="rounded-md bg-[rgb(0_44_146/0.12)] px-1.5 py-0.5 font-semibold uppercase tracking-wide text-[#002c92] dark:bg-[rgb(59_130_246/0.2)] dark:text-[#bfdbfe]">
                                  {t("demoChatCategoryGeneral")}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                  {t("demoChatMetaRouting")}
                                </span>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {typing ? (
                  <div
                    className={cn(
                      "flex gap-2.5",
                      heavyEffects && "chat-preview-typing-in",
                    )}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#002c92] shadow-sm ring-2 ring-slate-200 dark:bg-slate-800 dark:text-[#93c5fd] dark:ring-slate-700">
                      <Bot className="size-4" aria-hidden />
                    </div>
                    <div
                      className={cn(
                        BOT_CARD,
                        "inline-flex min-w-[8rem] px-4 py-3.5",
                      )}
                    >
                      <div className="flex gap-1.5">
                        <span className="chat-preview-dot size-1.5 rounded-full bg-slate-400/70" />
                        <span className="chat-preview-dot size-1.5 rounded-full bg-slate-400/70" />
                        <span className="chat-preview-dot size-1.5 rounded-full bg-slate-400/70" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200/80 bg-white/95 px-3 pb-3 pt-2 dark:border-slate-700/80 dark:bg-slate-900/80">
              <div className="mx-auto flex max-w-xl flex-col gap-2">
                <div className="flex items-center gap-2 rounded-[1.35rem] border border-slate-200/90 bg-white py-1.5 pl-3 pr-1.5 shadow-sm dark:border-slate-600/80 dark:bg-slate-950/50">
                  <Plus
                    className="size-[18px] shrink-0 text-slate-400"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-400">
                    {tChat("placeholder")}
                  </span>
                  <Mic
                    className="size-[18px] shrink-0 text-slate-400"
                    aria-hidden
                  />
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#002c92] text-white shadow-[0_10px_24px_-8px_rgb(0_44_146/0.45)]"
                    aria-hidden
                  >
                    <Send className="size-[18px]" />
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {modeChips.map(({ key, label, Icon }) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-slate-50/90 px-2 py-1 text-[10px] font-medium text-slate-600 dark:border-slate-600/80 dark:bg-slate-800/60 dark:text-slate-300"
                    >
                      <Icon className="size-3 opacity-80" aria-hidden />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
