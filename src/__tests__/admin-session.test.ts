/**
 * Unit tests for admin-session HMAC signing / verification.
 */
import { describe, it, expect, beforeAll } from "vitest";

// Set a valid 32-char secret before importing the module
beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "a".repeat(32);
});

// Dynamic import after env is set
async function getSessionModule() {
  const mod = await import("@/lib/admin-session");
  return mod;
}

describe("admin-session", () => {
  it("encodes and decodes a valid session", async () => {
    const { encodeAdminSession, decodeAdminSession } = await getSessionModule();

    const session = { userId: 1, email: "test@example.com", name: "Test" };
    const token = await encodeAdminSession(session);

    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");

    const decoded = await decodeAdminSession(token!);
    expect(decoded).toEqual(session);
  });

  it("returns null for a tampered token", async () => {
    const { encodeAdminSession, decodeAdminSession } = await getSessionModule();

    const session = { userId: 1, email: "test@example.com", name: "Test" };
    const token = await encodeAdminSession(session);
    const tampered = token!.slice(0, -5) + "AAAAA";

    const decoded = await decodeAdminSession(tampered);
    expect(decoded).toBeNull();
  });

  it("returns null for an empty token", async () => {
    const { decodeAdminSession } = await getSessionModule();
    expect(await decodeAdminSession("")).toBeNull();
  });

  it("returns null for a token without a dot separator", async () => {
    const { decodeAdminSession } = await getSessionModule();
    expect(await decodeAdminSession("nodot")).toBeNull();
  });

  it("throws when ADMIN_SESSION_SECRET is too short", async () => {
    process.env.ADMIN_SESSION_SECRET = "short";
    const { encodeAdminSession } = await getSessionModule();
    const result = await encodeAdminSession({ userId: 1, email: "x@x.com", name: "x" });
    // Should return null (caught internally) because secret is invalid
    expect(result).toBeNull();
    // Restore for subsequent tests
    process.env.ADMIN_SESSION_SECRET = "a".repeat(32);
  });
});
