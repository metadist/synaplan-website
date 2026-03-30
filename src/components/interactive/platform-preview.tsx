"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  BarChart3,
  FileText,
  Shield,
  Activity,
  Lock,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const MODELS = [
  {
    name: "GPT-4o",
    provider: "OpenAI",
    color: "bg-emerald-500",
    latency: "320ms",
    tokens: "1.2k",
  },
  {
    name: "Claude 4",
    provider: "Anthropic",
    color: "bg-amber-500",
    latency: "280ms",
    tokens: "0.9k",
  },
  {
    name: "Gemini 2.5",
    provider: "Google",
    color: "bg-blue-500",
    latency: "190ms",
    tokens: "1.5k",
  },
  {
    name: "Llama 3.3",
    provider: "Meta",
    color: "bg-purple-500",
    latency: "150ms",
    tokens: "0.7k",
  },
] as const;

export function PlatformPreview() {
  const t = useTranslations("platformPreview");
  const locale = useLocale();
  const [activeModel, setActiveModel] = useState(0);
  const [requestCount, setRequestCount] = useState(14283);

  useEffect(() => {
    const modelInterval = setInterval(() => {
      setActiveModel((prev) => (prev + 1) % MODELS.length);
    }, 2800);
    const countInterval = setInterval(() => {
      setRequestCount((prev) => prev + 1);
    }, 1600);
    return () => {
      clearInterval(modelInterval);
      clearInterval(countInterval);
    };
  }, []);

  const model = MODELS[activeModel];
  const docs = [
    { name: t("doc1Name"), status: t("doc1Status"), done: true },
    { name: t("doc2Name"), status: t("doc2Status"), done: false },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-brand-500/15 via-purple-500/10 to-emerald-500/5 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-2xl shadow-brand-500/10 dark:border-zinc-700/60 dark:bg-zinc-900">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400" />
            <div className="size-2.5 rounded-full bg-yellow-400" />
            <div className="size-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <span className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {t("titleBarUrl")}
            </span>
            <span className="shrink-0 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              {t("badgeDemo")}
            </span>
          </div>
          <Lock className="size-3.5 shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden />
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {/* Activity: requests + compliance (latency lives with model below) */}
          <section className="px-4 py-4">
            <div className="mb-3 flex items-end justify-between gap-2">
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t("sectionActivity")}
                </h3>
                <p className="mt-0.5 text-[10px] text-zinc-400">{t("activityHint")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white p-3 dark:border-zinc-800 dark:from-zinc-800/40 dark:to-zinc-900">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Activity className="size-3.5 shrink-0 text-brand-500" />
                  <span className="text-[10px] font-medium">{t("requests")}</span>
                </div>
                <p className="mt-2 text-xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-white">
                  {requestCount.toLocaleString(locale === "de" ? "de-DE" : "en-US")}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white p-3 dark:border-zinc-800 dark:from-zinc-800/40 dark:to-zinc-900">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Shield className="size-3.5 shrink-0 text-emerald-500" />
                  <span className="text-[10px] font-medium">{t("gdpr")}</span>
                </div>
                <p className="mt-2 text-xl font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
                  {t("gdprValue")}
                </p>
              </div>
            </div>
          </section>

          {/* Model routing */}
          <section className="px-4 py-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t("sectionRouting")}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/50" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  {t("live")}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-brand-100/80 bg-gradient-to-br from-brand-50/90 to-white p-3 dark:border-brand-900/50 dark:from-brand-950/40 dark:to-zinc-900 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 rounded-xl ${model.color} items-center justify-center shadow-sm`}
                >
                  <Bot className="size-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {model.name}
                  </p>
                  <p className="text-xs text-zinc-500">{model.provider}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-brand-100/60 pt-3 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0 dark:border-brand-900/40">
                <div className="text-right">
                  <p className="text-[9px] font-medium uppercase tracking-wide text-zinc-400">
                    {t("latencyLabel")}
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                    {model.latency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-medium uppercase tracking-wide text-zinc-400">
                    {t("tokensLabel")}
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-brand-700 dark:text-brand-300">
                    {model.tokens}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Usage chart */}
          <section className="px-4 py-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="size-3.5 text-zinc-400" />
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t("sectionUsage")}
                  </h3>
                  <p className="text-[10px] text-zinc-400">{t("usageSubtitle")}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {t("today")}
              </span>
            </div>
            <div className="flex h-12 items-end gap-1 rounded-lg bg-zinc-50/80 px-1 pb-1 dark:bg-zinc-800/50">
              {[35, 55, 40, 70, 85, 60, 90, 75, 95, 80, 65, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-brand-500/55 transition-all duration-500 hover:bg-brand-500"
                  style={{
                    height: `${h}%`,
                    opacity: i === 11 ? 1 : 0.35 + (i / 12) * 0.55,
                  }}
                />
              ))}
            </div>
          </section>

          {/* Knowledge */}
          <section className="px-4 py-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t("sectionKnowledge")}
                </h3>
                <p className="text-[10px] text-zinc-400">{t("knowledgeHint")}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {docs.map((doc) => (
                <li
                  key={doc.name}
                  className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/40 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/30"
                >
                  <FileText className="size-4 shrink-0 text-zinc-400" />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {doc.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      doc.done
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
                    }`}
                  >
                    {doc.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
