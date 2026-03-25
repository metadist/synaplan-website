# Design-Inspiration & Trends 2026

## Aktuelle Web-Design-Trends (umgesetzt)

### 1. Story-Driven Hero Sections
Statt generischer Taglines nutzen wir narrative Headlines, die den Problem→Lösung-Bogen sofort zeigen. Kein "Welcome to Synaplan", sondern "Take control of your AI."

### 2. Immersive Product Previews
Screenshots sind out. Wir zeigen:
- **Animierte Dashboard-Mockups** im Hero
- **Live Widget-Demos** auf der Chat-Widget-Seite
- **Interaktive Model-Selector** auf der Features-Seite
- **Code-Snippet-Previews** mit Syntax Highlighting für Entwickler

### 3. Purposeful Micro-Animations
Jede Animation hat einen Zweck:
- **Scroll Reveals**: Content wird beim Scrollen sichtbar (GSAP ScrollTrigger)
- **Hover Effects**: Cards liften sich, CTAs reagieren
- **Tab Transitions**: Smooth content switches bei Feature-Tabs
- **Number Counters**: GitHub Stars, Kunden-Anzahl zählen hoch
- **Typing Effect**: In der Hero Section für dynamische Headlines

### 4. Bento Grid Layouts
Moderne Bento-Grid-Layouts für Feature-Sections:

```
┌──────────────┬─────────┐
│              │         │
│  Multi-Model │ Widget  │
│  Routing     │         │
│              ├─────────┤
├──────────────┤ Audit   │
│  Memories /  │ Logs    │
│  RAG         │         │
├──────────────┴─────────┤
│      Dashboard          │
└─────────────────────────┘
```

### 5. Glassmorphism & Subtle Depth
- Glassmorphism für Overlay-Elemente (Navigation Dropdown, Modals)
- Subtile Schatten und Ebenen statt flacher Karten
- Gradient Meshes als Hintergrund-Akzente (dezent, nicht übertrieben)

### 6. Dark Sections für Emphasis
- Hero Section und CTA Sections in Dunkel (`neutral-950`)
- Kontrast zu weißen Content-Sections
- Brand-Blue Akzente leuchten auf dunklem Grund

### 7. Scroll-Progress & Sticky Elements
- Progress Bar im Header zeigt Scroll-Position
- Sticky Table of Contents auf Feature-Seiten
- Sticky CTA Button auf Mobile (Bottom Bar)

## Referenz-Websites (Inspiration)

| Website | Was wir übernehmen |
|---|---|
| **linear.app** | Clean Typography, Animierte Features, Dark Sections |
| **vercel.com** | Developer-fokussiert, Code Previews, Performance-Fokus |
| **cal.com** | Open Source Landing, Community Section, GitHub Stats |
| **resend.com** | Minimalismus, Code-first Demos, Beautiful Typography |
| **dub.co** | Open Source SaaS, Bento Grid, Smooth Animations |
| **planetscale.com** | Enterprise + Developer, Trust Signals, Feature Deep-Dives |
| **clerk.com** | Multi-Audience (Companies/Developers), Interactive Demos |

## Design-Prinzipien

1. **Clarity First**: Value Proposition in 5 Sekunden erkennbar
2. **Show, Don't Tell**: Interaktive Demos statt langer Texte
3. **Progressive Disclosure**: Grundinfo sofort, Details bei Interesse
4. **Consistent Rhythm**: Einheitliche Section-Abstände und Patterns
5. **Accessibility**: WCAG 2.1 AA, Keyboard Navigation, Screen Reader Support
6. **Performance = UX**: Schnelle Ladezeiten sind ein Feature

## Animation-Konzept

### Entrance Animations (GSAP)

```
Hero:       Fade Up + Scale (0.8s, ease-out)
Headings:   Slide Up + Fade (0.6s, staggered 0.1s)
Cards:      Fade Up (0.5s, staggered 0.15s)
Stats:      Count Up (1.5s, ease-out)
Images:     Clip Reveal (0.8s, ease-in-out)
```

### Page Transitions (React 19.2 View Transitions — NATIV)

```
Route Change:   Native View Transition API (cross-fade, zero JS bundle)
Shared Elements: view-transition-name für Bilder/Cards zwischen Seiten
Fallback:       Framer Motion AnimatePresence für ältere Browser
```

### Interaction Animations (Framer Motion)

```
Card Hover:     Scale 1.02 + Shadow lift (0.2s)
Button Hover:   Background transition (0.15s)
Tab Switch:     Layout animation with crossfade
Dropdown Open:  Scale Y from top + Fade (0.15s)
Mobile Menu:    Slide from right (0.3s)
```

### Scroll Animations (GSAP ScrollTrigger)

```
Parallax:       Hero background moves at 0.5x scroll speed
Sticky:         Feature demo sticks while descriptions scroll
Progress:       Section progress indicator
Reveal:         Elements animate in when entering viewport
Pin:            Pricing table pins during comparison scroll
```

## Responsive Design

### Mobile First Approach

| Breakpoint | Anpassungen |
|---|---|
| **< 640px** | Single Column, Hamburger Menu, Stacked Cards, Bottom CTA Bar |
| **640-768px** | 2-Column Grid für Cards, erweiterte Navigation |
| **768-1024px** | Full Navigation Dropdown, 3-Column Grid |
| **1024-1280px** | Desktop Layout, Side-by-Side Sections |
| **> 1280px** | Max-Width Container, Extra Padding |

### Mobile-Spezifische Elemente

- **Sticky Bottom CTA**: "Start for free" Button immer sichtbar
- **Swipeable Carousels**: Testimonials, Features auf Mobile
- **Collapsible Sections**: FAQs, Feature Details
- **Touch-optimierte Hover-States**: Tap statt Hover
