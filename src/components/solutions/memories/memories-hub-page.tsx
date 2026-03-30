import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SolutionArticleShell } from "@/components/solutions/solution-article-shell";
import { MemoriesNeuralPreview } from "@/components/interactive/memories-neural-preview";
import { LINKS } from "@/lib/constants";
import { ArrowRight, BookOpen } from "lucide-react";

export async function MemoriesHubPage({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "memoriesSection" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <SolutionArticleShell
      breadcrumbItems={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbMemories") },
      ]}
    >
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {t("pageLead")}
        </p>
      </header>

      <div className="relative mx-auto mt-12 max-w-4xl">
        <MemoriesNeuralPreview />
      </div>

      <section className="mx-auto mt-14 max-w-3xl rounded-3xl border border-[rgb(196_197_215/0.35)] bg-[rgb(255_255_255/0.65)] p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">
          {t("pageSection1Title")}
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {t("pageSection1Body")}
        </p>
      </section>

      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href={LINKS.web}
          className="btn-figma-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 px-8 text-base font-medium text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)] sm:w-auto"
        >
          {tc("startForFree")}
          <ArrowRight className="size-4" />
        </a>
        <a
          href={LINKS.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#002c92]/25 bg-[#f6e3f3] px-8 text-base font-semibold text-[#002c92] transition-colors hover:bg-[#edd8ea] sm:w-auto"
        >
          <BookOpen className="size-4" />
          {t("pageCtaSecondary")}
        </a>
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="font-medium text-[#002c92] underline-offset-4 hover:underline"
        >
          ← {t("breadcrumbHome")}
        </Link>
      </p>
    </SolutionArticleShell>
  );
}
