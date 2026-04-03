/**
 * AI writing assistant for the blog editor.
 * POST /api/admin/ai-write
 *
 * Body:
 *   prompt      string  — user instruction / topic
 *   locale      "de" | "en"
 *   mode        "full" | "outline" | "continue" | "rewrite" | "improve" | "translate"
 *   content?    string  — existing editor content (for continue / rewrite / improve)
 *   selection?  string  — selected text (for rewrite / improve)
 *   targetLocale? "de" | "en"  — only used for "translate" mode
 *
 * Response: SSE stream (text/event-stream)
 */
import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import {
  createDemoChat,
  fetchMessagesStream,
  isDemoChatConfigured,
} from "@/lib/synaplan-demo-api";

export const runtime = "nodejs";

type Mode = "full" | "outline" | "continue" | "rewrite" | "improve" | "translate";

function buildSystemPrompt(
  mode: Mode,
  locale: string,
  targetLocale?: string,
): string {
  const lang = locale === "en" ? "English" : "German";
  const targetLang = targetLocale === "en" ? "English" : "German";

  const base = `You are a professional blog author for Synaplan, an enterprise AI platform (open-source, GDPR-compliant, multi-model). Write in a professional yet approachable tone. Use Markdown formatting.`;

  switch (mode) {
    case "full":
      return `${base}
Write a complete, SEO-optimised blog post in ${lang}.
Structure: engaging introduction, multiple H2 sections with real insights, a conclusion with CTA.
Minimum 600 words. Include relevant subheadings and examples.`;

    case "outline":
      return `${base}
Create a detailed blog post outline in ${lang}.
Format: Markdown list with H2 headings and 2-3 bullet points per section describing what to cover.`;

    case "continue":
      return `${base}
Continue the following blog post in ${lang}. Match the existing style, tone and formatting exactly.
Write at least 3 more paragraphs. Do NOT repeat what was already written. Start directly with new content.`;

    case "rewrite":
      return `${base}
Rewrite the following text in ${lang}. Keep the same meaning but improve clarity, flow and engagement.
Return ONLY the rewritten text, no commentary.`;

    case "improve":
      return `${base}
Improve the following text in ${lang}: fix grammar, enhance readability, strengthen the argument, make it more engaging.
Return ONLY the improved version, no explanations.`;

    case "translate":
      return `You are a professional translator specialising in tech and AI content.
Translate the following from ${lang} to ${targetLang}.
Preserve all Markdown formatting (headings, bold, lists, code blocks) exactly.
The text is about Synaplan, an open-source enterprise AI platform.
Return ONLY the translated text.`;
  }
}

function buildMessage(
  mode: Mode,
  prompt: string,
  content?: string,
  selection?: string,
): string {
  const workingText = selection || content || "";

  switch (mode) {
    case "full":
    case "outline":
      return prompt;

    case "continue":
      return `${workingText}\n\n---\n\n${prompt ? `Additional instructions: ${prompt}` : "Please continue writing."}`;

    case "rewrite":
      return selection
        ? `Rewrite this text:\n\n${selection}\n\n${prompt ? `Instructions: ${prompt}` : ""}`
        : `Rewrite this entire post:\n\n${content}\n\n${prompt ? `Instructions: ${prompt}` : ""}`;

    case "improve":
      return selection
        ? `Improve this text:\n\n${selection}\n\n${prompt ? `Focus on: ${prompt}` : ""}`
        : `Improve this entire post:\n\n${content}\n\n${prompt ? `Focus on: ${prompt}` : ""}`;

    case "translate":
      return workingText || prompt;
  }
}

export async function POST(req: Request) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDemoChatConfigured()) {
    return NextResponse.json({ error: "Synaplan API not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const {
    prompt = "",
    locale = "de",
    mode = "full",
    content,
    selection,
    targetLocale,
  } = body as Record<string, unknown>;

  const resolvedMode = (mode as Mode) || "full";
  const lang = locale === "en" ? "en" : "de";
  const tLang = targetLocale === "en" ? "en" : "de";

  const systemPrompt = buildSystemPrompt(resolvedMode, lang, tLang);
  const userMessage = buildMessage(
    resolvedMode,
    typeof prompt === "string" ? prompt : "",
    typeof content === "string" ? content : undefined,
    typeof selection === "string" ? selection : undefined,
  );

  const fullMessage = `${systemPrompt}\n\n---\n\n${userMessage}`;

  let chatId: number;
  try {
    chatId = await createDemoChat(`admin-ai-${resolvedMode}-${Date.now()}`);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create AI session" },
      { status: 502 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetchMessagesStream(fullMessage, chatId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to reach AI" },
      { status: 502 },
    );
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
