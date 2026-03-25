# Seiten-Spezifikationen

## 1. Homepage (`/`)

### Ziel
Sofort vermitteln: Was ist Synaplan, für wen, warum. Conversion auf "Start for free" oder "Book Demo".

### Hero Section
- **Headline**: Dynamisch, story-driven (nicht generisch)
  - EN: "Take control of your AI. All models. One platform."
  - DE: "KI unter Kontrolle. Alle Modelle. Eine Plattform."
- **Subheadline**: 1-2 Sätze Value Proposition
- **CTAs**: `[Start for free]` (Primary) + `[Book a demo]` (Secondary)
- **Visual**: Interaktive Produkt-Demo (animiertes Dashboard oder Model-Routing Visualization)
- **Trust Badges**: "Open Source" · "Made in Germany" · "GDPR compliant"
- **Animation**: GSAP-basierte Entrance Animation, Parallax-Effekt auf Produkt-Visual

### Social Proof Bar
- GitHub Stars Count (live via API)
- "Trusted by X companies"
- Partner-Logos (scrolling marquee, dezent)

### "Why Synaplan" Section
- 3-Spalten Grid: Für Unternehmen / Für Website-Betreiber / Für Entwickler
- Jede Karte mit Icon, kurze Beschreibung, Link zur Solutions-Seite
- Hover: Subtle lift + Brand-Color Accent

### Features Highlight
- 4-6 Key Features als animierte Showcase-Cards
- Jedes Feature mit Mini-Demo/Animation
- Tab-basierte oder Scroll-basierte Navigation zwischen Features:
  - Multi-Model Routing
  - Chat Widget
  - Document Upload / RAG
  - Audit Logging
  - Dashboard & Analytics

### Use Cases / Testimonials
- Carousel oder Grid mit echten Kundenbeispielen
- Megaherz Yoga, SANI Pflegedienst, National Secure Cloud, PlateArt, Völker Digital
- Quote-Design mit Foto/Logo des Unternehmens

### Open Source Section
- GitHub Repo Stats (Stars, Forks, Contributors)
- "View on GitHub" CTA
- Recent Commits / Release Notes Teaser
- Discord Community Stats + Join-Link

### Getting Started
- 3-Step Process (wie aktuell, aber visuell aufgewertet)
- Animierte Step-Indikatoren
- Code-Snippet Preview für Entwickler

### CTA Section (Pre-Footer)
- Großer CTA Block mit Gradient Background
- "Confidently launch your AI strategy"
- Demo-Buchung + Free Trial

### Pricing Teaser
- Kompakte Pricing-Übersicht
- Link zu `/pricing` für Details

---

## 2. Solutions: For Companies (`/solutions/companies`)

### Ziel
Enterprise-Entscheider überzeugen: Sicherheit, Compliance, Kostenkontrolle.

### Sections
1. **Hero**: Problem-Statement + Lösung, Enterprise-Visual
2. **Pain Points Grid**: 6 Challenges (wie aktuell, visuell aufgewertet)
3. **Solutions Grid**: Wie Synaplan die Probleme löst
4. **Business vs. Enterprise**: Vergleich der Deployment-Modelle
5. **Use Cases**: Enterprise-fokussierte Testimonials
6. **Trust Section**: Open Source, Made in Germany, GDPR, Flexible
7. **CTA**: Demo buchen / Free Trial

---

## 3. Solutions: For Developers (`/solutions/developers`)

### Ziel
Entwickler begeistern: Open Source, API-first, einfache Integration.

### Sections
1. **Hero**: "Build with open standards" + Terminal/Code Visual
2. **Open Source vs. Proprietary**: Vergleichstabelle
3. **Developer Benefits**: 5 Cards (Open Source, Free, Transparent, Independent, API-first)
4. **Interactive Feature Demo**: Tabs mit Screenshots/Demos
5. **Getting Started**: 3-Step mit Code Snippets (Docker, API Key, Deploy)
6. **API Documentation Teaser**: Link zu docs.synaplan.com
7. **GitHub Integration**: Embedded Repo Stats
8. **Community**: Discord Join + GitHub Discussions

---

## 4. Solutions: Chat Widget (`/solutions/chat-widget`)

### Ziel
Website-Betreiber zum Kauf bewegen: Einfach, schnell, günstig.

### Sections
1. **Hero**: "Build your own support chatbot in minutes" + Live Widget Demo
2. **Video Demo**: 4-Minuten Walkthrough (embedded)
3. **Pain Points**: 6 Challenges für Website-Betreiber
4. **Benefits Grid**: 6 Vorteile (Integration, Automation, Custom Content, Multilingual, GDPR, Fair Pricing)
5. **Interactive Widget Preview**: Live Synaplan Widget auf der Seite (Dogfooding!)
6. **Setup Wizard Steps**: 4 Schritte visuell dargestellt
7. **Pricing**: Ab €19.95/Monat hervorheben
8. **CTA**: Free Trial starten

---

## 5. Features Overview (`/features`)

### Ziel
SEO-Landing für Feature-Suchen, Übersicht aller Capabilities.

### Sections
1. **Hero**: "Everything you need for professional AI management"
2. **Feature Grid**: Alle Features als Cards mit Links zu Detail-Seiten
3. **Comparison Table**: Synaplan vs. Alternativen
4. **CTA**: Free Trial

### Feature Detail Pages (`/features/[feature]`)

Jede Feature-Seite folgt einem Template:
1. **Hero** mit Feature-Name + Beschreibung
2. **Problem → Solution** Narrative
3. **Interactive Demo / Screenshots**
4. **Technical Details** (für Entwickler)
5. **Use Cases** (wie das Feature eingesetzt wird)
6. **Related Features**
7. **CTA**

---

## 6. Pricing (`/pricing`)

### Ziel
Transparente Preisdarstellung, Conversion auf Pro/Team/Business.

### Sections
1. **Pricing Table**: Trial / Pro / Team / Business / Enterprise
2. **Feature Comparison Matrix**: Detaillierter Vergleich
3. **FAQ**: Pricing-bezogene Fragen
4. **CTA**: Free Trial starten

### Interaktivität
- Toggle: Monatlich / Jährlich (wenn relevant)
- Hover-Effekte auf den Pricing Cards
- "Recommended" Badge auf Pro Plan
- Animated number counters

---

## 7. About (`/about`)

### Ziel
Vertrauen aufbauen, Philosophie kommunizieren.

### Sections
1. **Mission Statement**: "We're building the open-source platform for professional AI management"
2. **Philosophy**: "Solving problems for people"
3. **Quote**: Satya Nadella / Dario Amodei Zitat (wie aktuell)
4. **Team Teaser**: → Link zu `/about/team`
5. **Partner Teaser**: → Link zu `/about/partners`

### `/about/team`
- Team-Grid mit Fotos, Namen, Rollen
- Daniel, Stefan, Ralf, Yusuf, Aurel, Ana, Dominik, Furkan
- LinkedIn-Links

### `/about/philosophy`
- "Solving problems for people" — ausführlich
- "AI under control" — was das bedeutet
- Open Source Commitment
- Made in Germany / Made in Europe

### `/about/partners`
- Partner-Grid: IABG, PlateART, Balthasar Ress, Roatel, CastApp, Ocean View Consulting
- Integrationen: OIDC, Nextcloud, OpenDesk
- Synaplan Schweiz GmbH (Daniel, swiss.synaplan.com)

---

## 8. Blog (`/blog`)

### Ziel
SEO-Content, Thought Leadership, Announcements.

### Sections
1. **Featured Post**: Großer Hero mit neuestem/wichtigstem Post
2. **Post Grid**: Cards mit Thumbnail, Titel, Datum, Kategorie
3. **Kategorien**: Announcements, Use Cases, Technical, Company

### Blog Post Template
- MDX-basiert
- Table of Contents (auto-generated)
- Author Info
- Related Posts
- Social Share Buttons
- CTA am Ende

---

## 9. Contact (`/contact`)

### Sections
1. **Contact Form**: Name, Email, Unternehmen, Nachricht
2. **Alternative Kontaktwege**: Email, Discord, LinkedIn
3. **Office-Info**: metadist data management GmbH

---

## 10. Appointment (`/appointment`)

- Embedded Calendly oder ähnliches Booking-Tool
- Alternative: eigenes Booking-System

---

## 11. Legal Pages

### Imprint (`/imprint`)
- metadist data management GmbH Daten
- Synaplan Schweiz GmbH Referenz

### Privacy Policy (`/privacy-policy`)
- DSGVO-konforme Datenschutzerklärung
