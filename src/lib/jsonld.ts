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
  "@type": "Organization",
  "@id": "https://metadist.de/#organization",
  name: "metadist data management GmbH",
  url: "https://metadist.de",
  sameAs: [
    "https://synaplan.com",
    "https://github.com/metadist",
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
