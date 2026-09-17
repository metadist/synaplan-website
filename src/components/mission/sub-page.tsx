import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Lamp, Reveal, Ruler, SectionHead } from "./primitives";

export type PanelItem = { label: string; text: string };
export type PanelSection = { num: string; title: string; heading: string; text: string; items: PanelItem[] };

/** Sub-page hero: eyebrow (SYS id), H1 and lead — with the blueprint grid. */
export function PageHero({ eyebrow, title, lead, aside }: { eyebrow: string; title: string; lead: string; aside?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-14 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
      <div className="mc-grid" aria-hidden />
      <div className={`mc-wrap relative grid gap-10 ${aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}>
        <div>
          <p className="mc-label flex items-center gap-2">
            <Lamp tone="green" pulse />
            {eyebrow}
          </p>
          <h1 className="mc-display mt-6 max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)]">{title}</h1>
          <p className="mc-lead mt-6 max-w-2xl">{lead}</p>
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}

/** Numbered panel with heading, prose and a 3-up list of facts. Alternates cream/dark. */
export function FeaturePanel({ section, light = false, tag, children }: { section: PanelSection; light?: boolean; tag?: string; children?: ReactNode }) {
  return (
    <section className={`mc-section ${light ? "mc-panel-light" : ""}`}>
      <div className="mc-wrap">
        <SectionHead num={section.num} title={section.title} tag={tag} />
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <h2 className="mc-display text-[clamp(1.8rem,3.2vw,2.7rem)]">{section.heading}</h2>
            <p className="mc-lead mt-5">{section.text}</p>
          </Reveal>
          <Reveal delay={100}>
            <ul className="grid gap-3">
              {section.items.map((item, i) => (
                <li key={item.label} className="mc-card mc-card-tight">
                  <div className="flex items-center gap-2">
                    <span className="mc-section-num">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mc-mono text-[0.75rem] tracking-[0.14em] uppercase">{item.label}</p>
                  </div>
                  <p className={`mt-2 text-[0.9rem] leading-relaxed ${light ? "text-[var(--mc-muted-on-cream)]" : "text-[var(--mc-text-muted)]"}`}>{item.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Generic card grid with an ID chip per card (inventory / channels / systems). */
export function IdCardGrid({
  num,
  title,
  cards,
  light = false,
  columns = 3,
}: {
  num: string;
  title: string;
  light?: boolean;
  columns?: 2 | 3;
  cards: { id: string; name: string; text: string; status?: string; href?: string; external?: boolean }[];
}) {
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className={`mc-section ${light ? "mc-panel-light" : ""}`}>
      <div className="mc-wrap">
        <SectionHead num={num} title={title} />
        <ul className={`grid gap-3 ${cols}`}>
          {cards.map((c, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="mc-section-num">{c.id}</span>
                  {c.status ? (
                    <span className="mc-chip">
                      <Lamp tone="green" />
                      {c.status}
                    </span>
                  ) : null}
                </div>
                <p className="mc-mono mt-3 text-[0.85rem] tracking-[0.06em] uppercase">{c.name}</p>
                <p className={`mt-2 text-[0.88rem] leading-relaxed ${light ? "text-[var(--mc-muted-on-cream)]" : "text-[var(--mc-text-muted)]"}`}>{c.text}</p>
                {c.href ? <p className="mc-label mt-3 text-[0.6rem]">{c.external ? "↗" : "→"}</p> : null}
              </>
            );
            return (
              <Reveal key={c.id} as="li" delay={(i % 3) * 60} className="mc-card h-full transition-transform hover:-translate-y-0.5">
                {c.href && c.external ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="block no-underline">
                    {inner}
                  </a>
                ) : c.href ? (
                  <Link href={c.href} className="block no-underline">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-8">
          <Ruler left={cards[0]?.id ?? ""} right={cards[cards.length - 1]?.id ?? ""} />
        </div>
      </div>
    </section>
  );
}
