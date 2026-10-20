import rawGithubRepoStats from "@/data/github-repo-stats.json";

export type SynaplanGithubRepoStats = {
  stars: number;
  forks: number;
  /** SPDX id (e.g. Apache-2.0) or license name from API */
  licenseLabel: string | null;
};

type StoredPayload = {
  stars?: unknown;
  forks?: unknown;
  licenseLabel?: unknown;
};

const REPO_API = "https://api.github.com/repos/metadist/synaplan";
/** Refresh the public star count about once an hour. The JSON file is only the fallback. */
const REVALIDATE_SECONDS = 3600;

function cachedStats(): SynaplanGithubRepoStats | null {
  const data = rawGithubRepoStats as StoredPayload;
  const stars = data.stars;
  const forks = data.forks;
  if (typeof stars !== "number" || typeof forks !== "number") return null;
  const licenseLabel =
    typeof data.licenseLabel === "string" ? data.licenseLabel : null;
  return { stars, forks, licenseLabel };
}

function pickLicense(license: { spdx_id?: string; name?: string } | null): string | null {
  if (!license) return null;
  const spdx = license.spdx_id?.trim();
  if (spdx && spdx !== "NOASSERTION") return spdx;
  const name = license.name?.trim();
  return name || null;
}

/**
 * Live stars and forks from the GitHub API, cached for an hour.
 * Falls back to src/data/github-repo-stats.json when the API is unreachable.
 */
export async function getSynaplanGithubRepoStats(): Promise<SynaplanGithubRepoStats | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(REPO_API, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return cachedStats();

    const data = (await res.json()) as {
      stargazers_count?: unknown;
      forks_count?: unknown;
      license?: { spdx_id?: string; name?: string } | null;
    };
    if (typeof data.stargazers_count !== "number" || typeof data.forks_count !== "number") {
      return cachedStats();
    }

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      licenseLabel: pickLicense(data.license ?? null),
    };
  } catch {
    return cachedStats();
  }
}

/** Display stars/forks with locale-aware grouping; undefined → em dash */
export function formatGithubRepoStatNumber(
  value: number | undefined,
  locale: string,
): string {
  if (value === undefined) return "\u2014";
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US").format(
    value,
  );
}
