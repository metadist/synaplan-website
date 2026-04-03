export type GithubRelease = {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
};

/**
 * Fetches the latest releases from the Synaplan GitHub repository.
 * Cached for 1 hour via Next.js fetch cache; revalidated by the
 * /api/github-webhook endpoint when a new release is published.
 */
export async function getGithubReleases(limit = 5): Promise<GithubRelease[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/metadist/synaplan/releases?per_page=10",
      {
        next: {
          revalidate: 3600,
          tags: ["github-releases"],
        },
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "synaplan-website/1.0",
        },
      },
    );

    if (!res.ok) return [];

    const releases: GithubRelease[] = await res.json();
    return releases
      .filter((r) => !r.draft && !r.prerelease)
      .slice(0, limit);
  } catch {
    return [];
  }
}

/** Formats a GitHub release date in locale-aware long format */
export function formatReleaseDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

/** Trims Markdown body to a short excerpt */
export function releaseExcerpt(body: string, maxLen = 160): string {
  const plain = body
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > maxLen ? plain.slice(0, maxLen).trimEnd() + "…" : plain;
}
