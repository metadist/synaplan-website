"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StoreBadges } from "@/components/brand/store-badges";
import { AnimatedSection } from "@/components/interactive/animated-section";

const APPS_IMAGE = {
  src: "/images/synaplan-mobile-apps.png",
  width: 1080,
  height: 717,
} as const;

export function AppsSection() {
  const t = useTranslations("apps");

  const points = [t("point1"), t("point2"), t("point3")];

  return (
    <section id="apps" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-page-tint" />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgb(0_44_146/0.08),transparent)]"
        aria-hidden
      />

      <div className="container-wide section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <AnimatedSection className="lg:col-span-5">
            <Badge
              variant="secondary"
              className="mb-5 max-w-full rounded-full border-0 bg-soft-accent px-3 py-1.5 text-center text-xs font-bold uppercase tracking-[0.06em] text-[#002c92]"
            >
              {t("badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-foreground sm:text-base">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-soft-accent text-[#002c92]">
                    <Smartphone className="size-3.5" aria-hidden />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <StoreBadges className="mt-8" />
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-[rgb(196_197_215/0.35)] bg-white shadow-sm">
              <Image
                src={APPS_IMAGE.src}
                alt={t("imageAlt")}
                width={APPS_IMAGE.width}
                height={APPS_IMAGE.height}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="h-auto w-full"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
