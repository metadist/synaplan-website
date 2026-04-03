"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  Globe,
  Sparkles,
} from "lucide-react";

// ─── Animation preset ───────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45 },
};

// ─── Checkmark list item ─────────────────────────────────────────────────────
function Feature({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full",
          light
            ? "bg-white/20 text-white"
            : "bg-brand-100 text-brand-700",
        )}
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
      <span className={cn("text-sm leading-snug", light ? "text-white/85" : "text-muted-foreground")}>
        {text}
      </span>
    </li>
  );
}

// ─── Plan card (Platform sub-tiers) ─────────────────────────────────────────
function PlanCard({
  name,
  tagline,
  price,
  features,
  recommended,
  cta,
}: {
  name: string;
  tagline: string;
  price: string;
  features: string[];
  recommended: boolean;
  cta: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-shadow duration-200",
        recommended
          ? "border-brand-400 bg-white shadow-lg shadow-brand-100/50 ring-1 ring-brand-400"
          : "border-[rgb(196_197_215/0.4)] bg-white/70 hover:shadow-md",
      )}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">
          Recommended
        </span>
      )}

      <div className="mb-4">
        <p className="text-base font-bold text-foreground">{name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{tagline}</p>
      </div>

      <div className="mb-5 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">/mo</span>
      </div>

      <ul className="mb-6 flex flex-col gap-2.5 flex-1">
        {features.map((f) => (
          <Feature key={f} text={f} />
        ))}
      </ul>

      <a
        href={LINKS.web}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ size: "sm" }),
          recommended
            ? "btn-figma-primary border-0 text-white shadow-none hover:opacity-95"
            : "bg-soft-accent text-brand-700 hover:bg-soft-accent-hover border-0 shadow-none",
          "w-full justify-center rounded-xl text-sm font-semibold",
        )}
      >
        {cta}
      </a>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function PricingPage() {
  const t = useTranslations("pricingPage");
  const locale = useLocale();

  const openSourceFeatures = [
    t("pathOpenSourceF1"),
    t("pathOpenSourceF2"),
    t("pathOpenSourceF3"),
    t("pathOpenSourceF4"),
  ];

  const platformFeatures = [
    t("pathPlatformF1"),
    t("pathPlatformF2"),
    t("pathPlatformF3"),
    t("pathPlatformF4"),
  ];

  const enterpriseFeatures = [
    t("pathEnterpriseF1"),
    t("pathEnterpriseF2"),
    t("pathEnterpriseF3"),
    t("pathEnterpriseF4"),
    t("pathEnterpriseF5"),
  ];

  const plans = [
    {
      id: "pro" as const,
      name: t("plans.pro.name"),
      tagline: t("plans.pro.tagline"),
      price: "€19.95",
      features: [
        t("plans.pro.feature1plain"),
        t("plans.pro.feature2"),
        t("plans.pro.feature3"),
        t("plans.pro.feature4"),
        t("plans.pro.feature5"),
      ],
      recommended: false,
      cta: t("selectPlan"),
    },
    {
      id: "team" as const,
      name: t("plans.team.name"),
      tagline: t("plans.team.tagline"),
      price: "€49.95",
      features: [
        t("plans.team.feature1"),
        t("plans.team.feature2"),
        t("plans.team.feature3"),
        t("plans.team.feature4"),
        t("plans.team.feature5"),
        t("plans.team.feature6"),
      ],
      recommended: true,
      cta: t("selectPlan"),
    },
    {
      id: "business" as const,
      name: t("plans.business.name"),
      tagline: t("plans.business.tagline"),
      price: "€99.95",
      features: [
        t("plans.business.feature1"),
        t("plans.business.feature2plain"),
        t("plans.business.feature3plain"),
        t("plans.business.feature4"),
        t("plans.business.feature5"),
        t("plans.business.feature6"),
        t("plans.business.feature7"),
      ],
      recommended: false,
      cta: t("selectPlan"),
    },
  ];

  return (
    <div className="min-h-screen bg-page-tint">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-[rgb(196_197_215/0.2)] bg-gradient-to-b from-background to-soft-accent/30">
        <div className="container-narrow section-padding py-14 md:py-20">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("breadcrumbHome")}
            </Link>
            <ChevronRight className="size-3.5 opacity-40" />
            <span className="font-medium text-foreground">{t("breadcrumbPricing")}</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-4 text-brand-700" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              {t("heroEyebrow")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
            {t("heroSubtitle")}
          </p>
        </div>
      </div>

      <div className="container-wide section-padding py-14 md:py-20 space-y-20">

        {/* ── Three deployment paths ──────────────────────────────────────── */}
        <motion.div {...fadeUp} className="grid gap-5 lg:grid-cols-3">

          {/* Open Source */}
          <div className="flex flex-col rounded-2xl border border-[rgb(196_197_215/0.4)] bg-white/80 p-7">
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-soft-accent">
              <GithubIcon className="size-5 text-foreground" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {t("pathOpenSourceTagline")}
            </p>
            <h2 className="text-2xl font-bold text-foreground">{t("pathOpenSourceTitle")}</h2>
            <div className="my-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {t("pathOpenSourcePrice")}
              </span>
              <span className="text-sm text-muted-foreground">{t("pathOpenSourcePriceSub")}</span>
            </div>
            <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
              {t("pathOpenSourceDesc")}
            </p>
            <ul className="mb-7 flex flex-col gap-2.5 flex-1">
              {openSourceFeatures.map((f) => (
                <Feature key={f} text={f} />
              ))}
            </ul>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-center gap-2 rounded-xl font-semibold",
              )}
            >
              <GithubIcon className="size-4" />
              {t("pathOpenSourceCta")}
            </a>
          </div>

          {/* Platform — featured */}
          <div className="relative flex flex-col rounded-2xl border-2 border-brand-500 bg-white p-7 shadow-xl shadow-brand-100/40 ring-1 ring-brand-500/20">
            <div className="absolute -top-3.5 left-7 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow">
              Popular
            </div>
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-brand-100">
              <Globe className="size-5 text-brand-700" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-1">
              {t("pathPlatformTagline")}
            </p>
            <h2 className="text-2xl font-bold text-foreground">{t("pathPlatformTitle")}</h2>
            <div className="my-4 flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">{t("pathPlatformFrom")}</span>
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {t("pathPlatformPrice")}
              </span>
              <span className="text-sm text-muted-foreground">{t("pathPlatformPriceSub")}</span>
            </div>
            <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
              {t("pathPlatformDesc")}
            </p>
            <ul className="mb-7 flex flex-col gap-2.5 flex-1">
              {platformFeatures.map((f) => (
                <Feature key={f} text={f} />
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <a
                href={LINKS.web}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "btn-figma-primary w-full justify-center gap-1.5 rounded-xl border-0 text-white shadow-none hover:opacity-95 font-semibold",
                )}
              >
                {t("pathPlatformCta")}
                <ArrowRight className="size-3.5" />
              </a>
              <a
                href="#platform-plans"
                className="text-center text-xs font-medium text-brand-600 hover:underline"
              >
                {t("pathPlatformSeeAll")}
              </a>
            </div>
          </div>

          {/* Enterprise */}
          <div className="relative flex flex-col rounded-2xl bg-gradient-to-br from-[#001256] to-[#002c92] p-7 text-white overflow-hidden">
            {/* Subtle grid texture */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative">
              <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-white/15">
                <Building2 className="size-5 text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
                {t("pathEnterpriseTagline")}
              </p>
              <h2 className="text-2xl font-bold text-white">{t("pathEnterpriseTitle")}</h2>
              <div className="my-4">
                <span className="text-xl font-bold text-white/90">
                  {t("pathEnterprisePrice")}
                </span>
              </div>
              <p className="mb-5 text-sm text-white/75 leading-relaxed">
                {t("pathEnterpriseDesc")}
              </p>
              <ul className="mb-7 flex flex-col gap-2.5 flex-1">
                {enterpriseFeatures.map((f) => (
                  <Feature key={f} text={f} light />
                ))}
              </ul>
              <a
                href={LINKS.appointment}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#001256] transition-opacity hover:opacity-90"
              >
                {t("pathEnterpriseCta")}
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Platform plan details ───────────────────────────────────────── */}
        <motion.section id="platform-plans" {...fadeUp}>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t("platformSectionTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
              {t("platformSectionSub")}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} {...plan} />
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground/60">
            {t("pageFootnote")}
          </p>
        </motion.section>

        {/* ── Included in every platform plan ────────────────────────────── */}
        <motion.section {...fadeUp}>
          <div className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-8 md:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                {t("includedTitle")}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("includedLead")}</p>
            </div>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {(["included1","included2","included3","included4","included5","included6"] as const).map((key) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <Check className="size-3 text-brand-700" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-foreground leading-snug">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <motion.section {...fadeUp}>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">{t("faqTitle")}</h2>
          </div>
          <div className="mx-auto max-w-2xl divide-y divide-[rgb(196_197_215/0.3)]">
            {(["faq1","faq2","faq3","faq4","faq5"] as const).map((key) => (
              <FaqItem key={key} q={t(`${key}Q`)} a={t(`${key}A`)} />
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

// ─── Simple inline FAQ accordion ─────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground">
        {q}
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-soft-accent text-muted-foreground transition-transform group-open:rotate-45">
          <ArrowRight className="size-3 rotate-[-45deg] group-open:rotate-0 transition-transform" />
        </span>
      </summary>
      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </details>
  );
}
