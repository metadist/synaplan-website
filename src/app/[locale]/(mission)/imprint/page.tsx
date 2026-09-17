import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { PageHero } from "@/components/mission/sub-page";
import { Lamp, Reveal, Ruler, SectionHead } from "@/components/mission/primitives";

const PATH = "/imprint";

type Row = { label: string; value: ReactNode };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imprint" });
  return missionMetadata(
    locale,
    PATH,
    t("metaTitle"),
    t("metaDescription"),
    locale === "de"
      ? ["Impressum", "metadist data management GmbH", "Düsseldorf", "§ 5 TMG", "HRB 101206"]
      : ["Imprint", "metadist data management GmbH", "Düsseldorf", "legal notice", "HRB 101206"],
  );
}

function FactCard({ id, title, rows, light = false }: { id: string; title: string; rows: Row[]; light?: boolean }) {
  const muted = light ? "text-[var(--mc-muted-on-cream)]" : "text-[var(--mc-text-muted)]";
  return (
    <Reveal as="article" className="mc-card h-full">
      <p className="mc-section-num">{id}</p>
      <h2 className="mc-mono mt-3 text-[0.85rem] tracking-[0.06em] uppercase">{title}</h2>
      <dl className="mt-4 grid gap-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className={`mc-label ${muted}`}>{row.label}</dt>
            <dd className="mt-1 text-[0.95rem] leading-relaxed">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export default async function ImprintPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "imprint" });

  const cards: { id: string; title: string; rows: Row[] }[] = [
    {
      id: "L-01",
      title: t("companyTitle"),
      rows: [
        {
          label: t("addressLabel"),
          value: (
            <>
              {t("companyName")}
              <br />
              Königsallee 82
              <br />
              40212 Düsseldorf
              <br />
              {t("country")}
            </>
          ),
        },
      ],
    },
    {
      id: "L-02",
      title: t("contactTitle"),
      rows: [
        {
          label: t("emailLabel"),
          value: (
            <a href="mailto:team@synaplan.com" className="underline decoration-[var(--mc-line-strong)] underline-offset-4 hover:text-[var(--mc-blue-soft)]">
              team@synaplan.com
            </a>
          ),
        },
        {
          label: t("phoneLabel"),
          value: (
            <a href="tel:+4921190760084" className="underline decoration-[var(--mc-line-strong)] underline-offset-4 hover:text-[var(--mc-blue-soft)]">
              {t("phone")}
            </a>
          ),
        },
      ],
    },
    {
      id: "L-03",
      title: t("managementTitle"),
      rows: [{ label: t("ceoLabel"), value: t("ceo") }],
    },
    {
      id: "L-04",
      title: t("registerTitle"),
      rows: [
        { label: t("registerLabel"), value: t("registerCourt") },
        { label: "HRB", value: t("registerNumber") },
        { label: t("taxLabel"), value: t("taxId") },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(missionPageJsonLd(locale, PATH, t("metaTitle"), t("metaDescription"))) }}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("pageTitle")} lead={t("pageSubtitle")} />

      <section className="mc-section">
        <div className="mc-wrap">
          <SectionHead num="01" title={t("inventoryTitle")} tag="§ 5 TMG" />
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <FactCard key={card.id} {...card} />
            ))}
          </div>
          <div className="mt-8">
            <Ruler left="L-01" right="L-04" />
          </div>
        </div>
      </section>

      <section className="mc-section mc-panel-light">
        <div className="mc-wrap">
          <SectionHead num="02" title={t("notesTitle")} />
          <div className="grid gap-3 lg:grid-cols-2">
            <Reveal className="mc-card">
              <div className="flex items-center gap-2">
                <Lamp tone="amber" />
                <h2 className="mc-mono text-[0.85rem] tracking-[0.06em] uppercase">{t("disclaimerTitle")}</h2>
              </div>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--mc-muted-on-cream)]">{t("disclaimerBody")}</p>
            </Reveal>
            <Reveal delay={80} className="mc-card">
              <div className="flex items-center gap-2">
                <Lamp tone="blue" />
                <h2 className="mc-mono text-[0.85rem] tracking-[0.06em] uppercase">{t("copyrightTitle")}</h2>
              </div>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--mc-muted-on-cream)]">{t("copyrightBody")}</p>
            </Reveal>
          </div>
          <div className="mt-10">
            <Link href="/privacy-policy" className="mc-btn">
              {t("privacyCta")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
