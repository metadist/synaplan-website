import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Numbered section header: `01 / INCOMING SIGNALS ──────` */
export function SectionHead({
  num,
  title,
  tag,
  className,
}: {
  num: string;
  title: string;
  tag?: string;
  className?: string;
}) {
  return (
    <div className={cn("mc-section-head", className)}>
      <span className="mc-section-num">{num} /</span>
      <span className="mc-label" style={{ color: "inherit" }}>
        {title}
      </span>
      <span className="mc-section-rule" aria-hidden />
      {tag ? <span className="mc-section-num hidden sm:inline">{tag}</span> : null}
    </div>
  );
}

export type LampTone = "green" | "amber" | "red" | "blue" | "off";

export function Lamp({
  tone = "green",
  blink = false,
  pulse = false,
  className,
}: {
  tone?: LampTone;
  blink?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "mc-lamp",
        tone !== "off" && `mc-lamp--${tone}`,
        blink && "mc-lamp--blink",
        pulse && "mc-lamp--pulse",
        className,
      )}
    />
  );
}

/** Visible on-page search terms — indexed copy, styled as mission chips. */
export function SearchTerms({ terms }: { terms?: unknown }) {
  const list = Array.isArray(terms) ? terms.filter((t): t is string => typeof t === "string") : [];
  if (list.length === 0) return null;
  return (
    <ul className="mc-terms">
      {list.map((term) => (
        <li key={term} className="mc-term">
          {term}
        </li>
      ))}
    </ul>
  );
}

/** Thin technical ruler with coordinate-like markings */
export function Ruler({ left, right, center }: { left: string; right: string; center?: string }) {
  return (
    <div className="mc-ruler" aria-hidden>
      <span>{left}</span>
      {center ? <span className="hidden sm:inline">{center}</span> : null}
      <span>{right}</span>
    </div>
  );
}

/** Scroll-reveal wrapper (opt-in via class; the controller adds `is-in`). */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  return (
    <Tag
      className={cn("mc-reveal", className)}
      style={delay ? ({ "--mc-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/** Terminal-styled code block */
export function Terminal({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mc-terminal", className)}>
      <div className="mc-terminal-bar">
        <Lamp tone="red" />
        <Lamp tone="amber" />
        <Lamp tone="green" />
        <span className="ml-2">{title}</span>
      </div>
      <pre className="mc-terminal-body">{children}</pre>
    </div>
  );
}
