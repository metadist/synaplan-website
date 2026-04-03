"use client";

import { useEffect, useRef, useState } from "react";

export type TocItem = {
  id: string;
  title: string;
};

export function LegalToc({
  items,
  contactLabel,
  contactSub,
  contactEmail,
}: {
  items: TocItem[];
  contactLabel: string;
  contactSub: string;
  contactEmail: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!best || entry.intersectionRatio > best.ratio)
          ) {
            best = { id: entry.target.id, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActiveId(best.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const el = linkRefs.current.get(activeId);
    const nav = navRef.current;
    if (!el || !nav) return;
    const navTop = nav.getBoundingClientRect().top;
    const elRect = el.getBoundingClientRect();
    setIndicatorStyle({
      top: elRect.top - navTop,
      height: elRect.height,
    });
  }, [activeId]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setActiveId(id);
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 112;
    const top =
      target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="sticky top-28 flex flex-col gap-5">
      <nav ref={navRef} className="relative">
        {/* Sliding indicator */}
        <span
          className="pointer-events-none absolute left-0 w-0.5 rounded-full bg-brand-600 transition-all duration-300 ease-out"
          style={indicatorStyle}
          aria-hidden
        />

        <div className="flex flex-col gap-0.5 pl-4">
          {items.map(({ id, title }) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                ref={(el) => {
                  if (el) linkRefs.current.set(id, el);
                  else linkRefs.current.delete(id);
                }}
                onClick={(e) => handleClick(e, id)}
                className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  isActive
                    ? "font-medium text-brand-700 bg-brand-50"
                    : "text-muted-foreground hover:text-foreground hover:bg-soft-accent"
                }`}
              >
                {title}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Contact card */}
      <div className="rounded-2xl border border-[rgb(196_197_215/0.35)] bg-white/80 p-4">
        <p className="text-xs font-semibold text-foreground mb-1">{contactLabel}</p>
        <p className="text-xs text-muted-foreground mb-2">{contactSub}</p>
        <a
          href={`mailto:${contactEmail}`}
          className="text-xs font-medium text-brand-700 hover:underline"
        >
          {contactEmail}
        </a>
      </div>
    </div>
  );
}
