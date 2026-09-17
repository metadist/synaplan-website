import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppLandingPage } from "@/components/app/app-landing-page";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, buildMobileAppSchemas, SITE_URL } from "@/lib/jsonld";

export const dynamic = "force-static";

const PATH = "/app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "appPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "Synaplan App, iPhone, Android, App Store, Google Play, KI App"
        : "Synaplan app, iPhone, Android, App Store, Google Play, AI app",
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function AppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "appPage" });
  const pageUrl = canonicalUrl(locale, PATH);
  const isDE = locale === "de";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...buildMobileAppSchemas(locale),
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: t("breadcrumbPage"), url: pageUrl },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLandingPage locale={locale} />
    </>
  );
}
