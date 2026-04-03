import dynamic from "next/dynamic";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { HomeSectionSkeleton } from "@/components/sections/home-section-skeleton";
import { getSynaplanGithubRepoStats } from "@/lib/github-synaplan-repo";
import { buildFaqSchema, buildSoftwareAppSchema, SITE_URL } from "@/lib/jsonld";

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

  // Page-level structured data: SoftwareApplication + FAQPage (with publisher)
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildSoftwareAppSchema(locale),
      buildFaqSchema(faqItems),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}${locale === "de" ? "/de" : ""}/#webpage`,
        url: locale === "de" ? `${SITE_URL}/de` : SITE_URL,
        name: "Synaplan — KI-Plattform für Unternehmen",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        publisher: { "@id": "https://metadist.de/#organization" },
        author: { "@id": "https://metadist.de/#organization" },
        inLanguage: locale === "de" ? "de-DE" : "en-US",
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
      <FaqSection />
      <CTASection />
    </>
  );
}
