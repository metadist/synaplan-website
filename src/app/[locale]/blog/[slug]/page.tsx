import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { prisma } from "@/lib/prisma";
import { canonicalUrl } from "@/lib/jsonld";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED", locale },
    select: { title: true, excerpt: true, coverImage: true },
  });

  if (!post) return { title: "Not Found" };

  const canonical = canonicalUrl(locale, `/blog/${slug}`);

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: canonical,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await prisma.post
    .findFirst({
      where: { slug, status: "PUBLISHED", locale },
      include: { author: { select: { name: true } } },
    })
    .then(async (p) => {
      if (p) {
        // Increment view count (fire-and-forget)
        prisma.post.update({ where: { id: p.id }, data: { views: { increment: 1 } } }).catch(() => {});
      }
      return p;
    });

  if (!post) notFound();

  const isDE = locale === "de";
  const blogHref = isDE ? "/de/blog" : "/blog";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
      worksFor: { "@type": "Organization", name: "Synaplan", url: "https://www.synaplan.com" },
    },
    publisher: {
      "@type": "Organization",
      name: "Synaplan",
      url: "https://www.synaplan.com",
      logo: { "@type": "ImageObject", url: "https://www.synaplan.com/logo.png" },
    },
    url: canonicalUrl(locale, `/blog/${slug}`),
    inLanguage: locale === "de" ? "de-DE" : "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container-narrow section-padding pb-20">
        {/* Back link */}
        <Link
          href={blogHref}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {isDE ? "Alle Artikel" : "All posts"}
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-10 aspect-video overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="size-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10">
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.author.name}</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {new Date(post.publishedAt).toLocaleDateString(
                  isDE ? "de-DE" : "en-GB",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </time>
            )}
            <span>{post.views} {isDE ? "Aufrufe" : "views"}</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-brand-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t pt-8">
          <Link
            href={blogHref}
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
          >
            <ArrowLeft className="size-4" />
            {isDE ? "Zurück zum Blog" : "Back to blog"}
          </Link>
        </div>
      </main>
    </>
  );
}
