"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";

export function ChatWidgetCustomersPage() {
  const t = useTranslations("chatWidget");

  return (
    <SolutionArticleShell
      breadcrumbItems={[
        { label: t("hub.breadcrumbHome"), href: "/" },
        { label: t("hub.breadcrumbChatWidget"), href: "/solutions/chat-widget" },
        { label: t("customers.breadcrumbCurrent") },
      ]}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(480px,50vh)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(0_44_146/0.12),transparent)]"
        aria-hidden
      />

      <header className="relative mx-auto max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {t("customers.heroTitle")}
        </motion.h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {t("customers.heroLead")}
        </p>
      </header>

      <div className="relative mx-auto mt-10 max-w-3xl">
        <div className="flex flex-col gap-6 rounded-3xl border border-[rgb(196_197_215/0.4)] bg-gradient-to-br from-page-tint/80 to-soft-accent/30 p-6 shadow-sm sm:p-8">
          <p className="leading-relaxed text-muted-foreground">
            {t("customers.introP1")}
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {t("customers.introP2")}
          </p>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto mt-14 max-w-5xl"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgb(0_44_146/0.1)] bg-gradient-to-b from-white/90 to-soft-accent/25 p-6 shadow-[0_24px_48px_-28px_rgb(0_44_146/0.15)] sm:p-10">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#002c92]/15 bg-[#002c92]/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#002c92]">
              <Sparkles className="size-3.5" aria-hidden />
              {t("customers.megaherzSpotlightBadge")}
            </span>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("customers.story1Company")}
            </h2>
            <span className="text-xs font-medium uppercase tracking-wide text-[#002c92]/80">
              {t("customers.story1Role")}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <figure className="group space-y-3">
              <div className="overflow-hidden rounded-2xl border border-[rgb(196_197_215/0.45)] bg-[rgb(255_255_255/0.8)] shadow-[0_12px_32px_-16px_rgb(0_0_0/0.12)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Image
                  src="/megaherz_yoga_preview.png"
                  alt={t("customers.megaherzSiteAlt")}
                  width={1200}
                  height={720}
                  className="h-auto w-full object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="text-center text-xs font-medium text-muted-foreground">
                {t("customers.megaherzSiteCaption")}
              </figcaption>
            </figure>
            <figure className="group space-y-3">
              <div className="overflow-hidden rounded-2xl border border-[rgb(196_197_215/0.45)] bg-[rgb(255_255_255/0.8)] shadow-[0_12px_32px_-16px_rgb(0_0_0/0.12)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Image
                  src="/chatwidget_megaherz_yoga_preview.png"
                  alt={t("customers.megaherzWidgetAlt")}
                  width={800}
                  height={900}
                  className="h-auto w-full object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="text-center text-xs font-medium text-muted-foreground">
                {t("customers.megaherzWidgetCaption")}
              </figcaption>
            </figure>
          </div>

          <blockquote className="mt-8 flex gap-3 border-l-4 border-[#002c92]/25 pl-4 text-base italic text-foreground/90 sm:text-lg">
            <Quote
              className="size-5 shrink-0 text-[#002c92]/50"
              strokeWidth={1.5}
              aria-hidden
            />
            {t("customers.story1Quote")}
          </blockquote>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {t("customers.story1Body")}
          </p>
        </div>
      </motion.section>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:gap-8">
        {[2, 3, 4].map((n) => (
          <motion.article
            key={n}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-32px" }}
            transition={{ duration: 0.4, delay: (n - 2) * 0.05 }}
            className="rounded-3xl border border-[rgb(196_197_215/0.35)] bg-[rgb(255_255_255/0.65)] p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {t(`customers.story${n}Company`)}
              </h2>
              <span className="text-xs font-medium uppercase tracking-wide text-[#002c92]/80">
                {t(`customers.story${n}Role`)}
              </span>
            </div>
            <blockquote className="mt-4 flex gap-3 text-base italic text-foreground/90">
              <Quote
                className="size-5 shrink-0 text-[#002c92]/50"
                strokeWidth={1.5}
                aria-hidden
              />
              {t(`customers.story${n}Quote`)}
            </blockquote>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t(`customers.story${n}Body`)}
            </p>
          </motion.article>
        ))}
      </div>
    </SolutionArticleShell>
  );
}
