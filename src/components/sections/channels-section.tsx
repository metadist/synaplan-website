"use client";

import { useTranslations } from "next-intl";
import {
  Code2,
  Globe,
  Inbox,
  Mail,
  MessageCircle,
  Mic,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/interactive/animated-section";
import { cn } from "@/lib/utils";

type ChannelNode = {
  key: string;
  icon: LucideIcon;
};

const NODES: ChannelNode[] = [
  { key: "whatsapp", icon: MessageCircle },
  { key: "email", icon: Mail },
  { key: "outlook", icon: Inbox },
  { key: "website", icon: Globe },
  { key: "api", icon: Code2 },
  { key: "mcp", icon: Puzzle },
  { key: "voice", icon: Mic },
];

function polar(index: number, total: number, radius: number) {
  const angle = (-90 + index * (360 / total)) * (Math.PI / 180);
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
}

export function ChannelsSection() {
  const t = useTranslations("channels");
  const points = NODES.map((_, i) => polar(i, NODES.length, 38));

  return (
    <section id="channels" className="relative overflow-hidden py-20 sm:py-28">
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

        <AnimatedSection
          delay={0.1}
          className="relative mx-auto mt-14 aspect-square w-full max-w-[36rem]"
        >
          {/* Connecting lines */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="channel-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#002c92" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#003fc7" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {points.map((p, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke="url(#channel-line)"
                strokeWidth="0.5"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 z-10 flex size-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center text-white shadow-xl shadow-[#002c92]/25 sm:size-32">
            <span className="absolute inset-0 rounded-full gradient-brand" />
            <span className="channels-hub-pulse absolute inset-0 rounded-full ring-2 ring-[#002c92]/30" />
            <span className="relative text-base font-bold sm:text-lg">
              {t("hub")}
            </span>
            <span className="relative mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70">
              {t("hubHint")}
            </span>
          </div>

          {/* Channel nodes */}
          {NODES.map((node, i) => {
            const p = points[i];
            return (
              <div
                key={node.key}
                className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white text-[#002c92] shadow-sm sm:size-14",
                  )}
                >
                  <node.icon className="size-5 sm:size-6" />
                </div>
                <span className="whitespace-nowrap rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm sm:text-sm">
                  {t(`nodes.${node.key}`)}
                </span>
              </div>
            );
          })}
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="mx-auto mt-14 max-w-xl text-center">
          <p className="text-lg font-semibold text-foreground">{t("footnote")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
