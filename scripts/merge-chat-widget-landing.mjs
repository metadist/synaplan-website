/**
 * Adds landing page copy + interactive demos for chat widget hub & industry pages.
 * Run: node scripts/merge-chat-widget-landing.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const hubExtraEn = {
  landingHeroBadge: "Website AI · Lead-ready",
  landingStatsTitle: "Fast experiences, serious governance",
  landingStatsSubtitle:
    "Aligned with our technical SEO goals: responsive UI, minimal layout shift, and EU-friendly data handling.",
  stat1Value: "< 2.5s",
  stat1Label: "LCP target",
  stat1Desc:
    "Lean widget bundle and static-first pages help keep Largest Contentful Paint in a healthy range.",
  stat2Value: "< 200ms",
  stat2Label: "Interaction budget",
  stat2Desc:
    "We keep client JS small so taps and scrolls stay snappy — good for INP-style responsiveness.",
  stat3Value: "EU-ready",
  stat3Label: "Data & logs",
  stat3Desc:
    "Retention rules, hosting options, and audit trails — what procurement asks about before sign-off.",
  stepSectionTitle: "Live in four steps",
  step1Title: "Connect sources",
  step1Desc: "Crawl pages, upload PDFs, or paste structured FAQs — same knowledge your team trusts.",
  step2Title: "Map intents",
  step2Desc: "Route visitor questions to the right source (like the flow demo on our homepage).",
  step3Title: "Style & embed",
  step3Desc: "Match your brand, drop in the snippet or WordPress plugin, publish.",
  step4Title: "Measure & iterate",
  step4Desc: "Watch conversations, adjust mappings, scale models when you are ready.",
  painSectionTitle: "What we hear from marketing teams",
  pain1Title: "Generic chatbots hallucinate on pricing",
  pain1Desc:
    "Visitors get wrong numbers — Synaplan grounds answers in your crawled pages and uploaded files.",
  pain2Title: "Another silo to manage",
  pain2Desc:
    "The widget uses your Synaplan workspace: one routing and cost view, not a separate bot stack.",
  pain3Title: "Compliance questions stall rollouts",
  pain3Desc:
    "EU hosting, retention, and logs are built for the conversations legal and IT actually have.",
  benefitSectionTitle: "Why teams pick Synaplan for the website",
  benefit1Title: "Same models as internal workflows",
  benefit1Desc:
    "No split between “website AI” and “serious AI” — one policy surface for your org.",
  benefit2Title: "Multilingual without copy-paste",
  benefit2Desc:
    "Serve visitors in their language while staying tied to your approved source text.",
  benefit3Title: "Open source, inspectable",
  benefit3Desc:
    "No black box — your security team can review what ships. Self-host when required.",
  docsCtaLabel: "Technical docs & embed guides",
  pricingHighlight:
    "Plans from €19.95/mo for website widgets — scale when traffic grows.",
  demoCaption: "Interactive preview — scripted demo, not live data.",
  midCtaTitle: "Run a campaign landing here",
  midCtaLead:
    "Pair this page with Google Ads on “website chatbot”, “GDPR chat widget”, or industry keywords — clear CTAs above the fold and after benefits.",
};

const hubExtraDe = {
  landingHeroBadge: "Website-KI · conversionstark",
  landingStatsTitle: "Schnelle UX, klare Governance",
  landingStatsSubtitle:
    "Passend zu unseren SEO-Zielen: schlankes UI, wenig Layout-Sprung, EU-taugliche Datenführung.",
  stat1Value: "< 2,5s",
  stat1Label: "LCP-Ziel",
  stat1Desc:
    "Schlankes Widget und statische Seiten helfen, den Largest Contentful Paint im grünen Bereich zu halten.",
  stat2Value: "< 200ms",
  stat2Label: "Interaktion",
  stat2Desc:
    "Wenig Client-JS, damit Taps und Scrolls flink bleiben — gut für INP-ähnliche Responsiveness.",
  stat3Value: "EU-ready",
  stat3Label: "Daten & Logs",
  stat3Desc:
    "Aufbewahrung, Hosting-Optionen und Audit-Logs — was Einkauf und Legal vor der Freigabe prüfen.",
  stepSectionTitle: "In vier Schritten live",
  step1Title: "Quellen verbinden",
  step1Desc:
    "Seiten crawlen, PDFs hochladen oder FAQs pflegen — dasselbe Wissen wie intern.",
  step2Title: "Intents zuordnen",
  step2Desc:
    "Besucherfragen auf die richtige Quelle routen (wie im Flow-Beispiel auf der Startseite).",
  step3Title: "Styling & Embed",
  step3Desc: "Branding anpassen, Snippet oder WordPress-Plugin einfügen, veröffentlichen.",
  step4Title: "Messen & iterieren",
  step4Desc:
    "Gespräche auswerten, Mappings anpassen, Modelle bei Bedarf skalieren.",
  painSectionTitle: "Was Marketing-Teams uns sagen",
  pain1Title: "Generische Bots halluzinieren Preise",
  pain1Desc:
    "Besucher bekommen falsche Zahlen — Synaplan fundiert Antworten auf gecrawlten Seiten und Dateien.",
  pain2Title: "Noch ein Silo",
  pain2Desc:
    "Das Widget nutzt Ihren Synaplan-Workspace: ein Routing, eine Kostenübersicht — kein zweiter Bot-Stack.",
  pain3Title: "Compliance bremst Go-live",
  pain3Desc:
    "EU-Hosting, Aufbewahrung und Logs sind für die Fragen gedacht, die Legal und IT wirklich stellen.",
  benefitSectionTitle: "Warum Teams Synaplan fürs Website-Widget wählen",
  benefit1Title: "Dieselben Modelle wie intern",
  benefit1Desc:
    "Kein Bruch zwischen „Website-KI“ und ernsthafter KI — eine Policy-Fläche für die Organisation.",
  benefit2Title: "Mehrsprachig ohne Copy-Paste",
  benefit2Desc:
    "Gäste in ihrer Sprache bedienen — weiterhin an Ihre freigegebenen Quellen gebunden.",
  benefit3Title: "Open Source, prüfbar",
  benefit3Desc:
    "Keine Blackbox — Security kann reviewen. Bei Bedarf selbst hosten.",
  docsCtaLabel: "Technische Doku & Embed-Guides",
  pricingHighlight:
    "Tarife ab 19,95 €/Monat fürs Website-Widget — skalieren wenn Traffic wächst.",
  demoCaption: "Interaktive Vorschau — Demo-Skript, keine Live-Daten.",
  midCtaTitle: "Kampagnen-Landing für Ads",
  midCtaLead:
    "Diese Seite eignet sich für Google Ads zu „Website-Chatbot“, „DSGVO Chat-Widget“ oder Branchen-Keywords — klare CTAs oben und nach den Benefits.",
};

const demosEn = {
  replay: "Replay demo",
  hub: {
    widgetTitle: "Synaplan",
    statusOnline: "Online",
    statusDone: "Ready",
    placeholder: "Ask about hours, files, or policies…",
    bot0:
      "Hi! I can answer from your website, PDFs, and FAQ lists — same policies as your Synaplan workspace.",
    user0: "What are your support hours this week?",
    bot1:
      "Monday–Friday 9:00–18:00 CET, Saturday 10:00–14:00 — taken from your /hours crawl.",
    user1: "Do you have a product PDF I can download?",
    bot2:
      "Yes — handbook.pdf is indexed; I can summarize warranty and safety sections on request.",
    user2: "We need GDPR-friendly hosting — what options exist?",
    bot3:
      "Synaplan supports EU hosting, retention rules for uploads, and detailed logs for audits. Self-host if your policy requires it.",
    user3: "Book a 15-minute setup call for our marketing team.",
  },
  trades: {
    widgetTitle: "Musterhandwerk",
    statusOnline: "On call",
    statusDone: "Ready",
    placeholder: "Ask about appointments, parts, or emergencies…",
    bot0:
      "Hello — I answer from your service pages, price lists, and on-call policy. How can I help?",
    user0: "Can you come out tomorrow morning for a leak?",
    bot1:
      "Emergency slots: Mon–Sat 7:00–20:00 per your published schedule — I can offer the next window or escalate.",
    user1: "Do you stock gasket size XY for model Z?",
    bot2:
      "According to your parts PDF: available for pickup; delivery in 24–48h within your service radius.",
    user2: "What does a standard visit cost?",
    bot3:
      "Starter call-out €89 + materials — details match your /pricing page; I never invent numbers outside it.",
    user3: "Send me the warranty PDF link.",
  },
  hospitality: {
    widgetTitle: "Hotel Demo",
    statusOnline: "Reception AI",
    statusDone: "Ready",
    placeholder: "Check-in, parking, breakfast…",
    bot0:
      "Welcome — I answer from your official hotel pages and seasonal notes. What do you need?",
    user0: "What time is breakfast and where is parking?",
    bot1:
      "Breakfast 6:30–10:30 in the garden restaurant; parking P1 included for guests — from your amenities page.",
    user1: "Are pets allowed in the deluxe rooms?",
    bot2:
      "Pets allowed in selected deluxe rooms with a €25 nightly fee — policy text from your FAQ list.",
    user2: "Can I get a late checkout Sunday?",
    bot3:
      "Late checkout until 14:00 subject to availability — I can outline the fee from your rate sheet.",
    user3: "Book a table at the restaurant for two tonight.",
  },
};

const demosDe = {
  replay: "Demo wiederholen",
  hub: {
    widgetTitle: "Synaplan",
    statusOnline: "Online",
    statusDone: "Bereit",
    placeholder: "Fragen zu Zeiten, Dateien oder Richtlinien…",
    bot0:
      "Hallo! Ich antworte aus Website, PDFs und FAQ — dieselben Richtlinien wie in Ihrem Synaplan-Workspace.",
    user0: "Was sind eure Support-Zeiten diese Woche?",
    bot1:
      "Mo–Fr 9–18 Uhr, Sa 10–14 Uhr — aus Ihrem /zeiten-Crawl.",
    user1: "Gibt es ein Produkt-PDF zum Download?",
    bot2:
      "Ja — handbuch.pdf ist indexiert; ich kann Garantie- und Sicherheitsabschnitte zusammenfassen.",
    user2: "Wir brauchen DSGVO-konformes Hosting — welche Optionen?",
    bot3:
      "Synaplan bietet EU-Hosting, Aufbewahrung für Uploads und detaillierte Logs. Bei Bedarf Self-Hosting.",
    user3: "Bitte 15-Minuten-Setup für unser Marketing-Team buchen.",
  },
  trades: {
    widgetTitle: "Musterhandwerk",
    statusOnline: "Erreichbar",
    statusDone: "Bereit",
    placeholder: "Termine, Ersatzteile, Notdienst…",
    bot0:
      "Guten Tag — ich nutze Ihre Service-Seiten, Preislisten und Bereitschaftsregeln. Was brauchen Sie?",
    user0: "Könnt ihr morgen früh wegen eines Lecks kommen?",
    bot1:
      "Notfallfenster laut Veröffentlichung Mo–Sa 7–20 Uhr — ich kann den nächsten Slot nennen oder eskalieren.",
    user1: "Habt ihr Dichtung XY für Modell Z?",
    bot2:
      "Laut Teile-PDF: abholbar; Lieferung in 24–48 h innerhalb Ihres Einsatzgebiets.",
    user2: "Was kostet ein Standard-Einsatz?",
    bot3:
      "Anfahrt ab 89 € zzgl. Material — wie auf /preise; ich erfinke keine Zahlen außerhalb Ihrer Quellen.",
    user3: "Schick mir den Link zur Garantie-PDF.",
  },
  hospitality: {
    widgetTitle: "Hotel-Demo",
    statusOnline: "Rezeption",
    statusDone: "Bereit",
    placeholder: "Check-in, Parken, Frühstück…",
    bot0:
      "Willkommen — ich antworte aus Ihren offiziellen Hotel-Seiten und Saisonhinweisen. Wobei darf ich helfen?",
    user0: "Wann ist Frühstück und wo parken?",
    bot1:
      "Frühstück 6:30–10:30 im Garten-Restaurant; Parkplatz P1 für Gäste inklusive — laut Ausstattungsseite.",
    user1: "Sind Haustiere in den Deluxe-Zimmern erlaubt?",
    bot2:
      "In ausgewählten Deluxe-Zimmern mit 25 € Aufpreis pro Nacht — aus Ihrer FAQ-Liste.",
    user2: "Später Checkout am Sonntag möglich?",
    bot3:
      "Late Checkout bis 14:00 nach Verfügbarkeit — Gebühr laut Ihrer Preisliste.",
    user3: "Tisch für heute Abend für zwei reservieren.",
  },
};

const tradesExtraEn = {
  landingHeroBadge: "Trades & crafts",
  landingCtaHint:
    "Use this page as a Google Ads landing for “emergency plumber chatbot”, “craft business AI”, or local service keywords.",
  demoCaption: "Industry demo — scripted messages for trades.",
  painSectionTitle: "Sound familiar?",
  pain1Title: "Phone lines jam at 7:01",
  pain1Desc:
    "Repeat questions about coverage and hours burn capacity — automate the first response with grounded answers.",
  pain2Title: "PDFs nobody reads",
  pain2Desc:
    "Specs live in handbooks — the widget surfaces the right paragraph instead of “see our website”.",
  pain3Title: "After-hours anxiety",
  pain3Desc:
    "Publish what you can promise; the widget reflects your on-call rules without overpromising.",
  benefitSectionTitle: "What the widget does for your shop",
  benefit1Title: "Dispatch fewer duplicate calls",
  benefit1Desc:
    "Visitors self-serve on standard questions; your team handles exceptions.",
  benefit2Title: "Parts and pricing stay tied to source",
  benefit2Desc:
    "Mappings to crawl targets and PDFs reduce “creative” answers on money topics.",
  benefit3Title: "Faster experiments",
  benefit3Desc:
    "Change copy and mappings in Synaplan — no redeploy of a separate bot platform.",
  bottomCtaTitle: "Launch a trades-ready widget",
  bottomCtaLead:
    "Start free, connect your pages, then book a demo to align dispatch and marketing.",
};

const tradesExtraDe = {
  landingHeroBadge: "Handwerk & Gewerbe",
  landingCtaHint:
    "Nutzen Sie die Seite als Google-Ads-Landing für „Notdienst Chatbot“, „Handwerks-KI“ oder lokale Service-Keywords.",
  demoCaption: "Branchen-Demo — Skript für Handwerk.",
  painSectionTitle: "Kommt Ihnen das bekannt vor?",
  pain1Title: "Die Leitung klingelt um 7:01",
  pain1Desc:
    "Wiederholte Fragen zu Einsatzgebiet und Zeiten fressen Kapazität — erste Antworten fundiert automatisieren.",
  pain2Title: "PDFs, die niemand liest",
  pain2Desc:
    "Spezifikationen stecken in Handbüchern — das Widget liefert den richtigen Absatz statt „sehen Sie Webseite“.",
  pain3Title: "Außerhalb der Zeiten",
  pain3Desc:
    "Veröffentlichen, was Sie halten können; das Widget spiegelt Ihre Bereitschaftsregeln ohne Überversprechen.",
  benefitSectionTitle: "Was das Widget für Ihren Betrieb bringt",
  benefit1Title: "Weniger Doppel-Anrufe",
  benefit1Desc:
    "Standardfragen klären sich selbst; Ihr Team kümmert sich um Ausnahmen.",
  benefit2Title: "Teile & Preise an der Quelle",
  benefit2Desc:
    "Zuordnung zu Crawl und PDF reduziert „kreative“ Antworten bei Geldthemen.",
  benefit3Title: "Schneller testen",
  benefit3Desc:
    "Texte und Mappings in Synaplan ändern — ohne zweite Bot-Plattform neu deployen.",
  bottomCtaTitle: "Widget für Handwerk starten",
  bottomCtaLead:
    "Kostenlos testen, Seiten anbinden, dann Demo buchen — Disposition und Marketing im Blick.",
};

const hospitalityExtraEn = {
  landingHeroBadge: "Hotels & hosts",
  landingCtaHint:
    "Ideal for Ads on “hotel chatbot”, “guest messaging AI”, or destination + amenity keywords.",
  demoCaption: "Hospitality demo — scripted guest conversation.",
  painSectionTitle: "Where front desks lose time",
  pain1Title: "Same question, ten channels",
  pain1Desc:
    "OTA, email, phone — align answers from one curated knowledge base in Synaplan.",
  pain2Title: "Seasonal policy drift",
  pain2Desc:
    "Breakfast hours and pet rules change — update lists and crawls; the widget follows.",
  pain3Title: "Multilingual nights",
  pain3Desc:
    "Night staff shouldn’t translate policies from scratch — models respond in guest language from approved text.",
  benefitSectionTitle: "Outcomes guests (and GMs) feel",
  benefit1Title: "Shorter queues at reception",
  benefit1Desc:
    "Guests resolve routine questions before they stand in line.",
  benefit2Title: "Brand-consistent answers",
  benefit2Desc:
    "Tone and facts come from your Synaplan configuration, not random web text.",
  benefit3Title: "Campaign-ready landing",
  benefit3Desc:
    "Pair this URL with paid search to measure leads from hospitality-specific intents.",
  bottomCtaTitle: "Add hospitality AI to your site",
  bottomCtaLead:
    "Try Synaplan free, connect your official pages, then scale with Pro connectors when needed.",
};

const hospitalityExtraDe = {
  landingHeroBadge: "Hotels & Gastgewerbe",
  landingCtaHint:
    "Geeignet für Ads zu „Hotel-Chatbot“, „Gäste-KI“ oder Destination- und Ausstattungs-Keywords.",
  demoCaption: "Hospitality-Demo — Gäste-Gespräch als Skript.",
  painSectionTitle: "Wo die Rezeption Zeit verliert",
  pain1Title: "Dieselbe Frage, zehn Kanäle",
  pain1Desc:
    "OTA, Mail, Telefon — Antworten aus einer kuratierten Wissensbasis in Synaplan bündeln.",
  pain2Title: "Saisonale Policy-Drift",
  pain2Desc:
    "Frühstückszeiten und Haustierregeln ändern sich — Listen und Crawls aktualisieren; das Widget folgt.",
  pain3Title: "Mehrsprachige Nächte",
  pain3Desc:
    "Nachtschicht soll nicht Policies improvisieren — Modelle antworten in Gästesprache aus freigegebenem Text.",
  benefitSectionTitle: "Effekte für Gäste und Leitung",
  benefit1Title: "Kürzere Schlangen an der Rezeption",
  benefit1Desc:
    "Routinefragen klären sich, bevor Gäste anstehen.",
  benefit2Title: "Markenkonsistente Antworten",
  benefit2Desc:
    "Ton und Fakten aus Ihrer Synaplan-Konfiguration — kein Zufallstext aus dem Web.",
  benefit3Title: "Landing für Kampagnen",
  benefit3Desc:
    "Diese URL mit Paid Search kombinieren — Intents aus Hotellerie messbar machen.",
  bottomCtaTitle: "Hospitality-KI auf der Website",
  bottomCtaLead:
    "Synaplan kostenlos testen, offizielle Seiten anbinden — Pro-Connectoren bei Bedarf nachziehen.",
};

function merge() {
  for (const [file, hubExtra, tradesEx, hospEx, demos] of [
    ["en.json", hubExtraEn, tradesExtraEn, hospitalityExtraEn, demosEn],
    ["de.json", hubExtraDe, tradesExtraDe, hospitalityExtraDe, demosDe],
  ]) {
    const p = path.join(root, "src", "messages", file);
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    data.chatWidget.hub = { ...data.chatWidget.hub, ...hubExtra };
    data.chatWidget.trades = { ...data.chatWidget.trades, ...tradesEx };
    data.chatWidget.hospitality = {
      ...data.chatWidget.hospitality,
      ...hospEx,
    };
    data.chatWidget.demos = demos;
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
  }
  console.log("Merged landing + demos into en.json and de.json");
}

merge();
