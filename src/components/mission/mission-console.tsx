"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Lamp } from "./primitives";
import { parrotSay } from "./mode";

type Mission = {
  id: string;
  inbound: string;
  agent: string;
  knowledge: string;
  model: string;
  tools: string;
  node: string;
  result: string;
};

type Phase = "received" | "context" | "tool" | "waiting" | "approved" | "complete" | "deferred";

const TIMELINE: Record<Exclude<Phase, "approved" | "complete" | "deferred">, number> = {
  received: 500,
  context: 1400,
  tool: 2500,
  waiting: 3300,
};
const STILL_WAITING_MS = 13000;
const DEFER_MS = 24000;
const APPROVED_TO_COMPLETE_MS = 900;
const COMPLETE_TO_NEXT_MS = 3200;
const DEFERRED_TO_NEXT_MS = 1600;

const PHASE_ORDER: Phase[] = ["received", "context", "tool", "waiting", "approved", "complete"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * The animated system in the hero: a mission enters, context loads, a tool
 * runs, then the mission waits for a human. The visitor IS the human.
 */
export function MissionConsole() {
  const t = useTranslations("mission.console");
  const missions = useMemo(() => t.raw("missions") as Mission[], [t]);

  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("received");
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [stillWaiting, setStillWaiting] = useState(false);

  const mission = missions[idx % missions.length];

  // Clock starts after mount so SSR and the hydration pass both render T+00:00.
  useEffect(() => {
    const t0 = Date.now();
    setStartedAt(t0);
    setNow(t0);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Timeline driver
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (phase === "received") {
      at(TIMELINE.context - TIMELINE.received, () => setPhase("context"));
    } else if (phase === "context") {
      at(TIMELINE.tool - TIMELINE.context, () => setPhase("tool"));
    } else if (phase === "tool") {
      at(TIMELINE.waiting - TIMELINE.tool, () => setPhase("waiting"));
    } else if (phase === "waiting") {
      at(STILL_WAITING_MS, () => setStillWaiting(true));
      at(DEFER_MS, () => setPhase("deferred"));
    } else if (phase === "approved") {
      at(APPROVED_TO_COMPLETE_MS, () => setPhase("complete"));
    } else if (phase === "complete" || phase === "deferred") {
      at(phase === "complete" ? COMPLETE_TO_NEXT_MS : DEFERRED_TO_NEXT_MS, () => {
        setIdx((i) => i + 1);
        setPhase("received");
        setStillWaiting(false);
        setStartedAt(Date.now());
      });
    }
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const phaseIndex = PHASE_ORDER.indexOf(phase);
  const stateOf = (step: Phase): "todo" | "done" | "active" | "ok" => {
    if (phase === "deferred") return step === "waiting" ? "active" : PHASE_ORDER.indexOf(step) < 3 ? "done" : "todo";
    const i = PHASE_ORDER.indexOf(step);
    if (i < phaseIndex) return "done";
    if (i === phaseIndex) return step === "waiting" ? "active" : step === "approved" || step === "complete" ? "ok" : "active";
    return "todo";
  };

  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
  const clock = `T+${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}`;

  function approve() {
    if (phase !== "waiting") return;
    setPhase("approved");
    parrotSay("approved");
  }

  const glyph = (s: ReturnType<typeof stateOf>) => (s === "done" || s === "ok" ? "●" : s === "active" ? "◐" : "○");

  return (
    <div className="mc-terminal mc-frame relative" aria-live="polite">
      <div className="mc-scanline" aria-hidden />
      <div className="mc-terminal-bar justify-between">
        <span className="flex items-center gap-2">
          <Lamp tone={phase === "waiting" ? "amber" : phase === "complete" ? "green" : "blue"} blink={phase === "waiting"} pulse={phase !== "waiting"} />
          {t("mission")} {mission.id}
        </span>
        <span className="flex items-center gap-3">
          <span className="hidden sm:inline">{t("live")}</span>
          <span className="tabular-nums text-[var(--mc-text)]">{clock}</span>
        </span>
      </div>

      <div className="mc-terminal-body whitespace-normal!">
        <dl className="mc-mono text-[0.78rem]">
          <div className="mc-console-row"><dt>{t("labels.inbound")}</dt><dd>{mission.inbound}</dd></div>
          <div className="mc-console-row"><dt>{t("labels.agent")}</dt><dd className="text-[var(--mc-cyan)]">{mission.agent}</dd></div>
          <div className="mc-console-row"><dt>{t("labels.knowledge")}</dt><dd>{mission.knowledge}</dd></div>
          <div className="mc-console-row"><dt>{t("labels.model")}</dt><dd>{mission.model}</dd></div>
          <div className="mc-console-row"><dt>{t("labels.tools")}</dt><dd>{mission.tools}</dd></div>
          <div className="mc-console-row"><dt>{t("labels.node")}</dt><dd>{mission.node}</dd></div>
        </dl>

        <div className="my-3 flex items-center gap-2 border-y border-[var(--mc-line)] py-2 text-[0.6875rem] uppercase tracking-[0.16em] text-[var(--mc-amber)]">
          <Lamp tone="amber" blink={phase === "waiting"} />
          {t("approvalRequired")}
        </div>

        <ol className="mc-mono text-[0.78rem]" aria-label="Mission steps">
          <li className="mc-step mc-line-in" data-state={stateOf("received")}>
            <span aria-hidden>{glyph(stateOf("received"))}</span> {t("steps.received")}
          </li>
          {phaseIndex >= 1 || phase === "deferred" ? (
            <li className="mc-step mc-line-in" data-state={stateOf("context")}>
              <span aria-hidden>{glyph(stateOf("context"))}</span> {t("steps.context")}
            </li>
          ) : null}
          {phaseIndex >= 2 || phase === "deferred" ? (
            <li className="mc-step mc-line-in" data-state={stateOf("tool")}>
              <span aria-hidden>{glyph(stateOf("tool"))}</span> {t("steps.tool")}
            </li>
          ) : null}
          {phaseIndex >= 3 || phase === "deferred" ? (
            <li className="mc-step mc-line-in" data-state={phase === "waiting" || phase === "deferred" ? "active" : "done"}>
              <span aria-hidden>{phase === "waiting" || phase === "deferred" ? "◐" : "●"}</span> {t("steps.waiting")}
            </li>
          ) : null}
          {stillWaiting && phase === "waiting" ? (
            <li className="mc-step mc-line-in text-[var(--mc-text-faint)]!" data-state="todo">
              <span aria-hidden>…</span> {t("steps.stillWaiting")}
            </li>
          ) : null}
          {phase === "approved" || phase === "complete" ? (
            <li className="mc-step mc-line-in" data-state="ok">
              <span aria-hidden>●</span> {t("steps.executed")} <span className="text-[var(--mc-text-muted)]">— {mission.result}</span>
            </li>
          ) : null}
          {phase === "complete" ? (
            <li className="mc-step mc-line-in" data-state="ok">
              <span aria-hidden>✓</span> {t("steps.complete")}
            </li>
          ) : null}
          {phase === "deferred" ? (
            <li className="mc-step mc-line-in" data-state="active">
              <span aria-hidden>→</span> {t("steps.deferred")}
            </li>
          ) : null}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={approve}
            disabled={phase !== "waiting"}
            className={`mc-btn mc-btn--sm ${phase === "waiting" ? "mc-btn--primary mc-btn--approve" : "opacity-50"}`}
            style={phase === "waiting" ? { background: "var(--mc-green)", borderColor: "var(--mc-green)", color: "#06100a" } : undefined}
          >
            [ {phase === "approved" || phase === "complete" ? t("approved") : t("approve")} ]
          </button>
          <span className="mc-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--mc-text-faint)]">{t("hint")}</span>
        </div>
      </div>
    </div>
  );
}
