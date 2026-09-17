import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Clock,
  CreditCard,
  ExternalLink,
  Flag,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ScrollText,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DiscordIcon, GithubIcon, WhatsAppIcon } from "@/components/icons";
import { LINKS } from "@/lib/constants";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { buildBreadcrumbSchema, PUBLISHER, SITE_URL } from "@/lib/jsonld";

export const dynamic = "force-static";

const PATH = "/support";

const EMAIL = "team@synaplan.com";
const PHONE_HREF = "tel:+4921190760084";
const APPLE_REFUND_URL = "https://reportaproblem.apple.com";

function mailto(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "supportPage" });
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

const cardClass =
  "flex flex-col rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6";

const actionClass =
  "inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-700 underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

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
    <div className={`${cardClass} transition-shadow hover:shadow-md`}>
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

function StepCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cardClass}>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <Icon className="size-4 text-brand-700" aria-hidden />
        </span>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/** Renders an in-app navigation path such as `Settings > Subscriptions`. */
function UiPath({ children }: { children: string }) {
  return (
    <p className="mt-3 rounded-lg bg-soft-accent/60 px-3 py-2 font-mono text-xs leading-relaxed break-words text-foreground">
      {children}
    </p>
  );
}

function Callout({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <TriangleAlert className="mt-0.5 size-4.5 shrink-0 text-amber-600" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-amber-900">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/80">{body}</p>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-foreground">
        {q}
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-soft-accent text-muted-foreground transition-transform group-open:rotate-45">
          <ArrowRight className="size-3 rotate-[-45deg] transition-transform group-open:rotate-0" />
        </span>
      </summary>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  );
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "supportPage" });
  const isDE = locale === "de";
  const pageUrl = canonicalUrl(locale, PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#support`,
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
        { name: t("breadcrumbSupport"), url: pageUrl },
      ]),
    ],
  };

  const jumpLinks = [
    { href: "#help", label: t("jumpHelp") },
    { href: "#subscriptions", label: t("jumpSubscriptions") },
    { href: "#account", label: t("jumpAccount") },
    { href: "#report", label: t("jumpReport") },
    { href: "#faq", label: t("jumpFaq") },
    { href: "#bugs", label: t("jumpBugs") },
    { href: "#legal", label: t("jumpLegal") },
  ];

  const deletedItems = [
    t("deleteRemoves1"),
    t("deleteRemoves2"),
    t("deleteRemoves3"),
    t("deleteRemoves4"),
    t("deleteRemoves5"),
  ];

  const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

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
              <span className="font-medium text-foreground">{t("breadcrumbSupport")}</span>
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

            <nav aria-label={t("jumpTitle")} className="mt-8">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("jumpTitle")}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {jumpLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-500 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="container-narrow section-padding py-12 md:py-16">
          {/* 1 — Get help */}
          <section aria-labelledby="help-title" className="scroll-mt-24" id="help">
            <h2 id="help-title" className="text-xl font-bold tracking-tight text-foreground">
              {t("helpTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("helpLead")}
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ChannelCard icon={Mail} title={t("emailTitle")} description={t("emailDesc")}>
                <a href={mailto(t("emailSubject"))} className={actionClass}>
                  {t("emailValue")}
                </a>
              </ChannelCard>

              <ChannelCard icon={Phone} title={t("phoneTitle")} description={t("phoneDesc")}>
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

              <ChannelCard icon={BookOpen} title={t("docsTitle")} description={t("docsDesc")}>
                <a
                  href={LINKS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {t("docsCta")}
                  <ExternalLink className="size-3 opacity-60" aria-hidden />
                </a>
              </ChannelCard>

              <ChannelCard
                icon={DiscordIcon}
                title={t("discordTitle")}
                description={t("discordDesc")}
              >
                <a
                  href={LINKS.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {t("discordCta")}
                  <ExternalLink className="size-3 opacity-60" aria-hidden />
                </a>
              </ChannelCard>
            </div>
          </section>

          {/* 2 — App Store subscriptions */}
          <section aria-labelledby="subscriptions-title" className="mt-14 scroll-mt-24" id="subscriptions">
            <h2
              id="subscriptions-title"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {t("subsTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("subsLead")}
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <StepCard icon={CreditCard} title={t("subsManageTitle")}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("subsManageBody")}
                </p>
                <UiPath>{t("subsManagePath")}</UiPath>
              </StepCard>

              <StepCard icon={Clock} title={t("subsCancelTitle")}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("subsCancelBody")}
                </p>
              </StepCard>

              <StepCard icon={ScrollText} title={t("subsRefundTitle")}>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t("subsRefundBody")}
                </p>
                <div className="mt-4">
                  <a
                    href={APPLE_REFUND_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={actionClass}
                  >
                    {t("subsRefundCta")}
                    <ExternalLink className="size-3 opacity-60" aria-hidden />
                  </a>
                </div>
              </StepCard>

              <StepCard icon={RotateCcw} title={t("subsRestoreTitle")}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("subsRestoreBody")}
                </p>
              </StepCard>
            </div>

            <Callout title={t("subsNoteTitle")} body={t("subsNoteBody")} />
          </section>

          {/* 3 — Delete your account */}
          <section aria-labelledby="account-title" className="mt-14 scroll-mt-24" id="account">
            <h2
              id="account-title"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {t("deleteTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("deleteLead")}
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <StepCard icon={Trash2} title={t("deletePathLabel")}>
                <UiPath>{t("deletePath")}</UiPath>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("deleteBody")}
                </p>
              </StepCard>

              <div className={cardClass}>
                <h3 className="text-base font-semibold text-foreground">
                  {t("deleteRemovesTitle")}
                </h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                  {deletedItems.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Callout title={t("deleteWarningTitle")} body={t("deleteWarningBody")} />
          </section>

          {/* 4 — Report content */}
          <section aria-labelledby="report-title" className="mt-14 scroll-mt-24" id="report">
            <h2
              id="report-title"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {t("reportTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("reportLead")}
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <StepCard icon={Flag} title={t("reportInAppTitle")}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("reportInAppBody")}
                </p>
              </StepCard>

              <StepCard icon={Mail} title={t("reportEmailTitle")}>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t("reportEmailBody")}
                </p>
                <div className="mt-4">
                  <a href={mailto(t("reportEmailSubject"))} className={actionClass}>
                    {t("reportEmailCta")}
                    <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                  </a>
                </div>
              </StepCard>
            </div>

            <div className="mt-5 rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <p className="text-sm font-semibold text-foreground">
                {t("reportActionTitle")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t("reportActionBody")}
              </p>
            </div>
          </section>

          {/* 5 — Common questions */}
          <section aria-labelledby="faq-title" className="mt-14 scroll-mt-24" id="faq">
            <h2 id="faq-title" className="text-xl font-bold tracking-tight text-foreground">
              {t("faqTitle")}
            </h2>
            <div className="mt-4 divide-y divide-[rgb(196_197_215/0.3)]">
              {faqKeys.map((key) => (
                <FaqItem key={key} q={t(`${key}Q`)} a={t(`${key}A`)} />
              ))}
            </div>
          </section>

          {/* 6 — Bugs and feature requests */}
          <section aria-labelledby="bugs-title" className="mt-14 scroll-mt-24" id="bugs">
            <div className={cardClass}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <Bug className="size-4 text-brand-700" aria-hidden />
                </span>
                <h2
                  id="bugs-title"
                  className="text-base font-semibold text-foreground"
                >
                  {t("bugsTitle")}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("bugsBody")}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={`${LINKS.github}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {t("bugsCta")}
                  <ExternalLink className="size-3 opacity-60" aria-hidden />
                </a>
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  <GithubIcon className="size-3.5" aria-hidden />
                  {t("bugsSecondary")}
                </a>
              </div>
            </div>
          </section>

          {/* 7 — Legal and company */}
          <section aria-labelledby="legal-title" className="mt-14 scroll-mt-24" id="legal">
            <div className={cardClass}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <MapPin className="size-4 text-brand-700" aria-hidden />
                </span>
                <h2
                  id="legal-title"
                  className="text-base font-semibold text-foreground"
                >
                  {t("legalTitle")}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("legalLead")}</p>
              <address className="mt-3 text-sm not-italic leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{t("legalCompany")}</span>
                <br />
                {t("legalStreet")}
                <br />
                {t("legalCity")}
                <br />
                {t("legalCountry")}
                <br />
                <a href={mailto(t("emailSubject"))} className={`${actionClass} mt-2`}>
                  {t("emailValue")}
                </a>
              </address>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link href="/privacy-policy" className={actionClass}>
                  {t("legalPrivacyCta")}
                  <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                </Link>
                <Link href="/terms" className={actionClass}>
                  {t("legalTermsCta")}
                  <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                </Link>
                <Link href="/imprint" className={actionClass}>
                  {t("legalImprintCta")}
                  <ArrowRight className="size-3.5 opacity-70" aria-hidden />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
