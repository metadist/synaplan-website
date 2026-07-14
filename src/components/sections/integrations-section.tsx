"use client";

import { useTranslations } from "next-intl";
import {
  Boxes,
  Cloud,
  Code2,
  Database,
  FileText,
  FolderOpen,
  Globe,
  Inbox,
  LayoutGrid,
  Mail,
  MessageCircle,
  Mic,
  Puzzle,
  Server,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/interactive/animated-section";
import { useMotionPerformance } from "@/contexts/motion-performance-context";
import { cn } from "@/lib/utils";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "outlook", icon: Inbox },
  { key: "exchange", icon: Server },
  { key: "whatsapp", icon: MessageCircle },
  { key: "restApi", icon: Code2 },
  { key: "mcp", icon: Puzzle },
  { key: "crm", icon: Users },
  { key: "erp", icon: Boxes },
  { key: "sap", icon: Database },
  { key: "microsoft365", icon: LayoutGrid },
  { key: "wordpress", icon: Globe },
  { key: "nextcloud", icon: Cloud },
  { key: "files", icon: FolderOpen },
  { key: "documents", icon: FileText },
  { key: "voice", icon: Mic },
  { key: "email", icon: Mail },
];

export function IntegrationsSection() {
  const t = useTranslations("integrations");
  const { allowHeavyEffects } = useMotionPerformance();

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

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <AnimatedSection key={item.key} delay={(i % 5) * 0.03}>
              <div
                className={cn(
                  "flex h-full items-center gap-3 rounded-2xl border border-[rgb(196_197_215/0.25)] bg-[rgb(255_255_255/0.9)] px-4 py-3 shadow-sm",
                  allowHeavyEffects &&
                    "transition-all duration-300 hover:border-[#002c92]/20 hover:shadow-md",
                )}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <item.icon className="size-5" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {t(`items.${item.key}`)}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.1} className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-sm text-muted-foreground">{t("footnote")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
