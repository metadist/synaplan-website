import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturePageShell } from "@/components/features/feature-page-shell";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";
import { FileText, Shield, Download, Users, Clock, Server } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/features/audit-logs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auditLogsPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "KI Compliance, KI Datenschutz, DSGVO KI, Audit Logs, KI Protokollierung"
        : "AI compliance, AI audit logs, GDPR AI, ki compliance, ai logging",
    openGraph: { title, description, url: canonicalUrl(locale, PATH) },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function AuditLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auditLogsPage" });
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
    { icon: <FileText className="size-5" />, title: t("why1Title"), desc: t("why1Desc") },
    { icon: <Shield className="size-5" />, title: t("why2Title"), desc: t("why2Desc") },
    { icon: <Download className="size-5" />, title: t("why3Title"), desc: t("why3Desc") },
    { icon: <Users className="size-5" />, title: t("why4Title"), desc: t("why4Desc") },
    { icon: <Clock className="size-5" />, title: t("why5Title"), desc: t("why5Desc") },
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
