/**
 * Unit tests for synaplan-demo-api helpers.
 */
import { describe, it, expect } from "vitest";
import {
  normalizeBearerToken,
  extractChatIdFromCreateBody,
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
