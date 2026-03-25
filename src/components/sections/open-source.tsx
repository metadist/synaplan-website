"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import { Star, GitFork, Scale } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function OpenSourceSection() {
  const t = useTranslations("openSource");
  const tc = useTranslations("common");

  const stats = [
    { icon: Star, value: "—", label: t("stars") },
    { icon: GitFork, value: "—", label: t("forks") },
    { icon: Scale, value: "AGPL", label: t("license") },
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
            <div key={stat.label} className="group flex flex-col items-center gap-2">
              <div className="flex items-center gap-2.5">
                <stat.icon className="size-5 text-brand-400 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-3xl font-bold text-white">
                  {stat.value}
                </span>
              </div>
              <span className="text-sm text-white/50">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 border-white/10 bg-white text-zinc-900 shadow-lg shadow-white/5 hover:bg-white/90"
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
