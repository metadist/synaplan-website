"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { Plus } from "lucide-react";

type FaqItem = { q: string; a: string };

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`group rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-brand-200 bg-white shadow-sm shadow-brand-100/60"
          : "border-[rgb(196_197_215/0.35)] bg-white/60 hover:border-[rgb(196_197_215/0.6)] hover:bg-white/90"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start gap-4 px-6 py-5 text-left"
      >
        {/* Number badge */}
        <span
          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums transition-colors duration-300 ${
            isOpen
              ? "bg-brand-600 text-white"
              : "bg-soft-accent text-muted-foreground group-hover:bg-brand-100 group-hover:text-brand-700"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`flex-1 text-base font-semibold leading-snug transition-colors duration-200 ${
            isOpen ? "text-brand-800" : "text-foreground"
          }`}
        >
          {item.q}
        </span>

        {/* Plus / X icon */}
        <span
          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? "rotate-45 bg-brand-100 text-brand-700"
              : "bg-soft-accent text-muted-foreground group-hover:bg-brand-50 group-hover:text-brand-600"
          }`}
        >
          <Plus className="size-3.5" />
        </span>
      </button>

      {/* Animated body */}
      <div
        ref={bodyRef}
        style={{
          maxHeight: isOpen ? (bodyRef.current?.scrollHeight ?? 999) + "px" : "0px",
        }}
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      >
        <p className="px-6 pb-6 pl-16 text-sm leading-relaxed text-muted-foreground">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export function FaqSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  // Split into two columns
  const left = items.slice(0, Math.ceil(items.length / 2));
  const right = items.slice(Math.ceil(items.length / 2));

  return (
    <section className="bg-soft-accent/40 py-20 md:py-28">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700">
            {t("label")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Two-column accordion grid */}
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {/* Left column */}
          <div className="flex flex-col gap-3">
            {left.map((item, i) => (
              <AccordionItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-3">
            {right.map((item, i) => {
              const globalIndex = i + left.length;
              return (
                <AccordionItem
                  key={globalIndex}
                  item={item}
                  index={globalIndex}
                  isOpen={openIndex === globalIndex}
                  onToggle={() => toggle(globalIndex)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
