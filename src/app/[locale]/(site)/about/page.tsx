import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";
import { ArrowRight, Code2, ShieldCheck, Eye } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "aboutPage" });
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
        { name: t("breadcrumbAbout"), url: pageUrl },
      ]),
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#about`,
        url: pageUrl,
        name: t("metaTitle"),
        description: t("metaDescription"),
        publisher: { "@id": "https://metadist.de/#organization" },
        author: { "@id": "https://metadist.de/#organization" },
      },
    ],
  };

  const values = [
    { icon: <Code2 className="size-5 text-brand-600" />, title: t("v1Title"), desc: t("v1Desc") },
    { icon: <ShieldCheck className="size-5 text-emerald-600" />, title: t("v2Title"), desc: t("v2Desc") },
    { icon: <Eye className="size-5 text-amber-600" />, title: t("v3Title"), desc: t("v3Desc") },
  ];

  const subPages = [
    { href: "/about/team", label: t("ctaTeam") },
    { href: "/about/philosophy", label: t("ctaPhilosophy") },
    { href: "/about/partners", label: t("ctaPartners") },
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
          { label: t("breadcrumbAbout") },
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

        {/* Mission */}
        <section className="mt-16 mx-auto max-w-3xl rounded-2xl border border-brand-200 bg-brand-50 p-8">
          <h2 className="text-xl font-bold text-foreground">{t("missionTitle")}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("missionBody")}</p>
        </section>

        {/* Values */}
        <section className="mt-12">
          <dl className="grid gap-6 sm:grid-cols-3">
            {values.map((v, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <dt className="mb-3 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent">
                    {v.icon}
                  </span>
                  <span className="font-semibold text-foreground">{v.title}</span>
                </dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{v.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Sub-page links */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {subPages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-center justify-between rounded-xl border border-border bg-background px-5 py-4 font-medium text-foreground transition-all hover:border-brand-300 hover:shadow-md"
            >
              {p.label}
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </section>

        {/* Company info */}
        <footer className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">metadist data management GmbH</strong>
            {" · "}Königsallee 82, 40212 Düsseldorf{" · "}
            <a href="https://metadist.de" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
              metadist.de
            </a>
          </p>
        </footer>
      </SolutionArticleShell>
    </>
  );
}
