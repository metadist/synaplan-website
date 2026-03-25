# Seitenstruktur & Informationsarchitektur

## URL-Struktur

```
synaplan.com/
├── /                                    ← Homepage (EN, Default)
├── /de/                                 ← Homepage (DE)
│
├── /solutions/
│   ├── /solutions/companies             ← Für Unternehmen
│   ├── /solutions/developers            ← Für Entwickler
│   └── /solutions/chat-widget           ← Chat-Widget
│
├── /features/                           ← Feature-Übersicht (NEU)
│   ├── /features/multi-model            ← Multi-Model Routing
│   ├── /features/memories               ← Memories / RAG
│   ├── /features/audit-logs             ← Audit & Compliance
│   └── /features/widget                 ← Widget im Detail
│
├── /pricing/                            ← Preise
│
├── /about/                              ← Über Synaplan
│   ├── /about/team                      ← Team (NEU)
│   ├── /about/philosophy                ← Philosophie (NEU)
│   └── /about/partners                  ← Partnerschaften (NEU)
│
├── /blog/                               ← Blog / News (NEU)
│   └── /blog/[slug]                     ← Einzelne Blog-Posts
│
├── /docs/                               ← Redirect → docs.synaplan.com
│
├── /contact/                            ← Kontakt
├── /appointment/                        ← Demo buchen
│
├── /imprint/                            ← Impressum
├── /privacy-policy/                     ← Datenschutz
│
├── /de/solutions/companies
├── /de/solutions/developers
├── /de/solutions/chat-widget
├── /de/features/...
├── /de/pricing
├── /de/about/...
├── /de/blog/...
├── /de/contact
├── /de/appointment
├── /de/imprint
└── /de/privacy-policy
```

## Neue Seiten (vs. aktuell)

| Seite | Status | Begründung |
|---|---|---|
| `/features/` | **NEU** | Detaillierte Feature-Seiten für SEO und Produktverständnis |
| `/features/multi-model` | **NEU** | USP: Multi-Model Routing als eigene Seite |
| `/features/memories` | **NEU** | RAG / Memories Feature hervorheben |
| `/features/audit-logs` | **NEU** | Compliance/Audit als eigene Seite (Enterprise-Zielgruppe) |
| `/features/widget` | **NEU** | Widget-Feature detailliert (technische Details, Demos) |
| `/about/team` | **NEU** | Team vorstellen (Vertrauensaufbau) |
| `/about/philosophy` | **NEU** | "Solving problems for people" — Philosophie |
| `/about/partners` | **NEU** | IABG, PlateART, Balthasar Ress, Roatel, CastApp, Ocean View Consulting |
| `/blog/` | **NEU** | SEO-Content, Announcements, Use Cases |

## Navigation

### Primary Navigation (Header)

```
[Logo: ()> synaplan]

Solutions ▾               Features ▾          Pricing    About ▾        Blog
├── For Companies         ├── Multi-Model      
├── For Developers        ├── Memories                   ├── Team
└── Chat Widget           ├── Audit Logs                 ├── Philosophy
                          └── Widget                     └── Partners

                                                          [GitHub ★]  [Discord]  [DE/EN]

                                              [Start for free]  [Book Demo]
```

### Footer Navigation

```
Platform                Resources              Company              Legal
├── For Companies       ├── Documentation      ├── About            ├── Imprint
├── For Developers      ├── GitHub Repo        ├── Team             └── Privacy Policy
├── Chat Widget         ├── Discord            ├── Philosophy
└── Pricing             └── Blog               ├── Partners
                                               └── Contact

[Social: LinkedIn, Instagram, Facebook, GitHub]
[Synaplan Schweiz GmbH → swiss.synaplan.com]
```

## Next.js App Router Dateistruktur

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                   ← Root Layout mit i18n Provider
│   │   ├── page.tsx                     ← Homepage
│   │   ├── solutions/
│   │   │   ├── companies/page.tsx
│   │   │   ├── developers/page.tsx
│   │   │   └── chat-widget/page.tsx
│   │   ├── features/
│   │   │   ├── page.tsx                 ← Feature Overview
│   │   │   ├── multi-model/page.tsx
│   │   │   ├── memories/page.tsx
│   │   │   ├── audit-logs/page.tsx
│   │   │   └── widget/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── about/
│   │   │   ├── page.tsx                 ← About Overview
│   │   │   ├── team/page.tsx
│   │   │   ├── philosophy/page.tsx
│   │   │   └── partners/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx                 ← Blog Listing
│   │   │   └── [slug]/page.tsx          ← Blog Post
│   │   ├── contact/page.tsx
│   │   ├── appointment/page.tsx
│   │   ├── imprint/page.tsx
│   │   └── privacy-policy/page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── not-found.tsx
├── components/
│   ├── ui/                              ← shadcn/ui Komponenten
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   └── mobile-menu.tsx
│   ├── sections/                        ← Wiederverwendbare Sektionen
│   │   ├── hero.tsx
│   │   ├── features-grid.tsx
│   │   ├── use-cases.tsx
│   │   ├── cta-section.tsx
│   │   ├── faq-section.tsx
│   │   ├── pricing-table.tsx
│   │   ├── testimonials.tsx
│   │   └── partner-logos.tsx
│   ├── interactive/                     ← Client Components mit Animationen
│   │   ├── product-demo.tsx
│   │   ├── chat-widget-preview.tsx
│   │   ├── model-selector-demo.tsx
│   │   └── scroll-animations.tsx
│   └── integrations/
│       ├── github-stats.tsx
│       ├── discord-widget.tsx
│       └── synaplan-chat.tsx
├── lib/
│   ├── utils.ts
│   └── constants.ts
├── i18n/
│   ├── config.ts
│   ├── request.ts
│   └── routing.ts
├── messages/
│   ├── en.json
│   └── de.json
├── content/
│   ├── blog/                            ← MDX Blog Posts
│   ├── team.ts                          ← Team Data
│   ├── partners.ts                      ← Partner Data
│   └── use-cases.ts                     ← Use Case Data
├── styles/
│   └── globals.css
└── proxy.ts                              ← i18n Routing Proxy (Next.js 16, ersetzt middleware.ts)
```
