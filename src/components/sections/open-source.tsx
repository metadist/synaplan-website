"use client";

import { useLocale, useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { LINKS } from "@/lib/constants";
import {
  formatGithubRepoStatNumber,
  type SynaplanGithubRepoStats,
} from "@/lib/github-synaplan-repo";
import { cn } from "@/lib/utils";
import { GitFork, Scale, Star } from "lucide-react";

export type OpenSourceSectionProps = {
  githubRepo?: SynaplanGithubRepoStats | null;
};

export function OpenSourceSection({
  githubRepo = null,
}: OpenSourceSectionProps) {
  const t = useTranslations("openSource");
  const tc = useTranslations("common");
  const locale = useLocale();

  const stars = formatGithubRepoStatNumber(githubRepo?.stars, locale);
  const forks = formatGithubRepoStatNumber(githubRepo?.forks, locale);
  const license =
    githubRepo?.licenseLabel?.trim() || "\u2014";

  const stats: {
    icon: typeof Star;
    value: string;
    label: string;
    href: string;
  }[] = [
    {
      icon: Star,
      value: stars,
      label: t("stars"),
      href: `${LINKS.github}/stargazers`,
    },
    {
      icon: GitFork,
      value: forks,
      label: t("forks"),
      href: `${LINKS.github}/forks`,
    },
    {
      icon: Scale,
      value: license,
      label: t("license"),
      href: `${LINKS.github}/blob/main/LICENSE`,
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 grain">
      <div className="absolute inset-0 -z-10 bg-zinc-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_oklch(0.55_0.19_250_/_0.2),_transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_oklch(0.55_0.19_280_/_0.1),_transparent_50%)]" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-wide section-padding relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-white/60">{t("subtitle")}</p>
        </div>

        <div className="mx-auto mt-14 flex max-w-lg flex-wrap items-center justify-center gap-10">
          {stats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 rounded-xl px-2 py-1 outline-none transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-brand-400/50"
            >
              <div className="flex items-center gap-2.5">
                <stat.icon className="size-5 text-brand-400 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-3xl font-bold tabular-nums text-white">
                  {stat.value}
                </span>
              </div>
              <span className="text-sm text-white/50">{stat.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 border-white/10 bg-white text-zinc-900 shadow-lg shadow-white/5 hover:bg-white/90",
            )}
          >
            <GithubIcon className="size-5" />
            {tc("viewOnGithub")}
          </a>
        </div>
      </div>
    </section>
  );
}
