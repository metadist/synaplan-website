import { describe, expect, it } from "vitest";

import {
  CONSENT_MAX_AGE_MS,
  GA_MEASUREMENT_ID,
  isGaCookieName,
  parseStoredConsent,
  serializeConsent,
} from "@/lib/analytics-consent";

const NOW = Date.parse("2026-11-04T18:00:00Z");

describe("analytics consent storage", () => {
  it("keeps a fresh granted or denied choice", () => {
    expect(parseStoredConsent(serializeConsent("granted", NOW), NOW)).toBe("granted");
    expect(parseStoredConsent(serializeConsent("denied", NOW - 1000), NOW)).toBe("denied");
  });

  it("forgets a choice once it is 180 days old", () => {
    const expiredAt = NOW - CONSENT_MAX_AGE_MS;
    expect(parseStoredConsent(serializeConsent("granted", expiredAt), NOW)).toBeNull();
    expect(parseStoredConsent(serializeConsent("granted", expiredAt + 1), NOW)).toBe("granted");
  });

  it("ignores empty, broken, or unexpected values", () => {
    expect(parseStoredConsent(null, NOW)).toBeNull();
    expect(parseStoredConsent("", NOW)).toBeNull();
    expect(parseStoredConsent("not-json", NOW)).toBeNull();
    expect(parseStoredConsent(JSON.stringify({ choice: "maybe", at: NOW }), NOW)).toBeNull();
    expect(parseStoredConsent(JSON.stringify({ choice: "granted" }), NOW)).toBeNull();
    expect(parseStoredConsent(JSON.stringify({ choice: "granted", at: "today" }), NOW)).toBeNull();
  });

  it("only treats Google analytics cookie names as analytics cookies", () => {
    expect(isGaCookieName("_ga")).toBe(true);
    expect(isGaCookieName(`_ga_${GA_MEASUREMENT_ID.slice(2)}`)).toBe(true);
    expect(isGaCookieName("_gid")).toBe(true);
    expect(isGaCookieName("_gat")).toBe(true);
    expect(isGaCookieName("_gat_gtag")).toBe(true);
    expect(isGaCookieName("_gcl_au")).toBe(true);
    expect(isGaCookieName("_gateway")).toBe(false);
    expect(isGaCookieName("NEXT_LOCALE")).toBe(false);
    expect(isGaCookieName("synaplan_admin")).toBe(false);
  });
});
