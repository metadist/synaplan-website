/**
 * Parrot preference. Presentational only, stored in localStorage.
 */
import { useEffect, useState, useSyncExternalStore } from "react";

/** False on the server and during the hydration pass; true after mount. */
function useClientReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
}

export const PARROT_STORAGE_KEY = "mc-parrot";
export const PARROT_EVENT = "mc:parrot";
export const PARROT_SAY_EVENT = "mc:parrot-say";

export function readParrotEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(PARROT_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function applyParrotEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(PARROT_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent<boolean>(PARROT_EVENT, { detail: enabled }));
}

function subscribeParrot(callback: () => void) {
  window.addEventListener(PARROT_EVENT, callback);
  return () => window.removeEventListener(PARROT_EVENT, callback);
}

/** Whether the parrot is enabled; `true` until after hydration so the bird markup matches SSR. */
export function useParrotEnabled(): boolean {
  const ready = useClientReady();
  const on = useSyncExternalStore(subscribeParrot, readParrotEnabled, () => true);
  return ready ? on : true;
}

/** Ask the parrot to say a line (key inside `mission.parrot`). */
export function parrotSay(key: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(PARROT_SAY_EVENT, { detail: key }));
}
