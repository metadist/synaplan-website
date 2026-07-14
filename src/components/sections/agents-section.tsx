"use client";

import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  BrainCircuit,
  CalendarClock,
  Headset,
  Mail,
  Megaphone,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/interactive/animated-section";
import { useMotionPerformance } from "@/contexts/motion-performance-context";
import { cn } from "@/lib/utils";

const AGENTS: { key: string; icon: LucideIcon }[] = [
  { key: "sales", icon: TrendingUp },
  { key: "support", icon: Headset },
  { key: "hr", icon: Users },
  { key: "knowledge", icon: BrainCircuit },
  { key: "compliance", icon: BadgeCheck },
  { key: "meeting", icon: CalendarClock },
  { key: "email", icon: Mail },
  { key: "marketing", icon: Megaphone },
];

export function AgentsSection() {
  const t = useTranslations("agents");
  const { allowHeavyEffects } = useMotionPerformance();

  return (
    <section className="surface-rose relative py-20 sm:py-28">
      <div className="container-wide section-padding">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="mb-5 rounded-full border-0 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#002c92]"
          >
            {t("badge")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </AnimatedSection>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((agent, i) => (
            <AnimatedSection key={agent.key} delay={i * 0.04}>
              <div
                className={cn(
                  "group h-full rounded-3xl border border-[rgb(196_197_215/0.25)] bg-[rgb(255_255_255/0.9)] p-6 shadow-sm",
                  allowHeavyEffects &&
                    "transition-all duration-300 hover:-translate-y-1 hover:border-[#002c92]/20 hover:shadow-lg hover:shadow-[#002c92]/5",
                )}
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <agent.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t(`${agent.key}.name`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${agent.key}.description`)}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
