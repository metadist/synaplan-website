import type { ReactNode } from "react";
import { LINKS } from "@/lib/constants";
import { IdCardGrid, MissionCrumbs, MissionCta, PageHero, type Crumb } from "@/components/mission/sub-page";
import { Reveal, SectionHead } from "@/components/mission/primitives";

export type FeatureBreadcrumbItem = Crumb;

type WhyCard = { icon?: React.ReactNode; title: string; desc: string };
type ModelItem = { label: string };

export function FeaturePageShell({
  breadcrumbItems,
  badge,
  heroTitle,
  heroLead,
  whyCards,
  extraSection,
  ctaTitle,
  ctaPrimary,
  ctaSecondary,
  ctaSecondaryHref,
}: {
  breadcrumbItems: FeatureBreadcrumbItem[];
  badge: string;
  heroTitle: string;
  heroLead: string;
  whyCards: WhyCard[];
  extraSection?: React.ReactNode;
  ctaTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaSecondaryHref?: string;
}) {
  return (
    <>
      <MissionCrumbs items={breadcrumbItems} />
      <PageHero eyebrow={badge} title={heroTitle} lead={heroLead} />
      <IdCardGrid
        num="01"
        title={badge}
        cards={whyCards.map((card, i) => ({
          id: String(i + 1).padStart(2, "0"),
          name: card.title,
          text: card.desc,
        }))}
      />
      {extraSection}
      <MissionCta
        title={ctaTitle}
        primary={{ label: ctaPrimary, href: LINKS.github, external: true }}
        secondary={{ label: ctaSecondary, href: ctaSecondaryHref ?? LINKS.whatsappDE, external: true }}
      />
    </>
  );
}

export function ModelsList({
  title,
  models,
  lead,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  models: ModelItem[];
  lead?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="mc-section mc-panel-light">
      <div className="mc-wrap">
        <SectionHead num="02" title={title} />
        {lead ? <p className="mc-lead mb-8 max-w-3xl [&_a]:underline [&_a]:underline-offset-4">{lead}</p> : null}
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m, i) => (
            <Reveal key={m.label} as="li" delay={(i % 3) * 60} className="mc-card mc-card-tight">
              <span className="mc-section-num">{String(i + 1).padStart(2, "0")}</span>
              <p className="mc-mono mt-2 text-[0.85rem] tracking-[0.06em] uppercase">{m.label}</p>
            </Reveal>
          ))}
        </ul>
        {ctaLabel && ctaHref ? (
          <div className="mt-8">
            <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="mc-btn">
              {ctaLabel} ↗
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
