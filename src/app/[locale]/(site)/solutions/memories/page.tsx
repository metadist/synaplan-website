import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MemoriesHubPage } from "@/components/solutions/memories/memories-hub-page";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";

const PATH = "/solutions/memories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "memoriesSection" });
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

export default async function MemoriesSolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MemoriesHubPage locale={locale} />;
}
