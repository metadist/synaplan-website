import { getTranslations } from "next-intl/server";
import { getGithubReleases, formatReleaseDate, releaseExcerpt } from "@/lib/github-releases";
import { Tag, ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";

// ─── Server component — fetches live release data ────────────────────────────
// Rendering: SSR via Next.js ISR (revalidate: 1 h, tag: "github-releases").
// Google sees fully rendered HTML on first visit — no client JS needed.

export async function GithubFeed({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "githubFeed" });
  const releases = await getGithubReleases(4);

  // JSON-LD: ItemList of SoftwareApplication releases — helps Google index versions
  const jsonLd = releases.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Synaplan Releases",
    description: "Latest open-source releases of the Synaplan AI platform",
    url: "https://github.com/metadist/synaplan/releases",
    itemListElement: releases.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: r.name || r.tag_name,
        softwareVersion: r.tag_name,
        datePublished: r.published_at,
        url: r.html_url,
        description: r.body ? releaseExcerpt(r.body, 200) : undefined,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    <section className="container-wide section-padding py-16 sm:py-20">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <GithubIcon className="size-5 text-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              GitHub
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("sectionTitle")}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">{t("sectionLead")}</p>
        </div>
        <a
          href="https://github.com/metadist/synaplan/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {t("viewAll")}
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {releases.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noReleases")}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {releases.map((release) => (
            <a
              key={release.id}
              href={release.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-border bg-background p-5 transition-all hover:border-brand-300 hover:shadow-md"
            >
              {/* Tag badge */}
              <div className="mb-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-mono font-semibold text-brand-700">
                  <Tag className="size-3" />
                  {release.tag_name}
                </span>
              </div>

              {/* Title */}
              <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-brand-700 transition-colors">
                {release.name || release.tag_name}
              </h3>

              {/* Excerpt */}
              {release.body && (
                <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {releaseExcerpt(release.body, 120)}
                </p>
              )}

              {/* Date + arrow */}
              <div className="mt-4 flex items-center justify-between">
                <time
                  dateTime={release.published_at}
                  className="text-xs text-muted-foreground/70"
                >
                  {formatReleaseDate(release.published_at, locale)}
                </time>
                <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
    </>
  );
}
