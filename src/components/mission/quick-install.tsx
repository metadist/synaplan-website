"use client";

import { useEffect, useId, useState } from "react";

/** Same command on macOS, Linux, and WSL. install.sh checks Docker and starts the stack. */
export const INSTALL_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/metadist/synaplan/main/install.sh | bash";

export const INSTALL_DOCS = "https://docs.synaplan.com/quickstart";

export type InstallTarget = { key: string; label: string; hint: string };

export function QuickInstall({
  dockerNote,
  docsLabel,
  copyLabel,
  copiedLabel,
  targetsLabel,
  targets,
}: {
  dockerNote: string;
  docsLabel: string;
  copyLabel: string;
  copiedLabel: string;
  targetsLabel: string;
  targets: InstallTarget[];
}) {
  const [active, setActive] = useState(targets[0]?.key ?? "");
  const [copied, setCopied] = useState(false);
  const id = useId();
  const current = targets.find((target) => target.key === active) ?? targets[0];

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mc-install">
      <div
        className="mc-install-line"
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={current ? `${id}-tab-${current.key}` : undefined}
      >
        <code>
          <span className="mc-tok-dim">$ </span>
          curl -fsSL{" "}
          <span className="mc-install-url">
            https://raw.githubusercontent.com/
            <wbr />
            metadist/synaplan/main/install.sh
          </span>
          {" | bash"}
        </code>
        <button type="button" className="mc-btn mc-btn--primary shrink-0 self-center" onClick={copy} aria-live="polite">
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <div className="mc-tabs mt-4" role="tablist" aria-label={targetsLabel}>
        {targets.map((target) => (
          <button
            key={target.key}
            type="button"
            role="tab"
            id={`${id}-tab-${target.key}`}
            aria-selected={active === target.key}
            aria-controls={`${id}-panel`}
            tabIndex={active === target.key ? 0 : -1}
            className="mc-tab"
            onClick={() => setActive(target.key)}
            onKeyDown={(event) => {
              const index = targets.findIndex((item) => item.key === active);
              if (event.key === "ArrowRight") setActive(targets[(index + 1) % targets.length].key);
              if (event.key === "ArrowLeft") setActive(targets[(index - 1 + targets.length) % targets.length].key);
            }}
          >
            {target.label}
          </button>
        ))}
      </div>
      <p className="mc-install-note">
        <span>{dockerNote}</span>
        <span>{current?.hint}</span>{" "}
        <a href={INSTALL_DOCS} target="_blank" rel="noopener noreferrer" className="mc-link">
          {docsLabel} ↗
        </a>
      </p>
    </div>
  );
}
