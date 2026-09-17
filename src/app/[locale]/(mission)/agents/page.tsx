import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LINKS } from "@/lib/constants";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { FeaturePanel, PageHero, type PanelSection } from "@/components/mission/sub-page";
import { MissionConsole } from "@/components/mission/mission-console";
import { Pipeline } from "@/components/mission/pipeline";
import { Reveal, SectionHead } from "@/components/mission/primitives";
import { LaunchCta } from "@/components/mission/home-sections";

const PATH = "/agents";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission.meta.agents" });
  return missionMetadata(locale, PATH, t("title"), t("description"), t.raw("keywords") as string[]);
}

export default async function AgentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "mission.pages.agents" });
  const tm = await getTranslations({ locale, namespace: "mission.meta.agents" });
  const tc = await getTranslations({ locale, namespace: "mission.core" });
  const sections = t.raw("sections") as PanelSection[];
  const steps = tc.raw("steps") as { key: string; label: string; desc: string }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(missionPageJsonLd(locale, PATH, tm("title"), tm("description"))) }}
      />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        terms={tm.raw("searchTerms")}
        aside={<MissionConsole />}
      />
      <section className="mc-section mc-panel-light">
        <div className="mc-wrap">
          <SectionHead num="00" title={t("pipelineTitle")} tag="SYS-03" />
          <Reveal>
            <Pipeline steps={steps} />
          </Reveal>
        </div>
      </section>
      {sections.map((s, i) => (
        <FeaturePanel key={s.num} section={s} light={i % 2 === 1} />
      ))}
      <LaunchCta
        locale={locale}
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: LINKS.web, external: true }}
        secondary={{ label: t("cta.secondary"), href: LINKS.docs, external: true, newTab: true }}
      />
    </>
  );
}
