"use client";

import { useMemo } from "react";

/** Lightweight decorative mesh — center band, few edges, CSS pulse on nodes. */
function useNeuralMesh(w: number, h: number) {
  return useMemo(() => {
    if (w < 24 || h < 24) {
      return { nodes: [] as { x: number; y: number }[], edges: [] as [number, number][] };
    }
    const nodes: { x: number; y: number }[] = [];
    const cols = 4;
    const rows = 5;
    const marginX = w * 0.2;
    const marginY = h * 0.1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitter = (r + c) % 3 === 0 ? 4 : 0;
        const x =
          marginX +
          (c / Math.max(1, cols - 1)) * (w - 2 * marginX) +
          jitter;
        const y =
          marginY +
          (r / Math.max(1, rows - 1)) * (h - 2 * marginY);
        nodes.push({ x, y });
      }
    }
    const maxD = Math.min(w, h) * 0.17;
    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < maxD) edges.push([i, j]);
      }
    }
    return { nodes, edges: edges.slice(0, 48) };
  }, [w, h]);
}

export function WidgetFlowNeuralMeshSvg({
  w,
  h,
}: {
  w: number;
  h: number;
}) {
  const { nodes, edges } = useNeuralMesh(w, h);
  if (!nodes.length) return null;

  return (
    <g aria-hidden className="pointer-events-none">
      {edges.map(([i, j], idx) => (
        <line
          key={`mesh-e-${idx}`}
          x1={nodes[i].x}
          y1={nodes[i].y}
          x2={nodes[j].x}
          y2={nodes[j].y}
          className="widget-neural-mesh-edge"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={`mesh-n-${i}`}
          cx={n.x}
          cy={n.y}
          r={2.25}
          className="widget-neural-mesh-node"
          style={{ animationDelay: `${(i % 7) * 0.35}s` }}
        />
      ))}
    </g>
  );
}
