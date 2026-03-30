"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LINKS } from "@/lib/constants";
import { FloatingOrbs } from "@/components/interactive/floating-orbs";
import { ChatWidgetLandingDemo } from "@/components/solutions/chat-widget/chat-widget-landing-demo";
import { ChatWidgetHubUseCaseCards } from "@/components/solutions/chat-widget/hub-use-case-cards";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  Layers,
  Link2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const painIcons = [Zap, Layers, Sparkles] as const;
const benefitIcons = [CheckCircle2, Globe, Link2] as const;
const stepNums = [1, 2, 3, 4] as const;

export function ChatWidgetHubLanding() {
  const t = useTranslations("chatWidget");
  const tc = useTranslations("common");

  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-[rgb(196_197_215/0.2)] pb-16 pt-6 sm:pb-24 sm:pt-8">
        <FloatingOrbs />
        <div className="container-wide section-padding relative z-10">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
              <Badge
                variant="secondary"
                className="mb-5 gap-2 rounded-full border-0 bg-[#f6e3f3] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#002c92]"
              >
                <span className="text-[10px] leading-none" aria-hidden>
                  ●
                </span>
                {t("hub.landingHeroBadge")}
              </Badge>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[2.75rem] lg:leading-[1.08]">
                {t("hub.heroTitle")}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t("hub.heroLead")}
              </p>
              <p className="mt-3 max-w-xl rounded-2xl border border-[#002c92]/15 bg-[#002c92]/[0.04] px-4 py-3 text-center text-sm font-medium text-[#002c92] lg:text-left">
                {t("hub.pricingHighlight")}
              </p>
              <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <a
                  href={LINKS.web}
                  className="btn-figma-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)]"
                >
                  {tc("startForFree")}
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href={LINKS.appointment}
                  className="inline-flex h-12 items-center justify-center rounded-xl border-0 bg-[#f6e3f3] px-8 text-base font-bold text-[#002c92] transition-colors hover:bg-[#edd8ea]"
                >
                  {tc("bookDemo")}
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-[#002c92]" />
                  <span>{tc("openSource")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-[#002c92]" />
                  <span>{tc("gdprCompliant")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-[#002c92]" />
                  <span>{tc("madeInGermany")}</span>
                </div>
              </div>
              <a
                href={`${LINKS.docs}?utm_source=site&utm_medium=chat-widget-landing`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#002c92] underline-offset-4 hover:underline"
              >
                <BookOpen className="size-4 shrink-0" />
                {t("hub.docsCtaLabel")}
              </a>
            </div>
            <div className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0 lg:max-w-none">
              <p className="mb-3 text-center text-xs font-medium text-muted-foreground lg:text-left">
                {t("hub.demoCaption")}
              </p>
              <ChatWidgetLandingDemo scenario="hub" />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cw-stats"
        className="border-b border-[rgb(196_197_215/0.15)] bg-gradient-to-b from-[#fff7fa]/80 to-background py-14 sm:py-16"
      >
        <div className="container-wide section-padding">
          <h2
            id="cw-stats"
            className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t("hub.landingStatsTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
            {t("hub.landingStatsSubtitle")}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: n * 0.05 }}
                className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-[rgb(255_255_255/0.7)] p-5 text-center shadow-sm"
              >
                <p className="text-2xl font-bold text-[#002c92]">
                  {t(`hub.stat${n}Value`)}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {t(`hub.stat${n}Label`)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t(`hub.stat${n}Desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="cw-steps">
        <div className="container-wide section-padding">
          <h2
            id="cw-steps"
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t("hub.stepSectionTitle")}
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stepNums.map((n) => (
              <div
                key={n}
                className="relative rounded-2xl border border-[rgb(196_197_215/0.35)] bg-[rgb(255_255_255/0.65)] p-5"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-[#002c92] text-sm font-bold text-white">
                  {n}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {t(`hub.step${n}Title`)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t(`hub.step${n}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-y border-[rgb(196_197_215/0.15)] bg-[#fff7fa]/40 py-14 sm:py-20"
        aria-labelledby="cw-pain"
      >
        <div className="container-wide section-padding">
          <h2
            id="cw-pain"
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t("hub.painSectionTitle")}
          </h2>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const Icon = painIcons[i]!;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-amber-200/50 bg-amber-50/50 p-5"
                >
                  <Icon className="size-6 text-amber-800/80" strokeWidth={1.75} />
                  <h3 className="mt-3 text-base font-semibold text-foreground">
                    {t(`hub.pain${i + 1}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`hub.pain${i + 1}Desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="cw-benefits">
        <div className="container-wide section-padding">
          <h2
            id="cw-benefits"
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t("hub.benefitSectionTitle")}
          </h2>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const Icon = benefitIcons[i]!;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-[#002c92]/15 bg-gradient-to-br from-white to-[#f6e3f3]/40 p-5 shadow-sm"
                >
                  <Icon className="size-6 text-[#002c92]" strokeWidth={1.75} />
                  <h3 className="mt-3 text-base font-semibold text-foreground">
                    {t(`hub.benefit${i + 1}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`hub.benefit${i + 1}Desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[rgb(196_197_215/0.15)] bg-background py-12 sm:py-16">
        <div className="container-wide section-padding">
          <div className="mx-auto max-w-3xl rounded-3xl border border-[rgb(196_197_215/0.35)] bg-[rgb(255_255_255/0.6)] p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("hub.midCtaTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("hub.midCtaLead")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={LINKS.web}
                className="btn-figma-primary inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-0 px-6 text-sm font-semibold text-white sm:flex-initial"
              >
                {tc("startForFree")}
                <ArrowRight className="size-4" />
              </a>
              <a
                href={LINKS.appointment}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#f6e3f3] px-6 text-sm font-bold text-[#002c92] hover:bg-[#edd8ea] sm:flex-initial"
              >
                {tc("bookDemo")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-[rgb(196_197_215/0.15)] py-14 sm:py-20"
        aria-labelledby="cw-explore"
      >
        <div className="container-wide section-padding">
          <h2
            id="cw-explore"
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t("hub.sectionExploreTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            {t("hub.sectionExploreLead")}
          </p>
          <ChatWidgetHubUseCaseCards />
        </div>
      </section>

      <section
        className="border-t border-[rgb(196_197_215/0.15)] bg-gradient-to-b from-background to-[#fff7fa]/50 py-14 sm:py-20"
        aria-labelledby="cw-faq"
      >
        <div className="container-wide section-padding">
          <h2
            id="cw-faq"
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t("hub.faqTitle")}
          </h2>
          <Accordion className="mx-auto mt-8 w-full max-w-3xl">
            {[1, 2, 3, 4].map((n) => (
              <AccordionItem key={n} value={`faq-${n}`}>
                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                  {t(`hub.faq${n}Q`)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{t(`hub.faq${n}A`)}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-[rgb(196_197_215/0.15)] pb-20 pt-14">
        <div className="container-wide section-padding">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-[#002c92]/15 bg-gradient-to-br from-[#002c92]/8 via-transparent to-[#f6e3f3]/40 px-6 py-12 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {t("hub.bottomCtaTitle")}
            </h2>
            <p className="max-w-lg text-muted-foreground">{t("hub.bottomCtaLead")}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={LINKS.web}
                className="btn-figma-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white"
              >
                {tc("startForFree")}
                <ArrowRight className="size-4" />
              </a>
              <a
                href={LINKS.appointment}
                className="inline-flex h-11 items-center justify-center rounded-xl border-0 bg-[#f6e3f3] px-8 text-base font-semibold text-[#002c92] transition-colors hover:bg-[#edd8ea]"
              >
                {tc("bookDemo")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
