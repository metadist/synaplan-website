# Implementierungs-Roadmap

## Phase 0: Setup & Grundlagen (Tag 1-2)

### Aufgaben
- [ ] Next.js 16.2 Projekt initialisieren (`pnpm create next-app@latest`)
  - AGENTS.md wird automatisch mit generiert
  - Turbopack ist default (kein Flag nötig)
  - Bundled Next.js Docs in `node_modules/next/dist/docs/`
- [ ] TypeScript Konfiguration (5.1+)
- [ ] Node.js Version sicherstellen (20.9+)
- [ ] Tailwind CSS v4 Setup
- [ ] shadcn/ui v4 initialisieren (mit Custom Preset für Synaplan Colors)
- [ ] ESLint + Prettier Konfiguration
- [ ] `next-intl` Setup (**`proxy.ts`**, Routing, Messages)
- [ ] Git Repository + `.gitignore`
- [ ] AGENTS.md anpassen (Synaplan-spezifische Konventionen ergänzen)
- [ ] `next.config.ts` konfigurieren:
  - `cacheComponents: true` (für `"use cache"`)
  - `logging.browserToTerminal.level: "warning"` (für Agent-Debugging)
  - `experimental.agentDevTools: true`
- [ ] Fonts einbinden (Satoshi self-hosted, Plus Jakarta Sans via next/font)
- [ ] Design Tokens definieren (Farben, Spacing, Typografie)
- [ ] Basis-Layout: `[locale]/layout.tsx`

### Ergebnis
Leeres Projekt mit funktionierender i18n, Design System, AI Agent Tooling und Build Pipeline.

---

## Phase 1: Layout & Navigation (Tag 3-4)

### Aufgaben
- [ ] Header-Komponente (Desktop + Mobile)
  - Logo
  - Navigation mit Dropdowns (Solutions, Features, About)
  - Language Switcher (EN/DE)
  - GitHub Stars Badge
  - Discord Link
  - CTA Buttons
- [ ] Footer-Komponente
  - 4-Spalten Layout
  - Social Links
  - Synaplan Schweiz Referenz
  - Copyright
- [ ] Mobile Navigation (Sheet/Drawer)
- [ ] Scroll Progress Indicator
- [ ] Page Transition Wrapper (React 19.2 View Transitions + Framer Motion Fallback)

### Ergebnis
Vollständige Navigation, responsive, mit allen Links.

---

## Phase 2: Homepage (Tag 5-8)

### Aufgaben
- [ ] Hero Section mit GSAP Entrance Animation
- [ ] Interaktive Produkt-Demo / Visual
- [ ] Social Proof Bar (Partner Logos, GitHub Stars)
- [ ] "Why Synaplan" 3-Spalten Grid
- [ ] Features Showcase (Tabs oder Scroll-basiert)
- [ ] Use Cases / Testimonials Carousel
- [ ] Open Source Section mit GitHub Stats
- [ ] Getting Started 3-Step Section
- [ ] Pricing Teaser
- [ ] CTA Pre-Footer Section
- [ ] FAQ Section mit Accordion

### Ergebnis
Vollständige, animierte Homepage mit allen Sections.

---

## Phase 3: Solutions Pages (Tag 9-11)

### Aufgaben
- [ ] `/solutions/companies` — Enterprise-fokussiert
- [ ] `/solutions/developers` — Developer-fokussiert mit Code Snippets
- [ ] `/solutions/chat-widget` — Widget-fokussiert mit Live Demo
- [ ] Shared Components: Pain Points Grid, Benefits Grid, Use Cases
- [ ] Synaplan Chat Widget Einbindung (Dogfooding)

### Ergebnis
Alle drei Solutions-Seiten live.

---

## Phase 4: Features Pages (Tag 12-14)

### Aufgaben
- [ ] `/features` — Overview Page
- [ ] `/features/multi-model` — Multi-Model Routing
- [ ] `/features/memories` — RAG / Memories
- [ ] `/features/audit-logs` — Audit & Compliance
- [ ] `/features/widget` — Widget im Detail
- [ ] Feature Page Template Komponente
- [ ] Interaktive Demos pro Feature

### Ergebnis
Feature-Seiten für SEO und Produktverständnis.

---

## Phase 5: About, Pricing, Legal (Tag 15-17)

### Aufgaben
- [ ] `/about` — Mission & Philosophy
- [ ] `/about/team` — Team Grid
- [ ] `/about/philosophy` — Detaillierte Philosophie
- [ ] `/about/partners` — Partner & Integrationen
- [ ] `/pricing` — Pricing Table mit Feature Matrix
- [ ] `/contact` — Contact Form
- [ ] `/appointment` — Booking Integration (Cal.com / Calendly)
- [ ] `/imprint` — Impressum
- [ ] `/privacy-policy` — Datenschutz

### Ergebnis
Alle informativen Seiten komplett.

---

## Phase 6: Blog (Tag 18-20)

### Aufgaben
- [ ] Blog Listing Page (`/blog`)
- [ ] Blog Post Template (`/blog/[slug]`)
- [ ] MDX Setup mit Syntax Highlighting
- [ ] Table of Contents Generation
- [ ] Author Components
- [ ] Related Posts
- [ ] RSS Feed
- [ ] 3-5 initiale Blog-Posts schreiben

### Ergebnis
Funktionierender Blog mit initialen Inhalten.

---

## Phase 7: SEO & Performance (Tag 21-22)

### Aufgaben
- [ ] Meta Tags für alle Seiten
- [ ] Open Graph Images generieren
- [ ] Structured Data (JSON-LD) für alle Seiten
- [ ] Sitemap Generation
- [ ] Robots.txt
- [ ] 301 Redirects für Legacy-URLs
- [ ] Lighthouse Audit + Optimierung
- [ ] Core Web Vitals Check
- [ ] Image Optimization Review
- [ ] Bundle Size Analysis

### Ergebnis
SEO-Score > 95, Core Web Vitals alle grün.

---

## Phase 8: Integrationen & Polish (Tag 23-25)

### Aufgaben
- [ ] GitHub Stats Integration (live)
- [ ] Discord Join Widget
- [ ] Synaplan Chat Widget (2 Modi: User/Developer)
- [ ] Analytics Setup (Plausible/Umami)
- [ ] Error Pages (404, 500)
- [ ] Loading States & Skeletons
- [ ] Animations Fine-Tuning
- [ ] Cross-Browser Testing
- [ ] Responsive Testing (alle Breakpoints)
- [ ] Accessibility Audit (WCAG 2.1 AA)

### Ergebnis
Produktionsreife Website.

---

## Phase 9: Launch (Tag 26-27)

### Aufgaben
- [ ] DNS-Umstellung auf Vercel
- [ ] SSL-Zertifikat verifizieren
- [ ] Google Search Console: Neue Sitemap einreichen
- [ ] 301 Redirects testen
- [ ] Performance-Monitoring aktivieren
- [ ] Discord Announcement
- [ ] Social Media Announcement

### Ergebnis
synaplan.com läuft auf Next.js!

---

## Zeitschätzung

| Phase | Tage | Beschreibung |
|---|---|---|
| Phase 0 | 2 | Setup & Grundlagen |
| Phase 1 | 2 | Layout & Navigation |
| Phase 2 | 4 | Homepage |
| Phase 3 | 3 | Solutions Pages |
| Phase 4 | 3 | Features Pages |
| Phase 5 | 3 | About, Pricing, Legal |
| Phase 6 | 3 | Blog |
| Phase 7 | 2 | SEO & Performance |
| Phase 8 | 3 | Integrationen & Polish |
| Phase 9 | 2 | Launch |
| **Gesamt** | **~27 Tage** | |

## AGENTS.md Strategie

Next.js 16.2 generiert automatisch ein `AGENTS.md` das AI-Agents instruiert, die gebundelte Next.js-Doku zu lesen (100% Pass Rate auf Evals!). Wir erweitern es um Synaplan-spezifische Konventionen:

### Auto-generated (Next.js 16.2)
- Verweis auf `node_modules/next/dist/docs/` (Bundled Docs)
- Next.js Best Practices und API-Referenz

### Synaplan-spezifisch (von uns ergänzt)
1. **Projektstruktur** erklärt
2. **Design Tokens** referenziert (Farben, Fonts, Spacing)
3. **Komponenten-Konventionen** definiert (Server vs. Client, shadcn/ui Patterns)
4. **i18n-Workflow** beschreibt (proxy.ts, Messages, Blog-i18n)
5. **Content-Erweiterungs-Pattern** zeigt (neue Seiten, Blog-Posts, FAQs)
6. **Caching-Strategie** (`"use cache"` Patterns)
7. **Animation-Guidelines** (wann View Transitions, Framer Motion, GSAP)

### Vibe-Coding Workflow

```
1. Agent liest AGENTS.md (Synaplan Root)
2. Agent liest node_modules/next/dist/docs/ (Next.js Bundled Docs)
3. Agent nutzt shadcn/ui Skills (Komponenten-Kontext)
4. Agent nutzt Agent DevTools (React State, Props, Performance)
5. Agent sieht Browser Errors im Terminal (Browser Log Forwarding)
6. Agent erstellt/editiert Code konsistent nach Konventionen
```

So kann jeder AI-Agent (Cursor, Copilot, Windsurf, etc.) die Seite konsistent und korrekt erweitern.
