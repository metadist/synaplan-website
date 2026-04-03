"use client";

import { useTranslations } from "next-intl";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Bot,
  Brain,
  CircleUser,
  FileText,
  Folder,
  Globe,
  MessageSquare,
  Mic,
  Minimize2,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";

type DemoHandler = () => void;

export function TryChatFullscreenRail({
  onDemoAction,
}: {
  onDemoAction: DemoHandler;
}) {
  const t = useTranslations("tryChat");
  const items: { Icon: typeof Plus; labelKey: string }[] = [
    { Icon: Plus, labelKey: "fsSidebarNew" },
    { Icon: MessageSquare, labelKey: "fsSidebarChats" },
    { Icon: Folder, labelKey: "fsSidebarFolders" },
    { Icon: Globe, labelKey: "fsSidebarWorkspace" },
    { Icon: Settings, labelKey: "fsSidebarSettings" },
  ];
  return (
    <aside
      className="flex h-full min-h-0 w-[3.25rem] shrink-0 flex-col items-center gap-1 self-stretch border-r border-[rgb(196_197_215/0.2)] bg-white/90 py-3 sm:w-14"
      aria-label={t("fsChromeAria")}
    >
      <span className="mb-2 flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#002c92] to-[#003fc7] text-xs font-bold text-white shadow-sm">
        S
      </span>
      {items.map(({ Icon, labelKey }) => (
        <button
          key={labelKey}
          type="button"
          onClick={onDemoAction}
          className="flex size-10 items-center justify-center rounded-xl text-[#747686] transition-colors hover:bg-soft-accent/80 hover:text-[#002c92]"
          aria-label={t(labelKey)}
          title={t(labelKey)}
        >
          <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </button>
      ))}
      <div className="mt-auto flex flex-col gap-1">
        <button
          type="button"
          onClick={onDemoAction}
          className="flex size-10 items-center justify-center rounded-xl text-amber-600 transition-colors hover:bg-amber-50"
          aria-label={t("fsSidebarTools")}
          title={t("fsSidebarTools")}
        >
          <Wand2 className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onDemoAction}
          className="flex size-10 items-center justify-center rounded-xl text-[#747686] transition-colors hover:bg-soft-accent/80 hover:text-[#002c92]"
          aria-label={t("fsSidebarProfile")}
          title={t("fsSidebarProfile")}
        >
          <CircleUser className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </aside>
  );
}

export function TryChatFullscreenTopBar({
  onDemoAction,
  onExit,
  localeLabel,
}: {
  onDemoAction: DemoHandler;
  onExit: () => void;
  localeLabel: string;
}) {
  const t = useTranslations("tryChat");
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[rgb(196_197_215/0.15)] bg-white/80 px-3 py-2.5 backdrop-blur-sm sm:px-4">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onDemoAction}
          className="rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#434654] transition-colors hover:bg-soft-accent/60 sm:text-xs"
        >
          {t("fsTopAdvanced")}
        </button>
        <button
          type="button"
          onClick={onDemoAction}
          className="rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#434654] transition-colors hover:bg-soft-accent/60 sm:text-xs"
          aria-label={t("fsTopLang")}
        >
          {localeLabel}
        </button>
        <button
          type="button"
          onClick={onDemoAction}
          className="flex size-8 items-center justify-center rounded-lg text-[#747686] transition-colors hover:bg-soft-accent/60"
          aria-label={t("fsTopTheme")}
        >
          <Moon className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onDemoAction}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[#747686] transition-colors hover:bg-soft-accent/60 sm:text-xs"
        >
          <FileText className="size-3.5 shrink-0" aria-hidden />
          {t("fsTopVersion")}
        </button>
      </div>
      <button
        type="button"
        onClick={onExit}
        className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgb(196_197_215/0.35)] bg-gradient-to-br from-white to-soft-accent/90 px-3 py-2 text-xs font-semibold text-[#002c92] shadow-[0_2px_14px_rgba(0,44,146,0.12)] transition-all hover:scale-[1.02] hover:border-[#002c92]/40 hover:shadow-[0_8px_24px_rgba(0,44,146,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002c92]/30"
        aria-label={t("fullscreenExit")}
      >
        <Minimize2
          className="size-4 shrink-0 transition-transform group-hover:scale-105"
          aria-hidden
        />
        <span className="hidden sm:inline">{t("fullscreenExit")}</span>
      </button>
    </header>
  );
}

const demoModeChipBase =
  "inline-flex min-h-[2.125rem] items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-[opacity,background-color,color,box-shadow,filter] sm:text-[11px]";

export function TryChatFullscreenModeBar({
  onDemoAction,
}: {
  onDemoAction: DemoHandler;
}) {
  const t = useTranslations("tryChat");
  const modes: {
    key: string;
    Icon: LucideIcon;
    labelKey: string;
    variant?: "mic";
  }[] = [
    { key: "def", Icon: Bot, labelKey: "fsModeDefault" },
    { key: "ag", Icon: Users, labelKey: "fsModeAgents" },
    { key: "en", Icon: Sparkles, labelKey: "fsModeEnhance" },
    { key: "th", Icon: Brain, labelKey: "fsModeThinking" },
    { key: "mic", Icon: Mic, labelKey: "fsModeMic", variant: "mic" },
  ];
  const hint = t("fsModesWebOnlyHint");
  return (
    <div className="shrink-0 border-t border-[rgb(196_197_215/0.12)] bg-gradient-to-b from-white/85 to-[#f6f4fb]/90 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#747686]">
            {t("fsModesLabel")}
          </p>
          <p className="mt-1 text-[10px] leading-snug text-[#9499a8]">
            {t("fsModesSubline")}
          </p>
        </div>

        <div
          role="group"
          aria-label={t("fsModesLabel")}
          className="relative rounded-2xl border border-[rgb(196_197_215/0.16)] bg-[#f0eef5]/60 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-black/[0.02]"
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.35] to-transparent"
            aria-hidden
          />
          <div className="relative flex flex-wrap items-stretch justify-center gap-1 sm:flex-nowrap">
            {modes.map(({ key, Icon, labelKey, variant }, i) => (
              <button
                key={key}
                type="button"
                title={hint}
                onClick={onDemoAction}
                className={cn(
                  demoModeChipBase,
                  "min-w-0 flex-1 sm:min-w-[3.75rem]",
                  variant === "mic"
                    ? "border border-dashed border-[#002c92]/22 bg-soft-accent/35 text-[#3d4a6b] opacity-[0.9] saturate-[0.94] hover:border-[#002c92]/35 hover:bg-soft-accent/55 hover:opacity-100 hover:saturate-100"
                    : i === 0
                      ? "bg-white/95 text-[#221823] shadow-sm ring-1 ring-[rgb(196_197_215/0.22)]"
                      : "text-[#5a5d6c] opacity-[0.88] saturate-[0.92] hover:bg-white/65 hover:opacity-100 hover:saturate-100",
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5 shrink-0 sm:size-4",
                    variant === "mic"
                      ? "text-[#002c92]/90"
                      : i === 0
                        ? "text-[#002c92]"
                        : "opacity-85",
                  )}
                  aria-hidden
                />
                <span className="truncate">{t(labelKey)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TryChatFullscreenDemoToast({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const t = useTranslations("tryChat");
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[10050] w-[min(100%,22rem)] -translate-x-1/2 px-4 sm:w-[min(100%,28rem)]"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto rounded-2xl border border-[#002c92]/20 bg-gradient-to-br from-[#001a5c] via-[#002c92] to-[#1e4db8] p-4 text-center shadow-[0_24px_48px_-12px_rgb(0_44_146/0.45)] ring-1 ring-white/10">
        <p className="text-sm font-semibold text-white">{t("fullscreenDemoTitle")}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/90">
          {t("fullscreenDemoBody")}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <a
            href={LINKS.web}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#002c92] shadow-md transition-transform hover:scale-[1.02]"
          >
            {t("fullscreenDemoCta")}
          </a>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-xl border border-white/30 px-3 py-2 text-xs font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            {t("fullscreenDemoDismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
