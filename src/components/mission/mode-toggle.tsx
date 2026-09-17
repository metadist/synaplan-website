"use client";

import { useTranslations } from "next-intl";
import { type MissionMode, applyMode, useMissionMode } from "./mode";

export function ModeToggle({ className }: { className?: string }) {
  const t = useTranslations("mission.nav");
  const mode = useMissionMode();

  function select(next: MissionMode) {
    if (next === mode) return;
    applyMode(next);
  }

  return (
    <div className={className} role="group" aria-label={t("mode")}>
      <div className="mc-switch">
        <button type="button" data-mode="marketing" aria-pressed={mode === "marketing"} onClick={() => select("marketing")}>
          {t("marketing")}
        </button>
        <button type="button" data-mode="engineer" aria-pressed={mode === "engineer"} onClick={() => select("engineer")}>
          {t("engineer")}
        </button>
      </div>
    </div>
  );
}
