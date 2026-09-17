import type { Metadata } from "next";
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from "@/lib/seo";
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/jsonld";

/** Metadata for a Mission Control page: canonical + hreflang + OG/Twitter. */
export function missionMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const url = canonicalUrl(locale, path);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Synaplan",
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    alternates: {
      canonical: url,
      languages: alternateLanguageUrls(path),
    },
  };
}

/** WebPage + BreadcrumbList JSON-LD for a Mission Control sub-page. */
export function missionPageJsonLd(locale: string, path: string, name: string, description: string) {
  const isDE = locale === "de";
  const url = canonicalUrl(locale, path);
  const home = isDE ? `${SITE_URL}/de` : SITE_URL;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        publisher: { "@id": "https://metadist.de/#organization" },
        inLanguage: isDE ? "de-DE" : "en-US",
      },
      buildBreadcrumbSchema([
        { name: "Synaplan", url: home },
        { name, url },
      ]),
    ],
  };
}
