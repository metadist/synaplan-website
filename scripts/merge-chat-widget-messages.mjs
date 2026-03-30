/**
 * Merges chatWidget namespace + footer keys + widgetFlow CTA into en.json / de.json.
 * Run: node scripts/merge-chat-widget-messages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const chatWidgetEn = {
  hub: {
    metaTitle: "Synaplan chat widget — website AI with RAG & GDPR",
    metaDescription:
      "Embed Synaplan’s chat widget on your site: crawled pages, PDFs, FAQs, and APIs as knowledge. Trades, hotels, and real customer stories. EU-ready.",
    breadcrumbHome: "Home",
    breadcrumbChatWidget: "Chat widget",
    heroTitle: "Your website, your AI — grounded in your content",
    heroLead:
      "The Synaplan chat widget answers visitors with the same models and policies you use internally. Point it at crawled pages, uploaded documents, structured lists, or connected systems — so answers stay accurate and on-brand.",
    sectionEmbedTitle: "Go live in a day",
    sectionEmbedP1:
      "Add a small script snippet or the WordPress plugin, match colors and placement to your layout, and publish. No separate bot stack — the widget uses your Synaplan workspace, including routing and cost controls.",
    sectionEmbedP2:
      "Visitors get instant help on opening hours, pricing, downloads, and contact options while your team stays focused on complex cases.",
    sectionKnowledgeTitle: "Knowledge that matches your business",
    sectionKnowledgeP1:
      "Combine public crawl targets (e.g. /hours, /pricing) with private sources: PDF handbooks, Word quotes, FAQ bullets, and Pro connectors to CRM or your own API for personalized answers.",
    sectionKnowledgeP2:
      "You decide what each question type may read — similar to the interactive flow on our homepage: map visitor intents to the right source, swap when content changes.",
    sectionComplianceTitle: "Built for European expectations",
    sectionComplianceP1:
      "Host in the EU, define retention for uploads, and rely on audit-friendly logs when you need to explain what the model saw. Self-host Synaplan when your security team requires full data sovereignty.",
    sectionExploreTitle: "Where teams use it",
    sectionExploreLead:
      "Industry-specific playbooks — how trades businesses, hotels, and service teams roll out the widget without drowning in tickets.",
    cardTradesTitle: "Trades & crafts",
    cardTradesDesc:
      "Appointments, emergency lines, and spare-part questions — answered from your real pages and PDFs.",
    cardHospitalityTitle: "Hotels & hospitality",
    cardHospitalityDesc:
      "Front-desk load off: arrivals, parking, breakfast, and local tips from your curated content.",
    cardCustomersTitle: "Customer references",
    cardCustomersDesc:
      "Yoga studios, care services, public-sector cloud, and more — how organizations deploy Synaplan today.",
    faqTitle: "Chat widget FAQ",
    faq1Q: "Does the widget use the same models as our internal Synaplan workspace?",
    faq1A:
      "Yes. You choose routing and models in one place; the widget is another channel on top of the same policies and knowledge base.",
    faq2Q: "Can we mix crawled website text with uploaded PDFs?",
    faq2A:
      "Absolutely. Map visitor questions to crawl targets, files, structured lists, or APIs — and change mappings when you update content.",
    faq3Q: "Is it suitable for GDPR-focused teams?",
    faq3A:
      "Synaplan is designed with EU deployment in mind: data residency options, retention controls, and detailed logs. Your legal review still applies to your use case.",
    faq4Q: "Where do I start?",
    faq4A:
      "Open the docs for the embed snippet and WordPress plugin, or book a demo for a walkthrough with your IT and marketing stakeholders.",
    bottomCtaTitle: "Ready to try it on your site?",
    bottomCtaLead: "Start free, or book a short demo to align security and branding.",
  },
  trades: {
    metaTitle: "Chat widget for trades & crafts — Synaplan",
    metaDescription:
      "Answer appointment, pricing, and emergency questions on your craft business website with a Synaplan chat widget grounded in your real pages and PDFs.",
    breadcrumbCurrent: "Trades & crafts",
    heroTitle: "Less phone tag, more time on the job",
    heroLead:
      "Master workshops and regional service teams use the Synaplan widget to handle repeat questions — opening hours, service areas, quote requests, and PDF spec sheets — without maintaining a separate FAQ bot.",
    section1Title: "Typical visitor intents",
    section1Body:
      "When can you come out? Do you stock this part? Where is your emergency number? What’s in the warranty PDF? Map each intent to a crawl path, an uploaded document, or a short structured list so answers stay short and factual.",
    section2Title: "After-hours and peaks",
    section2Body:
      "Even when the office is closed, visitors get orientation from your published hours and on-call policy. Escalations still go to your team — the widget reduces noise, not accountability.",
    section3Title: "SEO note",
    section3Body:
      "This page is part of our chat-widget hub. Link here from service-area pages and blog posts so search engines understand how trades businesses use conversational AI with Synaplan.",
  },
  hospitality: {
    metaTitle: "Chat widget for hotels & hospitality — Synaplan",
    metaDescription:
      "Reduce front-desk load with a Synaplan chat widget: check-in, parking, breakfast, and local tips from your official content — multilingual and on-brand.",
    breadcrumbCurrent: "Hotels & hospitality",
    heroTitle: "Guest questions, consistent answers",
    heroLead:
      "Hotels and hosts publish the same facts in many places. The widget pulls from your chosen pages and lists so “breakfast time” and “pet policy” don’t drift between the website, OTA copy, and reception scripts.",
    section1Title: "What to connect",
    section1Body:
      "Point visitor questions at your rates and policy pages, PDF brochures, and a curated FAQ list for things that change seasonally. For member or loyalty data, use Pro connectors with your CRM rules.",
    section2Title: "Languages and tone",
    section2Body:
      "Align the widget with your brand voice in Synaplan and serve international guests with multilingual models — still grounded in your approved text.",
    section3Title: "SEO note",
    section3Body:
      "Use this page as a topical landing URL from destination guides and amenity pages; internal links help us describe hospitality-specific widget deployments clearly.",
  },
  customers: {
    metaTitle: "Synaplan chat widget — customer references",
    metaDescription:
      "How yoga studios, care providers, public-sector cloud, and product teams use Synaplan — including the website chat widget and secure AI workflows.",
    breadcrumbCurrent: "Customer references",
    heroTitle: "Deployed by teams who need clarity and control",
    heroLead:
      "Below are representative ways customers use Synaplan. Quotes are from our public materials; deployments vary by plan and configuration.",
    introP1:
      "Across industries, the same pattern appears: connect approved knowledge, route models centrally, and give visitors self-service without shadow IT.",
    introP2:
      "Use these stories to benchmark your rollout — from SMB websites to regulated environments.",
    story1Company: "Megaherz Yoga",
    story1Role: "Courses & bookings",
    story1Quote: "More time for mindfulness and less effort for organization.",
    story1Body:
      "The studio uses Synaplan to answer recurring questions about schedules and studio rules, so teachers stay present with participants instead of inbox triage.",
    story2Company: "SANI Pflegedienst",
    story2Role: "Care services",
    story2Quote: "Caregivers need time for people.",
    story2Body:
      "Frequent questions route through structured answers where appropriate, easing pressure on nursing staff while keeping escalation paths clear.",
    story3Company: "National Secure Cloud",
    story3Role: "Public-sector cloud",
    story3Quote: "Authorities use Synaplan to securely process sensitive data.",
    story3Body:
      "A GDPR-aware layer over external AI services helps teams meet compliance expectations while adopting modern tools.",
    story4Company: "PlateArt",
    story4Role: "Product & support",
    story4Quote: "Straightforward AI use for support and internal processes.",
    story4Body:
      "SMB-friendly rollout: website and internal workflows share governance without a heavy IT project.",
  },
};

const chatWidgetDe = {
  hub: {
    metaTitle: "Synaplan Chat-Widget — Website-KI mit RAG & DSGVO",
    metaDescription:
      "Synaplan Chat-Widget einbinden: gecrawlte Seiten, PDFs, FAQs und APIs als Wissen. Handwerk, Hotels und echte Kundenbeispiele. EU-tauglich.",
    breadcrumbHome: "Start",
    breadcrumbChatWidget: "Chat-Widget",
    heroTitle: "Ihre Website, Ihre KI — fundiert auf Ihren Inhalten",
    heroLead:
      "Das Synaplan Chat-Widget beantwortet Besucherfragen mit denselben Modellen und Richtlinien wie intern. Verknüpfen Sie gecrawlte Seiten, hochgeladene Dokumente, strukturierte Listen oder angebundene Systeme — für präzise, markenkonforme Antworten.",
    sectionEmbedTitle: "Schnell live",
    sectionEmbedP1:
      "Einbindung per Snippet oder WordPress-Plugin, Farben und Position an Layout anpassen und veröffentlichen — ohne separaten Bot-Stack; das Widget nutzt Ihren Synaplan-Workspace inkl. Routing und Kostenkontrolle.",
    sectionEmbedP2:
      "Besucher erhalten Hilfe zu Öffnungszeiten, Preisen, Downloads und Kontakt — Ihr Team konzentriert sich auf komplexe Fälle.",
    sectionKnowledgeTitle: "Wissen, das zum Betrieb passt",
    sectionKnowledgeP1:
      "Öffentliche Crawl-Ziele (z. B. /zeiten, /preise) mit privaten Quellen kombinieren: PDF-Handbücher, Word-Angebote, FAQ-Listen und mit Pro CRM oder eigene APIs für personalisierte Antworten.",
    sectionKnowledgeP2:
      "Sie steuern, welche Intent-Typen was lesen dürfen — ähnlich dem interaktiven Flow auf der Startseite: Fragen den passenden Quellen zuordnen und bei Content-Änderungen anpassen.",
    sectionComplianceTitle: "Für europäische Erwartungen gebaut",
    sectionComplianceP1:
      "Hosting in der EU, Aufbewahrung für Uploads definieren und nachvollziehbare Logs, wenn Sie erklären müssen, was das Modell gesehen hat. Synaplan bei Bedarf selbst hosten, wenn Ihre Security volle Datensouveränität verlangt.",
    sectionExploreTitle: "Wo Teams es nutzen",
    sectionExploreLead:
      "Branchennahe Einblicke — Handwerk, Hotels und Service-Teams, die das Widget ohne Ticket-Flut ausrollen.",
    cardTradesTitle: "Handwerk & Gewerbe",
    cardTradesDesc:
      "Termine, Notfälle, Ersatzteile — Antworten aus echten Seiten und PDFs.",
    cardHospitalityTitle: "Hotels & Gastgewerbe",
    cardHospitalityDesc:
      "Entlastung an der Rezeption: Anreise, Parken, Frühstück und Tipps aus Ihren Inhalten.",
    cardCustomersTitle: "Kundenreferenzen",
    cardCustomersDesc:
      "Yoga-Studios, Pflege, öffentliche Cloud und mehr — wie Organisationen Synaplan einsetzen.",
    faqTitle: "FAQ zum Chat-Widget",
    faq1Q: "Nutzt das Widget dieselben Modelle wie unser interner Synaplan-Workspace?",
    faq1A:
      "Ja. Routing und Modelle steuern Sie zentral; das Widget ist ein weiterer Kanal mit denselben Richtlinien und derselben Wissensbasis.",
    faq2Q: "Können wir gecrawlte Texte mit hochgeladenen PDFs mischen?",
    faq2A:
      "Ja. Ordnen Sie Besucherfragen Crawl-Pfaden, Dateien, strukturierten Listen oder APIs zu — und passen Sie Zuordnungen bei Content-Updates an.",
    faq3Q: "Ist das für DSGVO-fokussierte Teams geeignet?",
    faq3A:
      "Synaplan ist für EU-Einsatz konzipiert: Datenstandort, Aufbewahrung, detaillierte Logs. Ihre Rechtsprüfung bleibt natürlich anwendungsspezifisch.",
    faq4Q: "Wo starte ich?",
    faq4A:
      "Dokumentation zu Snippet und WordPress-Plugin lesen oder eine Demo buchen — für IT und Marketing gemeinsam.",
    bottomCtaTitle: "Direkt auf Ihrer Seite testen?",
    bottomCtaLead: "Kostenlos starten oder kurz demo buchen — Security und Branding im Blick.",
  },
  trades: {
    metaTitle: "Chat-Widget für Handwerk & Gewerbe — Synaplan",
    metaDescription:
      "Termine, Preise und Notfallfragen auf der Handwerks-Website mit Synaplan Chat-Widget — fundiert auf echten Seiten und PDFs.",
    breadcrumbCurrent: "Handwerk & Gewerbe",
    heroTitle: "Weniger Telefon-Chaos, mehr Zeit auf der Baustelle",
    heroLead:
      "Meisterbetriebe und regionale Dienste nutzen das Synaplan-Widget für wiederkehrende Fragen — Öffnungszeiten, Einsatzgebiete, Angebote und PDF-Datenblätter — ohne einen separaten FAQ-Bot zu pflegen.",
    section1Title: "Typische Besucher-Intents",
    section1Body:
      "Wann können Sie kommen? Haben Sie dieses Teil? Wo ist die Notfallnummer? Was steht in der Garantie-PDF? Ordnen Sie jeden Intent einem Crawl-Pfad, Dokument oder einer kurzen Liste zu — Antworten bleiben knapp und sachlich.",
    section2Title: "Außerhalb der Zeiten und bei Peaks",
    section2Body:
      "Auch wenn niemand rangeht, bekommen Besucher Orientierung aus veröffentlichten Zeiten und Bereitschaftsregeln. Eskalationen bleiben bei Ihrem Team — das Widget reduziert Lärm, nicht Verantwortung.",
    section3Title: "Hinweis für SEO",
    section3Body:
      "Diese Seite gehört zum Chat-Widget-Hub; verlinken Sie von Leistungs- und Regionalseiten, damit Suchmaschinen den Einsatz im Handwerk klar zuordnen können.",
  },
  hospitality: {
    metaTitle: "Chat-Widget für Hotels & Hospitality — Synaplan",
    metaDescription:
      "Rezeption entlasten mit Synaplan Chat-Widget: Check-in, Parken, Frühstück und lokale Tipps — mehrsprachig und markenkonform.",
    breadcrumbCurrent: "Hotels & Hospitality",
    heroTitle: "Gästefragen, konsistente Antworten",
    heroLead:
      "Hotels und Gastgeber:innen pflegen Fakten an vielen Stellen. Das Widget zieht aus gewählten Seiten und Listen, damit Frühstückszeiten und Haustierregeln nicht zwischen Website, OTA und Rezeption auseinanderlaufen.",
    section1Title: "Was anbinden",
    section1Body:
      "Fragen auf Preis- und Policy-Seiten, PDFs und saisonal gepflegte FAQ-Listen lenken. Für Treue- oder Mitgliedsdaten Pro-Connectoren mit CRM-Regeln nutzen.",
    section2Title: "Sprache und Ton",
    section2Body:
      "Stimmen Sie Stimme und Markenauftritt in Synaplan ab und bedienen Sie internationale Gäste mit mehrsprachigen Modellen — weiterhin auf freigegebenen Texten.",
    section3Title: "Hinweis für SEO",
    section3Body:
      "Diese URL als thematische Landingpage von Destination- und Ausstattungsseiten verlinken — interne Verlinkung hilft, Hospitality-Einsätze klar zu beschreiben.",
  },
  customers: {
    metaTitle: "Synaplan Chat-Widget — Kundenreferenzen",
    metaDescription:
      "Wie Yoga-Studios, Pflegedienste, öffentliche Cloud und Produktteams Synaplan nutzen — inklusive Website-Widget und sicherer KI-Workflows.",
    breadcrumbCurrent: "Kundenreferenzen",
    heroTitle: "Eingesetzt von Teams, die Klarheit und Kontrolle brauchen",
    heroLead:
      "Nachfolgend typische Einsatzszenarien. Zitate stammen aus unseren öffentlichen Materialien; der Umfang variiert je nach Plan und Konfiguration.",
    introP1:
      "Branchenübergreifend gilt: freigegebenes Wissen anbinden, Modelle zentral routen, Besuchern Self-Service ohne Schatten-IT geben.",
    introP2:
      "Nutzen Sie die Beispiele als Benchmark — von KMU-Websites bis regulierten Umgebungen.",
    story1Company: "Megaherz Yoga",
    story1Role: "Kurse & Buchungen",
    story1Quote: "Mehr Zeit für Achtsamkeit und weniger Aufwand für Organisation.",
    story1Body:
      "Das Studio beantwortet wiederkehrende Fragen zu Zeiten und Studio-Regeln mit Synaplan, damit Lehrkräfte bei den Teilnehmenden bleiben statt im Postfach.",
    story2Company: "SANI Pflegedienst",
    story2Role: "Pflegedienst",
    story2Quote: "Pflegekräfte brauchen Zeit für Menschen.",
    story2Body:
      "Häufige Fragen laufen über strukturierte Antworten; Eskalationen bleiben klar beim Team.",
    story3Company: "National Secure Cloud",
    story3Role: "Öffentliche Cloud",
    story3Quote: "Behörden nutzen Synaplan zur sicheren Verarbeitung sensibler Daten.",
    story3Body:
      "Eine DSGVO-bewusste Schicht über externen KI-Diensten unterstützt Compliance-Erwartungen.",
    story4Company: "PlateArt",
    story4Role: "Produkt & Support",
    story4Quote: "Unkomplizierter KI-Einsatz für Support und interne Prozesse.",
    story4Body:
      "SMB-tauglicher Rollout: Website und interne Workflows teilen sich Governance ohne Groß-IT-Projekt.",
  },
};

function mergeFile(filename, chatWidget, widgetFlowCta, footerExtra) {
  const p = path.join(root, "src", "messages", filename);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  data.widgetFlow = { ...data.widgetFlow, ...widgetFlowCta };
  data.chatWidget = chatWidget;
  data.footer = { ...data.footer, ...footerExtra };
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

mergeFile(
  "en.json",
  chatWidgetEn,
  {
    ctaLead:
      "Explore embedding, knowledge sources, industry examples, and how real teams deploy the widget.",
    ctaButton: "Learn more about the chat widget",
  },
  {
    widgetTrades: "Widget: Trades & crafts",
    widgetHospitality: "Widget: Hotels",
    widgetReferences: "Widget: Customer stories",
  },
);

mergeFile(
  "de.json",
  chatWidgetDe,
  {
    ctaLead:
      "Einbindung, Wissensquellen, Branchenbeispiele und echte Rollouts — alles im Überblick.",
    ctaButton: "Mehr zum Chat-Widget erfahren",
  },
  {
    widgetTrades: "Widget: Handwerk & Gewerbe",
    widgetHospitality: "Widget: Hotels",
    widgetReferences: "Widget: Kundenreferenzen",
  },
);

console.log("Merged chatWidget + CTA + footer keys into en.json and de.json");
