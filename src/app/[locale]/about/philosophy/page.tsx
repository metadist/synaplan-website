import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/jsonld";
import { LINKS } from "@/lib/constants";
import { ExternalLink, ArrowRight } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/about/philosophy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "philosophyPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title, description, url: canonicalUrl(locale, PATH) },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function PhilosophyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "philosophyPage" });
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: isDE ? "Über uns" : "About", url: `${SITE_URL}${isDE ? "/de" : ""}/about` },
        { name: t("breadcrumbPhilosophy"), url: pageUrl },
      ]),
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: t("heroTitle"),
        description: t("metaDescription"),
        author: { "@id": "https://metadist.de/#organization" },
        publisher: { "@id": "https://metadist.de/#organization" },
        inLanguage: isDE ? "de-DE" : "en-US",
        url: pageUrl,
      },
    ],
  };

  const sections = [
    { title: t("s1Title"), body: t("s1Body") },
    { title: t("s2Title"), body: t("s2Body") },
    { title: t("s3Title"), body: t("s3Body") },
    { title: t("s4Title"), body: t("s4Body") },
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
          { label: t("breadcrumbPhilosophy") },
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

        {/* Philosophy sections */}
        <div className="mt-16 mx-auto max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <section key={i} className="border-l-4 border-brand-300 pl-6">
              <h2 className="text-xl font-bold text-foreground">{s.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-8 text-center sm:p-12">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-figma-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 px-6 text-sm font-medium text-white sm:w-auto"
            >
              {t("ctaGithub")}
              <ExternalLink className="size-4" />
            </a>
            <a
              href={LINKS.appointment}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:w-auto"
            >
              {t("ctaDemo")}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </SolutionArticleShell>
    </>
  );
}
