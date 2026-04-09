"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CTASection() {
  const t = useTranslations("cta");
  const tc = useTranslations("common");

  const badges = [t("immediately"), t("gdpr"), t("germany")];

  return (
    <section className="py-20 sm:py-28">
      <div className="container-wide section-padding">
        <div className="relative overflow-hidden rounded-[2.5rem] p-10 text-center sm:p-16 md:rounded-[2.75rem]">
          {/* Multi-layer gradient background */}
          <div className="absolute inset-0 gradient-brand" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_oklch(0.55_0.19_280_/_0.3),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_white/8,_transparent_40%)]" />

          {/* Animated shimmer — disabled via html[data-motion-profile="reduced"] */}
          <div className="cta-shimmer-layer absolute inset-0 animate-shimmer" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {t("subtitle")}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={LINKS.web}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 border-transparent bg-white px-8 text-base font-semibold text-brand-700 shadow-xl shadow-black/10 hover:bg-white/95 hover:shadow-2xl"
                )}
              >
                {tc("startForFree")}
                <ArrowRight className="size-4" />
              </a>
              <a
                href={LINKS.whatsappDE}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-2 border-white/80 bg-white px-8 text-base font-semibold text-brand-700 shadow-md backdrop-blur-sm hover:bg-white/95 hover:text-brand-800",
                )}
              >
                {tc("bookDemo")}
              </a>
            </div>

            <p className="mt-6 text-center text-sm text-white/75">
              <Link
                href="/try-chat"
                className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
              >
                {tc("ctaTryChatTeaser")}
              </Link>
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
                >
                  <CheckCircle className="size-4 text-white/70" />
                  <span className="text-sm font-medium text-white/90">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
