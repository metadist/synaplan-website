"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CoreRings, NodeBox, Packet, anchor, edgePath, type DiagramLayout } from "./flow-diagram";

const NODE_KEYS = ["outlook", "whatsapp", "web", "desktop", "erp", "mcp", "m365", "models"] as const;
type NodeKey = (typeof NODE_KEYS)[number] | "synaplan";

const LABELS: Record<(typeof NODE_KEYS)[number], string> = {
  outlook: "Outlook",
  whatsapp: "WhatsApp",
  web: "Web",
  desktop: "Desktop",
  erp: "ERP / CRM",
  mcp: "MCP",
  m365: "M365 · Nextcloud",
  models: "Models",
};

const DESKTOP: DiagramLayout = {
  width: 760,
  height: 380,
  core: { x: 380, y: 190, r: 44 },
  nodeW: 150,
  nodeH: 34,
  nodes: [
    { key: "outlook", label: LABELS.outlook, x: 100, y: 60 },
    { key: "whatsapp", label: LABELS.whatsapp, x: 100, y: 146 },
    { key: "web", label: LABELS.web, x: 100, y: 232 },
    { key: "desktop", label: LABELS.desktop, x: 100, y: 318 },
    { key: "erp", label: LABELS.erp, x: 660, y: 60 },
    { key: "mcp", label: LABELS.mcp, x: 660, y: 146 },
    { key: "m365", label: LABELS.m365, x: 660, y: 232 },
    { key: "models", label: LABELS.models, x: 660, y: 318 },
  ],
};

const MOBILE: DiagramLayout = {
  width: 400,
  height: 620,
  core: { x: 200, y: 310, r: 42 },
  nodeW: 138,
  nodeH: 32,
  nodes: [
    { key: "outlook", label: LABELS.outlook, x: 200, y: 40 },
    { key: "whatsapp", label: LABELS.whatsapp, x: 324, y: 130 },
    { key: "erp", label: LABELS.erp, x: 324, y: 250 },
    { key: "mcp", label: LABELS.mcp, x: 324, y: 370 },
    { key: "web", label: LABELS.web, x: 324, y: 490 },
    { key: "desktop", label: LABELS.desktop, x: 200, y: 580 },
    { key: "m365", label: LABELS.m365, x: 76, y: 490 },
    { key: "models", label: LABELS.models, x: 76, y: 130 },
  ],
};

const TOUR_INTERVAL_MS = 2800;
const TOUR_RESUME_MS = 9000;

function Diagram({
  layout,
  active,
  onActivate,
  className,
}: {
  layout: DiagramLayout;
  active: NodeKey;
  onActivate: (key: string) => void;
  className?: string;
}) {
  const { width, height, core, nodes, nodeW, nodeH } = layout;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-label="Synaplan topology">
      {nodes.map((n, i) => {
        const a = anchor(n, core, nodeW, nodeH);
        const d = edgePath(a, core);
        const isActive = active === n.key;
        return (
          <g key={n.key}>
            <path d={d} className="mc-topo-edge" data-active={isActive ? "true" : undefined} />
            <Packet path={d} dur={`${4.4 + (i % 4) * 0.5}s`} begin={`${i * 0.55}s`} color={isActive ? "var(--mc-cyan)" : "var(--mc-blue-soft)"} r={isActive ? 3.5 : 2.2} />
            {isActive ? (
              <>
                <Packet path={d} dur="1.6s" begin="0s" color="var(--mc-cyan)" r={3.5} />
                <Packet path={d} dur="1.9s" begin="0.7s" color="var(--mc-green)" r={3} reverse />
              </>
            ) : null}
          </g>
        );
      })}
      <g
        role="button"
        tabIndex={0}
        aria-label="Synaplan"
        aria-pressed={active === "synaplan"}
        onPointerEnter={() => onActivate("synaplan")}
        onFocus={() => onActivate("synaplan")}
        onClick={() => onActivate("synaplan")}
        style={{ cursor: "pointer", outline: "none" }}
      >
        <CoreRings x={core.x} y={core.y} r={core.r} label="Synaplan" />
      </g>
      {nodes.map((n) => (
        <NodeBox key={n.key} node={n} w={nodeW} h={nodeH} active={active === n.key} onActivate={onActivate} interactive />
      ))}
    </svg>
  );
}

/** Interactive topology: hover / tap a node, packets follow. Auto-tours when idle. */
export function Topology() {
  const t = useTranslations("mission.connect");
  const [active, setActive] = useState<NodeKey>("synaplan");
  const lastInteraction = useRef(0);

  const tour = useMemo<NodeKey[]>(() => ["synaplan", ...NODE_KEYS], []);

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastInteraction.current < TOUR_RESUME_MS) return;
      setActive((cur) => tour[(tour.indexOf(cur) + 1) % tour.length]);
    }, TOUR_INTERVAL_MS);
    return () => clearInterval(id);
  }, [tour]);

  const onActivate = (key: string) => {
    lastInteraction.current = Date.now();
    setActive(key as NodeKey);
  };

  return (
    <div className="mc-card mc-frame p-3 sm:p-5">
      <Diagram layout={DESKTOP} active={active} onActivate={onActivate} className="hidden w-full md:block" />
      <Diagram layout={MOBILE} active={active} onActivate={onActivate} className="mx-auto w-full max-w-[26rem] md:hidden" />
      <div className="mt-3 flex min-h-[3.25rem] items-start gap-3 border-t border-[var(--mc-line)] pt-3">
        <span className="mc-chip shrink-0">
          <span className="mc-lamp mc-lamp--blue" aria-hidden />
          {active === "synaplan" ? "Synaplan" : LABELS[active]}
        </span>
        <p className="mc-mono text-[0.78rem] leading-relaxed text-[var(--mc-text-muted)]" aria-live="polite">
          {t(`nodes.${active}`)}
        </p>
      </div>
      <p className="mc-label mt-3 text-[0.6rem]">{t("hint")}</p>
    </div>
  );
}
