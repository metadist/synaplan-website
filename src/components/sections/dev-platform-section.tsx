"use client";

import { useTranslations } from "next-intl";
import {
  Container,
  FileJson,
  Globe,
  KeyRound,
  Plug,
  Puzzle,
  Ship,
  ShieldCheck,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { AnimatedSection } from "@/components/interactive/animated-section";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "rest", icon: Globe },
  { key: "openapi", icon: FileJson },
  { key: "mcp", icon: Puzzle },
  { key: "webhooks", icon: Webhook },
  { key: "plugins", icon: Plug },
  { key: "docker", icon: Container },
  { key: "kubernetes", icon: Ship },
  { key: "oauth", icon: KeyRound },
  { key: "sso", icon: ShieldCheck },
];

const CODE_LINES: { prompt?: boolean; text: string }[] = [
  { prompt: true, text: "curl https://api.synaplan.com/v1/chat \\" },
  { text: '  -H "Authorization: Bearer $SYNAPLAN_KEY" \\' },
  { text: '  -d \'{ "message": "Draft an offer for ACME" }\'' },
  { text: "" },
  { text: "→ routed to the best model" },
  { text: "→ grounded in your documents" },
  { text: "→ delivered to every channel" },
];

export function DevPlatformSection() {
  const t = useTranslations("devPlatform");

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 grain">
      <div className="absolute inset-0 -z-10 bg-zinc-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_oklch(0.55_0.19_250_/_0.22),_transparent_60%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-wide section-padding relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <AnimatedSection>
            <Badge
              variant="secondary"
              className="mb-5 rounded-full border-0 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-brand-300"
            >
              {t("badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/60">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {ITEMS.map((item) => (
                <span
                  key={item.key}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/85"
                >
                  <item.icon className="size-4 text-brand-300" />
                  {t(`items.${item.key}`)}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 border-transparent bg-white text-zinc-900 hover:bg-white/90",
                )}
              >
                {t("ctaDocs")}
              </a>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                <GithubIcon className="size-5" />
                {t("ctaGithub")}
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                <span className="size-3 rounded-full bg-red-400/70" />
                <span className="size-3 rounded-full bg-amber-400/70" />
                <span className="size-3 rounded-full bg-emerald-400/70" />
                <span className="ml-2 text-xs font-medium text-white/40">
                  synaplan · api
                </span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
                <code className="font-mono">
                  {CODE_LINES.map((line, i) => (
                    <span
                      key={i}
                      className={cn(
                        "block whitespace-pre",
                        line.text.startsWith("→")
                          ? "text-brand-300"
                          : line.prompt
                            ? "text-white"
                            : "text-white/70",
                      )}
                    >
                      {line.prompt ? (
                        <span className="text-emerald-400">$ </span>
                      ) : null}
                      {line.text || "\u00a0"}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
