/**
 * Marketing / Engineer mode + parrot preference.
 *
 * Both are purely presentational client preferences stored in localStorage.
 * The server always renders the marketing variant; an inline script applies
 * the stored attribute to <html> before first paint (see `mode-bootstrap.ts`).
 */
import { useSyncExternalStore } from "react";
import { MODE_STORAGE_KEY } from "./mode-bootstrap";

export type MissionMode = "marketing" | "engineer";

export const PARROT_STORAGE_KEY = "mc-parrot";
export const MODE_EVENT = "mc:mode";
export const PARROT_EVENT = "mc:parrot";
export const PARROT_SAY_EVENT = "mc:parrot-say";

export function readMode(): MissionMode {
  if (typeof document === "undefined") return "marketing";
  return document.documentElement.getAttribute("data-mc-mode") === "engineer" ? "engineer" : "marketing";
}

export function applyMode(mode: MissionMode) {
  if (typeof document === "undefined") return;
  if (mode === "engineer") {
    document.documentElement.setAttribute("data-mc-mode", "engineer");
  } else {
    document.documentElement.removeAttribute("data-mc-mode");
  }
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* private mode — ignore */
  }
  window.dispatchEvent(new CustomEvent<MissionMode>(MODE_EVENT, { detail: mode }));
}

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

function subscribeMode(callback: () => void) {
  window.addEventListener(MODE_EVENT, callback);
  return () => window.removeEventListener(MODE_EVENT, callback);
}

function subscribeParrot(callback: () => void) {
  window.addEventListener(PARROT_EVENT, callback);
  return () => window.removeEventListener(PARROT_EVENT, callback);
}

/** Current mode; "marketing" during SSR/hydration, real value right after. */
export function useMissionMode(): MissionMode {
  return useSyncExternalStore(subscribeMode, readMode, () => "marketing");
}

/** Whether the parrot is enabled; `true` during SSR/hydration. */
export function useParrotEnabled(): boolean {
  return useSyncExternalStore(subscribeParrot, readParrotEnabled, () => true);
}

/** Ask the parrot to say a line (key inside `mission.parrot`). */
export function parrotSay(key: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(PARROT_SAY_EVENT, { detail: key }));
}

