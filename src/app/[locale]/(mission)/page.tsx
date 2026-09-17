import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSynaplanGithubRepoStats } from "@/lib/github-synaplan-repo";
import { buildFaqSchema, buildHowToSchema, buildSoftwareAppSchema, SITE_URL } from "@/lib/jsonld";
import { missionMetadata } from "@/lib/mission-seo";
import {
  BriefingSection,
  ConnectSection,
  CoreSection,
  FlightLogSection,
  Hero,
  LaunchCta,
  RunSection,
  SignalsSection,
  SourceSection,
  Ticker,
} from "@/components/mission/home-sections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission.meta.home" });
  return missionMetadata(locale, "/", t("title"), t("description"), t.raw("keywords") as string[]);
}

export default async function MissionHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const stats = getSynaplanGithubRepoStats();
  const tf = await getTranslations({ locale, namespace: "faq" });
  const faqItems = tf.raw("items") as { q: string; a: string }[];
  const tm = await getTranslations({ locale, namespace: "mission.meta.home" });

  const isDE = locale === "de";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildSoftwareAppSchema(locale),
      buildFaqSchema(faqItems),
      buildHowToSchema(locale),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}${isDE ? "/de" : ""}/#webpage`,
        url: isDE ? `${SITE_URL}/de` : SITE_URL,
        name: tm("title"),
        description: tm("description"),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        publisher: { "@id": "https://metadist.de/#organization" },
        inLanguage: isDE ? "de-DE" : "en-US",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero locale={locale} />
      <Ticker locale={locale} />
      <SignalsSection locale={locale} />
      <CoreSection locale={locale} />
      <ConnectSection locale={locale} />
      <RunSection locale={locale} />
      <FlightLogSection locale={locale} />
      <SourceSection locale={locale} stats={stats} />
      <BriefingSection locale={locale} />
      <LaunchCta locale={locale} />
    </>
  );
}
