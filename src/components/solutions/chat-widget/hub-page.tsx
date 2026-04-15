import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChatWidgetHubLanding } from "@/components/solutions/chat-widget/chat-widget-hub-landing";

export async function ChatWidgetHubPage({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "chatWidget" });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((n) => ({
      "@type": "Question",
      name: t(`hub.faq${n}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`hub.faq${n}A`),
      },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("hub.heroTitle"),
    description: t("hub.metaDescription"),
    serviceType: "AI chat widget for websites",
    provider: {
      "@type": "Organization",
      name: "Synaplan",
      url: "https://www.synaplan.com",
    },
    areaServed: {
      "@type": "Place",
      name: "European Union",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: "19.95",
      description: t("hub.pricingHighlight"),
      url: "https://www.synaplan.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <div className="min-h-screen">
        <div className="container-wide section-padding border-b border-[rgb(196_197_215/0.12)] bg-page-tint/30 pb-4 pt-6 sm:pt-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              {t("hub.breadcrumbHome")}
            </Link>
            <span className="text-muted-foreground/50" aria-hidden>
              /
            </span>
            <span className="font-medium text-foreground">
              {t("hub.breadcrumbChatWidget")}
            </span>
          </nav>
        </div>
        <ChatWidgetHubLanding />
      </div>
    </>
  );
}
