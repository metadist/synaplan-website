import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { PageHero } from "@/components/mission/sub-page";

const PATH = "/privacy-policy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });
  return missionMetadata(locale, PATH, t("metaTitle"), t("metaDescription"));
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <article id={id} className="mc-card scroll-mt-28">
      <h2 className="mc-mono text-[0.95rem] tracking-[0.06em] uppercase">{title}</h2>
      <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-[var(--mc-text-muted)]">{children}</div>
    </article>
  );
}

function Box({ children }: { children: ReactNode }) {
  return <div className="space-y-2 rounded-lg border border-[var(--mc-line)] p-4">{children}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="mc-label mr-2">{label}</span>
      {value}
    </p>
  );
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });
  const isDE = locale === "de";

  const toc = Array.from({ length: 13 }, (_, i) => {
    const id = `s${i + 1}`;
    return { id, title: t(`${id}Title`) };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(missionPageJsonLd(locale, PATH, t("metaTitle"), t("metaDescription"))) }}
      />
      <PageHero eyebrow={isDE ? "DSGVO" : "GDPR"} title={t("pageTitle")} lead={`${t("pageSubtitle")} ${t("lastUpdated")}`} />

      <section className="mc-section">
        <div className="mc-wrap max-w-3xl">
          <nav className="mb-8" aria-label={t("tocTitle")}>
            <p className="mc-label mb-3">{t("tocTitle")}</p>
            <ol className="flex flex-wrap gap-2">
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="mc-chip">
                    {String(i + 1).padStart(2, "0")} {item.title.replace(/^\d+\.\s*/, "")}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-3">
            <Section id="s1" title={t("s1Title")}>
              <p>{t("s1Body")}</p>
              <Box>
                <p className="text-[var(--mc-text)]">{t("s1Company")}</p>
                <p>{t("s1Address")}</p>
                <p>
                  <a href={`mailto:${t("s1Email")}`} className="underline underline-offset-4">
                    {t("s1Email")}
                  </a>
                </p>
              </Box>
            </Section>

            <Section id="s2" title={t("s2Title")}>
              <p>{t("s2Body")}</p>
            </Section>

            <Section id="s3" title={t("s3Title")}>
              <p className="text-[var(--mc-text)]">{t("s3CookiesTitle")}</p>
              <p>{t("s3CookiesBody")}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["s3NecessaryTitle", "s3NecessaryBody", "s3NecessaryLegal"],
                    ["s3AnalyticsTitle", "s3AnalyticsBody", "s3AnalyticsLegal"],
                    ["s3MarketingTitle", "s3MarketingBody", "s3MarketingLegal"],
                  ] as const
                ).map(([title, body, legal]) => (
                  <Box key={title}>
                    <p className="text-[var(--mc-text)]">{t(title)}</p>
                    <p>{t(body)}</p>
                    <p className="mc-label">{t(legal)}</p>
                  </Box>
                ))}
              </div>
              <p className="text-[var(--mc-text)]">{t("s3LogsTitle")}</p>
              <p>{t("s3LogsBody")}</p>
              <Row label={t("legalBasis")} value={t("s3LogsLegal")} />
              <Row label={t("durationLabel")} value={t("s3LogsDuration")} />
            </Section>

            <Section id="s4" title={t("s4Title")}>
              <p>{t("s4Body")}</p>
              <Box>
                <Row label={t("providerLabel")} value={t("s4Provider")} />
                <Row label={t("purposeLabel")} value={t("s4Purpose")} />
                <Row label={t("legalBasis")} value={t("s4Legal")} />
                <Row label={t("usTransferLabel")} value={t("s4Transfer")} />
                <Row label={t("moreInfoLabel")} value={t("s4More")} />
              </Box>
            </Section>

            <Section id="s5" title={t("s5Title")}>
              <p>{t("s5Body")}</p>
              <Box>
                <Row label={t("providerLabel")} value={t("s5Provider")} />
                <Row label={t("dataProcessedLabel")} value={t("s5Data")} />
                <Row label={t("legalBasis")} value={t("s5Legal")} />
                <Row label={t("dpaLabel")} value={t("s5Dpa")} />
              </Box>
            </Section>

            <Section id="s6" title={t("s6Title")}>
              <p>{t("s6Body")}</p>
              <Box>
                <Row label={t("providerLabel")} value={t("s6Provider")} />
                <Row label={t("dataProcessedLabel")} value={t("s6Data")} />
                <Row label={t("purposeLabel")} value={t("s6Purpose")} />
                <Row label={t("legalBasis")} value={t("s6Legal")} />
                <Row label={t("dpaLabel")} value={t("s6Dpa")} />
                <Row label={t("usTransferLabel")} value={t("s6Transfer")} />
              </Box>
            </Section>

            <Section id="s7" title={t("s7Title")}>
              <p>{t("s7Body")}</p>
              <Box>
                <Row label={t("legalBasis")} value={t("s7Legal")} />
                <Row label={t("usTransferLabel")} value={t("s7Transfer")} />
                <p>{t("s7Measures")}</p>
              </Box>
            </Section>

            <Section id="s8" title={t("s8Title")}>
              <p>{t("s8Body")}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="mc-label">
                      <th className="py-2 pr-4">{t("s8TypeLabel")}</th>
                      <th className="py-2">{t("s8DurLabel")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        [t("s8Row1"), t("s8Dur1")],
                        [t("s8Row2"), t("s8Dur2")],
                        [t("s8Row3"), t("s8Dur3")],
                      ] as [string, string][]
                    ).map(([row, dur]) => (
                      <tr key={row} className="border-t border-[var(--mc-line)]">
                        <td className="py-2 pr-4">{row}</td>
                        <td className="py-2 text-[var(--mc-text)]">{dur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="s9" title={t("s9Title")}>
              <p>{t("s9Body")}</p>
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
                ).map(([r, b]) => (
                  <Box key={r}>
                    <p className="text-[var(--mc-text)]">{t(r)}</p>
                    <p>{t(b)}</p>
                  </Box>
                ))}
              </div>
              <p>
                {t("s9Contact")}{" "}
                <a href={`mailto:${t("s9Email")}`} className="underline underline-offset-4">
                  {t("s9Email")}
                </a>
              </p>
            </Section>

            <Section id="s10" title={t("s10Title")}>
              <p>{t("s10Body")}</p>
            </Section>

            <Section id="s11" title={t("s11Title")}>
              <p>{t("s11Body")}</p>
              <p className="text-[var(--mc-text)]">{t("s11PluginTitle")}</p>
              <p>{t("s11PluginBody")}</p>
              <Box>
                <p className="text-[var(--mc-text)]">{t("s11ProfilingTitle")}</p>
                <p>{t("s11ProfilingBody")}</p>
              </Box>
              <Box>
                <Row label={t("operatorLabel")} value={t("s11Operator")} />
                <Row label={t("dataLocationLabel")} value={t("s11DataLocation")} />
                <Row label={t("legalBasis")} value={t("s11Legal")} />
                <Row label={t("aiModelsLabel")} value={t("s11Models")} />
              </Box>
            </Section>

            <Section id="s12" title={t("s12Title")}>
              <p>{t("s12Body")}</p>
              <Box>
                <a href="https://github.com/metadist/Synamail" target="_blank" rel="noopener noreferrer" className="block underline underline-offset-4">
                  {t("s12Synamail")} ↗
                </a>
                <a href="https://github.com/metadist/synaplan" target="_blank" rel="noopener noreferrer" className="block underline underline-offset-4">
                  {t("s12Platform")} ↗
                </a>
                <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer" className="block underline underline-offset-4">
                  {t("s12License")} ↗
                </a>
              </Box>
            </Section>

            <Section id="s13" title={t("s13Title")}>
              <p>{t("s13Body")}</p>
            </Section>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/imprint" className="mc-btn">
                {isDE ? "Impressum" : "Imprint"} →
              </Link>
              <Link href="/terms" className="mc-btn">
                {isDE ? "Nutzungsbedingungen" : "Terms of use"} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
