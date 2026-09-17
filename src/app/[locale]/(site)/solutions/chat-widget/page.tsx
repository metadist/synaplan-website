import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChatWidgetHubPage } from "@/components/solutions/chat-widget/hub-page";
import { alternateLanguageUrls, canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema, SITE_URL } from "@/lib/jsonld";

export const dynamic = "force-static";

const PATH = "/solutions/chat-widget";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chatWidget" });
  const isDE = locale === "de";

  // Target keywords: ki chatbot (2.100 SV), ki kundenservice (350 SV, €15 CPC), chatbot website (€26.50 CPC)
  const title = isDE
    ? "KI Chatbot für Websites — Chat-Widget mit DSGVO & RAG | Synaplan"
    : "AI Chatbot for Websites — Chat Widget with GDPR & RAG | Synaplan";
  const description = isDE
    ? "KI Chatbot für Ihre Website in Minuten einrichten. Synaplan Chat-Widget: KI Kundenservice, DSGVO-konform, RAG auf Ihren Dokumenten. Kein Coding nötig."
    : "Add an AI chatbot to your website in minutes. Synaplan chat widget: AI customer service, GDPR-compliant, RAG on your documents. No coding required.";

  return {
    title,
    description,
    keywords: isDE
      ? "KI Chatbot, KI Kundenservice, Chatbot Website, Chat Widget, DSGVO Chatbot, KI Chat Widget"
      : "AI chatbot, AI customer service, chatbot website, chat widget, GDPR chatbot, AI chat widget",
    openGraph: {
      title,
      description,
      url: canonicalUrl(locale, PATH),
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  };
}

export default async function ChatWidgetSolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "chatWidget" });
  const pageUrl = canonicalUrl(locale, PATH);
  const isDE = locale === "de";

  // Rich JSON-LD targeting ki chatbot + ki kundenservice
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: isDE ? "KI Chatbot & Chat-Widget für Websites" : "AI Chatbot & Chat Widget for Websites",
        alternateName: isDE
          ? ["KI Kundenservice", "Chatbot Website", "DSGVO Chatbot"]
          : ["AI customer service", "website chatbot", "GDPR chatbot"],
        description: isDE
          ? "Einbettbarer KI-Chatbot für Websites. DSGVO-konform, RAG auf Ihren Dokumenten, White-Label-Design, ab €19,95/Monat."
          : "Embeddable AI chatbot for websites. GDPR-compliant, RAG on your documents, white-label design, from €19.95/month.",
        url: pageUrl,
        inLanguage: isDE ? "de-DE" : "en-US",
        provider: { "@id": "https://metadist.de/#organization" },
        serviceType: "AI Chatbot Service",
        areaServed: ["DE", "AT", "CH", "EU"],
        offers: {
          "@type": "Offer",
          price: "19.95",
          priceCurrency: "EUR",
          description: isDE ? "Monatliches Abonnement, jederzeit kündbar" : "Monthly subscription, cancel anytime",
        },
      },
      buildBreadcrumbSchema([
        { name: isDE ? "Startseite" : "Home", url: SITE_URL },
        { name: isDE ? "Lösungen" : "Solutions", url: `${SITE_URL}${isDE ? "/de" : ""}/solutions` },
        { name: isDE ? "KI Chatbot" : "AI Chatbot", url: pageUrl },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChatWidgetHubPage locale={locale} />
    </>
  );
}
