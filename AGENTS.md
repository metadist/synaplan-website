<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Synaplan Project Conventions

## Tech Stack
- **Framework**: Next.js 16.2 (App Router, Turbopack)
- **React**: 19.2 with Server Components
- **Styling**: Tailwind CSS v4 + shadcn/ui v4 (base-nova style, Base UI)
- **Animations**: Framer Motion (whileInView for scroll, initial+animate for hero)
- **i18n**: next-intl with `[locale]` routing, `proxy.ts` (NOT middleware.ts)
- **Icons**: lucide-react (NO brand icons — use `src/components/icons.tsx` for GitHub/LinkedIn)
- **Package Manager**: npm

## Key Patterns
- `asChild` does NOT exist in shadcn v4. Use `render` prop or `buttonVariants()` with anchor/Link.
- Use `getMessages()` (not `useMessages()`) in async Server Components.
- Brand colors: `brand-50` to `brand-950` (blue, oklch hue 250).
- Container utilities: `container-wide` (max-w-7xl), `container-narrow` (max-w-5xl), `section-padding`.
- CSS utilities: `gradient-brand`, `gradient-text`, `glass`.

## File Structure
```
src/
├── app/[locale]/         # i18n pages
├── components/
│   ├── layout/           # Header, Footer, LanguageSwitcher
│   ├── sections/         # Homepage sections (hero, features, etc.)
│   ├── interactive/      # Client components with animations
│   ├── ui/               # shadcn/ui components
│   └── icons.tsx          # Brand SVG icons
├── i18n/                 # routing, request, navigation
├── lib/                  # utils, constants
└── messages/             # en.json, de.json
```

## i18n
- Default locale: `en` (no prefix). German: `/de/...`
- Translation keys: `namespace.key` format
- Use `useTranslations("namespace")` in client, `getTranslations()` in server

## Coding Standards
- TypeScript strict mode
- Server Components by default, "use client" only when needed
- Responsive: mobile-first, must work from 320px to 8K displays
- All text in translation files, never hardcoded
