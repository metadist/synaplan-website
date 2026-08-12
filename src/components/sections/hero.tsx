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

const NEXT_SECTION_ID = "channels";

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
          <div className="grid min-w-0 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Copy — Figma: left column, left-aligned on large screens */}
            <div className="flex w-full min-w-0 flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
              <Badge
                variant="secondary"
                className="mb-6 max-w-full gap-2 rounded-full border-0 bg-soft-accent px-3 py-1.5 text-center text-[0.65rem] font-bold uppercase leading-snug tracking-[0.04em] text-[#002c92] sm:text-xs sm:tracking-[0.06em]"
              >
                <span className="shrink-0 text-[10px] leading-none" aria-hidden>
                  ●
                </span>
                <span className="min-w-0">{t("hero.badge")}</span>
              </Badge>

              <h1 className="w-full max-w-3xl text-[1.8rem] font-extrabold leading-[1.15] tracking-tight text-foreground wrap-break-word sm:text-[2.4rem] md:text-[3rem] lg:text-[3.4rem] lg:leading-[1.1] lg:tracking-[-0.045em] [word-spacing:0.04em]">
                {t("hero.title")}
                <br />
                <span className="mt-3 block text-[0.875em] text-[#002c92] sm:mt-4 lg:mt-5 lg:leading-[1.18] lg:[word-spacing:0.06em]">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p className="mt-6 w-full max-w-xl text-lg leading-relaxed text-muted-foreground wrap-break-word sm:text-xl">
                {t("hero.description")}
              </p>

              <div className="mt-8 flex w-full min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <a
                  href={LINKS.web}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "btn-figma-primary h-auto min-h-11 w-full gap-2 whitespace-normal rounded-xl border-0 px-6 text-base text-white sm:w-auto sm:px-8",
                  )}
                >
                  {t("common.startForFree")}
                  <ArrowRight className="size-4 shrink-0" />
                </a>
                <a
                  href={LINKS.whatsappDE}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-auto min-h-11 w-full whitespace-normal rounded-xl border-0 bg-soft-accent px-6 text-base font-bold text-[#002c92] hover:bg-soft-accent-hover sm:w-auto sm:px-8",
                  )}
                >
                  {t("common.bookDemo")}
                </a>
              </div>

              <p className="mt-5 w-full max-w-xl text-center text-sm leading-relaxed text-muted-foreground wrap-break-word lg:text-left">
                <Link
                  href="/try-chat"
                  className="font-medium text-[#002c92] underline decoration-[#002c92]/35 underline-offset-4 transition-colors hover:text-[#001f6b] hover:decoration-[#001f6b]/50"
                >
                  {t("hero.tryChatCta")}
                </Link>
              </p>

              <div className="mt-8 flex w-full min-w-0 flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start">
                <div className="flex min-w-0 items-center gap-2">
                  <Shield className="size-4 shrink-0 text-[#002c92]" />
                  <span className="wrap-break-word">{t("common.openSource")}</span>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <Shield className="size-4 shrink-0 text-[#002c92]" />
                  <span className="wrap-break-word">{t("common.gdprCompliant")}</span>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <Globe className="size-4 shrink-0 text-[#002c92]" />
                  <span className="wrap-break-word">{t("common.madeInGermany")}</span>
                </div>
              </div>
            </div>

            {/* Chat preview — Figma: right column */}
            <div className="mx-auto w-full min-h-0 min-w-0 max-w-md self-stretch pb-8 lg:col-span-5 lg:mx-0 lg:max-w-none lg:pb-0">
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
