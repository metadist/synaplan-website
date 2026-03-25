"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Shuffle,
  FileText,
  ShieldCheck,
  MessageCircle,
  BarChart3,
  Lock,
} from "lucide-react";
import { ModelRoutingVisual } from "@/components/interactive/model-routing-visual";

const features = [
  {
    key: "multiModel" as const,
    icon: Shuffle,
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    hasVisual: true,
  },
  { key: "documents" as const, icon: FileText, span: "" },
  { key: "audit" as const, icon: ShieldCheck, span: "" },
  { key: "widget" as const, icon: MessageCircle, span: "sm:col-span-2" },
  { key: "dashboard" as const, icon: BarChart3, span: "" },
  { key: "security" as const, icon: Lock, span: "" },
];

export function FeaturesShowcase() {
  const t = useTranslations("features");

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-muted/30" />

      <div className="container-wide section-padding">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat) => (
            <div
              key={feat.key}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 ${feat.span}`}
              style={{ perspective: "800px" }}
            >
              <div className="h-full transition-transform duration-500 group-hover:[transform:rotateX(1deg)_rotateY(-1deg)_scale(1.01)]">
                <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-brand-500/[0.04] blur-2xl transition-all duration-500 group-hover:bg-brand-500/[0.08] group-hover:blur-3xl" />

                <div className="relative p-6">
                  <Badge
                    variant="secondary"
                    className="mb-4 border-brand-100 bg-brand-50/80 text-brand-700"
                  >
                    <feat.icon className="mr-1 size-3" />
                    {t(`${feat.key}.label`)}
                  </Badge>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                    {t(`${feat.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`${feat.key}.description`)}
                  </p>
                </div>

                {feat.hasVisual && (
                  <div className="px-4 pb-4">
                    <ModelRoutingVisual />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
