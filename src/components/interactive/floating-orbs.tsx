"use client";

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 top-1/4 h-96 w-96 animate-[float_20s_ease-in-out_infinite] rounded-full bg-brand-500/[0.03] blur-3xl" />
      <div className="absolute -right-32 top-1/3 h-80 w-80 animate-[float_25s_ease-in-out_infinite_reverse] rounded-full bg-purple-500/[0.03] blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 h-64 w-64 animate-[float_22s_ease-in-out_infinite_2s] rounded-full bg-emerald-500/[0.02] blur-3xl" />
    </div>
  );
}
