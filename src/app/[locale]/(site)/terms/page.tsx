import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ShieldCheck } from "lucide-react";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";

const PATH = "/terms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsOfUse" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

type Section = { title: string; body: string[] };

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "termsOfUse" });
  const sections = t.raw("sections") as Section[];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-[rgb(196_197_215/0.2)] bg-gradient-to-b from-background to-soft-accent/30">
        <div className="container-narrow section-padding py-14 md:py-20">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("breadcrumbHome")}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-medium text-foreground">{t("pageTitle")}</span>
          </nav>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-700" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {t("pageSubtitle")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-narrow section-padding py-12 md:py-16">
        <div className="space-y-10">
          {sections.map((section, i) => (
            <section key={section.title} className="scroll-mt-24">
              <h2 className="flex items-baseline gap-3 text-lg font-semibold text-foreground">
                <span className="text-brand-700">{i + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 pl-7">
                {section.body.map((paragraph, j) => (
                  <p
                    key={`${i}-${j}`}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            → {t("linkPrivacy")}
          </Link>
          <Link
            href="/imprint"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            → {t("linkImprint")}
          </Link>
        </div>
      </div>
    </div>
  );
}
