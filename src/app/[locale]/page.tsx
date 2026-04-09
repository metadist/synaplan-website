import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { HomeSectionSkeleton } from "@/components/sections/home-section-skeleton";
import { getSynaplanGithubRepoStats } from "@/lib/github-synaplan-repo";
import { buildFaqSchema, buildHowToSchema, buildSoftwareAppSchema, SITE_URL } from "@/lib/jsonld";
import { OG_IMAGE } from "@/lib/seo";
import { GithubFeed } from "@/components/sections/github-feed";

const WidgetFlowSection = dynamic(
  () =>
    import("@/components/sections/widget-flow-section").then(
      (m) => m.WidgetFlowSection,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[28rem] rounded-none bg-transparent" />
    ),
  },
);

const MemoriesSection = dynamic(
  () =>
    import("@/components/sections/memories-section").then(
      (m) => m.MemoriesSection,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[28rem] rounded-none bg-transparent" />
    ),
  },
);

const SolutionsGrid = dynamic(
  () =>
    import("@/components/sections/solutions-grid").then(
      (m) => m.SolutionsGrid,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[22rem] rounded-none bg-transparent" />
    ),
  },
);

const FeaturesShowcase = dynamic(
  () =>
    import("@/components/sections/features-showcase").then(
      (m) => m.FeaturesShowcase,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[36rem] rounded-none bg-transparent" />
    ),
  },
);

const UseCasesSection = dynamic(
  () =>
    import("@/components/sections/use-cases").then((m) => m.UseCasesSection),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[24rem] rounded-none bg-transparent" />
    ),
  },
);

const OpenSourceSection = dynamic(
  () =>
    import("@/components/sections/open-source").then(
      (m) => m.OpenSourceSection,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[20rem] rounded-none bg-transparent" />
    ),
  },
);

const CTASection = dynamic(
  () => import("@/components/sections/cta-section").then((m) => m.CTASection),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[16rem] rounded-none bg-transparent" />
    ),
  },
);

const FaqSection = dynamic(
  () =>
    import("@/components/sections/faq-section").then((m) => m.FaqSection),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[32rem] rounded-none bg-transparent" />
    ),
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("homeTitle");
  const description = t("homeDescription");
  const url = locale === "de" ? `${SITE_URL}/de` : `${SITE_URL}/`;

  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "KI-Plattform, KI Chatbot, KI Kundenservice, ChatGPT Alternative, Open Source KI, DSGVO KI, Self Hosted AI, Chat Widget, KI Unternehmen"
        : "AI platform, AI chatbot, AI customer service, ChatGPT alternative, open source AI, GDPR AI, self hosted AI, chat widget",
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Synaplan",
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/`,
        de: `${SITE_URL}/de`,
        "x-default": `${SITE_URL}/`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const githubRepo = getSynaplanGithubRepoStats();

  const t = await getTranslations({ locale, namespace: "faq" });
  type FaqItem = { q: string; a: string };
  const faqItems = t.raw("items") as FaqItem[];

  // Page-level structured data: SoftwareApplication + FAQPage + HowTo
  const isDE = locale === "de";
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildSoftwareAppSchema(locale),
      buildFaqSchema(faqItems),
      buildHowToSchema(locale),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}${isDE ? "/de" : ""}/#webpage`,
        url: isDE ? `${SITE_URL}/de` : SITE_URL,
        name: isDE
          ? "Synaplan — KI-Plattform für Unternehmen"
          : "Synaplan — AI Platform for Businesses",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        publisher: { "@id": "https://metadist.de/#organization" },
        author: { "@id": "https://metadist.de/#organization" },
        inLanguage: isDE ? "de-DE" : "en-US",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <HeroSection />
      <WidgetFlowSection />
      <MemoriesSection />
      <SolutionsGrid />
      <FeaturesShowcase />
      <UseCasesSection />
      <OpenSourceSection githubRepo={githubRepo} />
      <GithubFeed locale={locale} />
      <FaqSection />
      <CTASection />
    </>
  );
}
