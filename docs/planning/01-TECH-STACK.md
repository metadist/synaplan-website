# Tech Stack

## Framework: Next.js 16.2 (App Router)

| Entscheidung | Begründung |
|---|---|
| **Next.js 16.2** | Stable (Release 18.03.2026), AI Agent DevTools, React 19.2, Turbopack default |
| **App Router** | Server Components, Streaming, Layouts, Parallel Routes, View Transitions |
| **TypeScript** | Typsicherheit, bessere DX, `next.config.ts` Support |
| **Turbopack** | Default-Bundler in v16, kein `--turbopack` Flag mehr nötig |

### Warum Next.js 16.2?

Next.js 16.2 (released 18. März 2026) bringt genau die Features, die für ein Vibe-Coding-erweiterbares Projekt ideal sind:

#### AI/Agent Features (Kernargument)

| Feature | Beschreibung | Nutzen für Synaplan |
|---|---|---|
| **AGENTS.md in create-next-app** | Wird automatisch generiert, instruiert AI-Agents die gebundelte Next.js-Doku zu lesen | 100% Pass Rate auf Next.js Evals (vs. 79% ohne) |
| **Bundled Docs** | Volle Next.js-Doku als Markdown in `node_modules/next/dist/docs/` | AI-Agents haben immer aktuelle Doku ohne Web-Zugriff |
| **Agent DevTools** (experimental) | AI-Agents bekommen Terminal-Zugriff auf React DevTools + Next.js Diagnostics | Agents können Komponenten-State, Props und Performance inspizieren |
| **Browser Log Forwarding** | Browser-Fehler werden automatisch ins Terminal weitergeleitet | AI-Agents (Cursor, Copilot) sehen Client-Errors ohne Browser-Zugriff |
| **Dev Server Lock File** | `.next/dev/lock` verhindert doppelte Dev-Server, actionable Errors | Saubere DX, kein Port-Chaos |

#### Konfiguration für AI Features

```ts
// next.config.ts
const nextConfig = {
  logging: {
    browserToTerminal: {
      // "error" | "warning" | "all"
      level: "warning",
    },
  },
  // Agent DevTools (experimental)
  experimental: {
    agentDevTools: true,
  },
};
```

#### Performance-Verbesserungen (vs. Next.js 15)

| Metrik | Verbesserung |
|---|---|
| **Dev Server Startup** | ~87% schneller (vs. 16.1), ~400% schneller als v15 |
| **Server-Side Rendering** | Bis zu 350% schneller (RSC Payload Deserialization) |
| **Server Fast Refresh** | 67-100% schnellerer App-Refresh (Turbopack) |
| **ImageResponse** | 2× schneller (einfach), 20× schneller (komplex) |

#### Neue Core Features (vs. Next.js 15)

| Feature | Beschreibung |
|---|---|
| **`"use cache"` Directive** | Explizites, opt-in Caching für Pages, Components und Functions |
| **`proxy.ts`** | Ersetzt `middleware.ts` — klarer, Node.js-nativer Request-Handler |
| **React Compiler (stable)** | Automatische Memoization, kein manuelles `useMemo`/`useCallback` |
| **React 19.2 View Transitions** | Native Browser View Transitions API für Page Navigations |
| **Next.js DevTools MCP** | Model Context Protocol Integration für besseres Debugging |
| **`updateTag()` / `revalidateTag()`** | Verbesserte Cache-Invalidierungs-APIs |

#### `"use cache"` — Neues Caching-Modell

In Next.js 16 ist Caching explizit opt-in (nicht mehr implizit wie in 15):

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
};
```

Drei Ebenen:

```tsx
// File-Level: Alle Exports gecached
"use cache";
export default async function Page() { /* ... */ }

// Component-Level: Einzelne Komponente
export async function GitHubStats() {
  "use cache";
  const stats = await fetch("https://api.github.com/repos/metadist/synaplan");
  return <StatsDisplay data={stats} />;
}

// Function-Level: Einzelne Datenfunktion
export async function getPartners() {
  "use cache";
  return partners;
}
```

#### View Transitions (React 19.2)

Native Page-Transition-Animationen ohne Framer Motion für einfache Übergänge:

```tsx
import { useViewTransition } from "react";

function NavigationLink({ href, children }) {
  const { startTransition } = useViewTransition();
  return (
    <Link href={href} onClick={() => startTransition()}>
      {children}
    </Link>
  );
}
```

Framer Motion bleibt für komplexe Animationen, aber einfache Page Transitions können nativ gelöst werden → weniger JS-Bundle.

---

## Breaking Changes: Migration Notes (15 → 16)

| Änderung | Was zu beachten |
|---|---|
| **`middleware.ts` → `proxy.ts`** | Datei umbenennen, Funktion von `middleware()` zu `proxy()` |
| **Turbopack Default** | `--turbopack` Flag aus `package.json` Scripts entfernen |
| **Webpack opt-in** | Wenn Webpack nötig: `next build --webpack` |
| **`JSX.Element` entfernt** | Ersetzen durch `React.ReactElement` |
| **Node.js 20.9+** | Node.js 18 nicht mehr unterstützt |
| **TypeScript 5.1+** | Mindestversion |
| **`next/image` Defaults** | Geänderte Standard-Props prüfen |
| **Caching opt-in** | `fetch()` und Route Handlers cachen NICHT mehr automatisch |
| **`swcMinify` entfernt** | Ist jetzt Standardverhalten |

---

## Styling: Tailwind CSS v4 + shadcn/ui

| Tool | Rolle |
|---|---|
| **Tailwind CSS v4** | Utility-first CSS, `@theme` Directive, OKLCH Farben, Container Queries |
| **shadcn/ui v4** | Komponentenbibliothek (Radix-basiert), copy-paste Architektur, voll anpassbar |
| **CSS Variables** | Design-Tokens für Brand-Colors, consistent Theming |

### Warum shadcn/ui?

- Copy-paste Architektur = volle Kontrolle, kein Vendor Lock-in
- Neue `skills` Feature für AI-Agent-Integration (passt zu AGENTS.md Ziel)
- Presets für schnelles Design-System-Setup
- Dark Mode built-in
- Tailwind v4 native Support

## Animationen: Framer Motion + GSAP + View Transitions

| Library | Einsatz |
|---|---|
| **React View Transitions** | Einfache Page Navigations (nativ, zero-JS overhead) |
| **Framer Motion** | Komplexe UI-Animationen, Layout Animations, Hover/Exit Effects |
| **GSAP + ScrollTrigger** | Scroll-basierte Animationen, Hero-Animationen, komplexe Timelines |

### Animations-Strategie

```
Einfache Page Transitions  →  React 19.2 View Transitions (nativ)
UI Hover/Enter/Exit         →  Framer Motion (deklarativ)
Scroll-Animationen          →  GSAP ScrollTrigger (imperativ)
CSS-only Effekte            →  Tailwind CSS Animations (zero JS)
```

### SEO-Kompatibilität

- View Transitions sind nativ im Browser — kein zusätzliches JS
- Framer Motion und GSAP werden als Client Components isoliert (`"use client"`)
- Content bleibt server-rendered und SEO-crawlbar
- Keine Layout Shifts durch Animationen (CLS = 0)

## Internationalisierung: next-intl

| Feature | Detail |
|---|---|
| **Library** | `next-intl` (~2KB Bundle) |
| **Routing** | `[locale]` Segment: `/en/...` und `/de/...` |
| **Locale Prefix** | `as-needed` — Default-Locale (EN) ohne Prefix, DE mit `/de/` |
| **Server Components** | Zero-Client-Bundle mit `getTranslations()` |
| **SEO** | Automatische `hreflang` Tags via Proxy (ehemals Middleware) |
| **Next.js 16** | `proxy.ts` statt `middleware.ts` (kompatibel seit v16.0.1) |

## Content Management

| Ansatz | Beschreibung |
|---|---|
| **MDX** | Blog-Posts, Changelogs, Docs-artige Inhalte |
| **JSON/TS Files** | Strukturierte Daten (Team, Partner, Use Cases, FAQs) |
| **next-intl Messages** | Übersetzbare UI-Texte in `messages/en.json` und `messages/de.json` |

### Warum kein CMS?

- Maximal erweiterbar per Code (AGENTS.md Kompatibilität)
- Keine externe Abhängigkeit
- Versionskontrolle über Git
- AI-Agents können Content direkt bearbeiten
- Bei Bedarf später Headless CMS (z.B. Sanity, Payload) ergänzbar

## Hosting & Deployment

| Option | Empfehlung |
|---|---|
| **Vercel** | Optimal für Next.js 16, Edge Runtime, ISR, Analytics |
| **Alternative** | Self-hosted via Docker + Node.js (für Enterprise-Kunden nachvollziehbar) |
| **CI/CD** | GitHub Actions für Build, Lint, Type-Check |

## Package Manager

| Tool | Begründung |
|---|---|
| **pnpm** | Schneller, platzsparender, strict dependency resolution |

## Node.js Version

| Requirement | Version |
|---|---|
| **Node.js** | 20.9+ (18 nicht mehr unterstützt in Next.js 16) |
| **TypeScript** | 5.1+ |

## Komplette Dependency-Übersicht

```json
{
  "dependencies": {
    "next": "^16.2.x",
    "react": "^19.2.x",
    "react-dom": "^19.2.x",
    "next-intl": "^4.x",
    "framer-motion": "^12.x",
    "gsap": "^3.x",
    "@radix-ui/react-*": "latest",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "prettier": "latest",
    "prettier-plugin-tailwindcss": "latest"
  }
}
```

## Vibe-Coding Ökosystem

Das Zusammenspiel der AI-Tools:

```
┌─────────────────────────────────────────────────────┐
│                    Entwickler                        │
│               (Cursor / Copilot / etc.)              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  AGENTS.md (Root)          ← Projekt-Konventionen    │
│  ├── Design Tokens                                   │
│  ├── Komponenten-Patterns                            │
│  ├── i18n-Workflow                                   │
│  └── Content-Patterns                                │
│                                                      │
│  AGENTS.md (Next.js)       ← Auto-generated          │
│  └── node_modules/next/dist/docs/  ← Bundled Docs    │
│                                                      │
│  shadcn/ui Skills          ← Komponenten-Kontext      │
│                                                      │
│  Agent DevTools            ← React State/Props/Perf   │
│  Browser Log Forwarding   ← Client-Side Errors       │
│  Dev Server Lock           ← Saubere DX              │
│  Next.js DevTools MCP      ← Diagnostics             │
│                                                      │
└─────────────────────────────────────────────────────┘
```
