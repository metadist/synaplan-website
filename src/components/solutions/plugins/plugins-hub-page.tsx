import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { LINKS } from "@/lib/constants";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Mail,
  Puzzle,
} from "lucide-react";

const PLUGINS = [
  {
    nameKey: "plugin1Name" as const,
    descKey: "plugin1Desc" as const,
    tagKey: "plugin1Tag" as const,
    githubSlug: "synaplan-marketing",
    accent: "#f97316",
    bg: "bg-orange-50",
    border: "border-orange-100",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    nameKey: "plugin2Name" as const,
    descKey: "plugin2Desc" as const,
    tagKey: "plugin2Tag" as const,
    githubSlug: "synaplan-nextcloud",
    accent: "#0ea5e9",
    bg: "bg-sky-50",
    border: "border-sky-100",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    nameKey: "plugin3Name" as const,
    descKey: "plugin3Desc" as const,
    tagKey: "plugin3Tag" as const,
    githubSlug: "synaplan-opencloud",
    accent: "#14b8a6",
    bg: "bg-teal-50",
    border: "border-teal-100",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    nameKey: "plugin4Name" as const,
    descKey: "plugin4Desc" as const,
    tagKey: "plugin4Tag" as const,
    githubSlug: "synaplan-ai-support-chat",
    accent: "#8b5cf6",
    bg: "bg-violet-50",
    border: "border-violet-100",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    nameKey: "plugin5Name" as const,
    descKey: "plugin5Desc" as const,
    tagKey: "plugin5Tag" as const,
    githubSlug: "synaplan",
    accent: "#e11d48",
    bg: "bg-rose-50",
    border: "border-rose-100",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    nameKey: "plugin6Name" as const,
    descKey: "plugin6Desc" as const,
    tagKey: "plugin6Tag" as const,
    githubSlug: "synaplan-memories",
    accent: "#6366f1",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
] as const;

const commissionFeatureKeys = [
  "commissionFeature1",
  "commissionFeature2",
  "commissionFeature3",
] as const;

export async function PluginsHubPage({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pluginsPage" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <SolutionArticleShell
      breadcrumbItems={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbPlugins") },
      ]}
    >
      {/* Hero */}
      <header className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
          <Puzzle className="size-3.5 text-brand-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Plugins
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {t("heroLead")}
        </p>
      </header>

      {/* What are plugins */}
      <section className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[rgb(196_197_215/0.35)] bg-white/70 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">
          {t("sectionWhatTitle")}
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {t("sectionWhatBody")}
        </p>
      </section>

      {/* Plugin cards */}
      <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLUGINS.map((plugin) => (
          <a
            key={plugin.nameKey}
            href={`https://github.com/metadist/${plugin.githubSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-col gap-4 rounded-2xl border p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${plugin.bg} ${plugin.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${plugin.iconBg}`}
              >
                <Puzzle className={`size-5 ${plugin.iconColor}`} />
              </div>
              <ExternalLink className="size-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold text-foreground">
                {t(plugin.nameKey)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(plugin.descKey)}
              </p>
            </div>
            <p className="mt-auto rounded-full border border-black/5 bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground/80 self-start">
              {t(plugin.tagKey)}
            </p>
          </a>
        ))}
      </div>

      {/* Build your own */}
      <section className="mx-auto mt-14 max-w-3xl rounded-3xl border border-[rgb(196_197_215/0.35)] bg-white/70 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">
          {t("sectionCtaTitle")}
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {t("sectionCtaBody")}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://github.com/orgs/metadist/repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-figma-primary inline-flex h-11 items-center gap-2 rounded-xl border-0 px-7 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgb(0_44_146/0.3)]"
          >
            {t("ctaPrimary")}
            <ArrowRight className="size-4" />
          </a>
          <a
            href={LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#002c92]/25 bg-soft-accent px-7 text-sm font-semibold text-[#002c92] transition-colors hover:bg-soft-accent-hover"
          >
            <BookOpen className="size-4" />
            {t("ctaSecondary")}
          </a>
        </div>
      </section>

      {/* Commission section */}
      <section className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#002c92] to-[#1a4fc4] p-8 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Mail className="size-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {t("commissionTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-white/80">
              {t("commissionBody")}
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {commissionFeatureKeys.map((k) => (
                <li key={k} className="flex items-center gap-2.5 text-sm text-white/90">
                  <CheckCircle2 className="size-4 shrink-0 text-white/60" />
                  {t(k)}
                </li>
              ))}
            </ul>
            <a
              href={LINKS.whatsappDE}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-[#002c92] transition-opacity hover:opacity-90"
            >
              {t("commissionCta")}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <p className="mx-auto mt-8 max-w-sm text-center text-sm text-muted-foreground">
        {tc("viewOnGithub")}:{" "}
        <a
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          github.com/metadist/synaplan
        </a>
      </p>
    </SolutionArticleShell>
  );
}
