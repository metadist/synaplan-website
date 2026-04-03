import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PluginsHubPage } from "@/components/solutions/plugins/plugins-hub-page";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";

const PATH = "/solutions/plugins";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pluginsPage" });
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

export default async function PluginsSolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PluginsHubPage locale={locale} />;
}
