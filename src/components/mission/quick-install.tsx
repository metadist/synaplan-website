"use client";

import { useEffect, useId, useState } from "react";

/** Same command on macOS, Linux, and WSL. install.sh checks Docker and starts the stack. */
export const INSTALL_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/metadist/synaplan/main/install.sh | bash";

export const INSTALL_DOCS = "https://docs.synaplan.com/quickstart";
export const HELM_CHARTS = "https://github.com/metadist/synaplan-charts";
export const ELESTIO_HOSTING = "https://elest.io/open-source/synaplan";

export type InstallTarget = {
  key: string;
  label: string;
  hint: string;
  mode: "shell" | "k8s" | "elestio";
};

function KubernetesMark() {
  return (
    <svg className="mc-tab-mark" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#326CE5"
        d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.779zm1.5-3.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594l-9.261.003a1.6 1.6 0 0 1-1.247-.596l-5.776-7.18a1.583 1.583 0 0 1-.307-1.34L2.1 5.573c.108-.47.425-.864.863-1.073L11.305.513a1.606 1.606 0 0 1 1.385 0l8.345 3.985c.438.209.755.604.863 1.073l2.062 8.955c.108.47-.005.963-.308 1.34zm-3.289-2.057c-.042-.01-.103-.026-.145-.034-.174-.033-.315-.025-.479-.038-.35-.037-.638-.067-.895-.148-.105-.04-.18-.165-.216-.216l-.201-.059a6.45 6.45 0 0 0-.105-2.332 6.465 6.465 0 0 0-.936-2.163c.052-.047.15-.133.177-.159.008-.09.001-.183.094-.282.197-.185.444-.338.743-.522.142-.084.273-.137.415-.242.032-.024.076-.062.11-.089.24-.191.295-.52.123-.736-.172-.216-.506-.236-.745-.045-.034.027-.08.062-.111.088-.134.116-.217.23-.33.35-.246.25-.45.458-.673.609-.097.056-.239.037-.303.033l-.19.135a6.545 6.545 0 0 0-4.146-2.003l-.012-.223c-.065-.062-.143-.115-.163-.25-.022-.268.015-.557.057-.905.023-.163.061-.298.068-.475.001-.04-.001-.099-.001-.142 0-.306-.224-.555-.5-.555-.275 0-.499.249-.499.555l.001.014c0 .041-.002.092 0 .128.006.177.044.312.067.475.042.348.078.637.056.906a.545.545 0 0 1-.162.258l-.012.211a6.424 6.424 0 0 0-4.166 2.003 8.373 8.373 0 0 1-.18-.128c-.09.012-.18.04-.297-.029-.223-.15-.427-.358-.673-.608-.113-.12-.195-.234-.329-.349-.03-.026-.077-.062-.111-.088a.594.594 0 0 0-.348-.132.481.481 0 0 0-.398.176c-.172.216-.117.546.123.737l.007.005.104.083c.142.105.272.159.414.242.299.185.546.338.743.522.076.082.09.226.1.288l.16.143a6.462 6.462 0 0 0-1.02 4.506l-.208.06c-.055.072-.133.184-.215.217-.257.081-.546.11-.895.147-.164.014-.305.006-.48.039-.037.007-.09.02-.133.03l-.004.002-.007.002c-.295.071-.484.342-.423.608.061.267.349.429.645.365l.007-.001.01-.003.129-.029c.17-.046.294-.113.448-.172.33-.118.604-.217.87-.256.112-.009.23.069.288.101l.217-.037a6.5 6.5 0 0 0 2.88 3.596l-.09.218c.033.084.069.199.044.282-.097.252-.263.517-.452.813-.091.136-.185.242-.268.399-.02.037-.045.095-.064.134-.128.275-.034.591.213.71.248.12.556-.007.69-.282v-.002c.02-.039.046-.09.062-.127.07-.162.094-.301.144-.458.132-.332.205-.68.387-.897.05-.06.13-.082.215-.105l.113-.205a6.453 6.453 0 0 0 4.609.012l.106.192c.086.028.18.042.256.155.136.232.229.507.342.84.05.156.074.295.145.457.016.037.043.09.062.129.133.276.442.402.69.282.247-.118.341-.435.213-.71-.02-.039-.045-.096-.065-.134-.083-.156-.177-.261-.268-.398-.19-.296-.346-.541-.443-.793-.04-.13.007-.21.038-.294-.018-.022-.059-.144-.083-.202a6.499 6.499 0 0 0 2.88-3.622c.064.01.176.03.213.038.075-.05.144-.114.28-.104.266.039.54.138.87.256.154.06.277.128.448.173.036.01.088.019.13.028l.009.003.007.001c.297.064.584-.098.645-.365.06-.266-.128-.537-.423-.608zM16.4 9.701l-1.95 1.746v.005a.44.44 0 0 0 .173.757l.003.01 2.526.728a5.199 5.199 0 0 0-.108-1.674A5.208 5.208 0 0 0 16.4 9.7zm-4.013 5.325a.437.437 0 0 0-.404-.232.44.44 0 0 0-.372.233h-.002l-1.268 2.292a5.164 5.164 0 0 0 3.326.003l-1.27-2.296h-.01zm1.888-1.293a.44.44 0 0 0-.27.036.44.44 0 0 0-.214.572l-.003.004 1.01 2.438a5.15 5.15 0 0 0 2.081-2.615l-2.6-.44-.004.005z"
      />
    </svg>
  );
}

function ElestioMark() {
  return (
    <svg className="mc-tab-mark" viewBox="799 68 200 196" aria-hidden>
      <path
        d="M896.123 116.43C897.404 116.43 898.685 116.43 899.646 116.75L854.808 84.0823C850.004 86.3242 845.52 89.2066 841.356 92.4094C812.532 113.547 799.08 147.816 803.884 181.125L848.722 148.457C856.409 129.561 874.664 116.43 896.123 116.43Z"
        fill="url(#elestio-mark-0)"
      />
      <path
        d="M844.879 167.355C844.879 160.629 846.16 154.224 848.722 148.138C834.951 158.067 817.656 170.878 803.884 180.806C804.525 185.931 805.806 191.055 807.407 196.179C818.297 230.128 847.121 253.508 880.109 258.953C879.469 257.031 871.142 231.73 863.135 206.108C851.925 197.14 844.879 183.048 844.879 167.355Z"
        fill="url(#elestio-mark-1)"
      />
      <path
        d="M922.705 210.588C915.018 215.392 905.73 218.275 895.802 218.275C883.311 218.275 871.782 213.791 862.814 206.104L879.788 258.629C884.913 259.59 890.037 259.91 895.482 259.91C931.352 259.91 962.098 239.733 977.792 210.268H922.705V210.588Z"
        fill="url(#elestio-mark-2)"
      />
      <path
        d="M962.529 104L945.496 155.746C946.46 159.51 947.103 163.586 947.103 167.663C947.103 185.539 937.462 201.22 923 210H978.598C981.168 205.61 983.097 200.592 984.704 195.888C995.309 162.332 985.668 127.207 962.529 104Z"
        fill="url(#elestio-mark-3)"
      />
      <path
        d="M945.443 155.184L962.417 102.339C958.894 98.496 954.731 95.2931 950.567 92.0904C921.742 70.9524 884.591 69.0308 854.806 83.7633L899.644 116.431C922.063 118.353 940.318 134.046 945.443 155.184Z"
        fill="url(#elestio-mark-4)"
      />
      <defs>
        <linearGradient id="elestio-mark-0" x1="851.309" y1="180.769" x2="851.309" y2="84.0249" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC5A22" />
          <stop offset="1" stopColor="#F5A11A" />
        </linearGradient>
        <linearGradient id="elestio-mark-1" x1="842.08" y1="259.08" x2="842.08" y2="148.211" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BF161C" />
          <stop offset="1" stopColor="#E81C24" />
        </linearGradient>
        <linearGradient id="elestio-mark-2" x1="920.689" y1="260.396" x2="920.689" y2="206.38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8C278A" />
          <stop offset="1" stopColor="#A567A5" />
        </linearGradient>
        <linearGradient id="elestio-mark-3" x1="955.653" y1="209.818" x2="955.653" y2="103.873" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A9EA" />
          <stop offset="1" stopColor="#6DCAF1" />
        </linearGradient>
        <linearGradient id="elestio-mark-4" x1="908.701" y1="155.288" x2="908.701" y2="74.4424" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F28E1E" />
          <stop offset="1" stopColor="#FFC605" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function QuickInstall({
  dockerNote,
  docsLabel,
  copyLabel,
  copiedLabel,
  targetsLabel,
  k8sBefore,
  k8sLink,
  k8sAfter,
  elestioText,
  elestioLink,
  targets,
}: {
  dockerNote: string;
  docsLabel: string;
  copyLabel: string;
  copiedLabel: string;
  targetsLabel: string;
  k8sBefore: string;
  k8sLink: string;
  k8sAfter: string;
  elestioText: string;
  elestioLink: string;
  targets: InstallTarget[];
}) {
  const [active, setActive] = useState(targets[0]?.key ?? "");
  const [copied, setCopied] = useState(false);
  const id = useId();
  const current = targets.find((target) => target.key === active) ?? targets[0];
  const shell = current?.mode === "shell";

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
        {shell ? (
          <>
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
          </>
        ) : (
          <p className="mc-install-prose">
            {current?.mode === "k8s" ? (
              <>
                {k8sBefore}
                <a href={HELM_CHARTS} target="_blank" rel="noopener noreferrer" className="mc-link">
                  {k8sLink}
                </a>
                {k8sAfter}
              </>
            ) : (
              <>
                {elestioText}{" "}
                <a href={ELESTIO_HOSTING} target="_blank" rel="noopener noreferrer" className="mc-link">
                  {elestioLink} ↗
                </a>
              </>
            )}
          </p>
        )}
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
            {target.mode === "k8s" ? <KubernetesMark /> : null}
            {target.mode === "elestio" ? <ElestioMark /> : null}
            {target.label}
          </button>
        ))}
      </div>
      {shell ? (
        <p className="mc-install-note">
          <span className="mc-install-req">{dockerNote}</span>
          <br />
          <span>{current?.hint}</span>{" "}
          <a href={INSTALL_DOCS} target="_blank" rel="noopener noreferrer" className="mc-link mc-install-docs">
            {docsLabel}&nbsp;↗
          </a>
        </p>
      ) : null}
    </div>
  );
}
