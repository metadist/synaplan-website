"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

const MESSAGES = [
  {
    type: "bot" as const,
    text: "Hi! I'm your AI assistant. How can I help you today?",
    textDE: "Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen helfen?",
  },
  {
    type: "user" as const,
    text: "What models do you support?",
    textDE: "Welche Modelle unterstützt ihr?",
  },
  {
    type: "bot" as const,
    text: "We support GPT-4o, Claude, Gemini, Llama 3, Mistral and many more — all from one API.",
    textDE: "Wir unterstützen GPT-4o, Claude, Gemini, Llama 3, Mistral und viele mehr — alles über eine API.",
  },
  {
    type: "user" as const,
    text: "Is it GDPR compliant?",
    textDE: "Ist es DSGVO-konform?",
  },
  {
    type: "bot" as const,
    text: "Yes! Full GDPR compliance, data stays in the EU, and you can self-host for maximum control.",
    textDE: "Ja! Volle DSGVO-Konformität, Daten bleiben in der EU, und Sie können selbst hosten.",
  },
];

export function ChatWidgetPreview({ locale = "en" }: { locale?: string }) {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleMessages >= MESSAGES.length) {
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0);
      }, 4000);
      return () => clearTimeout(resetTimer);
    }

    const delay = MESSAGES[visibleMessages]?.type === "bot" ? 1800 : 1200;

    setIsTyping(true);
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(typingTimer);
  }, [visibleMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isTyping]);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Glow effect behind widget */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 via-brand-400/10 to-purple-500/10 blur-2xl" />

      {/* Widget container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl shadow-brand-500/10 dark:border-white/10 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-zinc-100 bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 dark:border-zinc-800">
          <div className="relative flex size-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="size-4 text-white" />
            <div className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-brand-500 bg-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Synaplan AI</p>
            <p className="text-xs text-white/70">Online</p>
          </div>
          <Sparkles className="size-4 text-white/50" />
        </div>

        {/* Messages */}
        <div className="flex h-72 flex-col gap-3 overflow-y-auto p-4">
          {MESSAGES.slice(0, visibleMessages).map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${
                msg.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                  msg.type === "bot"
                    ? "bg-brand-100 text-brand-600"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                }`}
              >
                {msg.type === "bot" ? (
                  <Bot className="size-3.5" />
                ) : (
                  <User className="size-3.5" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.type === "bot"
                    ? "rounded-tl-sm bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    : "rounded-tr-sm bg-brand-500 text-white"
                }`}
              >
                {locale === "de" ? msg.textDE : msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && visibleMessages < MESSAGES.length && (
            <div className="flex gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                {MESSAGES[visibleMessages]?.type === "bot" ? (
                  <Bot className="size-3.5" />
                ) : (
                  <User className="size-3.5" />
                )}
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                <div className="flex gap-1">
                  <div className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
                  <div className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                  <div className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <span className="flex-1 text-sm text-zinc-400">
              {locale === "de" ? "Nachricht eingeben..." : "Type a message..."}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Send className="size-3.5" />
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div className="border-t border-zinc-50 px-4 py-1.5 text-center dark:border-zinc-800/50">
          <span className="text-[10px] text-zinc-400">
            Powered by <span className="font-semibold text-brand-500">Synaplan</span>
          </span>
        </div>
      </div>
    </div>
  );
}
