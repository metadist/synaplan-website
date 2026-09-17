import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompaniesHubPage } from "@/components/solutions/companies/companies-hub-page";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";

const PATH = "/solutions/companies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "companiesPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function CompaniesSolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "companiesPage" });
  const pageUrl = canonicalUrl(locale, PATH);
  const isDE = locale === "de";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildServiceSchema({
        name: t("metaTitle"),
        description: t("metaDescription"),
        url: pageUrl,
        locale,
      }),
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: isDE ? "Lösungen" : "Solutions", url: `${SITE_URL}${isDE ? "/de" : ""}/solutions` },
        { name: isDE ? "Für Unternehmen" : "For Companies", url: pageUrl },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompaniesHubPage locale={locale} />
    </>
  );
}
