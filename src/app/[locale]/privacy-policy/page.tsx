import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Calendar,
  Cookie,
  Database,
  Eye,
  Globe,
  Lock,
  Mail,
  Server,
  Shield,
} from "lucide-react";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { LegalToc } from "@/components/legal/legal-toc";

const PATH = "/privacy-policy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });
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

function SectionCard({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <Icon className="size-4 text-brand-700" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="ml-12 space-y-4">{children}</div>
    </section>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-5 space-y-3">
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:w-44">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function SubSection({
  title,
  body,
  legal,
}: {
  title: string;
  body: string;
  legal: string;
}) {
  return (
    <div className="rounded-xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-4">
      <h3 className="mb-1.5 text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      <p className="mt-2 text-xs font-medium text-brand-700">{legal}</p>
    </div>
  );
}

function RightItem({ right, body }: { right: string; body: string }) {
  return (
    <div className="rounded-xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-4">
      <p className="text-sm font-semibold text-foreground mb-1">{right}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
      {children}
    </div>
  );
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  const sections = [
    { id: "s1", title: t("s1Title"), icon: Shield },
    { id: "s2", title: t("s2Title"), icon: Eye },
    { id: "s3", title: t("s3Title"), icon: Cookie },
    { id: "s4", title: t("s4Title"), icon: Calendar },
    { id: "s5", title: t("s5Title"), icon: Server },
    { id: "s6", title: t("s6Title"), icon: Globe },
    { id: "s7", title: t("s7Title"), icon: Database },
    { id: "s8", title: t("s8Title"), icon: Database },
    { id: "s9", title: t("s9Title"), icon: Shield },
    { id: "s10", title: t("s10Title"), icon: Lock },
  ];

  const tocItems = sections.map(({ id, title }) => ({ id, title }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-[rgb(196_197_215/0.2)] bg-gradient-to-b from-background to-soft-accent/30">
        <div className="container-narrow section-padding py-14 md:py-20">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {locale === "de" ? "Startseite" : "Home"}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-medium text-foreground">{t("pageTitle")}</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="size-4 text-brand-700" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              {locale === "de" ? "DSGVO-konform" : "GDPR compliant"}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            {t("pageSubtitle")}
          </p>
          <p className="mt-3 text-xs text-muted-foreground/60">{t("lastUpdated")}</p>
        </div>
      </div>

      {/* Body */}
      <div className="container-narrow section-padding py-12 md:py-16">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-14">

          {/* TOC — sticky sidebar */}
          <aside className="mb-10 lg:mb-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("tocTitle")}
            </p>
            <LegalToc
              items={tocItems}
              contactLabel={locale === "de" ? "Fragen?" : "Questions?"}
              contactSub={
                locale === "de"
                  ? "Wir helfen Ihnen gerne."
                  : "We are happy to help."
              }
              contactEmail="team@synaplan.com"
            />
          </aside>

          {/* Main content */}
          <div className="space-y-10 divide-y divide-[rgb(196_197_215/0.25)]">
            {/* S1 — Controller */}
            <SectionCard id="s1" icon={Shield} title={t("s1Title")}>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("s1Body")}</p>
              <InfoBox>
                <p className="text-sm font-semibold text-foreground">{t("s1Company")}</p>
                <p className="text-sm text-muted-foreground">{t("s1Address")}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "de" ? "E-Mail" : "Email"}:{" "}
                  <a
                    href={`mailto:${t("s1Email")}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {t("s1Email")}
                  </a>
                </p>
              </InfoBox>
            </SectionCard>

            {/* S2 — General */}
            <div className="pt-10">
              <SectionCard id="s2" icon={Eye} title={t("s2Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s2Body")}</p>
              </SectionCard>
            </div>

            {/* S3 — Cookies */}
            <div className="pt-10">
              <SectionCard id="s3" icon={Cookie} title={t("s3Title")}>
                <p className="text-sm text-muted-foreground">{t("s3CookiesTitle")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s3CookiesBody")}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <SubSection title={t("s3NecessaryTitle")} body={t("s3NecessaryBody")} legal={t("s3NecessaryLegal")} />
                  <SubSection title={t("s3AnalyticsTitle")} body={t("s3AnalyticsBody")} legal={t("s3AnalyticsLegal")} />
                  <SubSection title={t("s3MarketingTitle")} body={t("s3MarketingBody")} legal={t("s3MarketingLegal")} />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{t("s3LogsTitle")}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t("s3LogsBody")}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <InfoRow label={t("legalBasis")} value={t("s3LogsLegal")} />
                    <InfoRow label={t("durationLabel")} value={t("s3LogsDuration")} />
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* S4 — Calendly */}
            <div className="pt-10">
              <SectionCard id="s4" icon={Calendar} title={t("s4Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s4Body")}</p>
                <InfoBox>
                  <InfoRow label={t("providerLabel")} value={t("s4Provider")} />
                  <InfoRow label={t("purposeLabel")} value={t("s4Purpose")} />
                  <InfoRow label={t("legalBasis")} value={t("s4Legal")} />
                  <InfoRow label={t("usTransferLabel")} value={t("s4Transfer")} />
                  <InfoRow label={t("moreInfoLabel")} value={t("s4More")} />
                </InfoBox>
              </SectionCard>
            </div>

            {/* S5 — Hetzner */}
            <div className="pt-10">
              <SectionCard id="s5" icon={Server} title={t("s5Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s5Body")}</p>
                <InfoBox>
                  <InfoRow label={t("providerLabel")} value={t("s5Provider")} />
                  <InfoRow label={t("dataProcessedLabel")} value={t("s5Data")} />
                  <InfoRow label={t("legalBasis")} value={t("s5Legal")} />
                  <InfoRow label={t("dpaLabel")} value={t("s5Dpa")} />
                </InfoBox>
              </SectionCard>
            </div>

            {/* S6 — Cloudflare CDN */}
            <div className="pt-10">
              <SectionCard id="s6" icon={Globe} title={t("s6Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s6Body")}</p>
                <InfoBox>
                  <InfoRow label={t("providerLabel")} value={t("s6Provider")} />
                  <InfoRow label={t("dataProcessedLabel")} value={t("s6Data")} />
                  <InfoRow label={t("purposeLabel")} value={t("s6Purpose")} />
                  <InfoRow label={t("legalBasis")} value={t("s6Legal")} />
                  <InfoRow label={t("dpaLabel")} value={t("s6Dpa")} />
                  <InfoRow label={t("usTransferLabel")} value={t("s6Transfer")} />
                </InfoBox>
              </SectionCard>
            </div>

            {/* S7 — Cloudflare Zaraz */}
            <div className="pt-10">
              <SectionCard id="s7" icon={Database} title={t("s7Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s7Body")}</p>
                <InfoBox>
                  <InfoRow label={t("legalBasis")} value={t("s7Legal")} />
                  <InfoRow label={t("usTransferLabel")} value={t("s7Transfer")} />
                </InfoBox>
                <HighlightBox>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-2">
                    {locale === "de" ? "Datenschutzmaßnahmen" : "Privacy measures"}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t("s7Measures")}</p>
                </HighlightBox>
              </SectionCard>
            </div>

            {/* S8 — Retention */}
            <div className="pt-10">
              <SectionCard id="s8" icon={Database} title={t("s8Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s8Body")}</p>
                <div className="overflow-hidden rounded-2xl border border-[rgb(196_197_215/0.35)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[rgb(196_197_215/0.35)] bg-soft-accent/60">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("s8TypeLabel")}
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("s8DurLabel")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgb(196_197_215/0.25)] bg-white/80">
                      {(
                        [
                          [t("s8Row1"), t("s8Dur1")],
                          [t("s8Row2"), t("s8Dur2")],
                          [t("s8Row3"), t("s8Dur3")],
                        ] as [string, string][]
                      ).map(([row, dur]) => (
                        <tr key={row}>
                          <td className="px-5 py-3 text-sm text-foreground">{row}</td>
                          <td className="px-5 py-3 text-sm font-medium text-brand-700">{dur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>

            {/* S9 — Rights */}
            <div className="pt-10">
              <SectionCard id="s9" icon={Shield} title={t("s9Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s9Body")}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["s9R1", "s9R1b"],
                      ["s9R2", "s9R2b"],
                      ["s9R3", "s9R3b"],
                      ["s9R4", "s9R4b"],
                      ["s9R5", "s9R5b"],
                      ["s9R6", "s9R6b"],
                      ["s9R7", "s9R7b"],
                      ["s9R8", "s9R8b"],
                    ] as const
                  ).map(([rKey, bKey]) => (
                    <RightItem key={rKey} right={t(rKey)} body={t(bKey)} />
                  ))}
                </div>
                <HighlightBox>
                  <p className="text-sm text-muted-foreground">{t("s9Contact")}</p>
                  <a
                    href={`mailto:${t("s9Email")}`}
                    className="mt-1.5 inline-block text-sm font-semibold text-brand-700 hover:underline"
                  >
                    {t("s9Email")}
                  </a>
                </HighlightBox>
              </SectionCard>
            </div>

            {/* S10 — SSL */}
            <div className="pt-10">
              <SectionCard id="s10" icon={Lock} title={t("s10Title")}>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("s10Body")}</p>
              </SectionCard>
            </div>

            {/* ── Closing section ── */}
            <div className="pt-16 pb-32">
              {/* Decorative divider */}
              <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgb(196_197_215/0.6)] to-transparent" />
                <Shield className="size-4 text-brand-300" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgb(196_197_215/0.6)] to-transparent" />
              </div>

              {/* Two-column info strip */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Responsible party */}
                <div className="rounded-2xl border border-[rgb(196_197_215/0.4)] bg-white/70 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50">
                      <Mail className="size-3.5 text-brand-700" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {locale === "de" ? "Verantwortliche Stelle" : "Controller"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">metadist data management GmbH</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Königsallee 82, 40212 Düsseldorf</p>
                  <a
                    href="mailto:team@synaplan.com"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
                  >
                    team@synaplan.com
                    <ArrowRight className="size-3" />
                  </a>
                </div>

                {/* Contact for privacy questions */}
                <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100">
                      <Shield className="size-3.5 text-brand-700" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                      {locale === "de" ? "Datenschutzfragen" : "Privacy inquiries"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {locale === "de"
                      ? "Bei Fragen zu Ihren Rechten oder zur Datenverarbeitung kontaktieren Sie uns jederzeit."
                      : "For questions about your rights or data processing, contact us at any time."}
                  </p>
                  <a
                    href="mailto:team@synaplan.com"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    {locale === "de" ? "E-Mail schreiben" : "Send email"}
                    <ArrowRight className="size-3" />
                  </a>
                </div>
              </div>

              {/* Last-updated note */}
              <p className="mt-8 text-center text-xs text-muted-foreground/50">
                {t("lastUpdated")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
