import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LINKS } from "@/lib/constants";
import { formatGithubRepoStatNumber, getSynaplanGithubRepoStats } from "@/lib/github-synaplan-repo";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { IdCardGrid, PageHero } from "@/components/mission/sub-page";
import { Lamp, Reveal, SectionHead } from "@/components/mission/primitives";
import { InspectSample } from "@/components/mission/code-samples";
import { LaunchCta } from "@/components/mission/home-sections";

const PATH = "/source";

type Repo = { name: string; text: string; href: string };
type Principle = { label: string; text: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission.meta.source" });
  return missionMetadata(locale, PATH, t("title"), t("description"));
}

export default async function SourcePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "mission.pages.source" });
  const ts = await getTranslations({ locale, namespace: "mission.source" });
  const ti = await getTranslations({ locale, namespace: "mission.inspect" });
  const tm = await getTranslations({ locale, namespace: "mission.meta.source" });
  const repos = t.raw("repos") as Repo[];
  const principles = t.raw("principles") as Principle[];
  const stats = getSynaplanGithubRepoStats();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(missionPageJsonLd(locale, PATH, tm("title"), tm("description"))) }}
      />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        aside={<InspectSample title={ti("title")} rows={ti.raw("rows") as { key: string; value: string }[]} />}
      />

      <section className="mc-section">
        <div className="mc-wrap">
          <SectionHead num="01" title={t("telemetryTitle")} tag="GH" />
          <Reveal className="grid gap-3 sm:grid-cols-3">
            <div className="mc-card">
              <p className="mc-label">{ts("stars")}</p>
              <p className="mc-mono mt-2 text-3xl tabular-nums">{formatGithubRepoStatNumber(stats?.stars, locale)}</p>
            </div>
            <div className="mc-card">
              <p className="mc-label">{ts("forks")}</p>
              <p className="mc-mono mt-2 text-3xl tabular-nums">{formatGithubRepoStatNumber(stats?.forks, locale)}</p>
            </div>
            <div className="mc-card">
              <p className="mc-label">{ts("license")}</p>
              <p className="mc-mono mt-2 flex items-center gap-2 text-2xl">
                <Lamp tone="green" />
                {stats?.licenseLabel ?? "Apache-2.0"}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <IdCardGrid
        num="02"
        title={t("reposTitle")}
        light
        columns={2}
        cards={repos.map((r, i) => ({ id: `REPO-${String(i + 1).padStart(2, "0")}`, name: r.name, text: r.text, href: r.href, external: true }))}
      />

      <IdCardGrid
        num="03"
        title={t("principlesTitle")}
        columns={2}
        cards={principles.map((p, i) => ({ id: `P-${String(i + 1).padStart(2, "0")}`, name: p.label, text: p.text }))}
      />

      <LaunchCta
        locale={locale}
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: LINKS.github, external: true, newTab: true }}
        secondary={{ label: t("cta.secondary"), href: LINKS.sovereignEU, external: true, newTab: true }}
      />
    </>
  );
}
