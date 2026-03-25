"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  BarChart3,
  FileText,
  Zap,
  Shield,
  Activity,
} from "lucide-react";

const MODELS = [
  { name: "GPT-4o", provider: "OpenAI", color: "bg-emerald-500", latency: "320ms", tokens: "1.2k" },
  { name: "Claude 4", provider: "Anthropic", color: "bg-amber-500", latency: "280ms", tokens: "0.9k" },
  { name: "Gemini 2.5", provider: "Google", color: "bg-blue-500", latency: "190ms", tokens: "1.5k" },
  { name: "Llama 3.3", provider: "Meta", color: "bg-purple-500", latency: "150ms", tokens: "0.7k" },
];

export function PlatformPreview() {
  const [activeModel, setActiveModel] = useState(0);
  const [requestCount, setRequestCount] = useState(14283);

  useEffect(() => {
    const modelInterval = setInterval(() => {
      setActiveModel((prev) => (prev + 1) % MODELS.length);
    }, 2500);
    const countInterval = setInterval(() => {
      setRequestCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 1500);
    return () => {
      clearInterval(modelInterval);
      clearInterval(countInterval);
    };
  }, []);

  const model = MODELS[activeModel];

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Glow */}
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-brand-500/15 via-purple-500/10 to-emerald-500/5 blur-3xl" />

      {/* Dashboard container */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-2xl shadow-brand-500/10 dark:border-zinc-700/60 dark:bg-zinc-900">
        {/* Titlebar */}
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400" />
            <div className="size-2.5 rounded-full bg-yellow-400" />
            <div className="size-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-zinc-400">app.synaplan.com</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-4">
          {/* Stats row */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1.5">
                <Activity className="size-3 text-brand-500" />
                <span className="text-[10px] font-medium text-zinc-500">Requests</span>
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-white">
                {requestCount.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1.5">
                <Zap className="size-3 text-amber-500" />
                <span className="text-[10px] font-medium text-zinc-500">Avg. Latency</span>
              </div>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                {model?.latency}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1.5">
                <Shield className="size-3 text-emerald-500" />
                <span className="text-[10px] font-medium text-zinc-500">GDPR</span>
              </div>
              <p className="mt-1 text-lg font-bold text-emerald-600">100%</p>
            </div>
          </div>

          {/* Active model */}
          <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50/50 p-3 dark:border-brand-900 dark:bg-brand-950/30">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                Active Model
              </span>
              <div className="flex items-center gap-1">
                <div className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] text-emerald-600">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-lg ${model?.color} flex items-center justify-center`}>
                <Bot className="size-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-900 transition-all dark:text-white">
                  {model?.name}
                </p>
                <p className="text-xs text-zinc-500">{model?.provider}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {model?.tokens} tokens/req
                </p>
              </div>
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="size-3 text-zinc-400" />
                <span className="text-[10px] font-medium text-zinc-500">
                  Usage (24h)
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">Today</span>
            </div>
            <div className="flex items-end gap-1 h-12">
              {[35, 55, 40, 70, 85, 60, 90, 75, 95, 80, 65, 88].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-brand-500/60 transition-all duration-500 hover:bg-brand-500"
                    style={{
                      height: `${h}%`,
                      opacity: i === 11 ? 1 : 0.4 + (i / 12) * 0.6,
                    }}
                  />
                )
              )}
            </div>
          </div>

          {/* Recent documents */}
          <div className="mt-3 space-y-1.5">
            {[
              { name: "Company Guidelines.pdf", status: "Indexed" },
              { name: "Product FAQ.md", status: "Processing..." },
            ].map((doc) => (
              <div
                key={doc.name}
                className="flex items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2 dark:border-zinc-800"
              >
                <FileText className="size-3.5 text-zinc-400" />
                <span className="flex-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {doc.name}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    doc.status === "Indexed"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
