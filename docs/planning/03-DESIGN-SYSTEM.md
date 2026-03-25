# Design System

## Brand Guidelines (aus Style Guide)

### Mascot & Logo

- **Logo**: `()> synaplan` mit dem nach rechts schauenden Papagei
- **Papagei-Name**: "syni" (Kurzform), vollständiger Name: "Duke Synapse of Brainland, King of Code"
- **Geschlecht**: männlich
- **Text-only Fallback**: `synaplan` (lowercase)
- **Slogan**: "AI under control"
- **Philosophie**: "Solving problems for people"

### Typografie

| Verwendung | Font | Quelle |
|---|---|---|
| **Headings** | **Satoshi** | Lokaler Download / Self-hosted |
| **Body Text** | **Plus Jakarta Sans** | Google Fonts |
| **Code / Monospace** | **JetBrains Mono** | Google Fonts |

#### Font-Strategie

- Satoshi wird self-hosted für maximale Performance (kein externer Request)
- Plus Jakarta Sans über `next/font/google` für automatische Optimierung
- Variable Fonts verwenden für kleinere Dateigröße
- `font-display: swap` für bessere CLS-Werte

#### Typografie-Skala

```css
--font-size-xs:    0.75rem   /* 12px */
--font-size-sm:    0.875rem  /* 14px */
--font-size-base:  1rem      /* 16px */
--font-size-lg:    1.125rem  /* 18px */
--font-size-xl:    1.25rem   /* 20px */
--font-size-2xl:   1.5rem    /* 24px */
--font-size-3xl:   1.875rem  /* 30px */
--font-size-4xl:   2.25rem   /* 36px */
--font-size-5xl:   3rem      /* 48px */
--font-size-6xl:   3.75rem   /* 60px */
--font-size-7xl:   4.5rem    /* 72px — Hero Headlines */
```

### Farbpalette

Die Brand-Colors folgen dem Style Guide: **Schwarz / Weiß / Blau / Grau** — ruhig und professionell.

#### Primäre Farben (OKLCH für Tailwind v4)

```css
@theme {
  /* Brand Blue — Primärfarbe */
  --color-brand-50:  oklch(0.97 0.01 240);
  --color-brand-100: oklch(0.93 0.03 240);
  --color-brand-200: oklch(0.87 0.06 240);
  --color-brand-300: oklch(0.78 0.10 240);
  --color-brand-400: oklch(0.68 0.15 240);
  --color-brand-500: oklch(0.55 0.20 240);   /* Hauptton */
  --color-brand-600: oklch(0.48 0.20 240);
  --color-brand-700: oklch(0.40 0.18 240);
  --color-brand-800: oklch(0.33 0.15 240);
  --color-brand-900: oklch(0.27 0.12 240);
  --color-brand-950: oklch(0.20 0.08 240);

  /* Neutral / Grau */
  --color-neutral-50:  oklch(0.98 0.00 0);
  --color-neutral-100: oklch(0.96 0.00 0);
  --color-neutral-200: oklch(0.91 0.00 0);
  --color-neutral-300: oklch(0.84 0.00 0);
  --color-neutral-400: oklch(0.71 0.00 0);
  --color-neutral-500: oklch(0.55 0.00 0);
  --color-neutral-600: oklch(0.45 0.00 0);
  --color-neutral-700: oklch(0.37 0.00 0);
  --color-neutral-800: oklch(0.27 0.00 0);
  --color-neutral-900: oklch(0.18 0.00 0);
  --color-neutral-950: oklch(0.10 0.00 0);

  /* Semantic Colors */
  --color-success: oklch(0.65 0.20 145);
  --color-warning: oklch(0.75 0.18 75);
  --color-error:   oklch(0.60 0.22 25);
}
```

#### Farbverwendung

| Kontext | Farbe | Anwendung |
|---|---|---|
| **Primary CTA** | `brand-500` | "Start for free", "Book Demo" Buttons |
| **Secondary CTA** | `brand-100` bg + `brand-700` text | Sekundäre Aktionen |
| **Text** | `neutral-900` (Light) / `neutral-50` (Dark) | Body Text |
| **Headings** | `neutral-950` (Light) / `white` (Dark) | Überschriften |
| **Muted Text** | `neutral-500` | Labels, Beschreibungen |
| **Borders** | `neutral-200` (Light) / `neutral-800` (Dark) | Trennlinien, Cards |
| **Background** | `white` / `neutral-50` | Alternating Sections |
| **Dark Sections** | `neutral-950` | Hero, CTA Blöcke |

### Dark Mode

- **Default**: Light Mode (Brand-konform: professionell, clean)
- **Dark Mode**: Unterstützt via Tailwind `dark:` Klassen und `next-themes`
- Automatische Erkennung via `prefers-color-scheme`
- Manueller Toggle im Header

## Spacing & Layout

### Grid System

```css
--container-max: 1280px;      /* Max Content Width */
--container-padding: 1.5rem;  /* Mobile Padding */
--section-gap: 6rem;          /* Abstand zwischen Sections */
--section-gap-lg: 8rem;       /* Große Abstände */
```

### Responsive Breakpoints (Tailwind v4 Defaults)

```
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px
```

## Komponenten-Stil

### Cards

- Leichte Border (`neutral-200`)
- Subtiler Shadow bei Hover
- Rounded Corners: `rounded-xl` (12px)
- Padding: `p-6` bis `p-8`

### Buttons

```
Primary:   bg-brand-500 text-white hover:bg-brand-600 rounded-lg px-6 py-3
Secondary: bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg px-6 py-3
Ghost:     text-neutral-700 hover:bg-neutral-100 rounded-lg px-4 py-2
Outline:   border border-neutral-300 hover:border-brand-500 rounded-lg px-6 py-3
```

### Micro-Interactions

- **Hover**: Scale 1.02, subtle shadow lift
- **Focus**: Brand-blue ring (accessibility)
- **Page Transitions**: Fade + subtle slide (Framer Motion)
- **Scroll Reveals**: Staggered fade-up Animationen (GSAP ScrollTrigger)
- **Scroll Progress**: Subtile Progress Bar im Header

## Iconografie

- **Primary**: Lucide React (consistent, modern, open source)
- **Brand**: Custom Synaplan Icons (Papagei "syni", Logo)
- **Feature Icons**: Outlined style, brand-blue Akzente

## Bilder & Medien

### Produktbilder

- Interaktive Produktdemos statt statischer Screenshots (Trend 2026)
- Live-Widget-Preview auf der Chat-Widget Seite
- Animierte Dashboard-Mockups

### Optimierung

- `next/image` für automatische Optimierung (WebP/AVIF)
- Responsive `sizes` Attribut
- Blur-Placeholder für Lazy Loading
- SVG für Icons und Illustrationen
