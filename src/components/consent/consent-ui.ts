import {
  type AnalyticsConsent,
  CONSENT_STORAGE_KEY,
  readConsent,
  writeConsent,
} from "@/lib/analytics-consent";

/**
 * Client snapshot of the analytics choice plus whether the notice was reopened.
 * Strings stay referentially stable for useSyncExternalStore (same text === same text).
 * "pending" is the server placeholder: render nothing until the browser can read storage.
 */
let reopen = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeConsentUi(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CONSENT_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getConsentUiSnapshot(): string {
  const choice = readConsent() ?? "unknown";
  return `${choice}:${reopen ? "1" : "0"}`;
}

export function getConsentUiServerSnapshot(): string {
  return "pending:0";
}

export function openConsentNotice(): void {
  reopen = true;
  emit();
}

export function publishConsent(choice: AnalyticsConsent): void {
  writeConsent(choice);
  reopen = false;
  emit();
}

export function dismissConsentNotice(): void {
  if (!reopen) return;
  reopen = false;
  emit();
}
