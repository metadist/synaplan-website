"use client";

import { useId, useState, type ReactNode } from "react";

export type DeployTab = { key: string; label: string; panel: ReactNode };

export function DeployTabs({ tabs }: { tabs: DeployTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");
  const id = useId();

  return (
    <div>
      <div className="mc-tabs" role="tablist" aria-label="Deployment options">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`${id}-panel-${tab.key}`}
            tabIndex={active === tab.key ? 0 : -1}
            className="mc-tab"
            onClick={() => setActive(tab.key)}
            onKeyDown={(e) => {
              const idx = tabs.findIndex((t) => t.key === active);
              if (e.key === "ArrowRight") setActive(tabs[(idx + 1) % tabs.length].key);
              if (e.key === "ArrowLeft") setActive(tabs[(idx - 1 + tabs.length) % tabs.length].key);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${id}-panel-${tab.key}`}
          aria-labelledby={`${id}-tab-${tab.key}`}
          hidden={active !== tab.key}
          className="mt-4"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
