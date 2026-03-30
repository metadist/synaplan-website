import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DEMO_CHAT_MESSAGE_LIMIT,
} from "@/lib/demo-chat-config";
import {
  DEMO_CHAT_COOKIE,
  decodeDemoSession,
} from "@/lib/demo-chat-session";
import { isDemoChatConfigured } from "@/lib/synaplan-demo-api";

export async function GET() {
  const configured = isDemoChatConfigured();
  if (!configured) {
    return NextResponse.json({
      configured: false,
      max: DEMO_CHAT_MESSAGE_LIMIT,
      remaining: 0,
      sent: 0,
    });
  }

  const jar = await cookies();
  const raw = jar.get(DEMO_CHAT_COOKIE)?.value;
  const session = raw ? decodeDemoSession(raw) : null;
  const sent = session?.sent ?? 0;
  const remaining = Math.max(0, DEMO_CHAT_MESSAGE_LIMIT - sent);

  return NextResponse.json({
    configured: true,
    max: DEMO_CHAT_MESSAGE_LIMIT,
    remaining,
    sent,
    hasChat: Boolean(session?.chatId),
  });
}
