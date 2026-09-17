"use client";

import { useEffect, useState } from "react";

type Step = { key: string; label: string; desc: string };

const STEP_INTERVAL_MS = 1400;

/** The agent pipeline: understand → retrieve → reason → tool → approval → execute */
export function Pipeline({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % steps.length), STEP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6" aria-label="Agent pipeline">
      {steps.map((s, i) => (
        <li key={s.key} className="mc-pipe-step" data-active={i === active ? "true" : "false"} onPointerEnter={() => setActive(i)}>
          <div className="flex items-center gap-2">
            <span className="mc-lamp" aria-hidden />
            <span className="mc-mono text-[0.6875rem] tracking-[0.14em] uppercase">
              {String(i + 1).padStart(2, "0")} {s.label}
            </span>
          </div>
          <p className="mt-2 text-[0.8rem] leading-snug text-[var(--mc-muted-on-cream)]">{s.desc}</p>
          {i < steps.length - 1 ? (
            <span aria-hidden className="mc-mono absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[var(--mc-muted-on-cream)] lg:block">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
