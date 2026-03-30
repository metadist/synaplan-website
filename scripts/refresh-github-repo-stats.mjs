/**
 * Fetches GitHub REST repo metadata and writes src/data/github-repo-stats.json.
 * Run locally (npm run refresh:github-stats) or via CI on a schedule.
 * Optional: GITHUB_TOKEN env for higher rate limits (CI sets this automatically).
 * @see https://docs.github.com/en/rest/repos/repos#get-a-repository
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src", "data", "github-repo-stats.json");
const REPO_API = "https://api.github.com/repos/metadist/synaplan";

function pickLicense(license) {
  if (!license) return null;
  const spdx = license.spdx_id?.trim();
  if (spdx && spdx !== "NOASSERTION") return spdx;
  const name = license.name?.trim();
  return name || null;
}

async function main() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(REPO_API, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const payload = {
    stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
    forks: typeof data.forks_count === "number" ? data.forks_count : 0,
    licenseLabel: pickLicense(data.license ?? null),
    fetchedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log("Wrote", OUT, payload);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
