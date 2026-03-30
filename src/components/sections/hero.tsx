"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LINKS } from "@/lib/constants";
import { ArrowRight, ChevronDown, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingOrbs } from "@/components/interactive/floating-orbs";
import { HeroChatSlot } from "@/components/sections/hero-chat-slot";
import { Link } from "@/i18n/navigation";

const NEXT_SECTION_ID = "widget-flow";

export function HeroSection() {
  const t = useTranslations();

  const scrollToNext = () => {
    document.getElementById(NEXT_SECTION_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <FloatingOrbs />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="container-wide section-padding flex min-h-0 flex-1 flex-col justify-center pt-8 sm:pt-10 lg:pt-12">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Copy — Figma: left column, left-aligned on large screens */}
            <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
              <Badge
                variant="secondary"
                className="mb-6 gap-2 rounded-full border-0 bg-[#f6e3f3] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#002c92]"
              >
                <span className="text-[10px] leading-none" aria-hidden>
                  ●
                </span>
                {t("hero.badge")}
              </Badge>

              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.1] lg:tracking-[-0.045em] [word-spacing:0.04em]">
                {t("hero.title")}
                <br />
                <span className="mt-3 block whitespace-pre-line text-[#002c92] sm:mt-4 lg:mt-5 lg:leading-[1.18] lg:[word-spacing:0.06em]">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t("hero.description")}
              </p>

              <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <a
                  href={LINKS.web}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "btn-figma-primary gap-2 rounded-xl border-0 px-8 text-base text-white",
                  )}
                >
                  {t("common.startForFree")}
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href={LINKS.appointment}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "rounded-xl border-0 bg-[#f6e3f3] px-8 text-base font-bold text-[#002c92] hover:bg-[#edd8ea]",
                  )}
                >
                  {t("common.bookDemo")}
                </a>
              </div>

              <p className="mt-5 max-w-xl text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
                <Link
                  href="/try-chat"
                  className="font-medium text-[#002c92] underline decoration-[#002c92]/35 underline-offset-4 transition-colors hover:text-[#001f6b] hover:decoration-[#001f6b]/50"
                >
                  {t("hero.tryChatCta")}
                </Link>
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-[#002c92]" />
                  <span>{t("common.openSource")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-[#002c92]" />
                  <span>{t("common.gdprCompliant")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-[#002c92]" />
                  <span>{t("common.madeInGermany")}</span>
                </div>
              </div>
            </div>

            {/* Chat preview — Figma: right column */}
            <div className="mx-auto w-full min-h-0 max-w-md self-stretch pb-8 lg:col-span-5 lg:mx-0 lg:max-w-none lg:pb-0">
              <HeroChatSlot />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-center pb-6 pt-2 sm:pb-8">
          <button
            type="button"
            onClick={scrollToNext}
            className="group flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-muted-foreground transition-colors hover:text-[#002c92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002c92]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={t("hero.scrollDown")}
          >
            <span
              className="relative flex h-11 w-7 items-start justify-center rounded-full border-2 border-current pt-2.5"
              aria-hidden
            >
              <span className="hero-scroll-wheel h-1.5 w-1 rounded-full bg-current" />
            </span>
            <ChevronDown
              className="hero-scroll-chevron size-5 shrink-0"
              strokeWidth={2.25}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>
  );
}
