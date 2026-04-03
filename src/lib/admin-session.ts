/**
 * Admin session — HMAC-signed JSON cookie (mirrors demo-chat-session pattern).
 * Cookie name : ADMIN_COOKIE
 * Secret      : process.env.ADMIN_SESSION_SECRET (min 32 chars)
 */
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";

export interface AdminSession {
  userId: number;
  email: string;
  name: string;
}

// ─── Crypto helpers ───────────────────────────────────────────────────────────

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET ?? "";
  if (s.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be at least 32 characters long",
    );
  }
  return s;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const b64 = Buffer.from(sig).toString("base64url");
  return `${payload}.${b64}`;
}

async function verify(token: string, secret: string): Promise<string | null> {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const key = await hmacKey(secret);
  const enc = new TextEncoder();
  const expected = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const expectedB64 = Buffer.from(expected).toString("base64url");
  return expectedB64 === sig ? payload : null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function encodeAdminSession(
  session: AdminSession,
): Promise<string | null> {
  try {
    const secret = getSecret();
    const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
    return await sign(payload, secret);
  } catch {
    return null;
  }
}

export async function decodeAdminSession(
  token: string,
): Promise<AdminSession | null> {
  try {
    const secret = getSecret();
    const payload = await verify(token, secret);
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(json) as AdminSession;
  } catch {
    return null;
  }
}

/** Read session from the Next.js cookies() API (Server Components / Route Handlers). */
export async function getAdminSessionFromCookies(): Promise<AdminSession | null> {
  try {
    const jar = await cookies();
    const raw = jar.get(ADMIN_COOKIE)?.value;
    if (!raw) return null;
    return decodeAdminSession(raw);
  } catch {
    return null;
  }
}

/** Read session from a NextRequest (Middleware). */
export async function getAdminSessionFromRequest(
  req: NextRequest,
): Promise<AdminSession | null> {
  try {
    const raw = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!raw) return null;
    return decodeAdminSession(raw);
  } catch {
    return null;
  }
}

export function adminSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
