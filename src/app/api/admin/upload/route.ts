/**
 * Image upload for admin blog editor.
 * POST /api/admin/upload  (multipart/form-data, field: "file")
 * Returns: { url: "/uploads/filename.ext" }
 *
 * Files are stored in public/uploads/ and served as static assets.
 * Allowed: jpg, jpeg, png, gif, webp, svg — max 8 MB.
 */
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { getAdminSessionFromCookies } from "@/lib/admin-session";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Use JPG, PNG, GIF, WebP or SVG." },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 8 MB." },
      { status: 400 },
    );
  }

  // Sanitise filename: keep only alphanumeric, dots, hyphens, underscores
  const ext = extname(file.name).toLowerCase() || ".jpg";
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  const filename = `${base}-${Date.now()}${ext}`;

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
