"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MemoriesChatDemoPanel } from "@/components/interactive/memories-chat-demo-panel";
import { MemoriesNeuralPreview } from "@/components/interactive/memories-neural-preview";
import { cn } from "@/lib/utils";
import { ArrowRight, Brain } from "lucide-react";

export function MemoriesSection() {
  const t = useTranslations("memoriesSection");
  const [revealedMemoryKeys, setRevealedMemoryKeys] = useState<string[]>([]);

  const revealMemory = useCallback((labelKey: string) => {
    setRevealedMemoryKeys((prev) =>
      prev.includes(labelKey) ? prev : [...prev, labelKey],
    );
  }, []);

  return (
    <>
      <section
        id="memories"
        className="border-t border-[rgb(196_197_215/0.2)] bg-gradient-to-b from-background via-[#f0f9ff]/[0.12] to-page-tint/80 py-16 sm:py-24"
        aria-labelledby="memories-heading"
      >
        <div className="container-wide section-padding">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 gap-1.5 rounded-full border-0 bg-[#e0f2fe]/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-[#002c92]"
            >
              <Brain className="size-3.5" aria-hidden />
              {t("badge")}
            </Badge>
            <h2
              id="memories-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {t("title")}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
          </div>

          <h3 id="memories-demo-heading" className="sr-only">
            {t("demoChatSectionTitle")}
          </h3>
          <p
            className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground sm:mt-10 sm:text-base"
            aria-labelledby="memories-demo-heading"
          >
            {t("demoChatSectionLead")}
          </p>

          <div className="mt-10 grid min-h-0 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10 sm:mt-12 lg:h-[min(75vh,700px)]">
            <div className="relative flex min-h-[min(70vh,480px)] flex-col overflow-hidden lg:col-span-7 lg:min-h-0 lg:h-full">
              <MemoriesNeuralPreview
                className="h-full min-h-0"
                revealedMemoryLabelKeys={revealedMemoryKeys}
              />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden max-lg:max-h-[min(80vh,680px)] lg:col-span-5 lg:h-full">
              <MemoriesChatDemoPanel onRevealMemory={revealMemory} />
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-[rgb(196_197_215/0.15)] bg-page-tint/40 py-12 sm:py-16"
        aria-label={t("ctaButton")}
      >
        <div className="container-wide section-padding">
          <div className="flex flex-col items-center text-center">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("ctaLead")}
            </p>
            <Link
              href="/solutions/memories"
              className={cn(
                buttonVariants({ size: "lg" }),
                "btn-figma-primary mt-6 gap-2 rounded-xl border-0 px-8 text-base text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)] transition-transform hover:scale-[1.02]",
              )}
            >
              {t("ctaButton")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
