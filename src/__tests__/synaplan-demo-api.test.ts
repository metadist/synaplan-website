/**
 * Unit tests for synaplan-demo-api helpers.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  normalizeBearerToken,
  extractChatIdFromCreateBody,
  buildMessagesStreamUrl,
} from "@/lib/synaplan-demo-api";

describe("normalizeBearerToken", () => {
  it("trims whitespace", () => {
    expect(normalizeBearerToken("  abc  ")).toBe("abc");
  });

  it("strips wrapping double quotes", () => {
    expect(normalizeBearerToken('"mytoken"')).toBe("mytoken");
  });

  it("strips wrapping single quotes", () => {
    expect(normalizeBearerToken("'mytoken'")).toBe("mytoken");
  });

  it("strips leading Bearer prefix (case-insensitive)", () => {
    expect(normalizeBearerToken("Bearer mytoken")).toBe("mytoken");
    expect(normalizeBearerToken("BEARER mytoken")).toBe("mytoken");
  });

  it("strips Bearer prefix inside quotes", () => {
    expect(normalizeBearerToken('"Bearer mytoken"')).toBe("mytoken");
  });
});

describe("extractChatIdFromCreateBody", () => {
  it("extracts numeric id from chat object", () => {
    expect(
      extractChatIdFromCreateBody({ success: true, chat: { id: 42 } }),
    ).toBe(42);
  });

  it("extracts id from JSON-stringified chat field", () => {
    expect(
      extractChatIdFromCreateBody({ success: true, chat: JSON.stringify({ id: 99 }) }),
    ).toBe(99);
  });

  it("returns null when success is false", () => {
    expect(
      extractChatIdFromCreateBody({ success: false, chat: { id: 1 } }),
    ).toBeNull();
  });

  it("returns null for null body", () => {
    expect(extractChatIdFromCreateBody(null)).toBeNull();
  });

  it("returns null for missing chat field", () => {
    expect(extractChatIdFromCreateBody({ success: true })).toBeNull();
  });
});

describe("buildMessagesStreamUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("always includes disableMemories=1 to prevent memory leaks for public demo", () => {
    vi.stubEnv("SYNAPLAN_API_BASE_URL", "https://api.synaplan.com/api/v1");
    vi.stubEnv("SYNAPLAN_DEMO_BEARER_TOKEN", "testtoken");

    const url = new URL(buildMessagesStreamUrl("hello world", 42));

    expect(url.searchParams.get("disableMemories")).toBe("1");
  });

  it("includes message and chatId in the URL", () => {
    vi.stubEnv("SYNAPLAN_API_BASE_URL", "https://api.synaplan.com/api/v1");
    vi.stubEnv("SYNAPLAN_DEMO_BEARER_TOKEN", "testtoken");

    const url = new URL(buildMessagesStreamUrl("test message", 123));

    expect(url.searchParams.get("message")).toBe("test message");
    expect(url.searchParams.get("chatId")).toBe("123");
  });
});
