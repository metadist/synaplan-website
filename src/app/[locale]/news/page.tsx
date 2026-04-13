import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { getGithubReleases, formatReleaseDate, releaseExcerpt } from '@/lib/github-releases'
import { buildBreadcrumbSchema, canonicalUrl, SITE_URL } from '@/lib/jsonld'
import { OG_IMAGE } from '@/lib/seo'
import { LINKS } from '@/lib/constants'
import { ArrowRight, ExternalLink, Tag } from 'lucide-react'
import { GithubIcon, DiscordIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'newsPage' })

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: canonicalUrl(locale, '/news'),
      languages: {
        en: canonicalUrl('en', '/news'),
        de: canonicalUrl('de', '/news'),
        'x-default': canonicalUrl('en', '/news'),
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: canonicalUrl(locale, '/news'),
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: [OG_IMAGE.url],
    },
  }
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'newsPage' })
  const isDE = locale === 'de'
  const blogPrefix = isDE ? '/de/blog' : '/blog'

  const [posts, releases] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED', locale },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        tags: true,
        author: { select: { name: true } },
      },
    }),
    getGithubReleases(3),
  ])

  const newsUrl = canonicalUrl(locale, '/news')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbSchema([
        { name: isDE ? 'Startseite' : 'Home', url: SITE_URL },
        { name: 'News', url: newsUrl },
      ]),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-wide section-padding py-12 sm:py-16">
        {/* ── Blog Posts ────────────────────────────────────────────── */}
        <section>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('blogTitle')}
            </h1>
            <Link
              href="/blog"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t('blogViewAll')}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-muted/20 p-16 text-center">
              <p className="text-muted-foreground">{t('blogEmpty')}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col rounded-2xl border border-border bg-background transition-all hover:border-brand-300 hover:shadow-md"
                >
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden rounded-t-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {post.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-brand-600">
                      <Link href={`${blogPrefix}/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {post.excerpt && (
                      <p className="mb-4 flex-1 line-clamp-3 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author.name}</span>
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt.toISOString()}>
                          {new Date(post.publishedAt).toLocaleDateString(
                            isDE ? 'de-DE' : 'en-GB',
                            { day: 'numeric', month: 'long', year: 'numeric' },
                          )}
                        </time>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── Releases + Discord ────────────────────────────────────── */}
        <section className="mt-16 sm:mt-20">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <GithubIcon className="size-5 text-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  GitHub
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t('releasesTitle')}
              </h2>
            </div>
            <a
              href="https://github.com/metadist/synaplan/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t('releasesViewAll')}
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          {releases.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('releasesEmpty')}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {releases.map((release) => (
                <a
                  key={release.id}
                  href={release.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-border bg-background p-5 transition-all hover:border-brand-300 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-mono font-semibold text-brand-700">
                      <Tag className="size-3" />
                      {release.tag_name}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-brand-700">
                    {release.name || release.tag_name}
                  </h3>

                  {release.body && (
                    <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {releaseExcerpt(release.body, 120)}
                    </p>
                  )}

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

          {/* Discord CTA */}
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 px-6 py-8 text-center sm:flex-row sm:text-left">
            <DiscordIcon className="size-10 shrink-0 text-[#5865F2]" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {t('discordCta')}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('discordLead')}
              </p>
            </div>
            <a
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <DiscordIcon className="size-4" />
              {t('discordCta')}
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
