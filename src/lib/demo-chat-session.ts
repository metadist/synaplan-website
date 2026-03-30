import { createHmac, timingSafeEqual } from "crypto";
import {
  DEMO_CHAT_COOKIE,
  DEMO_CHAT_COOKIE_MAX_AGE,
  DEMO_CHAT_MESSAGE_LIMIT,
} from "@/lib/demo-chat-config";

export type DemoChatSession = {
  chatId: number;
  /** User messages already sent in this demo session. */
  sent: number;
};

function getSecret(): string | null {
  const s = process.env.DEMO_CHAT_SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function encodeDemoSession(session: DemoChatSession): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString(
    "base64url",
  );
  const sig = signPayload(payload, secret);
  return `${payload}.${sig}`;
}

export function decodeDemoSession(token: string): DemoChatSession | null {
  const secret = getSecret();
  if (!secret) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = signPayload(payload, secret);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const raw = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as unknown;
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    if (typeof o.chatId !== "number" || typeof o.sent !== "number")
      return null;
    if (o.chatId < 1 || o.sent < 0 || o.sent > DEMO_CHAT_MESSAGE_LIMIT)
      return null;
    return { chatId: o.chatId, sent: o.sent };
  } catch {
    return null;
  }
}

export function demoSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEMO_CHAT_COOKIE_MAX_AGE,
  };
}

export { DEMO_CHAT_COOKIE };
