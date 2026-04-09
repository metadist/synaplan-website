import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/jsonld";
import { LinkedInIcon } from "@/components/icons";
import { LINKS } from "@/lib/constants";
import { ExternalLink, ArrowUpRight } from "lucide-react";

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
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
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

type Advisor = {
  name: string;
  linkedin: string;
  initials: string;
  color: string;
};

type TechPartner = {
  name: string;
  url: string;
  color: string;
  textColor: string;
};

const TEAM_DE: TeamMember[] = [
  {
    name: "Ralf",
    role: "CEO & Founder",
    location: "Düsseldorf",
    linkedin: "https://www.linkedin.com/in/orgaralf/",
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
  {
    name: "Stefan",
    role: "UI Design",
    location: "Düsseldorf",
    initials: "S",
    color: "bg-emerald-600",
  },
];

const TEAM_CH: TeamMember[] = [
  {
    name: "Daniel",
    role: "CEO, Synaplan Schweiz GmbH",
    location: "Basel, Switzerland",
    initials: "D",
    color: "bg-brand-600",
  },
  {
    name: "Aurel",
    role: "AI / ML Engineer",
    location: "Basel, Switzerland",
    initials: "A",
    color: "bg-rose-600",
  },
];

const ADVISORS: Advisor[] = [
  {
    name: "Claudia",
    linkedin: "https://www.linkedin.com/in/claudianemat/",
    initials: "C",
    color: "bg-indigo-600",
  },
  {
    name: "Oliver",
    linkedin: "https://www.linkedin.com/in/oli-b-0057362a/",
    initials: "O",
    color: "bg-cyan-600",
  },
  {
    name: "André",
    linkedin: "https://www.linkedin.com/in/dr-andre-t-nemat/",
    initials: "A",
    color: "bg-fuchsia-600",
  },
];

const TECH_PARTNERS: TechPartner[] = [
  {
    name: "IABG",
    url: "https://www.iabg.de/",
    color: "bg-brand-50 border-brand-200",
    textColor: "text-brand-700",
  },
  {
    name: "B1 Systems",
    url: "https://www.b1-systems.de/",
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-700",
  },
  {
    name: "Groq",
    url: "https://groq.com/",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
  },
  {
    name: "Vultr",
    url: "https://www.vultr.com/",
    color: "bg-violet-50 border-violet-200",
    textColor: "text-violet-700",
  },
];

const ALL_MEMBERS = [...TEAM_DE, ...TEAM_CH];

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center transition-shadow hover:shadow-md">
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
  );
}

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

  const personSchemas = ALL_MEMBERS.map((m) => ({
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

        {/* metadist GmbH — Germany */}
        <section className="mt-16">
          <h2 className="mb-2 text-xl font-bold text-foreground">{t("deTitle")}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{t("deSub")}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_DE.map((member) => (
              <MemberCard key={member.name + member.role} member={member} />
            ))}
          </div>
        </section>

        {/* Synaplan Schweiz GmbH — Switzerland */}
        <section className="mt-12">
          <h2 className="mb-2 text-xl font-bold text-foreground">{t("chTitle")}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{t("chSub")}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_CH.map((member) => (
              <MemberCard key={member.name + member.role} member={member} />
            ))}
          </div>
        </section>

        {/* Board of Advisors */}
        <section className="mt-16">
          <h2 className="mb-2 text-xl font-bold text-foreground">{t("advisorsTitle")}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{t("advisorsSub")}</p>
          <div className="grid gap-5 sm:grid-cols-3">
            {ADVISORS.map((advisor) => (
              <a
                key={advisor.name}
                href={advisor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center transition-shadow hover:shadow-md"
              >
                <span
                  className={`mb-4 flex size-16 items-center justify-center rounded-2xl text-xl font-bold text-white ${advisor.color}`}
                >
                  {advisor.initials}
                </span>
                <strong className="font-semibold text-foreground">{advisor.name}</strong>
                <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <LinkedInIcon className="size-3.5" />
                  LinkedIn
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Technology Partners */}
        <section className="mt-16">
          <h2 className="mb-2 text-xl font-bold text-foreground">{t("techPartnersTitle")}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{t("techPartnersSub")}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center rounded-2xl border p-6 text-center transition-shadow hover:shadow-md ${partner.color}`}
              >
                <strong className={`text-lg font-bold ${partner.textColor}`}>{partner.name}</strong>
                <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {t("visitWebsite")}
                  <ArrowUpRight className="size-3" />
                </span>
              </a>
            ))}
          </div>
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
              href={LINKS.whatsappDE}
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
