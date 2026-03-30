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

/**
 * Cached stats from src/data/github-repo-stats.json (updated by
 * `npm run refresh:github-stats` / scheduled CI — not at request time).
 * Imported as JSON so it resolves correctly even when Turbopack’s inferred
 * workspace root differs from this repo (e.g. multiple package-lock.json).
 */
export function getSynaplanGithubRepoStats(): SynaplanGithubRepoStats | null {
  const data = rawGithubRepoStats as StoredPayload;
  const stars = data.stars;
  const forks = data.forks;
  if (typeof stars !== "number" || typeof forks !== "number") return null;
  const licenseLabel =
    typeof data.licenseLabel === "string" ? data.licenseLabel : null;
  return { stars, forks, licenseLabel };
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
