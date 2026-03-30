"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  HelpCircle,
  LayoutGrid,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type PlanId = "pro" | "team" | "business";

const PLAN_ORDER: { id: PlanId; recommended: boolean; featureKeys: string[] }[] =
  [
    {
      id: "pro",
      recommended: false,
      featureKeys: [
        "feature1",
        "feature2",
        "feature3",
        "feature4",
        "feature5",
      ],
    },
    {
      id: "team",
      recommended: true,
      featureKeys: [
        "feature1",
        "feature2",
        "feature3",
        "feature4",
        "feature5",
        "feature6",
      ],
    },
    {
      id: "business",
      recommended: false,
      featureKeys: [
        "feature1",
        "feature2",
        "feature3",
        "feature4",
        "feature5",
        "feature6",
        "feature7",
      ],
    },
  ];

const COMPARE_KEYS = [
  "messages",
  "images",
  "storage",
  "video",
  "api",
  "collab",
  "whiteLabel",
  "support",
] as const;

const INCLUDED_KEYS = [
  "included1",
  "included2",
  "included3",
  "included4",
  "included5",
  "included6",
] as const;

const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.45 },
};

function FairUseInline({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const t = useTranslations("pricingPage");
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group inline-flex items-center gap-1.5 rounded-full border border-[#002c92]/20 bg-[#f6e3f3]/80 px-3 py-1 text-xs font-semibold text-[#002c92] shadow-sm transition hover:border-[#002c92]/35 hover:bg-[#f6e3f3]"
    >
      <HelpCircle className="size-3.5 opacity-80" aria-hidden />
      {t("fairUseCta")}
    </button>
  );
}

export function PricingPage() {
  const t = useTranslations("pricingPage");
  const [fairUseOpen, setFairUseOpen] = useState(false);

  const fu = (chunks: ReactNode) => (
    <button
      type="button"
      onClick={() => setFairUseOpen(true)}
      className="font-semibold text-[#002c92] underline decoration-[#002c92]/35 underline-offset-[0.2em] transition hover:decoration-[#002c92]"
    >
      {chunks}
    </button>
  );

  return (
    <div className="relative overflow-hidden bg-[#fff7fa]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 size-[28rem] rounded-full bg-[#002c92]/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/3 size-[22rem] rounded-full bg-[#003fc7]/18 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 left-1/3 size-72 rounded-full bg-[#f6e3f3]/80 blur-[70px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,44,146,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,44,146,0.05) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      <Dialog open={fairUseOpen} onOpenChange={setFairUseOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogTitle>{t("fairUseDialogTitle")}</DialogTitle>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground/90">
              {t("fairUseDialogLead")}
            </p>
            <p>{t("fairUseDialogP1")}</p>
            <p>{t("fairUseDialogP2")}</p>
            <p>{t("fairUseDialogP3")}</p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container-wide section-padding relative z-10 pb-24 pt-10 md:pb-32 md:pt-14">
        <nav
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-[#434654]"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition hover:text-[#002c92]">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="size-4 opacity-50" aria-hidden />
          <span className="font-medium text-[#221823]">
            {t("breadcrumbPricing")}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f6e3f3] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#002c92]">
            <Sparkles className="size-3.5" aria-hidden />
            {t("heroEyebrow")}
          </div>
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-[#221823] sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#434654]">
            {t("heroSubtitle")}
          </p>
          <div className="mt-6 flex justify-center">
            <FairUseInline onOpen={() => setFairUseOpen(true)} />
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.section {...fadeUp} className="mx-auto mt-16 max-w-3xl md:mt-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#221823] sm:text-3xl">
            {t("narrativeTitle")}
          </h2>
          <p className="mt-4 text-pretty text-center text-base leading-relaxed text-[#434654]">
            {t("narrativeP1")}
          </p>
          <p className="mt-4 text-pretty text-center text-base leading-relaxed text-[#434654]">
            {t("narrativeP2")}
          </p>
        </motion.section>

        {/* Value pillars */}
        <motion.div
          {...fadeUp}
          className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-3 sm:gap-6"
        >
          {(
            [
              { icon: TrendingUp, titleKey: "value1Title", bodyKey: "value1Body" },
              { icon: Shield, titleKey: "value2Title", bodyKey: "value2Body" },
              { icon: LayoutGrid, titleKey: "value3Title", bodyKey: "value3Body" },
            ] as const
          ).map((item) => (
            <div
              key={item.titleKey}
              className="rounded-[1.75rem] border border-[rgb(196_197_215/0.2)] bg-white/70 p-6 shadow-[0_12px_40px_-20px_rgba(0,44,146,0.12)] backdrop-blur-sm transition hover:border-[#002c92]/15 hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#002c92] to-[#003fc7] text-white shadow-sm">
                <item.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#221823]">
                {t(item.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#434654]">
                {t(item.bodyKey)}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Plan cards */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:mt-20 lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {PLAN_ORDER.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.06 * index }}
              className={cn(
                "relative flex flex-col rounded-[2rem] border bg-white/85 p-8 shadow-[0_25px_50px_-12px_rgba(0,44,146,0.08)] backdrop-blur-md",
                plan.recommended
                  ? "border-[#002c92]/35 ring-2 ring-[#002c92]/25 lg:-translate-y-1 lg:scale-[1.02] lg:p-9"
                  : "border-[rgb(196_197_215/0.18)]",
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge className="border-0 bg-gradient-to-r from-[#002c92] to-[#003fc7] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    {t("recommended")}
                  </Badge>
                </div>
              )}

              <div className="mb-5 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#747686]">
                  {t(`plans.${plan.id}.name`)}
                </p>
                <p className="mt-3 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold tabular-nums text-[#221823] sm:text-5xl">
                    {t(`plans.${plan.id}.price`)}
                  </span>
                  <span className="text-base font-medium text-[#747686]">
                    {t("perMonth")}
                  </span>
                </p>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-[#434654]">
                  {t(`plans.${plan.id}.tagline`)}
                </p>
              </div>

              <ul className="flex flex-1 flex-col gap-3.5">
                {plan.featureKeys.map((key) => (
                  <li
                    key={key}
                    className="flex gap-3 text-left text-sm leading-snug text-[#434654]"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#dce1ff]/80 text-[#002c92]">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="min-w-0 pt-0.5">
                      {t.rich(`plans.${plan.id}.${key}`, { fu })}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={LINKS.app}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "btn-figma-primary mt-8 w-full gap-2 rounded-xl border-0 py-6 text-base font-semibold text-white shadow-none",
                  !plan.recommended && "opacity-95 hover:opacity-100",
                )}
              >
                {t("selectPlan")}
                <ArrowRight className="size-4" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mx-auto mt-12 max-w-xl text-center text-sm text-[#747686]"
        >
          <button
            type="button"
            onClick={() => setFairUseOpen(true)}
            className="font-medium text-[#002c92] underline decoration-[#002c92]/30 underline-offset-4 hover:decoration-[#002c92]/60"
          >
            {t("fairUseCta")}
          </button>
        </motion.p>

        {/* Comparison table */}
        <motion.section {...fadeUp} className="mx-auto mt-20 max-w-5xl lg:mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#221823] sm:text-3xl">
              {t("compareTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-[#434654] sm:text-base">
              {t("compareSubtitle")}
            </p>
          </div>
          <div className="mt-10 overflow-x-auto rounded-[1.75rem] border border-[rgb(196_197_215/0.2)] bg-white/80 shadow-[0_20px_50px_-24px_rgba(0,44,146,0.12)] backdrop-blur-sm">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[rgb(196_197_215/0.25)] bg-[#f6e3f3]/40">
                  <th className="px-5 py-4 font-semibold text-[#221823] sm:px-6">
                    {/* feature column */}
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-[#002c92]">
                    {t("compareColPro")}
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-[#002c92]">
                    {t("compareColTeam")}
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-[#002c92]">
                    {t("compareColBusiness")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_KEYS.map((key, i) => (
                  <tr
                    key={key}
                    className={cn(
                      "border-b border-[rgb(196_197_215/0.12)] transition hover:bg-[#fff7fa]/80",
                      i % 2 === 1 && "bg-white/50",
                    )}
                  >
                    <td className="px-5 py-3.5 font-medium text-[#221823] sm:px-6">
                      {t(`compare.${key}.label`)}
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-[#434654]">
                      {t(`compare.${key}.pro`)}
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-[#434654]">
                      {t(`compare.${key}.team`)}
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-[#434654]">
                      {t(`compare.${key}.business`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Included everywhere */}
        <motion.section {...fadeUp} className="mx-auto mt-20 max-w-5xl lg:mt-24">
          <div className="rounded-[2rem] border border-[rgb(196_197_215/0.18)] bg-gradient-to-b from-white/90 to-[#fff7fa]/90 p-8 shadow-inner sm:p-10">
            <h2 className="text-center text-2xl font-bold tracking-tight text-[#221823] sm:text-3xl">
              {t("includedTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-sm leading-relaxed text-[#434654] sm:text-base">
              {t("includedLead")}
            </p>
            <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:gap-5">
              {INCLUDED_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 rounded-2xl border border-[rgb(196_197_215/0.12)] bg-white/70 px-4 py-3.5 sm:px-5"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl bg-[#dce1ff]/90 text-[#002c92]">
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-[#434654]">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section {...fadeUp} className="mx-auto mt-20 max-w-3xl lg:mt-24">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#221823] sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <Accordion className="mt-10 rounded-[1.75rem] border border-[rgb(196_197_215/0.2)] bg-white/75 px-4 py-2 backdrop-blur-sm sm:px-6">
            {FAQ_KEYS.map((id) => (
              <AccordionItem key={id} value={id} className="border-[rgb(196_197_215/0.15)]">
                <AccordionTrigger className="py-4 text-base font-semibold text-[#221823] hover:no-underline">
                  {t(`${id}Q`)}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-[#434654]">
                  {t(`${id}A`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        {/* Enterprise CTA */}
        <motion.section
          {...fadeUp}
          className="relative mx-auto mt-20 max-w-5xl overflow-hidden rounded-[2.5rem] p-10 text-center sm:p-14 lg:mt-24"
        >
          <div className="absolute inset-0 gradient-brand" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_oklch(0.55_0.19_280_/_0.25),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_white/10,_transparent_45%)]" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t("enterpriseTitle")}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/85">
              {t("enterpriseLead")}
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/appointment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 border-transparent bg-white px-8 text-base font-semibold text-brand-700 shadow-xl hover:bg-white/95",
                )}
              >
                {t("enterpriseCtaDemo")}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={LINKS.web}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/40 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20",
                )}
              >
                {t("enterpriseCtaStart")}
              </a>
            </div>
            <p className="mt-8 text-pretty text-sm leading-relaxed text-white/75">
              {t("enterpriseFootnote")}{" "}
              <a
                href={LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                <BookOpen className="mb-0.5 mr-1 inline size-3.5" aria-hidden />
                docs.synaplan.com
              </a>
            </p>
          </div>
        </motion.section>

        <motion.p
          {...fadeUp}
          className="mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed text-[#747686]"
        >
          {t("pageFootnote")}
        </motion.p>
      </div>
    </div>
  );
}
