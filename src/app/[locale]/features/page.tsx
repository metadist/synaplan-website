import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/jsonld";
import { ArrowRight, GitBranch, BookOpen, ShieldCheck, MessageSquare } from "lucide-react";
import { LINKS } from "@/lib/constants";

export const dynamic = "force-static";

const PATH = "/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "featuresPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    keywords:
      locale === "de"
        ? "KI-Plattform Funktionen, AI Gateway, KI Compliance, RAG, Chat-Widget"
        : "AI platform features, AI gateway, LLM proxy, RAG memories, audit logs",
    openGraph: { title, description, url: canonicalUrl(locale, PATH) },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

const featureCards = [
  {
    icon: GitBranch,
    hrefKey: "f1Href" as const,
    titleKey: "f1Title" as const,
    descKey: "f1Desc" as const,
    color: "text-brand-600",
    bg: "bg-brand-50",
  },
  {
    icon: BookOpen,
    hrefKey: "f2Href" as const,
    titleKey: "f2Title" as const,
    descKey: "f2Desc" as const,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: ShieldCheck,
    hrefKey: "f3Href" as const,
    titleKey: "f3Title" as const,
    descKey: "f3Desc" as const,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: MessageSquare,
    hrefKey: "f4Href" as const,
    titleKey: "f4Title" as const,
    descKey: "f4Desc" as const,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
] as const;

export default async function FeaturesOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "featuresPage" });
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: t("breadcrumbFeatures"), url: pageUrl },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolutionArticleShell
        breadcrumbItems={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbFeatures") },
        ]}
      >
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t("heroLead")}</p>
        </header>

        {/* Feature cards */}
        <section className="mt-16 grid gap-6 sm:grid-cols-2">
          {featureCards.map(({ icon: Icon, hrefKey, titleKey, descKey, color, bg }) => (
            <Link
              key={titleKey}
              href={t(hrefKey) as string}
              className="group flex flex-col rounded-2xl border border-border bg-background p-7 transition-all hover:border-brand-300 hover:shadow-lg"
            >
              <span className={`mb-4 flex size-12 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`size-6 ${color}`} />
              </span>
              <h2 className="mb-2 text-lg font-semibold text-foreground group-hover:text-brand-700 transition-colors">
                {t(titleKey)}
              </h2>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{t(descKey)}</p>
              <span className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("ctaTitle")}</h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-figma-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white sm:w-auto"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href={LINKS.whatsappDE}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-medium text-foreground transition-colors hover:bg-accent sm:w-auto"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </SolutionArticleShell>
    </>
  );
}
