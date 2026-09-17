import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LINKS } from "@/lib/constants";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { IdCardGrid, PageHero } from "@/components/mission/sub-page";
import { Topology } from "@/components/mission/topology";
import { LaunchCta } from "@/components/mission/home-sections";

const PATH = "/connect";

type Channel = { id: string; name: string; text: string; href: string };
type System = { id: string; name: string; text: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission.meta.connect" });
  return missionMetadata(locale, PATH, t("title"), t("description"));
}

export default async function ConnectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "mission.pages.connect" });
  const tm = await getTranslations({ locale, namespace: "mission.meta.connect" });
  const channels = t.raw("channels") as Channel[];
  const systems = t.raw("systems") as System[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(missionPageJsonLd(locale, PATH, tm("title"), tm("description"))) }}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <section className="pb-4">
        <div className="mc-wrap">
          <Topology />
        </div>
      </section>
      <IdCardGrid num="01" title={t("channelsTitle")} cards={channels} />
      <IdCardGrid num="02" title={t("systemsTitle")} cards={systems} light columns={2} />
      <LaunchCta
        locale={locale}
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: LINKS.docs, external: true, newTab: true }}
        secondary={{ label: t("cta.secondary"), href: "/contact" }}
      />
    </>
  );
}
