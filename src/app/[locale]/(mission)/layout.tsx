import { Space_Grotesk } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { MissionHeader } from "@/components/mission/mission-header";
import { MissionFooter } from "@/components/mission/mission-footer";
import { Parrot } from "@/components/mission/parrot";
import { RevealController } from "@/components/mission/reveal-controller";
import { MODE_BOOTSTRAP_SCRIPT } from "@/components/mission/mode-bootstrap";
import "../../mission.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

/**
 * Mission Control chrome: header with system status + mode switch, the
 * parrot, scroll reveals and the footer. Used by the homepage and the primary
 * navigation pages (product / deploy / connect / agents / source).
 */
export default async function MissionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission" });

  return (
    <div className={`mc ${spaceGrotesk.variable}`}>
      {/* Applies the stored Marketing/Engineer mode before first paint */}
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
