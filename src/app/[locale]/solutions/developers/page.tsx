import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DevelopersHubPage } from "@/components/solutions/developers/developers-hub-page";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";

const PATH = "/solutions/developers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "developersPage" });
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

export default async function DevelopersSolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DevelopersHubPage locale={locale} />;
}
