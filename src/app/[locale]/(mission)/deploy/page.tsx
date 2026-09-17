import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LINKS } from "@/lib/constants";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { PageHero } from "@/components/mission/sub-page";
import { Lamp, Reveal, Ruler, SectionHead } from "@/components/mission/primitives";
import { ComposeSample, HelmSample } from "@/components/mission/code-samples";
import { LaunchCta } from "@/components/mission/home-sections";

const PATH = "/deploy";

type Tier = { id: string; label: string; heading: string; text: string; facts: string[] };
type Requirement = { label: string; text: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission.meta.deploy" });
  return missionMetadata(locale, PATH, t("title"), t("description"));
}

export default async function DeployPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "mission.pages.deploy" });
  const tm = await getTranslations({ locale, namespace: "mission.meta.deploy" });
  const tiers = t.raw("tiers") as Tier[];
  const requirements = t.raw("requirements") as Requirement[];

  const samples: Record<string, React.ReactNode> = {
    "T-01": <ComposeSample />,
    "T-03": <HelmSample />,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(missionPageJsonLd(locale, PATH, tm("title"), tm("description"))) }}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} aside={<ComposeSample />} />

      {tiers.map((tier, i) => (
        <section key={tier.id} className={`mc-section ${i % 2 === 1 ? "mc-panel-light" : ""}`}>
          <div className="mc-wrap">
            <SectionHead num={String(i + 1).padStart(2, "0")} title={tier.label} tag={tier.id} />
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <Reveal>
                <h2 className="mc-display text-[clamp(1.8rem,3.2vw,2.7rem)]">
                  <span className="mc-mono">{tier.heading}</span>
                </h2>
                <p className="mc-lead mt-5">{tier.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {tier.facts.map((f) => (
                    <li key={f} className="mc-chip">
                      <Lamp tone="green" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={100}>
                {samples[tier.id] ?? (
                  <div className="mc-card mc-frame">
                    <p className="mc-label">{tier.id}</p>
                    <p className="mc-mono mt-3 text-[1.1rem]">{tier.heading}</p>
                    <ul className="mt-4 grid gap-2">
                      {tier.facts.map((f) => (
                        <li key={f} className={`flex items-center gap-2 text-[0.9rem] ${i % 2 === 1 ? "text-[var(--mc-muted-on-cream)]" : "text-[var(--mc-text-muted)]"}`}>
                          <Lamp tone="blue" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="mc-section">
        <div className="mc-wrap">
          <SectionHead num="05" title={t("requirementsTitle")} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {requirements.map((r, i) => (
              <Reveal key={r.label} as="li" delay={i * 60} className="mc-card mc-card-tight">
                <p className="mc-label">{r.label}</p>
                <p className="mt-2 text-[0.9rem] leading-relaxed">{r.text}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8">
            <Ruler left="REQ-01" right="REQ-04" />
          </div>
        </div>
      </section>

      <LaunchCta
        locale={locale}
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: LINKS.docs, external: true, newTab: true }}
        secondary={{ label: t("cta.secondary"), href: "https://github.com/metadist/synaplan-charts", external: true, newTab: true }}
      />
    </>
  );
}
