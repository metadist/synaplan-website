/**
 * Serve blog/admin files from public/uploads at runtime.
 *
 * Next standalone only wires static assets that existed at build time; files
 * written after deploy (bind-mounted volume) are invisible to the default
 * static handler and would 404 without this route.
 */
import { readFile, stat } from "fs/promises";
import { join, resolve } from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function extOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  for (const seg of segments) {
    if (seg === "" || seg === "." || seg === ".." || seg.includes("/") || seg.includes("\\")) {
      return new NextResponse("Bad request", { status: 400 });
    }
  }

  const uploadsRoot = resolve(join(process.cwd(), "public", "uploads"));
  const filePath = resolve(join(uploadsRoot, ...segments));

  const rootWithSep = uploadsRoot.endsWith("/") ? uploadsRoot : `${uploadsRoot}/`;
  if (filePath !== uploadsRoot && !filePath.startsWith(rootWithSep)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const st = await stat(filePath);
    if (!st.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buf = await readFile(filePath);
    const name = segments[segments.length - 1] ?? "";
    const contentType = MIME[extOf(name)] ?? "application/octet-stream";

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
