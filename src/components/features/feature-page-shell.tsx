import { Link } from "@/i18n/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { LINKS } from "@/lib/constants";

export type FeatureBreadcrumbItem = { label: string; href?: string };

type WhyCard = { icon: React.ReactNode; title: string; desc: string };
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
    <article className="relative overflow-hidden border-b border-[rgb(196_197_215/0.2)] bg-gradient-to-b from-background via-page-tint/35 to-soft-accent/25">
      <div className="container-wide section-padding py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
        >
          {breadcrumbItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground/50">/</span>}
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{badge}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{heroLead}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-figma-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)] sm:w-auto"
            >
              {ctaPrimary}
              <ExternalLink className="size-4" />
            </a>
            <a
              href={ctaSecondaryHref ?? LINKS.whatsappDE}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-medium text-foreground transition-colors hover:bg-accent sm:w-auto"
            >
              {ctaSecondary}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </header>

        {/* Why cards */}
        <section className="mt-20">
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
              >
                <dt className="mb-3 flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    {card.icon}
                  </span>
                  <span className="font-semibold text-foreground">{card.title}</span>
                </dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{card.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {extraSection}

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{ctaTitle}</h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-figma-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white sm:w-auto"
            >
              {ctaPrimary}
              <ExternalLink className="size-4" />
            </a>
            <a
              href={ctaSecondaryHref ?? LINKS.whatsappDE}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-medium text-foreground transition-colors hover:bg-accent sm:w-auto"
            >
              {ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </article>
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
    <section className="mt-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>
        {lead && (
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">{lead}</p>
        )}
      </div>
      <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m, i) => (
          <li
            key={i}
            className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-brand-500" />
            {m.label}
          </li>
        ))}
      </ul>
      {ctaLabel && ctaHref && (
        <div className="mt-8 flex justify-center">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {ctaLabel}
            <ExternalLink className="size-4" />
          </a>
        </div>
      )}
    </section>
  );
}
