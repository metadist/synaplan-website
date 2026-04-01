"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MotionPerformanceFlags = {
  prefersReducedMotion: boolean;
  saveData: boolean;
  likelyLowGpu: boolean;
  /** Blur, infinite animations, typing demo, heavy SVG */
  allowHeavyEffects: boolean;
};

/** Conservative defaults so SSR + first client paint match; real flags apply after mount. */
const defaultServerFlags: MotionPerformanceFlags = {
  prefersReducedMotion: false,
  saveData: false,
  likelyLowGpu: false,
  allowHeavyEffects: false,
};

function detectLikelyLowGpu(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) return true;
  } catch {
    return true;
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return true;
  if (
    nav.hardwareConcurrency !== undefined &&
    nav.hardwareConcurrency <= 2
  ) {
    return true;
  }
  return false;
}

function computeFlags(): MotionPerformanceFlags {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  const saveData = Boolean(nav.connection?.saveData);
  const likelyLowGpu = detectLikelyLowGpu();
  const allowHeavyEffects =
    !prefersReducedMotion && !saveData && !likelyLowGpu;
  return {
    prefersReducedMotion,
    saveData,
    likelyLowGpu,
    allowHeavyEffects,
  };
}

const MotionPerformanceContext =
  createContext<MotionPerformanceFlags>(defaultServerFlags);

export function MotionPerformanceProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<MotionPerformanceFlags>(
    defaultServerFlags,
  );

  useLayoutEffect(() => {
    setFlags(computeFlags());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setFlags(computeFlags());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    if (!flags.allowHeavyEffects) {
      document.documentElement.setAttribute("data-motion-profile", "reduced");
    } else {
      document.documentElement.removeAttribute("data-motion-profile");
    }
  }, [flags.allowHeavyEffects]);

  return (
    <MotionPerformanceContext.Provider value={flags}>
      {children}
    </MotionPerformanceContext.Provider>
  );
}

/**
 * `allowHeavyEffects` stays false on the first render (SSR + hydration) so markup matches; then
 * `useLayoutEffect` flips `mounted` before paint. Consumers inside Suspense / `next/dynamic` still
 * get a matching first render when they hydrate later.
 */
export function useMotionPerformance() {
  const flags = useContext(MotionPerformanceContext);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  return useMemo<MotionPerformanceFlags>(
    () => ({
      ...flags,
      allowHeavyEffects: mounted && flags.allowHeavyEffects,
    }),
    [flags, mounted],
  );
}
