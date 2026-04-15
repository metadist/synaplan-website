import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { createHmac } from "crypto";

/**
 * GitHub Webhook receiver.
 *
 * Setup in GitHub:
 *   Settings → Webhooks → Add webhook
 *   Payload URL:  https://www.synaplan.com/api/github-webhook
 *   Content type: application/json
 *   Secret:       set GITHUB_WEBHOOK_SECRET in .env.local / Vercel env vars
 *   Events:       "Releases" (and optionally "Pushes")
 *
 * On a valid webhook the route calls revalidateTag("github-releases") so
 * Next.js purges the cached GitHub API response and the website shows
 * the new release within the next page render.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  // Verify GitHub signature when a secret is configured
  if (secret) {
    const signature = req.headers.get("x-hub-signature-256");
    if (!signature) {
      return Response.json({ error: "Missing signature" }, { status: 401 });
    }

    const body = await req.text();
    const expected =
      "sha256=" +
      createHmac("sha256", secret)
        .update(body)
        .digest("hex");

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expected.length) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    if (mismatch !== 0) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = req.headers.get("x-github-event");

  // Revalidate on release events and push to main
  if (event === "release" || event === "push") {
    revalidateTag("github-releases", "max");
    return Response.json({ revalidated: true, event });
  }

  return Response.json({ skipped: true, event });
}

// Health check
export async function GET() {
  return Response.json({
    status: "ok",
    info: "POST with a GitHub webhook payload to revalidate the release feed.",
  });
}
