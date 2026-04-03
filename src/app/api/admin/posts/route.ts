/**
 * POST list & create:
 *   GET  /api/admin/posts?page=1&limit=20&status=PUBLISHED&locale=de&q=search
 *   POST /api/admin/posts
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import type { PostStatus } from "@/generated/prisma/client";

export const runtime = "nodejs";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── GET (list posts) ─────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") ?? "20"));
  const status = url.searchParams.get("status") as PostStatus | null;
  const locale = url.searchParams.get("locale");
  const q = url.searchParams.get("q")?.trim();

  const where = {
    ...(status && { status }),
    ...(locale && { locale }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        locale: true,
        tags: true,
        views: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ posts, total, page, limit });
}

// ─── POST (create post) ───────────────────────────────────────────────────────

export async function POST(req: Request) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const {
    title,
    slug: rawSlug,
    excerpt,
    content,
    coverImage,
    status = "DRAFT",
    locale = "de",
    tags = [],
    publishedAt,
    translationKey,
  } = body as Record<string, unknown>;

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (typeof content !== "string") {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const slug =
    typeof rawSlug === "string" && rawSlug.trim()
      ? slugify(rawSlug)
      : slugify(title);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: typeof excerpt === "string" ? excerpt : null,
      content,
      coverImage: typeof coverImage === "string" ? coverImage : null,
      status: status as PostStatus,
      locale: typeof locale === "string" ? locale : "de",
      tags: Array.isArray(tags) ? (tags as string[]) : [],
      translationKey: typeof translationKey === "string" && translationKey ? translationKey : null,
      publishedAt:
        status === "PUBLISHED"
          ? typeof publishedAt === "string"
            ? new Date(publishedAt)
            : new Date()
          : null,
      authorId: session.userId,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
