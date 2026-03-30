"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMotionPerformance } from "@/contexts/motion-performance-context";
import { cn } from "@/lib/utils";

const ChatWidgetPreview = dynamic(
  () =>
    import("@/components/interactive/chat-widget-preview").then(
      (m) => m.ChatWidgetPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[min(380px,52vh)] w-full max-w-md rounded-3xl border border-[rgb(196_197_215/0.15)] bg-muted/20 sm:min-h-[420px]"
        aria-hidden
      />
    ),
  },
);

function scheduleIdle(cb: () => void, timeout: number) {
  if (typeof requestIdleCallback !== "undefined") {
    const id = requestIdleCallback(cb, { timeout });
    return () => cancelIdleCallback(id);
  }
  const t = window.setTimeout(cb, timeout);
  return () => clearTimeout(t);
}

/**
 * Defers the chat preview so the hero CTAs and copy can paint first.
 * Low-power / no-GPU profiles mount sooner with reduced in-widget motion.
 */
export function HeroChatSlot({ className }: { className?: string }) {
  const [show, setShow] = useState(false);
  const { allowHeavyEffects } = useMotionPerformance();

  useEffect(() => {
    if (!allowHeavyEffects) {
      setShow(true);
      return;
    }
    return scheduleIdle(() => setShow(true), 2200);
  }, [allowHeavyEffects]);

  if (!show) {
    return (
      <div
        className={cn(
          "min-h-[min(380px,52vh)] w-full max-w-md rounded-3xl border border-[rgb(196_197_215/0.12)] bg-muted/15 sm:min-h-[420px]",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <ChatWidgetPreview />
    </div>
  );
}
