import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChatWidgetHubPage } from "@/components/solutions/chat-widget/hub-page";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";

const PATH = "/solutions/chat-widget";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chatWidget" });
  const title = t("hub.metaTitle");
  const description = t("hub.metaDescription");
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

export default async function ChatWidgetSolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ChatWidgetHubPage locale={locale} />;
}
