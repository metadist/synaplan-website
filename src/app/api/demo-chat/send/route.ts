import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DEMO_CHAT_MAX_MESSAGE_CHARS,
  DEMO_CHAT_MESSAGE_LIMIT,
} from "@/lib/demo-chat-config";
import {
  DEMO_CHAT_COOKIE,
  decodeDemoSession,
  demoSessionCookieOptions,
  encodeDemoSession,
  type DemoChatSession,
} from "@/lib/demo-chat-session";
import {
  createDemoChat,
  fetchMessagesStream,
  isDemoChatConfigured,
} from "@/lib/synaplan-demo-api";

const LOG_PREFIX = "[demo-chat/send]";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isDemoChatConfigured()) {
    return NextResponse.json(
      { error: "not_configured", message: "Demo chat is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const message =
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message.trim()
      : "";

  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }
  if (message.length > DEMO_CHAT_MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  const jar = await cookies();
  const rawCookie = jar.get(DEMO_CHAT_COOKIE)?.value;
  let session = rawCookie ? decodeDemoSession(rawCookie) : null;

  if (!session) {
    try {
      const chatId = await createDemoChat("synaplan.com try-chat");
      session = { chatId, sent: 0 };
    } catch (err) {
      console.error(`${LOG_PREFIX} createDemoChat failed`, err);
      const message =
        err instanceof Error ? err.message : "Failed to create chat session";
      return NextResponse.json(
        { error: "upstream", code: "create_chat", message },
        { status: 502 },
      );
    }
  }

  if (session.sent >= DEMO_CHAT_MESSAGE_LIMIT) {
    return NextResponse.json(
      {
        error: "limit",
        max: DEMO_CHAT_MESSAGE_LIMIT,
      },
      { status: 429 },
    );
  }

  const nextSession: DemoChatSession = {
    chatId: session.chatId,
    sent: session.sent + 1,
  };

  const signed = encodeDemoSession(nextSession);
  if (!signed) {
    return NextResponse.json(
      { error: "session_unavailable" },
      { status: 503 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetchMessagesStream(message, session.chatId);
  } catch (err) {
    console.error(`${LOG_PREFIX} fetchMessagesStream threw`, err);
    const message =
      err instanceof Error ? err.message : "Failed to reach AI stream";
    return NextResponse.json(
      { error: "upstream", code: "stream_fetch", message },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    let detail = errText.slice(0, 500);
    try {
      const parsed: unknown = JSON.parse(errText);
      if (parsed && typeof parsed === "object" && "message" in parsed) {
        const m = (parsed as { message?: unknown }).message;
        if (typeof m === "string") detail = m;
      }
    } catch {
      /* plain text error */
    }
    console.error(`${LOG_PREFIX} stream upstream not OK`, {
      status: upstream.status,
      statusText: upstream.statusText,
      detail: detail.slice(0, 800),
    });
    return NextResponse.json(
      {
        error: "upstream",
        code: "stream_response",
        status: upstream.status,
        message: detail || upstream.statusText,
      },
      { status: 502 },
    );
  }

  const res = new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
  res.cookies.set(DEMO_CHAT_COOKIE, signed, demoSessionCookieOptions());
  return res;
}
