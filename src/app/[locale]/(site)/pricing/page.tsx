import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PricingPage } from "@/components/pricing/pricing-page";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildPricingFaqSchema, buildProductPricingSchema, SITE_URL } from "@/lib/jsonld";

export const dynamic = "force-static";

const PATH = "/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricingPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const isDE = locale === "de";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl(locale, PATH),
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function PricingRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

  const offers = isDE
    ? [
        { name: "Open Source", description: "Kostenlos, selbst gehostet via GitHub", price: "0" },
        { name: "Pro", description: "Verwaltetes SaaS auf web.synaplan.com", price: "19.95" },
        { name: "Team", description: "Team-Zusammenarbeit und API-Zugang", price: "49.95" },
        { name: "Business", description: "White-Label, Fair-Use-Medien, dedizierter Support", price: "99.95" },
        { name: "Enterprise", description: "On-Premise-Deployment auf Ihrer Infrastruktur", price: "0", priceSpecification: "custom" },
      ]
    : [
        { name: "Open Source", description: "Free, self-hosted via GitHub", price: "0" },
        { name: "Pro", description: "Managed SaaS on web.synaplan.com", price: "19.95" },
        { name: "Team", description: "Team collaboration and API access", price: "49.95" },
        { name: "Business", description: "White-label, fair-use media, dedicated support", price: "99.95" },
        { name: "Enterprise", description: "On-premise deployment on your infrastructure", price: "0", priceSpecification: "custom" },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildProductPricingSchema(locale, offers),
      buildPricingFaqSchema(locale),
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: isDE ? "Preise" : "Pricing", url: pageUrl },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingPage />
    </>
  );
}
