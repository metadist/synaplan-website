import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { FeaturePageShell, ModelsList } from "@/components/features/feature-page-shell";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";
import { Shuffle, DollarSign, Unlink, Eye, Server, Code2 } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/features/multi-model";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "multiModelPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "AI Gateway, LLM Proxy, OpenAI Alternative, Multi-Model Routing, Ollama, KI-Plattform"
        : "AI gateway, LLM proxy, OpenAI alternative, multi-model routing, Ollama, self-hosted AI",
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function MultiModelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "multiModelPage" });
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
    { icon: <Shuffle className="size-5" />, title: t("why1Title"), desc: t("why1Desc") },
    { icon: <DollarSign className="size-5" />, title: t("why2Title"), desc: t("why2Desc") },
    { icon: <Unlink className="size-5" />, title: t("why3Title"), desc: t("why3Desc") },
    { icon: <Eye className="size-5" />, title: t("why4Title"), desc: t("why4Desc") },
    { icon: <Server className="size-5" />, title: t("why5Title"), desc: t("why5Desc") },
    { icon: <Code2 className="size-5" />, title: t("why6Title"), desc: t("why6Desc") },
  ];

  const models = [
    { label: t("model1") },
    { label: t("model2") },
    { label: t("model3") },
    { label: t("model4") },
    { label: t("model5") },
    { label: t("model6") },
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
        extraSection={<ModelsList title={t("modelsTitle")} models={models} />}
        ctaTitle={t("ctaTitle")}
        ctaPrimary={t("ctaPrimary")}
        ctaSecondary={t("ctaSecondary")}
      />
    </>
  );
}
