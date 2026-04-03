import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Shield, Server, Cookie, Calendar, Lock, Mail, Globe, Eye, Database } from "lucide-react";
import { canonicalUrl, alternateLanguageUrls } from "@/lib/seo";

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
    openGraph: { title, description },
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
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="ml-12 space-y-4">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-500 sm:w-44">
        {label}
      </span>
      <span className="text-sm text-neutral-300">{value}</span>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-4 space-y-2.5">
      {children}
    </div>
  );
}

function SubSection({ title, body, legal }: { title: string; body: string; legal: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-4">
      <h3 className="mb-2 text-sm font-semibold text-white/90">{title}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
      <p className="mt-2 text-xs text-brand-400/80">{legal}</p>
    </div>
  );
}

function RightItem({ right, body }: { right: string; body: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-3.5">
      <p className="text-sm font-medium text-white/90 mb-1">{right}</p>
      <p className="text-sm text-neutral-400">{body}</p>
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
    { id: "s1", title: t("s1Title") },
    { id: "s2", title: t("s2Title") },
    { id: "s3", title: t("s3Title") },
    { id: "s4", title: t("s4Title") },
    { id: "s5", title: t("s5Title") },
    { id: "s6", title: t("s6Title") },
    { id: "s7", title: t("s7Title") },
    { id: "s8", title: t("s8Title") },
    { id: "s9", title: t("s9Title") },
    { id: "s10", title: t("s10Title") },
    { id: "s11", title: t("s11Title") },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f1a]">
      {/* Hero */}
      <div className="border-b border-white/8 bg-[#10121e]">
        <div className="container-narrow section-padding py-14 md:py-20">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-brand-400">
              {locale === "de" ? "DSGVO-konform" : "GDPR compliant"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{t("pageTitle")}</h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-400 leading-relaxed">
            {t("pageSubtitle")}
          </p>
          <p className="mt-4 text-xs text-neutral-600">{t("lastUpdated")}</p>
        </div>
      </div>

      <div className="container-narrow section-padding py-12">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Table of contents — sticky on desktop */}
          <aside className="mb-10 lg:mb-0">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {t("tocTitle")}
              </p>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-md px-2 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-10 divide-y divide-white/8">
            {/* Section 1 — Controller */}
            <SectionCard id="s1" icon={Shield} title={t("s1Title")}>
              <p className="text-sm text-neutral-400">{t("s1Body")}</p>
              <InfoBox>
                <p className="text-sm font-semibold text-white">{t("s1Company")}</p>
                <p className="text-sm text-neutral-400">{t("s1Address")}</p>
                <p className="text-sm text-neutral-400">
                  {locale === "de" ? "E-Mail" : "Email"}:{" "}
                  <a
                    href={`mailto:${t("s1Email")}`}
                    className="text-brand-400 hover:underline"
                  >
                    {t("s1Email")}
                  </a>
                </p>
              </InfoBox>
            </SectionCard>

            {/* Section 2 — General */}
            <SectionCard id="s2" icon={Eye} title={t("s2Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s2Body")}</p>
            </SectionCard>

            {/* Section 3 — Data collection */}
            <SectionCard id="s3" icon={Cookie} title={t("s3Title")}>
              <p className="text-sm text-neutral-400">{t("s3CookiesTitle")}</p>
              <p className="text-sm text-neutral-500 leading-relaxed">{t("s3CookiesBody")}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <SubSection
                  title={t("s3NecessaryTitle")}
                  body={t("s3NecessaryBody")}
                  legal={t("s3NecessaryLegal")}
                />
                <SubSection
                  title={t("s3AnalyticsTitle")}
                  body={t("s3AnalyticsBody")}
                  legal={t("s3AnalyticsLegal")}
                />
                <SubSection
                  title={t("s3MarketingTitle")}
                  body={t("s3MarketingBody")}
                  legal={t("s3MarketingLegal")}
                />
              </div>
              <div className="mt-2">
                <h3 className="mb-2 text-sm font-semibold text-white/90">{t("s3LogsTitle")}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{t("s3LogsBody")}</p>
                <div className="mt-3 flex flex-wrap gap-4">
                  <InfoRow label={t("legalBasis")} value={t("s3LogsLegal")} />
                  <InfoRow label={t("durationLabel")} value={t("s3LogsDuration")} />
                </div>
              </div>
            </SectionCard>

            {/* Section 4 — Calendly */}
            <SectionCard id="s4" icon={Calendar} title={t("s4Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s4Body")}</p>
              <InfoBox>
                <InfoRow label={t("providerLabel")} value={t("s4Provider")} />
                <InfoRow label={t("purposeLabel")} value={t("s4Purpose")} />
                <InfoRow label={t("legalBasis")} value={t("s4Legal")} />
                <InfoRow label={t("usTransferLabel")} value={t("s4Transfer")} />
                <InfoRow
                  label={t("moreInfoLabel")}
                  value={t("s4More")}
                />
              </InfoBox>
            </SectionCard>

            {/* Section 5 — Hetzner */}
            <SectionCard id="s5" icon={Server} title={t("s5Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s5Body")}</p>
              <InfoBox>
                <InfoRow label={t("providerLabel")} value={t("s5Provider")} />
                <InfoRow label={t("dataProcessedLabel")} value={t("s5Data")} />
                <InfoRow label={t("legalBasis")} value={t("s5Legal")} />
                <InfoRow label={t("dpaLabel")} value={t("s5Dpa")} />
              </InfoBox>
            </SectionCard>

            {/* Section 6 — Cloudflare CDN */}
            <SectionCard id="s6" icon={Globe} title={t("s6Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s6Body")}</p>
              <InfoBox>
                <InfoRow label={t("providerLabel")} value={t("s6Provider")} />
                <InfoRow label={t("dataProcessedLabel")} value={t("s6Data")} />
                <InfoRow label={t("purposeLabel")} value={t("s6Purpose")} />
                <InfoRow label={t("legalBasis")} value={t("s6Legal")} />
                <InfoRow label={t("dpaLabel")} value={t("s6Dpa")} />
                <InfoRow label={t("usTransferLabel")} value={t("s6Transfer")} />
              </InfoBox>
            </SectionCard>

            {/* Section 7 — Cloudflare Zaraz */}
            <SectionCard id="s7" icon={Database} title={t("s7Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s7Body")}</p>
              <InfoBox>
                <InfoRow label={t("legalBasis")} value={t("s7Legal")} />
                <InfoRow label={t("usTransferLabel")} value={t("s7Transfer")} />
              </InfoBox>
              <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-2">
                  {locale === "de" ? "Datenschutzmaßnahmen" : "Privacy measures"}
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed">{t("s7Measures")}</p>
              </div>
            </SectionCard>

            {/* Section 8 — Retention */}
            <SectionCard id="s8" icon={Database} title={t("s8Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s8Body")}</p>
              <div className="overflow-hidden rounded-lg border border-white/8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/3">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        {t("s8TypeLabel")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        {t("s8DurLabel")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {[
                      [t("s8Row1"), t("s8Dur1")],
                      [t("s8Row2"), t("s8Dur2")],
                      [t("s8Row3"), t("s8Dur3")],
                    ].map(([row, dur]) => (
                      <tr key={row} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 text-neutral-300">{row}</td>
                        <td className="px-4 py-3 text-brand-400">{dur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Section 9 — Rights */}
            <SectionCard id="s9" icon={Shield} title={t("s9Title")}>
              <p className="text-sm text-neutral-400">{t("s9Body")}</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
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
              <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 p-4">
                <p className="text-sm text-neutral-400">{t("s9Contact")}</p>
                <a
                  href={`mailto:${t("s9Email")}`}
                  className="mt-1 inline-block text-sm font-medium text-brand-400 hover:underline"
                >
                  {t("s9Email")}
                </a>
              </div>
            </SectionCard>

            {/* Section 10 — SSL */}
            <SectionCard id="s10" icon={Lock} title={t("s10Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s10Body")}</p>
            </SectionCard>

            {/* Section 11 — Ad objection */}
            <SectionCard id="s11" icon={Mail} title={t("s11Title")}>
              <p className="text-sm text-neutral-400 leading-relaxed">{t("s11Body")}</p>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
