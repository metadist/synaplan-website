import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { StoreDownloadCards } from "@/components/app/store-download-cards";
import { LINKS } from "@/lib/constants";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquare,
  Smartphone,
  Mic,
} from "lucide-react";

const featureIcons = [Smartphone, MessageSquare, FileText, Mic] as const;

export async function AppLandingPage({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "appPage" });

  const features = [
    { icon: featureIcons[0], titleKey: "f1Title" as const, descKey: "f1Desc" as const },
    { icon: featureIcons[1], titleKey: "f2Title" as const, descKey: "f2Desc" as const },
    { icon: featureIcons[2], titleKey: "f3Title" as const, descKey: "f3Desc" as const },
    { icon: featureIcons[3], titleKey: "f4Title" as const, descKey: "f4Desc" as const },
  ];

  return (
    <SolutionArticleShell
      breadcrumbItems={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbPage") },
      ]}
    >
      <header className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 dark:border-brand-700 dark:bg-brand-950">
          <Smartphone className="size-3.5 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-200">
            {t("badge")}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {t("heroLead")}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {(["sameAccount", "gdpr", "germany"] as const).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-brand-600 dark:text-brand-400" />
              <span>{t(k)}</span>
            </div>
          ))}
        </div>
      </header>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-foreground">
          {t("storesTitle")}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
          {t("storesLead")}
        </p>
        <StoreDownloadCards locale={locale} />
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
          {t("featuresTitle")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950">
                <Icon className="size-5 text-brand-700 dark:text-brand-300" />
              </div>
              <h3 className="font-semibold text-foreground">{t(titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-3xl rounded-3xl bg-gradient-to-br from-[#002c92] to-[#1a4fc4] p-8 text-center text-white sm:p-10">
        <h2 className="text-2xl font-bold">{t("ctaTitle")}</h2>
        <p className="mt-3 text-base leading-relaxed text-white/80">{t("ctaBody")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={LINKS.web}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-[#002c92] transition-opacity hover:opacity-90 sm:w-auto"
          >
            {t("ctaWeb")}
            <ArrowRight className="size-4" />
          </a>
          <Link
            href="/support"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-8 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            {t("ctaSupport")}
          </Link>
        </div>
      </section>
    </SolutionArticleShell>
  );
}
