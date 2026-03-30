"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Body } from "matter-js";
import { FolderInput, Hand, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type MemoriesFilter = "all" | "pref" | "personal";

export type MemoriesNeuralPreviewProps = {
  /** When set, only these memory bubbles exist (e.g. synced demo). Omit to show all memories. */
  revealedMemoryLabelKeys?: string[];
  className?: string;
};

type MemSpec = {
  id: string;
  catId: "pref" | "personal";
  labelKey: string;
  dx: number;
  dy: number;
};

type MemoryBubbleShortKey =
  | "memPref1Short"
  | "memPref2Short"
  | "memPref3Short"
  | "memPersonal1Short"
  | "memPersonal2Short"
  | "memPersonal3Short"
  | "memPersonal4Short"
  | "memPersonal5Short";

const MEMORIES: MemSpec[] = [
  { id: "mp1", catId: "pref", labelKey: "memPref1", dx: -95, dy: -75 },
  { id: "mp2", catId: "pref", labelKey: "memPref2", dx: 105, dy: -45 },
  { id: "mp3", catId: "pref", labelKey: "memPref3", dx: -25, dy: 95 },
  { id: "m1", catId: "personal", labelKey: "memPersonal1", dx: -100, dy: -85 },
  { id: "m2", catId: "personal", labelKey: "memPersonal2", dx: 110, dy: -50 },
  { id: "m3", catId: "personal", labelKey: "memPersonal3", dx: -30, dy: 100 },
  { id: "m4", catId: "personal", labelKey: "memPersonal4", dx: 95, dy: 85 },
  { id: "m5", catId: "personal", labelKey: "memPersonal5", dx: -115, dy: 40 },
];

function scaleOffset(dx: number, dy: number, w: number, h: number, base = 420) {
  const s = Math.min(w, h) / base;
  return { dx: dx * s, dy: dy * s };
}

export function MemoriesNeuralPreview({
  revealedMemoryLabelKeys,
  className,
}: MemoriesNeuralPreviewProps = {}) {
  const t = useTranslations("memoriesSection");
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [filter, setFilter] = useState<MemoriesFilter>("all");
  const [dragHintVisible, setDragHintVisible] = useState(true);
  const tRef = useRef(t);
  tRef.current = t;

  const revealedKey =
    revealedMemoryLabelKeys === undefined
      ? "__ALL__"
      : revealedMemoryLabelKeys.slice().sort().join("|");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.floor(r.width), h: Math.floor(r.height) });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setSize({ w: Math.floor(r.width), h: Math.floor(r.height) });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w < 80 || size.h < 120) return;

    let cancelled = false;

    const boot = async () => {
      const matterModule = await import("matter-js");
      const Matter = (
        matterModule &&
        typeof matterModule === "object" &&
        "default" in matterModule &&
        matterModule.default
          ? matterModule.default
          : matterModule
      ) as typeof import("matter-js");
      const {
        Engine,
        Runner,
        Bodies,
        World,
        Composite,
        Constraint,
        Mouse,
        MouseConstraint,
        Events,
        Vector,
      } = Matter;

      if (cancelled) return undefined;

      const w = size.w;
      const h = size.h;
      const dpr =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const engine = Engine.create({
        gravity: { x: 0, y: 0 },
        enableSleeping: false,
      });
      const world = engine.world;

      const wallT = 64;
      const walls = [
        Bodies.rectangle(w / 2, -wallT / 2, w + wallT * 4, wallT, {
          isStatic: true,
          label: "wall",
        }),
        Bodies.rectangle(w / 2, h + wallT / 2, w + wallT * 4, wallT, {
          isStatic: true,
          label: "wall",
        }),
        Bodies.rectangle(-wallT / 2, h / 2, wallT, h + wallT * 4, {
          isStatic: true,
          label: "wall",
        }),
        Bodies.rectangle(w + wallT / 2, h / 2, wallT, h + wallT * 4, {
          isStatic: true,
          label: "wall",
        }),
      ];
      World.add(world, walls);

      const catR = Math.min(w, h) * 0.072;
      const memR = Math.min(w, h) * 0.05;

      const includePref = filter === "all" || filter === "pref";
      const includePersonal = filter === "all" || filter === "personal";

      const revealedSet =
        revealedMemoryLabelKeys === undefined
          ? null
          : new Set(revealedMemoryLabelKeys);

      /** In homepage demo mode, category nodes only appear once that side has a saved memory. */
      const hasPrefCategory =
        revealedSet === null ||
        MEMORIES.some(
          (m) => m.catId === "pref" && revealedSet.has(m.labelKey),
        );
      const hasPersonalCategory =
        revealedSet === null ||
        MEMORIES.some(
          (m) => m.catId === "personal" && revealedSet.has(m.labelKey),
        );

      const prefPos =
        filter === "all"
          ? { x: w * 0.26, y: h * 0.48 }
          : filter === "pref"
            ? { x: w * 0.5, y: h * 0.48 }
            : { x: -9999, y: -9999 };

      const personalPos =
        filter === "all"
          ? { x: w * 0.74, y: h * 0.48 }
          : filter === "personal"
            ? { x: w * 0.5, y: h * 0.48 }
            : { x: -9999, y: -9999 };

      const commonBody = {
        frictionAir: 0.06,
        restitution: 0.25,
        friction: 0.06,
      };

      const catBodies: Record<"pref" | "personal", Body | undefined> = {
        pref: undefined,
        personal: undefined,
      };

      if (includePref && hasPrefCategory) {
        const b = Bodies.circle(prefPos.x, prefPos.y, catR, {
          ...commonBody,
          density: 0.014,
          label: "cat:pref",
        });
        catBodies.pref = b;
        World.add(world, b);
      }

      if (includePersonal && hasPersonalCategory) {
        const b = Bodies.circle(personalPos.x, personalPos.y, catR, {
          ...commonBody,
          density: 0.014,
          label: "cat:personal",
        });
        catBodies.personal = b;
        World.add(world, b);
      }

      for (const spec of MEMORIES) {
        if (spec.catId === "pref" && !includePref) continue;
        if (spec.catId === "personal" && !includePersonal) continue;
        if (revealedSet !== null && !revealedSet.has(spec.labelKey)) continue;

        const cat = catBodies[spec.catId];
        if (!cat) continue;

        const off = scaleOffset(spec.dx, spec.dy, w, h);
        const x = cat.position.x + off.dx;
        const y = cat.position.y + off.dy;

        const mb = Bodies.circle(x, y, memR, {
          ...commonBody,
          density: 0.0026,
          label: `mem:${spec.labelKey}`,
        });
        World.add(world, mb);

        const dist = Vector.magnitude(Vector.sub(mb.position, cat.position));
        World.add(
          world,
          Constraint.create({
            bodyA: cat,
            bodyB: mb,
            length: Math.max(dist * 0.9, catR + memR + 6),
            stiffness: 0.09,
            damping: 0.1,
          }),
        );
      }

      const mouse = Mouse.create(canvas);
      Mouse.setScale(mouse, { x: 1 / dpr, y: 1 / dpr });
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.35,
          damping: 0.1,
          render: { visible: false },
        },
      });
      World.add(world, mouseConstraint);

      const runner = Runner.create();
      Runner.run(runner, engine);

      const reducedMotionDrift =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const bootAtMs = performance.now();

      const applyIdleDrift = () => {
        if (reducedMotionDrift) return;
        const now = engine.timing.timestamp * 0.001;
        const elapsedSec = (performance.now() - bootAtMs) / 1000;
        const introFade = Math.exp(-elapsedSec / 5.5);
        const introMult = 1 + 1.65 * introFade;
        const freqBoost = 0.45 * introFade;
        Composite.allBodies(world).forEach((body) => {
          const lbl = String(body.label ?? "");
          if (!lbl || lbl === "wall" || body.isStatic) return;
          const seed = body.id * 0.19;
          const amp = 0.000032 * introMult;
          const fx =
            Math.sin(now * (1.08 + freqBoost) + seed) * amp;
          const fy =
            Math.cos(now * (0.88 + freqBoost * 0.7) + seed * 1.37) * amp;
          Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
        });
      };

      Events.on(engine, "beforeUpdate", applyIdleDrift);

      const draw = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgb(255 247 250)";
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgb(0 44 146 / 0.06)";
        ctx.lineWidth = 1;
        const gs = 28;
        for (let x = 0; x < w; x += gs) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += gs) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        const reducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const flowT = reducedMotion ? 0 : performance.now() * 0.001;

        const elapsedDrawSec = (performance.now() - bootAtMs) / 1000;
        const introWorldAlpha = reducedMotion
          ? 1
          : Math.min(1, elapsedDrawSec / 0.65);

        ctx.save();
        ctx.globalAlpha = introWorldAlpha;
        Composite.allConstraints(world).forEach((c) => {
          const a = c.bodyA;
          const b = c.bodyB;
          if (!a || !b) return;
          const la = String(a.label ?? "");
          const lb = String(b.label ?? "");
          const cat =
            la.startsWith("cat:") ? a : lb.startsWith("cat:") ? b : undefined;
          const mem =
            la.startsWith("mem:") ? a : lb.startsWith("mem:") ? b : undefined;
          if (!cat || !mem) return;

          const cx = cat.position.x;
          const cy = cat.position.y;
          const mx = mem.position.x;
          const my = mem.position.y;
          const cr = cat.circleRadius ?? catR;
          const mr = mem.circleRadius ?? memR;
          const { sx, sy, ex, ey } = trimLineToCircles(
            cx,
            cy,
            cr,
            mx,
            my,
            mr,
          );
          const catIsPref = cat.label === "cat:pref";
          drawNeuralEdge(
            ctx,
            sx,
            sy,
            ex,
            ey,
            catIsPref,
            flowT,
            reducedMotion,
          );
        });

        const tr = tRef.current;

        Composite.allBodies(world).forEach((body) => {
          if (body.label === "wall") return;
          const { x, y } = body.position;
          const r0 = body.circleRadius ?? memR;
          const lbl = String(body.label);

          const isCat = lbl.startsWith("cat:");
          const grad = ctx.createRadialGradient(
            x - r0 * 0.35,
            y - r0 * 0.35,
            r0 * 0.1,
            x,
            y,
            r0,
          );
          if (isCat) {
            if (lbl === "cat:pref") {
              grad.addColorStop(0, "rgb(0 44 146)");
              grad.addColorStop(1, "rgb(0 63 199)");
            } else {
              grad.addColorStop(0, "rgb(13 148 136)");
              grad.addColorStop(1, "rgb(5 150 105)");
            }
          } else {
            grad.addColorStop(0, "rgb(255 255 255)");
            grad.addColorStop(1, "rgb(248 250 252)");
          }

          ctx.beginPath();
          ctx.arc(x, y, r0, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = isCat
            ? "rgb(255 255 255 / 0.4)"
            : "rgb(0 44 146 / 0.2)";
          ctx.lineWidth = 2;
          ctx.stroke();

          let text = "";
          let fill = "rgb(255 255 255)";
          if (isCat) {
            text =
              lbl === "cat:pref"
                ? tr("prefLabelShort")
                : tr("personalLabelShort");
          } else {
            const base = lbl.replace("mem:", "");
            text = tr(`${base}Short` as MemoryBubbleShortKey);
            const personalMem = base.startsWith("memPersonal");
            fill = personalMem ? "rgb(4 120 87)" : "rgb(0 44 146)";
          }

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          fitTextInCircle(ctx, text, x, y, r0, {
            isCat,
            fill: isCat ? "rgb(255 255 255)" : fill,
          });
        });
        ctx.restore();
      };

      Events.on(engine, "afterUpdate", draw);
      draw();

      if (cancelled) {
        Runner.stop(runner);
        Engine.clear(engine);
        Mouse.clearSourceEvents(mouse);
        return undefined;
      }

      return () => {
        Events.off(engine, "beforeUpdate", applyIdleDrift);
        Events.off(engine, "afterUpdate", draw);
        Runner.stop(runner);
        Engine.clear(engine);
        Mouse.clearSourceEvents(mouse);
      };
    };

    let dispose: (() => void) | undefined;
    void boot().then((d) => {
      if (!cancelled && d) dispose = d;
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [size.w, size.h, filter, revealedKey]);

  const toggleLegend = (next: MemoriesFilter) => {
    setFilter((prev) => (prev === next ? "all" : next));
  };

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[rgb(196_197_215/0.45)] bg-gradient-to-b from-[#fff7fa] via-white to-[#f6e3f3]/35 shadow-[0_24px_50px_-28px_rgb(0_44_146/0.18)] ring-1 ring-[rgb(0_44_146/0.05)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgb(196_197_215/0.35)] bg-white/90 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#002c92]/[0.08] text-[#002c92]">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold text-foreground">
              {t("panelTitle")}
            </p>
            <p className="text-[11px] text-muted-foreground sm:text-xs">
              {t("previewSubtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-[rgb(196_197_215/0.25)] bg-[rgb(255_247_250/0.8)] px-3 py-2 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:text-[11px]">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 font-medium text-foreground/90 ring-1 ring-[rgb(0_44_146/0.12)]">
            <FolderInput className="size-3.5 shrink-0 text-[#002c92]" aria-hidden />
            <span className="text-left">{t("groupedBy")}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-2.5 py-0.5 font-medium ring-1 transition-colors",
              filter === "all"
                ? "bg-[#002c92]/15 text-[#002c92] ring-[#002c92]/25"
                : "bg-white/80 text-muted-foreground ring-transparent hover:bg-[#002c92]/[0.06]",
            )}
          >
            {t("legendAll")}
          </button>
          <span className="text-muted-foreground/50" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => toggleLegend("pref")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ring-1 transition-colors",
              filter === "pref"
                ? "bg-[#002c92]/15 text-[#002c92] ring-[#002c92]/25"
                : "bg-white/80 text-muted-foreground ring-transparent hover:bg-[#002c92]/[0.06]",
            )}
          >
            <span className="size-2 shrink-0 rounded-full bg-[#002c92]" aria-hidden />
            {t("prefLabel")} (3)
          </button>
          <button
            type="button"
            onClick={() => toggleLegend("personal")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ring-1 transition-colors",
              filter === "personal"
                ? "bg-teal-500/12 text-foreground ring-teal-500/25"
                : "bg-white/80 text-muted-foreground ring-transparent hover:bg-teal-500/10",
            )}
          >
            <span className="size-2 shrink-0 rounded-full bg-[#14b8a6]" aria-hidden />
            {t("personalLabel")} (5)
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col sm:min-h-[320px]"
      >
        {dragHintVisible ? (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[6] flex justify-center pt-3 sm:pt-4"
            aria-hidden
          >
            <div
              className="flex max-w-[min(calc(100%-2rem),18rem)] items-center gap-2 rounded-full border border-[rgb(0_44_146/0.12)] bg-[rgb(255_255_255/0.55)] px-3 py-1.5 text-[10px] font-medium text-foreground/85 shadow-[0_8px_30px_-12px_rgb(0_44_146/0.25)] backdrop-blur-md sm:text-[11px]"
            >
              <Hand className="size-4 shrink-0 text-[#002c92] opacity-90" />
              <span className="text-center leading-tight">{t("dragHint")}</span>
            </div>
          </div>
        ) : null}

        <canvas
          ref={canvasRef}
          className="block h-full min-h-[280px] w-full min-w-0 flex-1 cursor-grab touch-none active:cursor-grabbing sm:min-h-[360px]"
          aria-label={t("panelTitle")}
          onPointerDown={() => setDragHintVisible(false)}
        />

        <div className="pointer-events-auto absolute bottom-2 left-2 z-10 max-w-[min(calc(100%-1rem),15rem)] rounded-xl border border-[rgb(196_197_215/0.4)] bg-white/95 px-2 py-2 text-[9px] text-muted-foreground shadow-md sm:bottom-3 sm:left-3 sm:px-2.5 sm:text-[10px]">
          <p className="font-semibold text-foreground">{t("legendTitle")}</p>
          <ul className="mt-1.5 space-y-1">
            <li>
              <button
                type="button"
                onClick={() => toggleLegend("pref")}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-[#002c92]/[0.06]",
                  filter === "pref" &&
                    "bg-[#002c92]/[0.1] font-medium text-foreground",
                )}
              >
                <span className="size-2.5 shrink-0 rounded-full bg-[#002c92]" />
                {t("legendPreferences")}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => toggleLegend("personal")}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-teal-500/10",
                  filter === "personal" &&
                    "bg-teal-500/12 font-medium text-foreground",
                )}
              >
                <span className="size-2.5 shrink-0 rounded-full bg-[#14b8a6]" />
                {t("legendPersonal")}
              </button>
            </li>
            <li className="flex items-center gap-1.5 px-1 pt-0.5 text-[9px] opacity-90 sm:text-[10px]">
              <span className="h-px w-4 bg-[#002c92]/35" aria-hidden />
              {t("legendLine")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function trimLineToCircles(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1e-6;
  const ux = dx / dist;
  const uy = dy / dist;
  return {
    sx: x1 + ux * r1,
    sy: y1 + uy * r1,
    ex: x2 - ux * r2,
    ey: y2 - uy * r2,
  };
}

function drawNeuralEdge(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  catIsPref: boolean,
  flowT: number,
  reducedMotion: boolean,
) {
  const dx = ex - sx;
  const dy = ey - sy;
  const len = Math.hypot(dx, dy);
  if (len < 8) return;

  const grad = ctx.createLinearGradient(sx, sy, ex, ey);
  if (catIsPref) {
    grad.addColorStop(0, "rgb(0 44 146 / 0.4)");
    grad.addColorStop(0.5, "rgb(0 63 199 / 0.24)");
    grad.addColorStop(1, "rgb(0 44 146 / 0.08)");
  } else {
    grad.addColorStop(0, "rgb(13 148 136 / 0.4)");
    grad.addColorStop(0.5, "rgb(5 150 105 / 0.22)");
    grad.addColorStop(1, "rgb(13 148 136 / 0.06)");
  }

  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.stroke();

  if (reducedMotion) return;

  const edgeBias =
    (Math.abs(sx * 0.011 + sy * 0.017 + ex * 0.009 + ey * 0.005) % 1) *
    0.97;
  const speed = 0.51;
  const phase = ((flowT * speed + edgeBias) % 1 + 1) % 1;
  const px = sx + dx * phase;
  const py = sy + dy * phase;

  const softR = catIsPref ? 4.8 : 4.2;
  const coreR = catIsPref ? 2.2 : 2;

  ctx.beginPath();
  ctx.arc(px, py, softR, 0, Math.PI * 2);
  ctx.fillStyle = catIsPref
    ? "rgb(59 130 250 / 0.16)"
    : "rgb(45 212 191 / 0.18)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(px, py, coreR, 0, Math.PI * 2);
  ctx.fillStyle = catIsPref
    ? "rgb(219 234 254 / 0.9)"
    : "rgb(204 251 241 / 0.9)";
  ctx.fill();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    let w = word;
    if (ctx.measureText(w).width > maxWidth) {
      let part = "";
      for (const ch of w) {
        const test = part + ch;
        if (ctx.measureText(test).width > maxWidth && part) {
          if (line) {
            lines.push(line);
            line = "";
          }
          lines.push(part);
          part = ch;
        } else {
          part = test;
        }
      }
      w = part;
    }
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fitTextInCircle(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  r0: number,
  opts: { isCat: boolean; fill: string },
) {
  const maxW = r0 * (opts.isCat ? 1.75 : 1.92);
  const maxLines = 3;
  const maxH = r0 * 1.85;
  const minFs = 7;
  const maxFs = Math.max(
    minFs,
    Math.floor(r0 * (opts.isCat ? 0.4 : 0.36)),
  );

  ctx.fillStyle = opts.fill;

  for (let fs = maxFs; fs >= minFs; fs--) {
    ctx.font = `${fs}px system-ui, sans-serif`;
    const lineHeight = fs * 1.12;
    const lines = wrapTextLines(ctx, text, maxW);
    if (lines.length > maxLines) continue;
    const totalH = lines.length * lineHeight;
    if (totalH > maxH) continue;
    const startY = y - (totalH - lineHeight) / 2;
    lines.forEach((ln, i) => {
      ctx.fillText(ln, x, startY + i * lineHeight);
    });
    return;
  }

  ctx.font = `${minFs}px system-ui, sans-serif`;
  const lineHeight = minFs * 1.12;
  let lines = wrapTextLines(ctx, text, maxW);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[maxLines - 1];
    let ell = last;
    while (
      ell.length > 1 &&
      ctx.measureText(`${ell}…`).width > maxW
    ) {
      ell = ell.slice(0, -1);
    }
    lines[maxLines - 1] = `${ell}…`;
  }
  const totalH = lines.length * lineHeight;
  const startY = y - (totalH - lineHeight) / 2;
  lines.forEach((ln, i) => {
    ctx.fillText(ln, x, startY + i * lineHeight);
  });
}
