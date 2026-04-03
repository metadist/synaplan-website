"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LINKS } from "@/lib/constants";
import { ChatWidgetLandingDemo } from "@/components/solutions/chat-widget/chat-widget-landing-demo";
import { FloatingOrbs } from "@/components/interactive/floating-orbs";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Globe,
  Shield,
  Wrench,
} from "lucide-react";

export type IndustrySlug = "trades" | "hospitality";

const slugIcon = {
  trades: Wrench,
  hospitality: Building2,
} as const;

export function ChatWidgetIndustryLanding({ slug }: { slug: IndustrySlug }) {
  const t = useTranslations("chatWidget");
  const tc = useTranslations("common");
  const p = `${slug}.` as const;
  const Icon = slugIcon[slug];

  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-[rgb(196_197_215/0.2)] pb-16 pt-2 sm:pb-20">
        <FloatingOrbs />
        <div className="container-wide section-padding relative z-10">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
              <Badge
                variant="secondary"
                className="mb-5 gap-2 rounded-full border-0 bg-soft-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#002c92]"
              >
                <Icon className="size-3.5" aria-hidden />
                {t(`${p}landingHeroBadge`)}
              </Badge>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[2.65rem] lg:leading-[1.08]">
                {t(`${p}heroTitle`)}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t(`${p}heroLead`)}
              </p>
              <p className="mt-4 max-w-xl rounded-2xl border border-[#002c92]/15 bg-[#002c92]/[0.04] px-4 py-3 text-sm font-medium text-[#002c92]">
                {t(`${p}landingCtaHint`)}
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
                  className="inline-flex h-12 items-center justify-center rounded-xl border-0 bg-soft-accent px-8 text-base font-bold text-[#002c92] transition-colors hover:bg-soft-accent-hover"
                >
                  {tc("bookDemo")}
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
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
                href={`${LINKS.docs}?utm_source=site&utm_medium=chat-widget-${slug}`}
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
                {t(`${p}demoCaption`)}
              </p>
              <ChatWidgetLandingDemo scenario={slug} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="ind-story">
        <div className="container-wide section-padding">
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2
                id="ind-story"
                className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
              >
                {t(`${p}section1Title`)}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(`${p}section1Body`)}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t(`${p}section2Title`)}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(`${p}section2Body`)}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t(`${p}section3Title`)}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(`${p}section3Body`)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-[rgb(196_197_215/0.15)] bg-page-tint/40 py-14 sm:py-16"
        aria-labelledby="ind-pain"
      >
        <div className="container-wide section-padding">
          <h2
            id="ind-pain"
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t(`${p}painSectionTitle`)}
          </h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/70 p-5"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {t(`${p}pain${n}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${p}pain${n}Desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16" aria-labelledby="ind-benefit">
        <div className="container-wide section-padding">
          <h2
            id="ind-benefit"
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t(`${p}benefitSectionTitle`)}
          </h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#002c92]/15 bg-gradient-to-br from-white to-soft-accent/35 p-5"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {t(`${p}benefit${n}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${p}benefit${n}Desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[rgb(196_197_215/0.15)] pb-20 pt-12">
        <div className="container-wide section-padding">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-[#002c92]/15 bg-gradient-to-br from-[#002c92]/8 via-transparent to-soft-accent/40 px-6 py-10 text-center">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              {t(`${p}bottomCtaTitle`)}
            </h2>
            <p className="max-w-lg text-muted-foreground">{t(`${p}bottomCtaLead`)}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <a
                href={LINKS.web}
                className="btn-figma-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white"
              >
                {tc("startForFree")}
                <ArrowRight className="size-4" />
              </a>
              <Link
                href="/solutions/chat-widget"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#002c92]/25 bg-white px-8 text-sm font-semibold text-[#002c92] hover:bg-[#002c92]/5"
              >
                {t("hub.breadcrumbChatWidget")}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
