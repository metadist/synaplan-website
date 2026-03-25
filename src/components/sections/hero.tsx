"use client";

import { useTranslations, useLocale } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LINKS } from "@/lib/constants";
import { ArrowRight, Shield, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformPreview } from "@/components/interactive/platform-preview";
import { ChatWidgetPreview } from "@/components/interactive/chat-widget-preview";
import { FloatingOrbs } from "@/components/interactive/floating-orbs";

export function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden">
      <FloatingOrbs />

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-background to-background" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/[0.06] blur-[100px]" />
      </div>

      <div className="container-wide section-padding">
        {/* Text section */}
        <div className="flex flex-col items-center pt-16 pb-8 text-center sm:pt-24 sm:pb-12 lg:pt-28">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 border-brand-200 bg-brand-50 px-3 py-1.5 text-brand-700"
          >
            <Sparkles className="size-3.5" />
            {t("hero.badge")}
          </Badge>

          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t("hero.title")}
            <br />
            <span className="gradient-text">{t("hero.titleHighlight")}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href={LINKS.web}
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 px-6 text-base"
              )}
            >
              {t("common.startForFree")}
              <ArrowRight className="size-4" />
            </a>
            <a
              href={LINKS.appointment}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-6 text-base"
              )}
            >
              {t("common.bookDemo")}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-brand-500" />
              <span>{t("common.openSource")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-brand-500" />
              <span>{t("common.gdprCompliant")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-brand-500" />
              <span>{t("common.madeInGermany")}</span>
            </div>
          </div>
        </div>

        {/* Visual preview section */}
        <div className="relative mx-auto max-w-5xl pb-16 pt-8 lg:pb-24">
          <div className="grid items-start gap-8 lg:grid-cols-5">
            {/* Platform dashboard — takes 3 cols */}
            <div className="lg:col-span-3" style={{ perspective: "1200px" }}>
              <div
                className="transition-transform duration-700"
                style={{ transform: "rotateY(-2deg) rotateX(2deg)" }}
              >
                <PlatformPreview />
              </div>
            </div>

            {/* Chat widget — takes 2 cols, offset down */}
            <div className="lg:col-span-2 lg:mt-12" style={{ perspective: "1200px" }}>
              <div
                className="transition-transform duration-700"
                style={{ transform: "rotateY(3deg) rotateX(1deg)" }}
              >
                <ChatWidgetPreview locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
