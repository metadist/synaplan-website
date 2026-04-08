import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { LINKS, USE_CASES } from "@/lib/constants";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Database,
  Euro,
  Globe,
  MessageSquare,
  Shield,
} from "lucide-react";

const featureIcons = [Bot, Database, BookOpen, Shield, Euro, MessageSquare] as const;

export async function CompaniesHubPage({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "companiesPage" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const features = [
    { icon: featureIcons[0], titleKey: "f1Title" as const, descKey: "f1Desc" as const },
    { icon: featureIcons[1], titleKey: "f2Title" as const, descKey: "f2Desc" as const },
    { icon: featureIcons[2], titleKey: "f3Title" as const, descKey: "f3Desc" as const },
    { icon: featureIcons[3], titleKey: "f4Title" as const, descKey: "f4Desc" as const },
    { icon: featureIcons[4], titleKey: "f5Title" as const, descKey: "f5Desc" as const },
    { icon: featureIcons[5], titleKey: "f6Title" as const, descKey: "f6Desc" as const },
  ];

  return (
    <SolutionArticleShell
      breadcrumbItems={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbCompanies") },
      ]}
    >
      {/* Hero */}
      <header className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
          <Globe className="size-3.5 text-brand-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            {t("badge")}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {t("heroLead")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={LINKS.web}
            className="btn-figma-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)] sm:w-auto"
          >
            {t("ctaPrimary")}
            <ArrowRight className="size-4" />
          </a>
          <a
            href={LINKS.whatsappDE}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#002c92]/25 bg-soft-accent px-8 text-base font-semibold text-[#002c92] transition-colors hover:bg-soft-accent-hover sm:w-auto"
          >
            {t("ctaSecondary")}
          </a>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {(["openSource", "gdpr", "germany"] as const).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#002c92]" />
              <span>{t(k)}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Features grid */}
      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
          {t("featuresTitle")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="flex flex-col gap-3 rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/70 p-6 shadow-sm"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50">
                <Icon className="size-5 text-brand-700" />
              </div>
              <h3 className="font-semibold text-foreground">{t(titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto mt-14 max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
          {t("useCasesTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {USE_CASES.map((uc) => (
            <div
              key={uc.company}
              className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/70 p-6"
            >
              <p className="text-sm font-semibold text-brand-700">{uc.company}</p>
              <p className="mt-2 font-medium italic text-foreground">
                &ldquo;{locale === "de" ? uc.quoteDE : uc.quote}&rdquo;
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "de" ? uc.descriptionDE : uc.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto mt-14 max-w-3xl rounded-3xl bg-gradient-to-br from-[#002c92] to-[#1a4fc4] p-8 text-center text-white sm:p-10">
        <h2 className="text-2xl font-bold">{t("ctaBannerTitle")}</h2>
        <p className="mt-3 text-base leading-relaxed text-white/80">
          {t("ctaBannerBody")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={LINKS.web}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-[#002c92] transition-opacity hover:opacity-90 sm:w-auto"
          >
            {tc("startForFree")}
            <ArrowRight className="size-4" />
          </a>
          <a
            href={LINKS.whatsappDE}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-8 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            {tc("bookDemo")}
          </a>
        </div>
      </section>
    </SolutionArticleShell>
  );
}
