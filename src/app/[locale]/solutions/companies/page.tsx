import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompaniesHubPage } from "@/components/solutions/companies/companies-hub-page";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";

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
    openGraph: { title, description },
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
  return <CompaniesHubPage locale={locale} />;
}
