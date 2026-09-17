import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/constants";
import { ParrotGlyph } from "@/components/mission/parrot-glyph";
import { Lamp } from "@/components/mission/primitives";
import "../mission.css";

/** 404 — "SIGNAL NOT FOUND". Rendered inside the locale layout (no chrome). */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "mission.notFound" });
  const tp = await getTranslations({ locale, namespace: "mission.parrot" });

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
        <p className="mc-lead mx-auto mt-6">{t("text")}</p>
        <div className="mc-parrot-bubble mx-auto mt-8 inline-block text-left after:hidden">
          <strong>{tp("prefix")}</strong> {t("parrot")}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="mc-btn mc-btn--primary">
            [ {t("home")} ]
          </Link>
          <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="mc-btn">
            {t("docs")} ↗
          </a>
        </div>
        <div className="mt-14 flex justify-center">
          <ParrotGlyph still className="h-24 w-20 opacity-90" />
        </div>
      </main>
    </div>
  );
}
