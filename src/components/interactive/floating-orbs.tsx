"use client";

import { useMotionPerformance } from "@/contexts/motion-performance-context";

/** Hero ambient blurs aligned with Figma (blue top-right, lavender bottom-left). */
export function FloatingOrbs() {
  const { allowHeavyEffects } = useMotionPerformance();

  if (!allowHeavyEffects) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-25">
        <div className="absolute -right-[200px] -top-[200px] h-[500px] w-[500px] rounded-full bg-[#003fc7]/35" />
        <div className="absolute -bottom-[180px] -left-[200px] h-[400px] w-[400px] rounded-full bg-[#f6e3f3]/45" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      <div className="absolute -right-[200px] -top-[200px] h-[500px] w-[500px] animate-[float_22s_ease-in-out_infinite] rounded-full bg-[#003fc7] blur-[60px]" />
      <div className="absolute -bottom-[180px] -left-[200px] h-[400px] w-[400px] animate-[float_26s_ease-in-out_infinite_reverse] rounded-full bg-[#f6e3f3] blur-[50px]" />
    </div>
  );
}
