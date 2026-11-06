/**
 * Google Analytics is loaded only after an explicit opt-in.
 * Declining, ignoring the notice, or an expired choice never inserts the tag
 * and never sets analytics cookies. The choice itself lives in localStorage
 * (not a cookie) for 180 days, matching the privacy policy.
 */

export const GA_MEASUREMENT_ID = "G-0D8L6ESEFT";

export const CONSENT_STORAGE_KEY = "synaplan.analyticsConsent";

/** Matches the "180 days" retention stated in the privacy policy. */
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

const INLINE_SCRIPT_ID = "ga-gtag-inline";
const SOURCE_SCRIPT_ID = "ga-gtag-src";

export type AnalyticsConsent = "granted" | "denied";

export interface StoredConsent {
  choice: AnalyticsConsent;
  at: number;
}

const ANALYTICS_GRANTED = {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
} as const;

const ANALYTICS_DENIED = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
} as const;

const GA_CONFIG = {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
} as const;

export function parseStoredConsent(raw: string | null, now: number): AnalyticsConsent | null {
  if (!raw) return null;
  let parsed: Partial<StoredConsent>;
  try {
    parsed = JSON.parse(raw) as Partial<StoredConsent>;
  } catch {
    return null;
  }
  if (parsed.choice !== "granted" && parsed.choice !== "denied") return null;
  if (typeof parsed.at !== "number" || !Number.isFinite(parsed.at)) return null;
  if (now - parsed.at >= CONSENT_MAX_AGE_MS) return null;
  return parsed.choice;
}

export function serializeConsent(choice: AnalyticsConsent, at: number): string {
  return JSON.stringify({ choice, at } satisfies StoredConsent);
}

export function isGaCookieName(name: string): boolean {
  return (
    name === "_ga" ||
    name.startsWith("_ga_") ||
    name === "_gid" ||
    name === "_gat" ||
    name.startsWith("_gat_") ||
    name.startsWith("_gcl_")
  );
}

export function readConsent(now = Date.now()): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY), now);
  } catch {
    return null;
  }
}

/** Drops an unreadable or expired choice and any analytics cookies it left behind. */
export function discardExpiredConsent(now = Date.now()): void {
  if (typeof window === "undefined") return;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return;
  }
  if (!raw || parseStoredConsent(raw, now) !== null) return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Storage can be blocked; the expired choice is still ignored.
  }
  clearAnalyticsCookies();
}

export function writeConsent(choice: AnalyticsConsent, now = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serializeConsent(choice, now));
  } catch {
    // Private mode can reject storage. The in-memory choice still applies.
  }
}

export function installGoogleAnalytics(): void {
  if (typeof document === "undefined") return;
  setGaDisabled(false);

  if (document.getElementById(SOURCE_SCRIPT_ID)) {
    window.gtag?.("consent", "update", { ...ANALYTICS_GRANTED });
    return;
  }

  const inline = document.createElement("script");
  inline.id = INLINE_SCRIPT_ID;
  inline.text = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag = gtag;",
    `gtag('consent', 'default', ${JSON.stringify(ANALYTICS_GRANTED)});`,
    "gtag('js', new Date());",
    `gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)}, ${JSON.stringify(GA_CONFIG)});`,
  ].join("\n");
  document.head.appendChild(inline);

  const src = document.createElement("script");
  src.id = SOURCE_SCRIPT_ID;
  src.async = true;
  src.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(src);
}

export function stopGoogleAnalytics(): void {
  if (typeof window === "undefined") return;
  setGaDisabled(true);
  window.gtag?.("consent", "update", { ...ANALYTICS_DENIED });
  clearAnalyticsCookies();
}

export function trackPageView(): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    ...GA_CONFIG,
    page_path: window.location.pathname,
    page_title: document.title,
  });
}

export function clearAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim() ?? "")
    .filter((name) => isGaCookieName(name));
  if (names.length === 0) return;

  const host = window.location.hostname;
  const bare = host.replace(/^www\./, "");
  const domains = [undefined, host, `.${host}`, bare, `.${bare}`];
  for (const name of names) {
    for (const domain of domains) {
      const domainAttr = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; path=/${domainAttr}`;
      document.cookie = `${name}=; Max-Age=0; path=/${domainAttr}; Secure`;
    }
  }
}

function setGaDisabled(disabled: boolean): void {
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
