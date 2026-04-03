/**
 * Centralised JSON-LD schema builders.
 * All schemas are typed as `Record<string, unknown>` so they can be
 * spread into `dangerouslySetInnerHTML` without extra casting.
 *
 * Publisher / Author identity: metadist data management GmbH
 * — the company behind Synaplan (metadist.de) used for E-E-A-T signals.
 */

export const SITE_URL = "https://synaplan.com";

/** Build a canonical URL for a given locale + path. */
export function canonicalUrl(locale: string, path: string): string {
  const prefix = locale === "de" ? "/de" : "";
  return `${SITE_URL}${prefix}${path}`;
}

// ─── Shared identity ────────────────────────────────────────────────────────

export const PUBLISHER = {
  "@type": ["Organization", "LocalBusiness"],
  "@id": "https://metadist.de/#organization",
  name: "metadist data management GmbH",
  url: "https://metadist.de",
  sameAs: [
    "https://synaplan.com",
    "https://github.com/metadist",
    "https://www.linkedin.com/company/metadist",
    "https://www.wikidata.org/wiki/Q131736023",
  ],
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 200,
    height: 200,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Königsallee 82",
    addressLocality: "Düsseldorf",
    postalCode: "40212",
    addressCountry: "DE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "team@synaplan.com",
    telephone: "+49-211-90760084",
    contactType: "customer support",
    availableLanguage: ["German", "English"],
  },
};

// ─── Global schemas (injected in layout) ────────────────────────────────────

/** Schema.org Organization — primary trust signal for Google E-E-A-T */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    ...PUBLISHER,
  };
}

/** Schema.org WebSite — enables Sitelinks Searchbox in Google */
export function buildWebSiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Synaplan",
    url: locale === "de" ? `${SITE_URL}/de` : SITE_URL,
    inLanguage: locale === "de" ? "de-DE" : "en-US",
    publisher: { "@id": "https://metadist.de/#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Homepage schemas ────────────────────────────────────────────────────────

/** Schema.org SoftwareApplication — makes Synaplan eligible for app rich results */
export function buildSoftwareAppSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: "Synaplan",
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "AI Platform",
    operatingSystem: "Any (self-hosted via Docker)",
    softwareVersion: "2.4.1",
    inLanguage: ["de-DE", "en-US"],
    description:
      locale === "de"
        ? "Open-Source-KI-Plattform mit Chat-Widget, RAG-Dokumentensuche und Multi-Model-Routing. DSGVO-konform, selbst gehostet."
        : "Open-source AI platform with chat widget, RAG document search, and multi-model routing. GDPR-compliant, self-hosted.",
    featureList: [
      "Multi-model AI routing (OpenAI, Anthropic, Groq, Gemini, Ollama)",
      "Embeddable chat widget for any website",
      "RAG document search with vector database",
      "GDPR-compliant self-hosting via Docker",
      "Plugin system for business-specific extensions",
      "WhatsApp & email AI integration",
      "AI Memories with Qdrant vector search",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Open Source",
        price: "0",
        priceCurrency: "EUR",
        description: "Self-hosted, free forever",
      },
      {
        "@type": "Offer",
        name: "Chat Widget",
        price: "19.95",
        priceCurrency: "EUR",
        billingIncrement: "monthly",
        description: "Managed chat widget for websites",
      },
    ],
    author: { "@id": "https://metadist.de/#organization" },
    publisher: { "@id": "https://metadist.de/#organization" },
    license: "https://github.com/metadist/synaplan/blob/main/LICENSE",
    codeRepository: "https://github.com/metadist/synaplan",
    releaseNotes: "https://github.com/metadist/synaplan/releases",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "32",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/** Schema.org FAQPage — enables FAQ rich results in Google Search */
export function buildFaqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    author: { "@id": "https://metadist.de/#organization" },
    publisher: { "@id": "https://metadist.de/#organization" },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
        author: { "@id": "https://metadist.de/#organization" },
      },
    })),
  };
}

// ─── Solution / Service pages ────────────────────────────────────────────────

type ServiceSchemaInput = {
  name: string;
  description: string;
  url: string;
  locale: string;
};

/** Schema.org Service — for solution sub-pages */
export function buildServiceSchema({ name, description, url, locale }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    inLanguage: locale === "de" ? "de-DE" : "en-US",
    provider: { "@id": "https://metadist.de/#organization" },
    serviceType: "AI Software Service",
    areaServed: ["DE", "AT", "CH", "EU"],
  };
}

/** Schema.org BreadcrumbList */
export function buildBreadcrumbSchema(
  crumbs: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// ─── HowTo ───────────────────────────────────────────────────────────────────

/**
 * Schema.org HowTo — "Getting Started" steps.
 * Eligible for a rich result showing numbered steps directly in Google Search.
 */
export function buildHowToSchema(locale: string) {
  const isDE = locale === "de";
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE_URL}${isDE ? "/de" : ""}/#howto`,
    name: isDE
      ? "Synaplan einrichten: KI-Chatbot in 3 Schritten"
      : "Set up Synaplan: AI chatbot in 3 steps",
    description: isDE
      ? "So richtest du Synaplan als KI-Plattform oder Chat-Widget für deine Website ein."
      : "How to set up Synaplan as an AI platform or chat widget for your website.",
    totalTime: "PT10M",
    inLanguage: isDE ? "de-DE" : "en-US",
    author: { "@id": "https://metadist.de/#organization" },
    step: isDE
      ? [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Konto erstellen",
            text: "Registriere dich kostenlos auf web.synaplan.com oder lade die Open-Source-Version von GitHub herunter und starte sie per Docker.",
            url: "https://web.synaplan.com",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "KI-Modell verbinden",
            text: "Wähle dein bevorzugtes KI-Modell (OpenAI, Claude, Groq, Gemini oder lokal via Ollama) und verbinde es mit deinem API-Schlüssel.",
            url: `${SITE_URL}/de/features/multi-model`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Chat-Widget einbinden",
            text: "Kopiere einen einzeiligen Script-Tag und füge ihn in deine Website ein. Das Widget ist sofort einsatzbereit — kein Coding nötig.",
            url: `${SITE_URL}/de/solutions/chat-widget`,
          },
        ]
      : [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Create an account",
            text: "Sign up for free at web.synaplan.com or download the open-source version from GitHub and run it via Docker.",
            url: "https://web.synaplan.com",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Connect an AI model",
            text: "Choose your preferred AI model (OpenAI, Claude, Groq, Gemini, or local via Ollama) and connect it with your API key.",
            url: `${SITE_URL}/features/multi-model`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Embed the chat widget",
            text: "Copy a one-line script tag and paste it into your website. The widget is ready immediately — no coding required.",
            url: `${SITE_URL}/solutions/chat-widget`,
          },
        ],
  };
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

/** Schema.org Blog + CollectionPage — registers /blog as a structured content hub */
export function buildBlogSchema(locale: string) {
  const isDE = locale === "de";
  const url = isDE ? `${SITE_URL}/de/blog` : `${SITE_URL}/blog`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Blog", "CollectionPage"],
        "@id": `${url}#blog`,
        name: isDE ? "Synaplan Blog — KI-Insights & Neuigkeiten" : "Synaplan Blog — AI Insights & News",
        description: isDE
          ? "Artikel zu KI-Strategie, Multi-Model-Routing, DSGVO-Compliance und mehr vom Synaplan-Team."
          : "Articles on AI strategy, multi-model routing, GDPR compliance and more from the Synaplan team.",
        url,
        inLanguage: isDE ? "de-DE" : "en-US",
        publisher: { "@id": "https://metadist.de/#organization" },
        author: { "@id": "https://metadist.de/#organization" },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
    ],
  };
}

// ─── Pricing FAQ ──────────────────────────────────────────────────────────────

/** FAQPage for /pricing — enables FAQ rich results on the pricing page */
export function buildPricingFaqSchema(locale: string) {
  const isDE = locale === "de";
  const items = isDE
    ? [
        {
          q: "Ist Synaplan wirklich kostenlos?",
          a: "Die Open-Source-Version von Synaplan ist komplett kostenlos. Du kannst sie von GitHub herunterladen und auf deiner eigenen Infrastruktur betreiben. Für das verwaltete Chat-Widget auf web.synaplan.com fallen ab 19,95 €/Monat Kosten an.",
        },
        {
          q: "Was kostet das Chat-Widget?",
          a: "Das Synaplan Chat-Widget für Websites ist ab 19,95 €/Monat erhältlich. Der Preis beinhaltet Hosting, Updates und Support. Es gibt keine versteckten Kosten — das Abonnement ist monatlich kündbar.",
        },
        {
          q: "Gibt es eine kostenlose Testphase?",
          a: "Ja. Du kannst Synaplan kostenlos testen — entweder über die Self-Hosted Open-Source-Version oder über eine Demo-Anfrage für die Cloud-Plattform.",
        },
        {
          q: "Was kostet die Enterprise-Lösung?",
          a: "Der Preis für die Enterprise-Installation (On-Premise auf eurer eigenen Infrastruktur) ist individuell und hängt von Unternehmensgröße, Anforderungen und gewünschten Plugins ab. Kontaktiert uns für ein Angebot.",
        },
        {
          q: "Welche Zahlungsmethoden werden akzeptiert?",
          a: "Für die Platform-Pläne akzeptieren wir Kreditkarte und SEPA-Lastschrift. Enterprise-Kunden können per Rechnung zahlen.",
        },
      ]
    : [
        {
          q: "Is Synaplan really free?",
          a: "The open-source version of Synaplan is completely free. You can download it from GitHub and run it on your own infrastructure. The managed chat widget on web.synaplan.com starts at €19.95/month.",
        },
        {
          q: "How much does the chat widget cost?",
          a: "The Synaplan chat widget for websites starts at €19.95/month. The price includes hosting, updates and support. No hidden costs — cancel anytime.",
        },
        {
          q: "Is there a free trial?",
          a: "Yes. You can try Synaplan for free — either via the self-hosted open-source version or by requesting a demo of the cloud platform.",
        },
        {
          q: "How much does the Enterprise solution cost?",
          a: "The price for an Enterprise installation (on-premise on your own infrastructure) is individual and depends on company size, requirements and desired plugins. Contact us for a quote.",
        },
        {
          q: "What payment methods are accepted?",
          a: "For platform plans we accept credit card and SEPA direct debit. Enterprise customers can pay by invoice.",
        },
      ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${isDE ? "/de" : ""}/pricing#faq`,
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

type PricingOffer = {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  priceSpecification?: string;
};

/** Schema.org Product with Offer array — enables pricing rich results in Google */
export function buildProductPricingSchema(
  locale: string,
  offers: PricingOffer[],
) {
  const url = locale === "de" ? `${SITE_URL}/de/pricing` : `${SITE_URL}/pricing`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/#product`,
    name: "Synaplan",
    description:
      locale === "de"
        ? "Open-Source-KI-Plattform für Unternehmen — Chat-Widget, RAG, Multi-Model-Routing, DSGVO-konform."
        : "Open-source AI platform for businesses — chat widget, RAG, multi-model routing, GDPR-compliant.",
    url,
    brand: { "@id": "https://metadist.de/#organization" },
    manufacturer: { "@id": "https://metadist.de/#organization" },
    offers: offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      description: o.description,
      price: o.price,
      priceCurrency: o.priceCurrency ?? "EUR",
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": "https://metadist.de/#organization" },
    })),
  };
}

/** Serialise one or more schemas into a JSON-LD string for dangerouslySetInnerHTML */
export function serializeJsonLd(
  ...schemas: Record<string, unknown>[]
): string {
  if (schemas.length === 1) return JSON.stringify(schemas[0]);
  return JSON.stringify({ "@context": "https://schema.org", "@graph": schemas });
}
