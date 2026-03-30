"use client";

import { useEffect, useState } from "react";
import { useMotionPerformance } from "@/contexts/motion-performance-context";
import { cn } from "@/lib/utils";

const MODELS = [
  { name: "GPT-4o", color: "#10b981", x: 75, y: 15 },
  { name: "Claude", color: "#f59e0b", x: 90, y: 40 },
  { name: "Gemini", color: "#3b82f6", x: 80, y: 65 },
  { name: "Llama 3", color: "#8b5cf6", x: 70, y: 88 },
  { name: "Mistral", color: "#ef4444", x: 92, y: 85 },
];

export function ModelRoutingVisual() {
  const { allowHeavyEffects } = useMotionPerformance();
  const [activeRoute, setActiveRoute] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (!allowHeavyEffects) return;
    const interval = setInterval(() => {
      setActiveRoute((prev) => (prev + 1) % MODELS.length);
      setPulseKey((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [allowHeavyEffects]);

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-zinc-950 p-6 sm:h-56">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Source node — "Your App" */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <div className="relative">
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 sm:size-16",
              allowHeavyEffects && "backdrop-blur-sm",
            )}
          >
            <div className="text-center">
              <span className="block text-[10px] font-bold text-brand-400">
                YOUR
              </span>
              <span className="block text-[10px] font-bold text-brand-400">
                APP
              </span>
            </div>
          </div>
          <div className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-brand-500" />
        </div>
      </div>

      {/* Synaplan hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div
            key={pulseKey}
            aria-hidden
            className={cn(
              "absolute -inset-3 rounded-full bg-brand-500/20",
              allowHeavyEffects
                ? "animate-ping"
                : "pointer-events-none opacity-0",
            )}
            style={
              allowHeavyEffects
                ? { animationDuration: "2s", animationIterationCount: "1" }
                : undefined
            }
          />
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full border border-brand-500/40 bg-brand-500/20 sm:size-14",
              allowHeavyEffects && "backdrop-blur-sm",
            )}
          >
            <span className="text-[9px] font-bold text-brand-300 sm:text-[10px]">
              SYNA
            </span>
          </div>
        </div>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {/* Source to hub */}
        <line
          x1="18%"
          y1="50%"
          x2="46%"
          y2="50%"
          stroke="oklch(0.55 0.19 250)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.4"
        />

        {/* Hub to models */}
        {MODELS.map((model, i) => (
          <line
            key={model.name}
            x1="54%"
            y1="50%"
            x2={`${model.x}%`}
            y2={`${model.y}%`}
            stroke={model.color}
            strokeWidth={activeRoute === i ? "2" : "1"}
            strokeDasharray={activeRoute === i ? "none" : "3 6"}
            opacity={activeRoute === i ? 0.8 : 0.15}
            className="transition-all duration-500"
          />
        ))}
      </svg>

      {/* Model nodes */}
      {MODELS.map((model, i) => (
        <div
          key={model.name}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
          style={{ left: `${model.x}%`, top: `${model.y}%` }}
        >
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2 py-1",
              allowHeavyEffects && "backdrop-blur-sm transition-all duration-500",
              activeRoute === i
                ? "scale-110 border-white/20 bg-white/10"
                : "scale-100 border-white/5 bg-white/5",
            )}
          >
            <div
              className="size-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: model.color,
                boxShadow:
                  activeRoute === i ? `0 0 8px ${model.color}` : "none",
              }}
            />
            <span
              className={`text-[10px] font-medium transition-all duration-500 ${
                activeRoute === i ? "text-white" : "text-white/40"
              }`}
            >
              {model.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
