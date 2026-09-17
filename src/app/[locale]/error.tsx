"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ParrotGlyph } from "@/components/mission/parrot-glyph";
import { Lamp } from "@/components/mission/primitives";
import "../mission.css";

/** 500 — "MISSION LOST. The parrot has been informed." */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("mission.error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mc relative min-h-dvh items-center justify-center overflow-hidden px-6 py-20">
      <div className="mc-grid" aria-hidden />
      <main className="relative mx-auto w-full max-w-2xl text-center">
        <p className="mc-label flex items-center justify-center gap-2">
          <Lamp tone="red" blink />
          SYNAPLAN // MISSION CONTROL · {t("code")}
        </p>
        <h1 className="mc-display mc-glitch mt-6 text-[clamp(2.4rem,7vw,5.5rem)] uppercase" data-text={t("title")}>
          {t("title")}
        </h1>
        <p className="mc-mono mt-6 text-[0.9rem] uppercase tracking-[0.12em] text-[var(--mc-text-muted)]">{t("text")}</p>
        <p className="mc-mono mt-2 text-[0.75rem] uppercase tracking-[0.12em] text-[var(--mc-text-faint)]">
          {t("parrot")}
          {error.digest ? ` · REF ${error.digest}` : ""}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="mc-btn mc-btn--primary">
            [ {t("retry")} ]
          </button>
          <Link href="/" className="mc-btn">
            {t("home")}
          </Link>
        </div>
        <div className="mt-14 flex justify-center">
          <ParrotGlyph still className="h-24 w-20 opacity-90" />
        </div>
      </main>
    </div>
  );
}
