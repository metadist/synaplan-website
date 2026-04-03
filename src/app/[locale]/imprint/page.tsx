import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Building2,
  Copyright,
  ExternalLink,
  Mail,
  Phone,
  Scale,
  Shield,
  User,
} from "lucide-react";
import { canonicalUrl, alternateLanguageUrls } from "@/lib/seo";

const PATH = "/imprint";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imprint" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <Icon className="size-4 text-brand-700" />
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3 pl-12">{children}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:w-40">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "imprint" });

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
          <div className="flex items-center gap-2 mb-4">
            <Scale className="size-4 text-brand-700" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              § 5 TMG
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {t("pageSubtitle")}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-narrow section-padding py-12 md:py-16">
        <div className="grid gap-5 sm:grid-cols-2">

          {/* Company */}
          <Card icon={Building2} title={t("companyTitle")}>
            <DataRow label={t("addressLabel")} value={
              <span>
                {t("companyName")}<br />
                Königsallee 82<br />
                40212 Düsseldorf<br />
                Germany
              </span>
            } />
          </Card>

          {/* Contact */}
          <Card icon={Mail} title={t("contactTitle")}>
            <DataRow
              label={t("emailLabel")}
              value={
                <a
                  href="mailto:team@synaplan.com"
                  className="font-medium text-brand-700 hover:underline inline-flex items-center gap-1"
                >
                  team@synaplan.com
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              }
            />
            <DataRow
              label={t("phoneLabel")}
              value={
                <a
                  href="tel:+4921190760084"
                  className="font-medium text-brand-700 hover:underline inline-flex items-center gap-1"
                >
                  {t("phone")}
                  <Phone className="size-3 opacity-60" />
                </a>
              }
            />
          </Card>

          {/* Management */}
          <Card icon={User} title={t("managementTitle")}>
            <DataRow label={t("ceoLabel")} value={t("ceo")} />
          </Card>

          {/* Register */}
          <Card icon={Shield} title={t("registerTitle")}>
            <DataRow label={t("registerLabel")} value={t("registerCourt")} />
            <DataRow label="HRB" value={t("registerNumber")} />
            <DataRow label={t("taxLabel")} value={t("taxId")} />
          </Card>

          {/* Disclaimer */}
          <div className="sm:col-span-2 rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Scale className="size-4 text-brand-700" />
              </span>
              <h2 className="text-base font-semibold text-foreground">{t("disclaimerTitle")}</h2>
            </div>
            <p className="pl-12 text-sm text-muted-foreground leading-relaxed">
              {t("disclaimerBody")}
            </p>
          </div>

          {/* Copyright */}
          <div className="sm:col-span-2 rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Copyright className="size-4 text-brand-700" />
              </span>
              <h2 className="text-base font-semibold text-foreground">{t("copyrightTitle")}</h2>
            </div>
            <p className="pl-12 text-sm text-muted-foreground leading-relaxed">
              {t("copyrightBody")}
            </p>
          </div>

        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            → {locale === "de" ? "Zur Datenschutzerklärung" : "View privacy policy"}
          </Link>
        </div>
      </div>
    </div>
  );
}
