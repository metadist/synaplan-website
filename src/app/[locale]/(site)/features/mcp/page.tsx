import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturePageShell, ModelsList } from "@/components/features/feature-page-shell";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";
import { LINKS } from "@/lib/constants";
import { Bot, PlugZap, Database, ShieldCheck, SlidersHorizontal, Network } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/features/mcp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mcpPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "MCP Server, Model Context Protocol, MCP Integration, Claude MCP, Cursor MCP, KI Datenquellen"
        : "MCP server, Model Context Protocol, MCP integration, Claude MCP, Cursor MCP, AI data sources",
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function McpFeaturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "mcpPage" });
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
    { icon: <Bot className="size-5" />, title: t("why1Title"), desc: t("why1Desc") },
    { icon: <PlugZap className="size-5" />, title: t("why2Title"), desc: t("why2Desc") },
    { icon: <Database className="size-5" />, title: t("why3Title"), desc: t("why3Desc") },
    { icon: <ShieldCheck className="size-5" />, title: t("why4Title"), desc: t("why4Desc") },
    { icon: <SlidersHorizontal className="size-5" />, title: t("why5Title"), desc: t("why5Desc") },
    { icon: <Network className="size-5" />, title: t("why6Title"), desc: t("why6Desc") },
  ];

  const worksWith = [
    { label: t("w1") },
    { label: t("w2") },
    { label: t("w3") },
    { label: t("w4") },
    { label: t("w5") },
    { label: t("w6") },
    { label: t("w7") },
    { label: t("w8") },
    { label: t("w9") },
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
        extraSection={
          <ModelsList title={t("worksWithTitle")} lead={t("worksWithLead")} models={worksWith} />
        }
        ctaTitle={t("ctaTitle")}
        ctaPrimary={t("ctaPrimary")}
        ctaSecondary={t("ctaSecondary")}
        ctaSecondaryHref={LINKS.docs}
      />
    </>
  );
}
