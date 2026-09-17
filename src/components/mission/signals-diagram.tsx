import { CoreRings, NodeBox, Packet, anchor, edgePath, type DiagramLayout } from "./flow-diagram";

type Channel = { key: string; label: string };

const DESKTOP = (channels: Channel[]): DiagramLayout => {
  const left = channels.slice(0, 3);
  const right = channels.slice(3, 6);
  return {
    width: 760,
    height: 340,
    core: { x: 380, y: 170, r: 46 },
    nodeW: 124,
    nodeH: 34,
    nodes: [
      ...left.map((c, i) => ({ key: c.key, label: c.label, x: 96, y: 62 + i * 108 })),
      ...right.map((c, i) => ({ key: c.key, label: c.label, x: 664, y: 62 + i * 108 })),
    ],
  };
};

const MOBILE = (channels: Channel[]): DiagramLayout => {
  const positions = [
    { x: 200, y: 44 },
    { x: 338, y: 160 },
    { x: 338, y: 400 },
    { x: 200, y: 516 },
    { x: 62, y: 400 },
    { x: 62, y: 160 },
  ];
  return {
    width: 400,
    height: 560,
    core: { x: 200, y: 280, r: 40 },
    nodeW: 112,
    nodeH: 32,
    nodes: channels.map((c, i) => ({ key: c.key, label: c.label, ...positions[i] })),
  };
};

function Diagram({ layout, coreLabel, className }: { layout: DiagramLayout; coreLabel: string; className?: string }) {
  const { width, height, core, nodes, nodeW, nodeH } = layout;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={coreLabel}>
      {nodes.map((n, i) => {
        const a = anchor(n, core, nodeW, nodeH);
        const d = edgePath(a, core);
        return (
          <g key={n.key}>
            <path d={d} className="mc-flow-line" fill="none" />
            <Packet path={d} dur={`${3.6 + (i % 3) * 0.7}s`} begin={`${i * 0.6}s`} />
            {i % 2 === 0 ? <Packet path={d} dur={`${5.2 + (i % 2)}s`} begin={`${1.8 + i * 0.4}s`} color="var(--mc-green)" r={2} reverse /> : null}
          </g>
        );
      })}
      <CoreRings x={core.x} y={core.y} r={core.r} label={coreLabel} />
      {nodes.map((n) => (
        <NodeBox key={n.key} node={n} w={nodeW} h={nodeH} />
      ))}
    </svg>
  );
}

/** Messages from six channels flow into the agent core. Pure SVG + SMIL. */
export function SignalsDiagram({ channels, coreLabel }: { channels: Channel[]; coreLabel: string }) {
  return (
    <>
      <Diagram layout={DESKTOP(channels)} coreLabel={coreLabel} className="hidden w-full md:block" />
      <Diagram layout={MOBILE(channels)} coreLabel={coreLabel} className="mx-auto w-full max-w-[26rem] md:hidden" />
    </>
  );
}
