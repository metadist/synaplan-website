import { Space_Grotesk } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { MissionHeader } from "@/components/mission/mission-header";
import { MissionFooter } from "@/components/mission/mission-footer";
import { Parrot } from "@/components/mission/parrot";
import { RevealController } from "@/components/mission/reveal-controller";
import { MODE_BOOTSTRAP_SCRIPT } from "@/components/mission/mode-bootstrap";
import "../../app/mission.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

/** Shared Mission Control chrome for every public marketing route. */
export async function MissionChrome({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "mission" });

  return (
    <div className={`mc ${spaceGrotesk.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: MODE_BOOTSTRAP_SCRIPT }} />
      <a
        href="#mc-main"
        className="mc-btn mc-btn--sm absolute left-3 top-3 z-[70] -translate-y-24 bg-[var(--mc-ink)] focus:translate-y-0"
      >
        {t("skip")}
      </a>
      <MissionHeader />
      <main id="mc-main" className="flex-1">
        {children}
      </main>
      <MissionFooter />
      <Parrot />
      <RevealController />
    </div>
  );
}
