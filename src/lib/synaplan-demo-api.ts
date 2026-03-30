/**
 * Server-only helpers for the public website demo chat.
 * Bearer token: process.env.SYNAPLAN_DEMO_BEARER_TOKEN (see API docs: POST /api/v1/chats, etc.)
 */

const LOG_PREFIX = "[synaplan-demo-api]";

function getBaseUrl(): string | null {
  const raw = process.env.SYNAPLAN_API_BASE_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

/** Trim, strip wrapping quotes, and a leading `Bearer ` if the value was pasted that way. */
export function normalizeBearerToken(raw: string): string {
  let t = raw.trim().replace(/\r/g, "");
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  if (t.toLowerCase().startsWith("bearer ")) {
    t = t.slice(7).trim();
  }
  return t;
}

function getBearer(): string | null {
  const raw = process.env.SYNAPLAN_DEMO_BEARER_TOKEN;
  if (!raw) return null;
  const t = normalizeBearerToken(raw);
  return t.length > 0 ? t : null;
}

export function isDemoChatConfigured(): boolean {
  const secret = process.env.DEMO_CHAT_SESSION_SECRET?.trim();
  return Boolean(
    getBaseUrl() && getBearer() && secret && secret.length >= 16,
  );
}

function coerceId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Docs: `chat` may be a JSON object OR a stringified JSON object.
 * List endpoint uses the same pattern for each item in `chats[]`.
 */
function parseChatField(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t) return null;
  try {
    const once: unknown = JSON.parse(t);
    if (typeof once === "object" && once !== null && !Array.isArray(once)) {
      return once as Record<string, unknown>;
    }
    if (typeof once === "string") {
      try {
        const twice: unknown = JSON.parse(once);
        if (typeof twice === "object" && twice !== null && !Array.isArray(twice)) {
          return twice as Record<string, unknown>;
        }
      } catch {
        return null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * POST /api/v1/chats — 201 Created, body: { success: true, chat: "{...}" | {...} }
 */
export function extractChatIdFromCreateBody(body: unknown): number | null {
  if (body == null || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.success === false) return null;

  const chatRaw =
    b.chat ??
    (b.data && typeof b.data === "object"
      ? (b.data as Record<string, unknown>).chat
      : undefined);

  const chatObj = parseChatField(chatRaw);
  if (!chatObj) return null;
  return coerceId(chatObj.id);
}

function extractUpstreamErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const o = json as Record<string, unknown>;
  const direct =
    (typeof o.message === "string" ? o.message : undefined) ??
    (typeof o.error === "string" ? o.error : undefined) ??
    (typeof o.detail === "string" ? o.detail : undefined);
  if (direct !== undefined && direct.length > 0) return direct;
  if (o.errors && typeof o.errors === "object") {
    try {
      return JSON.stringify(o.errors).slice(0, 300);
    } catch {
      /* ignore */
    }
  }
  return fallback;
}

export async function createDemoChat(title: string): Promise<number> {
  const base = getBaseUrl();
  const token = getBearer();
  if (!base || !token) throw new Error("Demo API not configured");

  const url = `${base}/chats`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
    cache: "no-store",
  });

  const rawText = await res.text();
  let body: unknown = null;
  try {
    body = rawText.trim() ? JSON.parse(rawText) : null;
  } catch {
    console.error(
      `${LOG_PREFIX} POST /chats response is not JSON`,
      { status: res.status, url, preview: rawText.slice(0, 800) },
    );
    throw new Error("Chat API returned non-JSON body");
  }

  const id = extractChatIdFromCreateBody(body);
  /** Docs: POST /chats → 201 Created. `res.ok` is true for 2xx. */
  if (!res.ok || id == null) {
    console.error(`${LOG_PREFIX} POST /chats failed`, {
      status: res.status,
      statusText: res.statusText,
      parsedSuccess: body && typeof body === "object" ? (body as { success?: unknown }).success : undefined,
      extractedId: id,
      bodyPreview:
        typeof body === "object"
          ? JSON.stringify(body).slice(0, 1200)
          : String(body).slice(0, 1200),
    });
    const msg = extractUpstreamErrorMessage(body, res.statusText);
    throw new Error(msg || "Failed to create chat");
  }

  return id;
}

export function buildMessagesStreamUrl(message: string, chatId: number): string {
  const base = getBaseUrl();
  if (!base) throw new Error("Demo API not configured");
  const token = getBearer();
  if (!token) throw new Error("Demo API not configured");

  const url = new URL(`${base}/messages/stream`);
  url.searchParams.set("message", message);
  url.searchParams.set("chatId", String(chatId));
  return url.toString();
}

export async function fetchMessagesStream(
  message: string,
  chatId: number,
): Promise<Response> {
  const token = getBearer();
  if (!token) throw new Error("Demo API not configured");
  const url = buildMessagesStreamUrl(message, chatId);
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
    cache: "no-store",
  });
}
