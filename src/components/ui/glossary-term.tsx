"use client"

import { useState, useCallback, type ReactNode } from "react"

interface GlossaryTermProps {
  children: ReactNode
  definition: string
}

export function GlossaryTerm({ children, definition }: GlossaryTermProps) {
  const [open, setOpen] = useState(false)

  const handleTouch = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  return (
    <span
      className="group/glossary relative inline"
      onTouchStart={handleTouch}
    >
      <span
        className="cursor-help border-b border-dotted border-muted-foreground/50 transition-colors hover:border-foreground"
        role="term"
        tabIndex={0}
        aria-describedby={undefined}
      >
        {children}
      </span>
      <span
        role="definition"
        aria-hidden={!open ? "true" : undefined}
        className={`pointer-events-none absolute left-0 top-full z-50 mt-1.5 w-64 max-w-[90vw] overflow-hidden rounded-lg border border-border bg-popover px-3 py-2 text-xs leading-relaxed text-muted-foreground shadow-lg transition-all sm:w-72 ${
          open
            ? "visible max-h-40 opacity-100"
            : "invisible max-h-0 opacity-0 group-hover/glossary:visible group-hover/glossary:max-h-40 group-hover/glossary:opacity-100 group-focus-within/glossary:visible group-focus-within/glossary:max-h-40 group-focus-within/glossary:opacity-100"
        }`}
      >
        {definition}
      </span>
    </span>
  )
}
