/**
 * Admin auth routes:
 *   POST   /api/admin/auth  — login (email + password → session cookie)
 *   DELETE /api/admin/auth  — logout (clears session cookie)
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE,
  adminSessionCookieOptions,
  encodeAdminSession,
} from "@/lib/admin-session";

export const runtime = "nodejs";

// ─── POST /api/admin/auth (login) ─────────────────────────────────────────────

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { email, password } =
    body && typeof body === "object"
      ? (body as { email?: unknown; password?: unknown })
      : {};

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  const user = await prisma.adminUser.findUnique({ where: { email } }).catch(
    () => null,
  );

  // Constant-time comparison even on user-not-found
  const hash = user?.password ?? "$2b$12$invalidhashplaceholderXXXXXXXXXXXXXX";
  const valid = await bcrypt.compare(password, hash);

  if (!user || !valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const token = await encodeAdminSession({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  if (!token) {
    return NextResponse.json(
      { error: "Session encoding failed" },
      { status: 500 },
    );
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, adminSessionCookieOptions());

  return NextResponse.json({ ok: true, name: user.name, email: user.email });
}

// ─── DELETE /api/admin/auth (logout) ─────────────────────────────────────────

export async function DELETE() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
