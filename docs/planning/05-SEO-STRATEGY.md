# SEO-Strategie

## Core Web Vitals Ziele

| Metrik | Ziel | Maßnahmen |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Server Components, Image Optimization, Font Preloading |
| **FID** (First Input Delay) | < 100ms | Minimale Client-JS, Code Splitting, Selective Hydration |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Font `display: swap`, Image dimensions, Reserved space |
| **INP** (Interaction to Next Paint) | < 200ms | Optimierte Event Handler, Web Workers für schwere Aufgaben |

## Technische SEO

### Meta Tags & Open Graph

Jede Seite bekommt:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Page Title | Synaplan",
    description: "...",
    openGraph: {
      title: "...",
      description: "...",
      url: "https://synaplan.com/...",
      siteName: "Synaplan",
      images: [{ url: "/og/page-name.png", width: 1200, height: 630 }],
      locale: params.locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "...",
      description: "...",
    },
    alternates: {
      canonical: "https://synaplan.com/...",
      languages: {
        en: "https://synaplan.com/...",
        de: "https://synaplan.com/de/...",
      },
    },
  };
}
```

### Structured Data (JSON-LD)

| Seite | Schema Type |
|---|---|
| Homepage | `Organization`, `SoftwareApplication`, `WebSite` |
| Solutions | `Product`, `Service` |
| Pricing | `Product` mit `Offer` |
| About | `Organization`, `Person` (Team) |
| Blog | `Article`, `BlogPosting` |
| FAQ Sections | `FAQPage` |
| Contact | `ContactPage` |

### Sitemap

Automatisch generiert via `src/app/sitemap.ts`:

```tsx
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "de"];
  const pages = [
    "/", "/solutions/companies", "/solutions/developers",
    "/solutions/chat-widget", "/features", "/pricing",
    "/about", "/about/team", "/about/philosophy",
    "/about/partners", "/blog", "/contact",
  ];

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `https://synaplan.com${locale === "en" ? "" : "/de"}${page === "/" ? "" : page}`,
      lastModified: new Date(),
      changeFrequency: page === "/blog" ? "daily" : "weekly",
      priority: page === "/" ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: `https://synaplan.com${page === "/" ? "" : page}`,
          de: `https://synaplan.com/de${page === "/" ? "" : page}`,
        },
      },
    }))
  );
}
```

### Robots.txt

```tsx
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: "https://synaplan.com/sitemap.xml",
  };
}
```

### URL-Preservation Redirects

Wenn sich URLs ändern, werden 301-Redirects in `next.config.ts` konfiguriert:

```ts
async redirects() {
  return [
    // Legacy-URLs von der Webflow-Seite, falls nötig
  ];
}
```

### Caching für SEO (Next.js 16 `"use cache"`)

Statische Marketing-Seiten profitieren von explizitem Caching:

```tsx
// Seiten mit selten wechselndem Content
"use cache";
export default async function PricingPage() { /* ... */ }

// Dynamische Daten (GitHub Stats) mit revalidation
export async function getGitHubStats() {
  "use cache";
  // Cache wird stündlich invalidiert via revalidateTag
  const data = await fetch("https://api.github.com/repos/metadist/synaplan");
  return data.json();
}
```

## Hreflang-Strategie

Via `next-intl` Middleware automatisch generiert:

```html
<link rel="alternate" hrefLang="en" href="https://synaplan.com/pricing" />
<link rel="alternate" hrefLang="de" href="https://synaplan.com/de/pricing" />
<link rel="alternate" hrefLang="x-default" href="https://synaplan.com/pricing" />
```

## Content-SEO (basierend auf Sistrix-Analyse 25.03.2026)

> Vollständige Daten: siehe `10-SISTRIX-SEO-CHECKLIST.md`

### Keyword-Strategie (datenbasiert)

| Cluster | Primary Keyword (DE) | SV | CPC | Intent | Zielseite |
|---|---|---|---|---|---|
| **Chat-Widget** | `ki chatbot` | **2.100** | €2,80 | **Know+Do** | `/solutions/chat-widget` |
| **Transaktional** | `ki kundenservice` | 350 | €15 | **Do** | `/solutions/chat-widget` |
| **High-CPC Widget** | `chatbot website` | 70 | **€26,50** | **Know+Do** | `/solutions/chat-widget` |
| **Tutorial** | `chatbot erstellen` | 250 | €12,60 | Know+Do | `/blog` + `/solutions/chat-widget` |
| **High-Volume** | `chatgpt alternative` | 8.800 | €1 | Know | `/blog/chatgpt-alternative` |
| **Homepage** | `ki plattform` | 450 | €10 | Know | `/` |
| **Compliance** | `ki datenschutz` | 400 | €9 | Know | `/blog` + `/features/audit-logs` |
| **Open Source** | `open source ki` | 400 | €4 | Know | `/solutions/developers` |
| **Enterprise** | `chatgpt für unternehmen` | 200 | €4 | Know | `/solutions/companies` |
| **Compliance** | `ki compliance` | 150 | €7 | Know | `/features/audit-logs` |
| **Easy Win** | `chatgpt dsgvo` | 150 | €3 | Know | `/blog` (0 Competition!) |
| **Developer (EN)** | `ai gateway` | 50 DE / 900 global | €13 | Know | `/features/multi-model` |
| **Wettbewerber** | `intercom alternative` | 70 | €27 | Know | `/blog` (Vergleichsartikel) |

### Blog-Content-Plan (datenbasiert, nach Priorität)

| # | Artikel | Target Keyword | SV (DE) | Schwierigkeit |
|---|---|---|---|---|
| 1 | "Die besten ChatGPT-Alternativen 2026" | `chatgpt alternative` | 8.800 | Hoch |
| 2 | "KI-Datenschutz: DSGVO-konformer KI-Einsatz" | `ki datenschutz` | 400 | Mittel |
| 3 | "Open Source KI: Warum Transparenz wichtig ist" | `open source ki` | 400 | Mittel |
| 4 | "KI im Kundenservice: Support automatisieren" | `ki kundenservice` | 350 | Mittel |
| 5 | "ChatGPT und DSGVO — Was Unternehmen wissen müssen" | `chatgpt dsgvo` | 150 | **Leicht** |
| 6 | "Synaplan vs. Intercom: Chat-Widget Vergleich" | `intercom alternative` | 70 | Mittel |
| 7 | "Self-Hosted AI: KI auf eigener Infrastruktur" | `self hosted ai` | 90 | **Leicht** |
| 8 | "KI-Compliance: Audit-Logs und Governance" | `ki compliance` | 150 | Mittel |
| 9 | "Synaplan vs. Tidio / Userlike" | `tidio/userlike alternative` | 30 | **Leicht** |
| 10 | "Was ist AI Model Routing?" | `ai gateway` (EN) | 900 (global) | Leicht |

### Wichtigste strategische Erkenntnis

**82% aller Keywords haben informationalen Intent** ("Know"). Nutzer wollen sich informieren, nicht sofort kaufen. Das bedeutet:

1. **Blog ist der Traffic-Treiber #1** — nicht die Homepage oder Sales-Pages
2. **Content-Funnel nötig**: Blog → Feature-Seiten → Pricing/CTA → Conversion
3. **Chat-Widget-Seite ist die Geldmaschine**: `ki chatbot` (2.100 SV, Know+Do), `ki kundenservice` (350 SV, Do, €15 CPC), `chatbot website` (70 SV, €26,50 CPC!)
   → `/solutions/chat-widget` muss für alle Chat-Keywords perfekt optimiert sein
4. **Blog-Artikel "Chatbot erstellen"** (250 SV, €12,60 CPC) fungiert als Conversion-Brücke zum Widget

## Performance-Optimierung

### Next.js Spezifisch

- **Static Generation (SSG)** für alle Marketing-Seiten
- **ISR** (Incremental Static Regeneration) für Blog-Posts
- **Dynamic Imports** für schwere Client Components (Demos, Animationen)
- **Route Segments**: `export const dynamic = "force-static"` wo möglich
- **Partial Prerendering (PPR)**: Static Shell + Dynamic Content für personalisierte Elemente

### Asset-Optimierung

- `next/image` mit `priority` für Above-the-fold Bilder
- Font Subsetting via `next/font`
- SVG Sprites für Icons
- CSS-only Animationen wo möglich (GPU-optimiert)
- Lazy Loading für Below-the-fold Content

### Monitoring

- Vercel Analytics (Web Vitals)
- Google Search Console Integration
- Lighthouse CI in GitHub Actions
