/**
 * Shared SVG helpers for the "signals" and "topology" diagrams.
 * Packets travel along edges with SMIL <animateMotion> — no JavaScript,
 * works in every modern browser, hidden under reduced-motion via CSS.
 */

export type DiagramNode = { key: string; label: string; x: number; y: number };

export type DiagramLayout = {
  width: number;
  height: number;
  core: { x: number; y: number; r: number };
  nodes: DiagramNode[];
  nodeW: number;
  nodeH: number;
};

/** Smooth S-curve from a node to the core (or back). */
export function edgePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  if (horizontal) {
    const c1x = from.x + dx * 0.5;
    return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c1x} ${to.y}, ${to.x} ${to.y}`;
  }
  const c1y = from.y + dy * 0.5;
  return `M ${from.x} ${from.y} C ${from.x} ${c1y}, ${to.x} ${c1y}, ${to.x} ${to.y}`;
}

/** Point on the node box edge that faces the core */
export function anchor(node: DiagramNode, core: { x: number; y: number }, w: number, h: number) {
  const dx = core.x - node.x;
  const dy = core.y - node.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: node.x + Math.sign(dx) * (w / 2), y: node.y };
  }
  return { x: node.x, y: node.y + Math.sign(dy) * (h / 2) };
}

export function Packet({
  path,
  dur,
  begin,
  color = "var(--mc-cyan)",
  r = 3,
  reverse = false,
  className,
}: {
  path: string;
  dur: string;
  begin: string;
  color?: string;
  r?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <circle r={r} fill={color} className={className} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} keyPoints={reverse ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur={dur} begin={begin} repeatCount="indefinite" />
    </circle>
  );
}

export function CoreRings({ x, y, r, label }: { x: number; y: number; r: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 22} fill="none" stroke="var(--mc-line)" strokeWidth={1} />
      <circle
        cx={x}
        cy={y}
        r={r + 12}
        fill="none"
        stroke="var(--mc-line-strong)"
        strokeWidth={1}
        strokeDasharray="4 10"
        className="mc-core-ring"
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      <circle
        cx={x}
        cy={y}
        r={r + 4}
        fill="none"
        stroke="var(--mc-blue-soft)"
        strokeWidth={1}
        strokeDasharray="2 6"
        className="mc-core-ring mc-core-ring--rev"
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      <circle cx={x} cy={y} r={r} fill="var(--mc-blue)" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize={10} fontFamily="var(--mc-mono)" letterSpacing="1.5" fill="#fff">
        {label.toUpperCase()}
      </text>
    </g>
  );
}

export function NodeBox({
  node,
  w,
  h,
  active,
  onActivate,
  interactive = false,
}: {
  node: DiagramNode;
  w: number;
  h: number;
  active?: boolean;
  onActivate?: (key: string) => void;
  interactive?: boolean;
}) {
  const common = {
    className: "mc-topo-node",
    "data-active": active ? "true" : undefined,
    transform: `translate(${node.x - w / 2} ${node.y - h / 2})`,
  };
  const content = (
    <>
      <rect width={w} height={h} rx={6} />
      <circle cx={12} cy={h / 2} r={2.5} fill={active ? "var(--mc-cyan)" : "var(--mc-green)"} />
      <text x={22} y={h / 2 + 4}>
        {node.label}
      </text>
    </>
  );
  if (!interactive) {
    return <g {...common}>{content}</g>;
  }
  return (
    <g
      {...common}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={node.label}
      onPointerEnter={() => onActivate?.(node.key)}
      onFocus={() => onActivate?.(node.key)}
      onClick={() => onActivate?.(node.key)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate?.(node.key);
        }
      }}
      style={{ outline: "none" }}
    >
      {content}
    </g>
  );
}
