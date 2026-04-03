import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { LINKS } from "@/lib/constants";
import {
  ArrowRight,
  BookOpen,
  Box,
  Code2,
  GitBranch,
  Network,
  Puzzle,
  Search,
  Terminal,
} from "lucide-react";

const featureIcons = [GitBranch, Code2, Puzzle, Box, Network, Search] as const;

export async function DevelopersHubPage({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "developersPage" });

  const features = [
    { icon: featureIcons[0], titleKey: "f1Title" as const, descKey: "f1Desc" as const },
    { icon: featureIcons[1], titleKey: "f2Title" as const, descKey: "f2Desc" as const },
    { icon: featureIcons[2], titleKey: "f3Title" as const, descKey: "f3Desc" as const },
    { icon: featureIcons[3], titleKey: "f4Title" as const, descKey: "f4Desc" as const },
    { icon: featureIcons[4], titleKey: "f5Title" as const, descKey: "f5Desc" as const },
    { icon: featureIcons[5], titleKey: "f6Title" as const, descKey: "f6Desc" as const },
  ];

  return (
    <SolutionArticleShell
      breadcrumbItems={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbDevelopers") },
      ]}
    >
      {/* Hero */}
      <header className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
          <Code2 className="size-3.5 text-brand-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            {t("badge")}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {t("heroLead")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-figma-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)] sm:w-auto"
          >
            {t("ctaPrimary")}
            <ArrowRight className="size-4" />
          </a>
          <a
            href={LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#002c92]/25 bg-soft-accent px-8 text-base font-semibold text-[#002c92] transition-colors hover:bg-soft-accent-hover sm:w-auto"
          >
            <BookOpen className="size-4" />
            {t("ctaSecondary")}
          </a>
        </div>
      </header>

      {/* Features grid */}
      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
          {t("featuresTitle")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="flex flex-col gap-3 rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/70 p-6 shadow-sm"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50">
                <Icon className="size-5 text-brand-700" />
              </div>
              <h3 className="font-semibold text-foreground">{t(titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quickstart */}
      <section className="mx-auto mt-14 max-w-3xl">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">
          {t("quickstartTitle")}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-[rgb(196_197_215/0.35)] bg-[#12141f]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <Terminal className="size-4 text-white/40" />
            <span className="text-xs font-mono text-white/40">bash</span>
          </div>
          <div className="flex flex-col gap-4 p-5 font-mono text-sm">
            <div>
              <p className="text-white/40"># {t("quickstartStep1")}</p>
              <p className="mt-1 text-green-400">
                git clone https://github.com/metadist/synaplan
              </p>
              <p className="text-green-400">cd synaplan</p>
            </div>
            <div>
              <p className="text-white/40"># {t("quickstartStep2")}</p>
              <p className="mt-1 text-green-400">docker compose up -d</p>
            </div>
            <div>
              <p className="text-white/40"># {t("quickstartStep3")} — {t("quickstartStep3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plugins CTA */}
      <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100">
            <Puzzle className="size-5 text-brand-700" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t("pluginsCtaTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t("pluginsCtaBody")}
            </p>
            <Link
              href="/solutions/plugins"
              className="mt-3 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-900"
            >
              {t("pluginsCtaLink")}
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTAs */}
      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href={LINKS.web}
          className="btn-figma-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)] sm:w-auto"
        >
          {t("ctaTertiary")}
          <ArrowRight className="size-4" />
        </a>
        <a
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#002c92]/25 bg-soft-accent px-8 text-base font-semibold text-[#002c92] transition-colors hover:bg-soft-accent-hover sm:w-auto"
        >
          GitHub
        </a>
      </div>
    </SolutionArticleShell>
  );
}
