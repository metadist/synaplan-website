import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Clock,
  ExternalLink,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Server,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DiscordIcon, GithubIcon, WhatsAppIcon } from "@/components/icons";
import { LINKS } from "@/lib/constants";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, PUBLISHER, SITE_URL } from "@/lib/jsonld";

export const dynamic = "force-static";

const PATH = "/contact";

const EMAIL = "team@synaplan.com";
const PHONE_HREF = "tel:+4921190760084";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Königsallee 82, 40212 Düsseldorf, Germany");

function mailto(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
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

function ChannelCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6 transition-shadow hover:shadow-md">
      <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-50">
        <Icon className="size-4.5 text-brand-700" />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">{children}</div>
    </div>
  );
}

const actionClass =
  "inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-700 underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${pageUrl}#contact`,
        url: pageUrl,
        name: t("metaTitle"),
        description: t("metaDescription"),
        inLanguage: isDE ? "de-DE" : "en-US",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": "https://metadist.de/#organization" },
        mainEntity: {
          "@type": "Organization",
          "@id": "https://metadist.de/#organization",
          contactPoint: [PUBLISHER.contactPoint],
        },
      },
      buildBreadcrumbSchema([
        { name: t("breadcrumbHome"), url: isDE ? `${SITE_URL}/de` : SITE_URL },
        { name: t("breadcrumbContact"), url: pageUrl },
      ]),
    ],
  };

  const topics = [
    {
      icon: Rocket,
      title: t("topicSalesTitle"),
      description: t("topicSalesDesc"),
      actions: [
        { label: t("topicSalesCta"), href: mailto(t("topicSalesSubject")) },
      ],
    },
    {
      icon: LifeBuoy,
      title: t("topicSupportTitle"),
      description: t("topicSupportDesc"),
      actions: [
        { label: t("topicSupportCtaPage"), href: "/support", internal: true },
        { label: t("topicSupportCta"), href: LINKS.discord, external: true },
        { label: t("topicSupportCtaAlt"), href: LINKS.docs, external: true },
      ],
    },
    {
      icon: Bug,
      title: t("topicOpenSourceTitle"),
      description: t("topicOpenSourceDesc"),
      actions: [
        { label: t("topicOpenSourceCta"), href: `${LINKS.github}/issues`, external: true },
      ],
    },
    {
      icon: Server,
      title: t("topicEnterpriseTitle"),
      description: t("topicEnterpriseDesc"),
      actions: [
        { label: t("topicEnterpriseCta"), href: mailto(t("topicEnterpriseSubject")) },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <div className="border-b border-[rgb(196_197_215/0.2)] bg-gradient-to-b from-background to-soft-accent/30">
          <div className="container-narrow section-padding py-14 md:py-20">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Link href="/" className="transition-colors hover:text-foreground">
                {t("breadcrumbHome")}
              </Link>
              <span className="text-muted-foreground/40" aria-hidden>
                /
              </span>
              <span className="font-medium text-foreground">{t("breadcrumbContact")}</span>
            </nav>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                {t("badge")}
              </span>
            </div>

            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-balance text-foreground md:text-4xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t("heroLead")}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <Clock className="size-4 text-brand-700" aria-hidden />
                {t("responseTime")}
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-brand-700" aria-hidden />
                {t("officeHours")}
              </li>
            </ul>
          </div>
        </div>

        <div className="container-narrow section-padding py-12 md:py-16">
          {/* Direct channels */}
          <section aria-labelledby="contact-channels">
            <h2
              id="contact-channels"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {t("channelsTitle")}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ChannelCard
                icon={Mail}
                title={t("emailTitle")}
                description={t("emailDesc")}
              >
                <a href={mailto(t("emailSubject"))} className={actionClass}>
                  {t("emailValue")}
                </a>
              </ChannelCard>

              <ChannelCard
                icon={Phone}
                title={t("phoneTitle")}
                description={t("phoneDesc")}
              >
                <a href={PHONE_HREF} className={actionClass}>
                  {t("phoneValue")}
                </a>
              </ChannelCard>

              <ChannelCard
                icon={WhatsAppIcon}
                title={t("whatsappTitle")}
                description={t("whatsappDesc")}
              >
                <a
                  href={LINKS.whatsappDE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {t("whatsappDE")}
                  <ExternalLink className="size-3 opacity-60" aria-hidden />
                </a>
                <a
                  href={LINKS.whatsappUS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {t("whatsappUS")}
                  <ExternalLink className="size-3 opacity-60" aria-hidden />
                </a>
              </ChannelCard>
            </div>
          </section>

          {/* Topic routing */}
          <section aria-labelledby="contact-topics" className="mt-14">
            <h2
              id="contact-topics"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {t("topicsTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("topicsLead")}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {topics.map((topic) => (
                <div
                  key={topic.title}
                  className="flex flex-col rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                      <topic.icon className="size-4 text-brand-700" aria-hidden />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {topic.title}
                    </h3>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {topic.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {topic.actions.map((action) =>
                      "external" in action && action.external ? (
                        <a
                          key={action.href}
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={actionClass}
                        >
                          {action.label}
                          <ExternalLink className="size-3 opacity-60" aria-hidden />
                        </a>
                      ) : "internal" in action && action.internal ? (
                        <Link key={action.href} href={action.href} className={actionClass}>
                          {action.label}
                          <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                        </Link>
                      ) : (
                        <a key={action.href} href={action.href} className={actionClass}>
                          {action.label}
                          <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                        </a>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Office + privacy */}
          <section aria-labelledby="contact-office" className="mt-14 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <MapPin className="size-4 text-brand-700" aria-hidden />
                </span>
                <h2
                  id="contact-office"
                  className="text-base font-semibold text-foreground"
                >
                  {t("officeTitle")}
                </h2>
              </div>
              <address className="text-sm not-italic leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{t("officeCompany")}</span>
                <br />
                {t("officeStreet")}
                <br />
                {t("officeCity")}
                <br />
                {t("officeCountry")}
              </address>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {t("officeMapsCta")}
                  <ExternalLink className="size-3 opacity-60" aria-hidden />
                </a>
                <Link href="/imprint" className={actionClass}>
                  {t("officeImprintCta")}
                  <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <ShieldCheck className="size-4 text-brand-700" aria-hidden />
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {t("privacyTitle")}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("privacyBody")}
              </p>
              <div className="mt-4">
                <Link href="/privacy-policy" className={actionClass}>
                  {t("privacyCta")}
                  <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          {/* Community + CTA */}
          <section
            aria-labelledby="contact-cta"
            className="mt-14 rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center"
          >
            <h2
              id="contact-cta"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t("ctaLead")}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/try-chat"
                className="btn-figma-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {t("ctaPrimary")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground">
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="GitHub"
              >
                <GithubIcon className="size-5" />
              </a>
              <a
                href={LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="Discord"
              >
                <DiscordIcon className="size-5" />
              </a>
              <a
                href={LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={t("topicSupportCtaAlt")}
              >
                <BookOpen className="size-5" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
