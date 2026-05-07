/**
 * Combined proxy (Next.js 16 middleware):
 *   1. /admin/**  → admin session guard (redirect to /admin/login)
 *   2. everything else → next-intl i18n routing
 */
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getAdminSessionFromRequest } from "./lib/admin-session";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Static uploads (blog/admin) — skip i18n; matcher may miss some paths ─────
  if (pathname === "/uploads" || pathname.startsWith("/uploads/")) {
    return NextResponse.next();
  }

  // ── Admin protection ────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      return NextResponse.next();
    }

    const session = await getAdminSessionFromRequest(req);
    if (!session?.userId) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ── i18n routing ────────────────────────────────────────────────────────────
  const res = intlMiddleware(req);

  // Defensive cleanup: if a visitor still has a NEXT_LOCALE cookie from an
  // earlier deploy (when next-intl wrote one), evict it. We never read it
  // anymore (localeDetection: false, localeCookie: false), but leaving it
  // around is confusing during debugging. The URL is the only source of
  // truth for language now.
  if (req.cookies.has("NEXT_LOCALE")) {
    res.cookies.set("NEXT_LOCALE", "", { path: "/", maxAge: 0 });
  }

  return res;
}

export const config = {
  // Exclude static files (.*\..*), API, Next internals, and /uploads (blog images).
  matcher: ["/((?!api|_next|_vercel|uploads(?:/|$)|.*\\..*).*)"],
};
