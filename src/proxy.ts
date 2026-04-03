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
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
