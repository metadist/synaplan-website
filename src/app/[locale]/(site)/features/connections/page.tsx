import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturePageShell, ModelsList } from "@/components/features/feature-page-shell";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";
import { Mail, Cloud, Box, CalendarDays, Inbox, Plug } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/features/connections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "connectionsPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "KI Integrationen, Microsoft 365 KI, Nextcloud KI, Dropbox KI, CalDAV, WebDAV, KI Verbindungen"
        : "AI integrations, Microsoft 365 AI, Nextcloud AI, Dropbox AI, CalDAV, WebDAV, AI connections",
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function ConnectionsFeaturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "connectionsPage" });
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
    { icon: <Mail className="size-5" />, title: t("why1Title"), desc: t("why1Desc") },
    { icon: <Cloud className="size-5" />, title: t("why2Title"), desc: t("why2Desc") },
    { icon: <Box className="size-5" />, title: t("why3Title"), desc: t("why3Desc") },
    { icon: <CalendarDays className="size-5" />, title: t("why4Title"), desc: t("why4Desc") },
    { icon: <Inbox className="size-5" />, title: t("why5Title"), desc: t("why5Desc") },
    { icon: <Plug className="size-5" />, title: t("why6Title"), desc: t("why6Desc") },
  ];

  const apps = [
    { label: t("a1") },
    { label: t("a2") },
    { label: t("a3") },
    { label: t("a4") },
    { label: t("a5") },
    { label: t("a6") },
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
        extraSection={<ModelsList title={t("appsTitle")} lead={t("appsLead")} models={apps} />}
        ctaTitle={t("ctaTitle")}
        ctaPrimary={t("ctaPrimary")}
        ctaSecondary={t("ctaSecondary")}
      />
    </>
  );
}
