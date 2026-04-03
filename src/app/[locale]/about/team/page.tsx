import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/jsonld";
import { LinkedInIcon } from "@/components/icons";
import { LINKS } from "@/lib/constants";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-static";

const PATH = "/about/team";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "teamPage" });
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

type TeamMember = {
  name: string;
  role: string;
  location: string;
  linkedin?: string;
  initials: string;
  color: string;
};

const TEAM: TeamMember[] = [
  {
    name: "Daniel",
    role: "CEO & Co-Founder",
    location: "Düsseldorf / Zürich",
    linkedin: "https://linkedin.com/in/",
    initials: "D",
    color: "bg-brand-600",
  },
  {
    name: "Stefan",
    role: "CTO & Co-Founder",
    location: "Düsseldorf",
    initials: "S",
    color: "bg-emerald-600",
  },
  {
    name: "Ralf",
    role: "Senior Engineer",
    location: "Germany",
    initials: "R",
    color: "bg-amber-600",
  },
  {
    name: "Yusuf",
    role: "Full Stack Developer",
    location: "Germany",
    initials: "Y",
    color: "bg-violet-600",
  },
  {
    name: "Aurel",
    role: "AI / ML Engineer",
    location: "Germany",
    initials: "A",
    color: "bg-rose-600",
  },
  {
    name: "Ana",
    role: "Product & Design",
    location: "Germany",
    initials: "A",
    color: "bg-teal-600",
  },
  {
    name: "Dominik",
    role: "Backend Developer",
    location: "Germany",
    initials: "D",
    color: "bg-sky-600",
  },
  {
    name: "Furkan",
    role: "Frontend Developer",
    location: "Germany",
    initials: "F",
    color: "bg-orange-600",
  },
];

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "teamPage" });
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

  const personSchemas = TEAM.map((m) => ({
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    worksFor: { "@id": "https://metadist.de/#organization" },
    ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: isDE ? "Über uns" : "About", url: `${SITE_URL}${isDE ? "/de" : ""}/about` },
        { name: t("breadcrumbTeam"), url: pageUrl },
      ]),
      ...personSchemas,
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
          { label: isDE ? "Startseite" : "Home", href: "/" },
          { label: isDE ? "Über uns" : "About", href: "/about" },
          { label: t("breadcrumbTeam") },
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

        {/* Team Grid */}
        <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <div
              key={member.name + member.role}
              className="group flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center transition-shadow hover:shadow-md"
            >
              <span
                className={`mb-4 flex size-16 items-center justify-center rounded-2xl text-xl font-bold text-white ${member.color}`}
              >
                {member.initials}
              </span>
              <strong className="font-semibold text-foreground">{member.name}</strong>
              <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
              <p className="mt-0.5 text-xs text-muted-foreground/70">{member.location}</p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="mt-3 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                >
                  <LinkedInIcon className="size-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          ))}
        </section>

        {/* Join CTA */}
        <section className="mt-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-foreground">{t("joinTitle")}</h2>
          <p className="mt-3 text-base text-muted-foreground">{t("joinBody")}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              {t("ctaContact")}
            </a>
          </div>
        </section>
      </SolutionArticleShell>
    </>
  );
}
