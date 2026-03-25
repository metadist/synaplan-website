# Integrationen

## 1. Synaplan Chat Widget (Dogfooding)

### Konzept
Die eigene Synaplan-Seite nutzt das eigene Chat Widget — perfekte Demonstration des Produkts ("Dogfooding").

### Implementierung

```tsx
// components/integrations/synaplan-chat.tsx
"use client";

import { useEffect } from "react";

export function SynaplanChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.synaplan.com/widget.php?uid=SYNAPLAN_UID&widgetid=SYNAPLAN_WIDGET_ID&mode=inline-box";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return null;
}
```

### Zwei Chat-Modi (aus Revibe Doc)

| Modus | Zielgruppe | Inhalte |
|---|---|---|
| **User & Partner** | Interessenten, Kunden | Preise, Hintergrundinformationen, Use Cases |
| **Developer** | Entwickler | Architekturwissen, API-Doku, Integrations-Guides |

### Umsetzung
- Eigener Firmen-Account für die Website
- Widget-Konfiguration pro Zielgruppe
- Automatische Spracherkennung (Widget-Feature)

---

## 2. GitHub Integration

### Repository Stats

Live-Daten vom GitHub Repository (`metadist/synaplan`):

```tsx
// lib/github.ts
export async function getGitHubStats() {
  const res = await fetch("https://api.github.com/repos/metadist/synaplan", {
    next: { revalidate: 3600 }, // ISR: stündlich aktualisieren
  });
  const data = await res.json();

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.watchers_count,
    openIssues: data.open_issues_count,
    language: data.language,
    license: data.license?.name,
    updatedAt: data.updated_at,
  };
}
```

### Anzeige auf der Seite

- **Header**: GitHub Stars Badge (live count)
- **Homepage**: Open Source Section mit Stars, Forks, Contributors
- **Developer Page**: Prominent GitHub CTA + Repo Stats
- **Footer**: GitHub Link

### Latest Releases

```tsx
export async function getLatestReleases(count = 3) {
  const res = await fetch(
    "https://api.github.com/repos/metadist/synaplan/releases?per_page=" + count,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}
```

---

## 3. Discord Integration

### Anforderungen (aus Revibe Doc)
- Announcements nur einmal posten (nicht doppelt auf Discord + Website)
- Community-Verweis

### Umsetzung

| Element | Beschreibung |
|---|---|
| **Join Button** | Discord Invite Link im Header und Footer |
| **Community Stats** | Member Count via Discord API (optional) |
| **Announcements** | Blog-Posts = Source of Truth, Discord bekommt Webhook-Notification |

### Discord Webhook für Blog-Posts

Bei neuem Blog-Post (in CI/CD Pipeline oder via API Route):

```ts
// Webhook bei Deployment oder Blog-Post Publish
async function notifyDiscord(post: BlogPost) {
  await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: post.title,
        description: post.excerpt,
        url: `https://synaplan.com/blog/${post.slug}`,
        color: 0x3B82F6, // Brand Blue
        timestamp: new Date().toISOString(),
      }],
    }),
  });
}
```

---

## 4. Partnerschaften

### Partner-Daten

```ts
// content/partners.ts
export const partners = [
  {
    name: "IABG",
    logo: "/partners/iabg.svg",
    url: "https://www.iabg.de",
    category: "enterprise",
  },
  {
    name: "PlateART",
    logo: "/partners/plateart.svg",
    url: "https://www.plateart.com",
    category: "sme",
  },
  {
    name: "Balthasar Ress",
    logo: "/partners/ress.svg",
    url: "https://www.balthasar-ress.de",
    category: "sme",
  },
  {
    name: "Roatel",
    logo: "/partners/roatel.svg",
    url: "https://www.roatel.com",
    category: "sme",
  },
  {
    name: "CastApp",
    logo: "/partners/castapp.svg",
    url: "#",
    category: "tech",
  },
  {
    name: "Ocean View Consulting",
    logo: "/partners/ocean-view.svg",
    url: "#",
    category: "consulting",
  },
];
```

### Integrationen

```ts
export const integrations = [
  { name: "OIDC", icon: "key", description: "OpenID Connect Authentication" },
  { name: "Nextcloud", icon: "cloud", description: "File Sync & Collaboration" },
  { name: "OpenDesk", icon: "monitor", description: "Digital Workplace" },
];
```

---

## 5. Synaplan Schweiz

- Link zu `swiss.synaplan.com` im Footer
- Erwähnung auf About/Partners Seite
- Kontaktperson: Daniel Burgwinkel

---

## 6. Analytics & Tracking

| Tool | Zweck |
|---|---|
| **Vercel Analytics** | Web Vitals, Performance Monitoring |
| **Plausible** oder **Umami** | Privacy-first Website Analytics (DSGVO-konform) |
| **Google Search Console** | SEO Monitoring, Indexierung |

### Warum kein Google Analytics?

- DSGVO-Problematik
- Passt nicht zur "Privacy first" Brand Message
- Plausible/Umami sind Open Source Alternativen

---

## 7. Booking / Appointment

| Option | Beschreibung |
|---|---|
| **Calendly Embed** | Schnelle Umsetzung, bewährt |
| **Cal.com** | Open Source Alternative (passt zur Brand) |
| **Custom** | Eigenes Formular + API Route |

**Empfehlung**: Cal.com — Open Source, passt zur Philosophie, Self-hostbar.
