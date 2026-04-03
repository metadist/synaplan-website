/**
 * AI-assisted blog writing via Synaplan API.
 * POST /api/admin/ai-write
 *
 * Body: { prompt: string; locale?: "de" | "en"; mode?: "full" | "outline" | "expand" }
 * Response: SSE stream (text/event-stream) — same format as /messages/stream
 */
import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import {
  createDemoChat,
  fetchMessagesStream,
  isDemoChatConfigured,
} from "@/lib/synaplan-demo-api";

export const runtime = "nodejs";

const SYSTEM_HINTS: Record<string, string> = {
  full_de: `Du bist ein professioneller Blog-Autor für Synaplan, eine KI-Plattform für Unternehmen.
Schreibe einen vollständigen, SEO-optimierten deutschen Blogartikel im Markdown-Format.
Struktur: Einleitung, mehrere H2-Abschnitte, Fazit.
Halte den Ton professionell aber zugänglich. Vermeide Floskeln.`,
  full_en: `You are a professional blog author for Synaplan, an enterprise AI platform.
Write a complete, SEO-optimised English blog post in Markdown format.
Structure: introduction, multiple H2 sections, conclusion.
Keep the tone professional yet approachable. Avoid buzzwords.`,
  outline_de: `Erstelle eine detaillierte Gliederung (Outline) für einen Blogartikel auf Deutsch.
Format: Markdown-Liste mit H2-Überschriften und kurzen Beschreibungen der Unterabschnitte.`,
  outline_en: `Create a detailed outline for a blog post in English.
Format: Markdown list with H2 headings and brief descriptions of sub-sections.`,
  expand_de: `Erweitere den folgenden Text zu einem ausführlichen deutschen Abschnitt. Behalte den Kontext und schreibe im selben Stil weiter.`,
  expand_en: `Expand the following text into a detailed English paragraph. Maintain context and continue in the same style.`,
};

export async function POST(req: Request) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDemoChatConfigured()) {
    return NextResponse.json(
      { error: "Synaplan API not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const {
    prompt,
    locale = "de",
    mode = "full",
  } = body as Record<string, unknown>;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const lang = locale === "en" ? "en" : "de";
  const key = `${mode}_${lang}`;
  const systemHint = SYSTEM_HINTS[key] ?? SYSTEM_HINTS[`full_${lang}`];

  const fullMessage = `${systemHint}\n\n---\n\n${prompt.trim()}`;

  let chatId: number;
  try {
    chatId = await createDemoChat(`admin-ai-write-${Date.now()}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create AI session";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  let upstream: Response;
  try {
    upstream = await fetchMessagesStream(fullMessage, chatId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to reach AI";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: text.slice(0, 400) || upstream.statusText },
      { status: 502 },
    );
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
