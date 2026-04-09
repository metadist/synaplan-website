import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TryChatExperience } from "@/components/try-chat/try-chat-experience";
import { getSynaplanGithubRepoStats } from "@/lib/github-synaplan-repo";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";

const PATH = "/try-chat";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tryChat" });
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

export default async function TryChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const githubRepo = getSynaplanGithubRepoStats();
  return <TryChatExperience githubRepo={githubRepo} />;
}
