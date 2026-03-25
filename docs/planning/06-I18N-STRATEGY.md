# Internationalisierung (i18n)

## Strategie

| Aspekt | Entscheidung |
|---|---|
| **Library** | `next-intl` v4+ |
| **Sprachen** | Englisch (Default), Deutsch |
| **URL-Schema** | `as-needed` — EN ohne Prefix, DE mit `/de/` |
| **Erweiterbarkeit** | Weitere Sprachen einfach ergänzbar |

## URL-Beispiele

| Seite | Englisch | Deutsch |
|---|---|---|
| Homepage | `synaplan.com/` | `synaplan.com/de/` |
| Pricing | `synaplan.com/pricing` | `synaplan.com/de/pricing` |
| Solutions | `synaplan.com/solutions/companies` | `synaplan.com/de/solutions/companies` |
| Blog Post | `synaplan.com/blog/my-post` | `synaplan.com/de/blog/my-post` |

## Architektur

### Proxy (`src/proxy.ts`) — Next.js 16 Konvention

In Next.js 16 ersetzt `proxy.ts` die bisherige `middleware.ts`. next-intl ist seit v16.0.1 kompatibel:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

> **Hinweis**: Die Datei heißt `proxy.ts` statt `middleware.ts`, die API von next-intl bleibt identisch.

### Routing Config (`src/i18n/routing.ts`)

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed", // EN ohne /en/, DE mit /de/
});
```

### Request Config (`src/i18n/request.ts`)

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

## Message-Struktur

### `messages/en.json` (Auszug)

```json
{
  "common": {
    "startForFree": "Start for free",
    "bookDemo": "Book a demo",
    "learnMore": "Learn more",
    "madeInGermany": "Made in Germany",
    "gdprCompliant": "GDPR compliant",
    "openSource": "100% Open Source"
  },
  "nav": {
    "solutions": "Solutions",
    "features": "Features",
    "pricing": "Pricing",
    "about": "About",
    "blog": "Blog",
    "forCompanies": "For Companies",
    "forDevelopers": "For Developers",
    "chatWidget": "Chat Widget"
  },
  "home": {
    "hero": {
      "title": "Take control of your AI",
      "subtitle": "All models. One platform.",
      "description": "Synaplan connects leading AI systems with professional management: free choice, cost control, result governance, and full transparency."
    },
    "whySynaplan": {
      "title": "Synaplan adapts to your needs"
    }
  }
}
```

### `messages/de.json` (Auszug)

```json
{
  "common": {
    "startForFree": "Kostenlos starten",
    "bookDemo": "Demo buchen",
    "learnMore": "Mehr erfahren",
    "madeInGermany": "Made in Germany",
    "gdprCompliant": "DSGVO-konform",
    "openSource": "100% Open Source"
  },
  "nav": {
    "solutions": "Lösungen",
    "features": "Features",
    "pricing": "Preise",
    "about": "Über uns",
    "blog": "Blog",
    "forCompanies": "Für Unternehmen",
    "forDevelopers": "Für Entwickler",
    "chatWidget": "Chat-Widget"
  },
  "home": {
    "hero": {
      "title": "KI unter Kontrolle",
      "subtitle": "Alle Modelle. Eine Plattform.",
      "description": "Synaplan verbindet führende KI-Systeme mit professionellem Management: freie Modellwahl, Kostenkontrolle, Ergebnis-Governance und volle Transparenz."
    },
    "whySynaplan": {
      "title": "Synaplan passt sich Ihren Bedürfnissen an"
    }
  }
}
```

## Blog-i18n

Für Blog-Posts gibt es zwei Ansätze:

### Option A: Separate MDX-Dateien pro Sprache (Empfohlen)

```
content/blog/
├── en/
│   └── what-is-model-routing.mdx
└── de/
    └── what-is-model-routing.mdx
```

### Option B: Frontmatter mit Locale

```mdx
---
title: "What is AI Model Routing?"
locale: en
translations:
  de: "/de/blog/was-ist-ki-model-routing"
---
```

**Empfehlung**: Option A — saubere Trennung, keine Mischung, einfacher für Content-Autoren.

## Language Switcher

- Im Header als Dropdown/Toggle: `EN` / `DE`
- Wechselt zur gleichen Seite in der anderen Sprache
- Speichert Präferenz in Cookie (via next-intl Proxy)
- Erkennt Browser-Sprache beim ersten Besuch

## SEO-Implikationen

- Automatische `hreflang` Tags via next-intl
- Separate Sitemap-Einträge pro Sprache
- `x-default` zeigt auf EN-Version
- Canonical URLs pro Sprache
