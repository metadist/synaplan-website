import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { FeaturePanel, IdCardGrid, PageHero, type PanelSection } from "@/components/mission/sub-page";
import { LaunchCta } from "@/components/mission/home-sections";
import { InspectSample } from "@/components/mission/code-samples";

const PATH = "/product";

type Inventory = { id: string; name: string; desc: string; status: string; href: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission.meta.product" });
  return missionMetadata(locale, PATH, t("title"), t("description"), t.raw("keywords") as string[]);
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "mission.pages.product" });
  const tm = await getTranslations({ locale, namespace: "mission.meta.product" });
  const ti = await getTranslations({ locale, namespace: "mission.inspect" });
  const inventory = t.raw("inventory") as Inventory[];
  const sections = t.raw("sections") as PanelSection[];

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
        terms={tm.raw("terms") as string[]}
        aside={<InspectSample title={ti("title")} rows={ti.raw("rows") as { key: string; value: string }[]} />}
      />
      <IdCardGrid
        num="00"
        title={t("inventoryTitle")}
        cards={inventory.map((i) => ({ id: i.id, name: i.name, text: i.desc, status: i.status, href: i.href }))}
      />
      {sections.map((s, i) => (
        <FeaturePanel key={s.num} section={s} light={i % 2 === 0} />
      ))}
      <LaunchCta
        locale={locale}
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: "/try-chat" }}
        secondary={{ label: t("cta.secondary"), href: "/pricing" }}
      />
    </>
  );
}
