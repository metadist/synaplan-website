import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { buildBlogSchema, buildBreadcrumbSchema, canonicalUrl, SITE_URL } from "@/lib/jsonld";
import { OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isDE = locale === "de";

  const title = isDE
    ? "Blog — KI-Insights & Synaplan News"
    : "Blog — AI Insights & Synaplan News";
  const description = isDE
    ? "Artikel zu KI-Strategie, Multi-Model-Routing, DSGVO-Compliance und mehr vom Synaplan-Team."
    : "Articles on AI strategy, multi-model routing, GDPR compliance and more from the Synaplan team.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(locale, "/blog"),
      languages: {
        en: canonicalUrl("en", "/blog"),
        de: canonicalUrl("de", "/blog"),
        "x-default": canonicalUrl("en", "/blog"),
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl(locale, "/blog"),
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", locale },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      tags: true,
      author: { select: { name: true } },
    },
  });

  const isDE = locale === "de";
  const blogPrefix = isDE ? "/de/blog" : "/blog";
  const blogUrl = canonicalUrl(locale, "/blog");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...((buildBlogSchema(locale) as { "@graph": unknown[] })["@graph"]),
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: "Blog", url: blogUrl },
      ]),
      ...(posts.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${blogUrl}#list`,
              name: isDE ? "Aktuelle Artikel" : "Latest Articles",
              itemListElement: posts.map((post, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${blogUrl}/${post.slug}`,
                name: post.title,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <main className="container-narrow section-padding">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          {isDE ? "Blog" : "Blog"}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {isDE
            ? "KI-Insights, Produktneuheiten und Praxis-Tipps vom Synaplan-Team."
            : "AI insights, product news and practical tips from the Synaplan team."}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 p-16 text-center">
          <p className="text-muted-foreground">
            {isDE ? "Noch keine Artikel veröffentlicht." : "No posts published yet."}
          </p>
        </div>
      ) : (
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border bg-background transition-shadow hover:shadow-md"
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
              <div className="p-6">
                {/* Tags */}
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

                <h2 className="mb-2 text-xl font-semibold leading-snug group-hover:text-brand-600 transition-colors">
                  <Link href={`${blogPrefix}/${post.slug}`}>{post.title}</Link>
                </h2>

                {post.excerpt && (
                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author.name}</span>
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt.toISOString()}>
                      {new Date(post.publishedAt).toLocaleDateString(
                        isDE ? "de-DE" : "en-GB",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </time>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
    </>
  );
}
