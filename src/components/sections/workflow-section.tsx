"use client";

import { useTranslations } from "next-intl";
import {
  BrainCircuit,
  CalendarPlus,
  ClipboardCheck,
  Cpu,
  Database,
  FileSignature,
  FileText,
  MessageCircle,
  Send,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/interactive/animated-section";

type Step = { title: string; detail: string };

const ICONS: LucideIcon[] = [
  MessageCircle,
  Cpu,
  Database,
  FileText,
  BrainCircuit,
  FileSignature,
  Send,
  CalendarPlus,
  ClipboardCheck,
];

export function WorkflowSection() {
  const t = useTranslations("workflow");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-wide section-padding">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="mb-5 rounded-full border-0 bg-soft-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#002c92]"
          >
            {t("badge")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </AnimatedSection>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div
            className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-[#002c92]/40 via-[#002c92]/20 to-transparent sm:left-7"
            aria-hidden
          />
          <ol className="space-y-4">
            {steps.map((step, i) => {
              const Icon = ICONS[i] ?? MessageCircle;
              return (
                <AnimatedSection key={step.title} delay={i * 0.05}>
                  <li className="relative flex items-start gap-5">
                    <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white text-[#002c92] shadow-sm sm:size-14">
                      <Icon className="size-5 sm:size-6" />
                      <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full gradient-brand text-[10px] font-bold text-white shadow">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 rounded-2xl border border-[rgb(196_197_215/0.2)] bg-[rgb(255_255_255/0.9)] p-4 shadow-sm sm:p-5">
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                </AnimatedSection>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
