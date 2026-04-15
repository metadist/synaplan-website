/**
 * Single-post routes:
 *   GET    /api/admin/posts/:id
 *   PUT    /api/admin/posts/:id
 *   DELETE /api/admin/posts/:id
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

type Params = { params: Promise<{ id: string }> };

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(_req: Request, { params }: Params) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

// ─── PUT (update) ─────────────────────────────────────────────────────────────

export async function PUT(req: Request, { params }: Params) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const {
    title,
    slug,
    excerpt,
    content,
    coverImage,
    status,
    locale,
    tags,
    publishedAt,
    translationKey,
  } = body as Record<string, unknown>;

  // If transitioning to PUBLISHED for the first time, set publishedAt
  const wasPublished = existing.status === "PUBLISHED";
  const nowPublished = status === "PUBLISHED";
  const resolvedPublishedAt =
    nowPublished && !wasPublished
      ? typeof publishedAt === "string"
        ? new Date(publishedAt)
        : new Date()
      : existing.publishedAt;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(typeof title === "string" && { title }),
        ...(typeof slug === "string" && slug.trim() && { slug: slugify(slug) }),
        ...(typeof excerpt === "string" && { excerpt }),
        ...(typeof content === "string" && { content }),
        ...(typeof coverImage === "string" && { coverImage }),
        ...(typeof status === "string" && { status: status as PostStatus }),
        ...(typeof locale === "string" && { locale }),
        ...(Array.isArray(tags) && { tags: tags as string[] }),
        ...(typeof translationKey === "string" && { translationKey: translationKey || null }),
        publishedAt: resolvedPublishedAt,
      },
    });

    return NextResponse.json({ post });
  } catch (e: unknown) {
    const code = typeof e === "object" && e !== null && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002") {
      return NextResponse.json(
        { error: "A post with this slug already exists for this locale. Choose a different slug." },
        { status: 409 },
      );
    }
    console.error("PUT /api/admin/posts/:id", e);
    return NextResponse.json({ error: "Could not update post" }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.post.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
