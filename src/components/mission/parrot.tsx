"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ParrotGlyph } from "./parrot-glyph";
import { MODE_EVENT, PARROT_SAY_EVENT, applyParrotEnabled, useParrotEnabled } from "./mode";

const HELLO_DELAY_MS = 2400;
const TYPE_INTERVAL_MS = 22;
const MIN_VISIBLE_MS = 4200;
const PER_CHAR_VISIBLE_MS = 45;
const PUPIL_MAX_OFFSET = 0.55;

/**
 * The flight engineer. Lives in the corner, comments on what the visitor is
 * doing, tracks the cursor with its eye and blinks. Never blocks anything.
 *
 * Triggers:
 *  - `[data-parrot="<key>"]` sections entering the viewport (once each)
 *  - `[data-parrot-hover="<key>"]` elements on pointer-over (once each)
 *  - `mc:parrot-say` custom events (e.g. approving the demo mission)
 *  - mode switches (`mc:mode`)
 *  - clicking the bird (random idle line)
 */
export function Parrot() {
  const t = useTranslations("mission.parrot");
  const enabled = useParrotEnabled();
  const [line, setLine] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [talking, setTalking] = useState(false);

  const pupilRef = useRef<SVGCircleElement>(null);
  const bodyRef = useRef<HTMLButtonElement>(null);
  const saidRef = useRef<Set<string>>(new Set());
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleIndex = useRef(-1);

  const say = useCallback((text: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (typeTimer.current) clearInterval(typeTimer.current);
    setLine(text);
    setTyped("");
    setTalking(true);

    let i = 0;
    typeTimer.current = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length && typeTimer.current) {
        clearInterval(typeTimer.current);
        typeTimer.current = null;
      }
    }, TYPE_INTERVAL_MS);

    const visible = MIN_VISIBLE_MS + text.length * PER_CHAR_VISIBLE_MS;
    hideTimer.current = setTimeout(() => {
      setLine(null);
      setTalking(false);
    }, visible);
  }, []);

  const sayOnce = useCallback(
    (key: string, text: string) => {
      if (saidRef.current.has(key)) return;
      saidRef.current.add(key);
      say(text);
    },
    [say],
  );

  // External events
  useEffect(() => {
    const onSay = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      if (t.has(key)) say(t(key));
    };
    const onMode = (e: Event) => {
      const mode = (e as CustomEvent<string>).detail;
      say(t(mode === "engineer" ? "engineerOn" : "engineerOff"));
    };
    window.addEventListener(PARROT_SAY_EVENT, onSay);
    window.addEventListener(MODE_EVENT, onMode);
    return () => {
      window.removeEventListener(PARROT_SAY_EVENT, onSay);
      window.removeEventListener(MODE_EVENT, onMode);
    };
  }, [say, t]);

  // Greeting
  useEffect(() => {
    if (!enabled) return;
    const id = setTimeout(() => sayOnce("hello", t("hello")), HELLO_DELAY_MS);
    return () => clearTimeout(id);
  }, [enabled, sayOnce, t]);

  // Section triggers
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.parrot;
          if (key && t.has(key)) sayOnce(`section:${key}`, t(key));
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll<HTMLElement>("[data-parrot]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled, sayOnce, t]);

  // Hover triggers (delegated)
  useEffect(() => {
    if (!enabled) return;
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-parrot-hover]");
      if (!el) return;
      const key = el.dataset.parrotHover;
      if (key && t.has(key)) sayOnce(`hover:${key}`, t(key));
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => document.removeEventListener("pointerover", onOver);
  }, [enabled, sayOnce, t]);

  // Eye tracking
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    const update = () => {
      raf = 0;
      const pupil = pupilRef.current;
      const body = bodyRef.current;
      if (!pupil || !body) return;
      const rect = body.getBoundingClientRect();
      // eye sits roughly at 60% x / 32% y of the glyph box
      const ex = rect.left + rect.width * 0.6;
      const ey = rect.top + rect.height * 0.32;
      const dx = lastX - ex;
      const dy = lastY - ey;
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 240) * PUPIL_MAX_OFFSET;
      pupil.style.transform = `translate(${((dx / dist) * k).toFixed(3)}px, ${((dy / dist) * k).toFixed(3)}px)`;
    };
    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (typeTimer.current) clearInterval(typeTimer.current);
    },
    [],
  );

  function onClickBird() {
    const idle = t.raw("idle") as string[];
    idleIndex.current = idleIndex.current < 0 ? Math.floor(Math.random() * idle.length) : (idleIndex.current + 1) % idle.length;
    say(idle[idleIndex.current]);
  }

  function mute() {
    setLine(null);
    applyParrotEnabled(false);
  }

  if (!enabled) return null;

  return (
    <div className="mc-parrot" aria-live="polite">
      {line ? (
        <div className="mc-parrot-bubble" role="status">
          <button type="button" className="mc-parrot-mute" onClick={mute} aria-label={t("mute")} title={t("mute")}>
            ×
          </button>
          <strong>{t("prefix")}</strong> <span className={typed.length < line.length ? "mc-cursor" : undefined}>{typed}</span>
        </div>
      ) : null}
      <button
        ref={bodyRef}
        type="button"
        className="mc-parrot-body"
        data-talking={talking ? "true" : "false"}
        onClick={onClickBird}
        aria-label={t("aria")}
        title={t("aria")}
      >
        <ParrotGlyph ref={pupilRef} />
      </button>
    </div>
  );
}
