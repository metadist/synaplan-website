import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturePageShell } from "@/components/features/feature-page-shell";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";
import { Upload, Search, Brain, Layers, Sparkles, Server } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/features/memories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "memoriesFeaturePage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "KI Memories, RAG, Retrieval-Augmented Generation, Vektorsuche, Qdrant, Dokument-KI"
        : "AI memories, RAG, retrieval augmented generation, vector search, Qdrant, document AI",
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function MemoriesFeaturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "memoriesFeaturePage" });
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

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
        { name: t("breadcrumbFeatures"), url: `${SITE_URL}${isDE ? "/de" : ""}/features` },
        { name: t("breadcrumbPage"), url: pageUrl },
      ]),
    ],
  };

  const whyCards = [
    { icon: <Upload className="size-5" />, title: t("why1Title"), desc: t("why1Desc") },
    { icon: <Search className="size-5" />, title: t("why2Title"), desc: t("why2Desc") },
    { icon: <Brain className="size-5" />, title: t("why3Title"), desc: t("why3Desc") },
    { icon: <Layers className="size-5" />, title: t("why4Title"), desc: t("why4Desc") },
    { icon: <Sparkles className="size-5" />, title: t("why5Title"), desc: t("why5Desc") },
    { icon: <Server className="size-5" />, title: t("why6Title"), desc: t("why6Desc") },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FeaturePageShell
        breadcrumbItems={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbFeatures"), href: "/features" },
          { label: t("breadcrumbPage") },
        ]}
        badge={t("badge")}
        heroTitle={t("heroTitle")}
        heroLead={t("heroLead")}
        whyCards={whyCards}
        ctaTitle={t("ctaTitle")}
        ctaPrimary={t("ctaPrimary")}
        ctaSecondary={t("ctaSecondary")}
      />
    </>
  );
}
