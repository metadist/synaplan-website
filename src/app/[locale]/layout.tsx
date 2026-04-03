import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionPerformanceProvider } from "@/contexts/motion-performance-context";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/jsonld";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("title"),
      template: `%s | Synaplan`,
    },
    description: t("description"),
    // metadataBase ensures relative URLs in page-level metadata resolve to the
    // production domain, not the dev-server host (localhost) — this is what
    // caused the "canonical points to localhost" Lighthouse SEO warning.
    metadataBase: new URL("https://synaplan.com"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Synaplan",
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    // Do NOT set alternates here — every page sets its own canonical + hreflang.
    // Setting it in the layout causes Next.js to output conflicting <link> tags
    // which Lighthouse flags as "canonical points to another hreflang location".
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "de")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const orgSchema = buildOrganizationSchema();
  const siteSchema = buildWebSiteSchema(locale);

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Global structured data — injected on every page for E-E-A-T trust */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [orgSchema, siteSchema],
            }),
          }}
        />
      </head>
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionPerformanceProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </MotionPerformanceProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
