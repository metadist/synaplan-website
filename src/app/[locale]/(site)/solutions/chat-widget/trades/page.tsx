import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChatWidgetIndustryPage } from "@/components/solutions/chat-widget/industry-page";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";

const PATH = "/solutions/chat-widget/trades";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chatWidget" });
  const title = t("trades.metaTitle");
  const description = t("trades.metaDescription");
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

export default async function ChatWidgetTradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ChatWidgetIndustryPage locale={locale} slug="trades" />;
}
