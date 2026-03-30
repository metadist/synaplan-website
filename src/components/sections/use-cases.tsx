"use client";

import { useTranslations, useLocale } from "next-intl";
import { Quote, ArrowRight } from "lucide-react";
import { USE_CASES } from "@/lib/constants";
import { useMotionPerformance } from "@/contexts/motion-performance-context";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-brand-500/10 to-brand-600/5",
  "from-emerald-500/10 to-emerald-600/5",
  "from-amber-500/10 to-amber-600/5",
  "from-purple-500/10 to-purple-600/5",
];

export function UseCasesSection() {
  const t = useTranslations("useCases");
  const locale = useLocale();
  const { allowHeavyEffects } = useMotionPerformance();

  return (
    <section className="py-20 sm:py-28">
      <div className="container-wide section-padding">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {USE_CASES.map((uc, i) => (
            <div
              key={uc.company}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-[rgb(196_197_215/0.25)] bg-[rgb(255_255_255/0.85)] p-6 shadow-sm",
                allowHeavyEffects &&
                  "transition-all duration-500 hover:border-[#002c92]/20 hover:shadow-lg",
              )}
              style={allowHeavyEffects ? { perspective: "800px" } : undefined}
            >
              <div
                className={cn(
                  `absolute inset-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`,
                  allowHeavyEffects
                    ? "opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    : "opacity-0",
                )}
              />

              <div
                className={cn(
                  "relative",
                  allowHeavyEffects &&
                    "transition-transform duration-500 group-hover:[transform:translateZ(10px)]",
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Quote className="size-8 text-brand-400/40" />
                  <ArrowRight className="size-4 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-brand-500" />
                </div>

                <blockquote className="text-lg font-medium leading-relaxed text-foreground">
                  &ldquo;{locale === "de" ? uc.quoteDE : uc.quote}&rdquo;
                </blockquote>
                <p className="mt-3 text-sm text-muted-foreground">
                  {locale === "de" ? uc.descriptionDE : uc.description}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-md shadow-brand-500/20">
                    <span className="text-sm font-bold text-white">
                      {uc.company[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">
                      {uc.company}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Synaplan Customer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
