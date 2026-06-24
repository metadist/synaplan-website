import { routing } from "@/i18n/routing";
import { canonicalUrl, SITE_URL } from "@/lib/jsonld";
import { prisma } from "@/lib/prisma";

const FEED_LIMIT = 12;

type FeedPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishedAt: Date | null;
  tags: string[];
  author: { name: string };
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: Date): string {
  return date.toUTCString();
}

function absoluteImageUrl(coverImage: string | null | undefined): string | null {
  if (!coverImage) {
    return null;
  }
  if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
    return coverImage;
  }
  return `${SITE_URL}${coverImage.startsWith("/") ? coverImage : `/${coverImage}`}`;
}

function mimeFromPath(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

/** Self-referencing feed URL for a locale, matching the site's as-needed prefix. */
function feedSelfUrl(locale: string): string {
  return locale === routing.defaultLocale
    ? `${SITE_URL}/feed.xml`
    : `${SITE_URL}/${locale}/feed.xml`;
}

function buildFeedXml(locale: string, posts: FeedPost[]): string {
  const isDE = locale === "de";
  const channelTitle = "Synaplan Blog";
  const channelDescription = isDE
    ? "Neuigkeiten, Releases und Insights vom Synaplan-Team."
    : "News, releases and insights from the Synaplan team.";
  const channelLink = canonicalUrl(locale, "/news");
  const language = isDE ? "de-DE" : "en-US";
  const lastBuild = posts[0]?.publishedAt ?? new Date();

  const items = posts
    .map((post) => {
      const link = canonicalUrl(locale, `/blog/${post.slug}`);
      const pubDate = post.publishedAt
        ? toRfc822(post.publishedAt)
        : toRfc822(new Date());
      const description = post.excerpt ?? "";
      const imageUrl = absoluteImageUrl(post.coverImage);
      const tagsXml = post.tags
        .slice(0, 5)
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("\n      ");
      const enclosureXml = imageUrl
        ? `<enclosure url="${escapeXml(imageUrl)}" type="${mimeFromPath(imageUrl)}" length="0" />\n      <media:content url="${escapeXml(imageUrl)}" medium="image" />`
        : "";

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(post.author.name)}</dc:creator>
      <description>${escapeXml(description)}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      ${enclosureXml}
      ${tagsXml}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${language}</language>
    <lastBuildDate>${toRfc822(lastBuild)}</lastBuildDate>
    <atom:link href="${escapeXml(feedSelfUrl(locale))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

/**
 * Build an RSS 2.0 (WordPress-compatible) feed Response for one locale.
 * Locale is taken from the URL path (`/feed.xml` = default, `/<locale>/feed.xml`),
 * never from a query parameter, so each feed has exactly one canonical URL.
 */
export async function buildFeedResponse(locale: string): Promise<Response> {
  const safeLocale = routing.locales.includes(locale as "en" | "de")
    ? locale
    : routing.defaultLocale;

  let posts: FeedPost[] = [];

  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", locale: safeLocale },
      orderBy: { publishedAt: "desc" },
      take: FEED_LIMIT,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        publishedAt: true,
        tags: true,
        author: { select: { name: true } },
      },
    });
  } catch {
    // DB unavailable (e.g. CI build without DATABASE_URL) — return an empty but valid feed
  }

  return new Response(buildFeedXml(safeLocale, posts), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900",
    },
  });
}
