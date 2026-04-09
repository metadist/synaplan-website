import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/jsonld";
import { LINKS } from "@/lib/constants";
import { ArrowRight, Key, Cloud, Globe, MessageCircle } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/about/partners";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnersPage" });
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

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partnersPage" });
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: isDE ? "Über uns" : "About", url: `${SITE_URL}${isDE ? "/de" : ""}/about` },
        { name: t("breadcrumbPartners"), url: pageUrl },
      ]),
    ],
  };

  const partnerKeys = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;
  const colors = [
    "bg-brand-50 border-brand-200",
    "bg-emerald-50 border-emerald-200",
    "bg-amber-50 border-amber-200",
    "bg-violet-50 border-violet-200",
    "bg-rose-50 border-rose-200",
    "bg-sky-50 border-sky-200",
  ];
  const textColors = [
    "text-brand-700",
    "text-emerald-700",
    "text-amber-700",
    "text-violet-700",
    "text-rose-700",
    "text-sky-700",
  ];

  const integrations = [
    { icon: <Key className="size-5" />, titleKey: "int1Title" as const, descKey: "int1Desc" as const },
    { icon: <Cloud className="size-5" />, titleKey: "int2Title" as const, descKey: "int2Desc" as const },
    { icon: <Globe className="size-5" />, titleKey: "int3Title" as const, descKey: "int3Desc" as const },
    { icon: <MessageCircle className="size-5" />, titleKey: "int4Title" as const, descKey: "int4Desc" as const },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolutionArticleShell
        breadcrumbItems={[
          { label: isDE ? "Startseite" : "Home", href: "/" },
          { label: isDE ? "Über uns" : "About", href: "/about" },
          { label: t("breadcrumbPartners") },
        ]}
      >
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{t("badge")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t("heroLead")}</p>
        </header>

        {/* Partners */}
        <section className="mt-16">
          <h2 className="mb-8 text-center text-xl font-bold text-foreground">{t("partnersTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnerKeys.map((key, i) => (
              <div
                key={key}
                className={`rounded-2xl border p-6 ${colors[i]}`}
              >
                <strong className={`block text-lg font-bold ${textColors[i]}`}>
                  {t(`${key}Name`)}
                </strong>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className="mt-16">
          <h2 className="mb-8 text-center text-xl font-bold text-foreground">{t("integrationsTitle")}</h2>
          <dl className="grid gap-5 sm:grid-cols-2">
            {integrations.map(({ icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="flex gap-4 rounded-2xl border border-border bg-background p-5"
              >
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {icon}
                </span>
                <div>
                  <dt className="font-semibold text-foreground">{t(titleKey)}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(descKey)}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* Switzerland box */}
        <section className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{t("swissTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("swissBody")}</p>
          </div>
          <a
            href="https://swiss.synaplan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-brand-300 bg-white px-4 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
          >
            {t("swissLink")}
            <ArrowRight className="size-3.5" />
          </a>
        </section>

        {/* Partner CTA */}
        <section className="mt-12 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-foreground">{t("ctaTitle")}</h2>
          <p className="mt-3 text-base text-muted-foreground">{t("ctaBody")}</p>
          <div className="mt-6">
            <a
              href={LINKS.whatsappDE}
              className="btn-figma-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white"
            >
              {t("ctaPrimary")}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </section>
      </SolutionArticleShell>
    </>
  );
}
