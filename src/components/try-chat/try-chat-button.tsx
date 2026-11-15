"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { openSupportWidget } from "@/components/try-chat/support-widget";

function WidgetNotice({ reason, onClose }: { reason: "blocked" | "failed"; onClose: () => void }) {
  const t = useTranslations("tryChat");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="mc fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.72)", minHeight: 0 }}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-widget-notice-title"
        className="w-full max-w-md rounded-[14px] border border-[var(--mc-line-strong)] p-6 shadow-2xl"
        style={{ background: "#171c28" }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="support-widget-notice-title" className="text-lg font-semibold text-[var(--mc-text)]">
          {t("widgetBlockedTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--mc-text-muted)]">
          {t(reason === "blocked" ? "widgetBlockedBody" : "widgetFailedBody")}
        </p>
        <button type="button" className="mc-btn mc-btn--primary mt-6 cursor-pointer" onClick={onClose}>
          {t("widgetBlockedClose")}
        </button>
      </div>
    </div>
  );
}

/** Opens the website widget instead of the retired free-chat demo. */
export function TryChatButton({
  className,
  children,
  autoOpen = false,
}: {
  className?: string;
  children: React.ReactNode;
  autoOpen?: boolean;
}) {
  const [notice, setNotice] = useState<"blocked" | "failed" | null>(null);

  useEffect(() => {
    if (!autoOpen) return;
    void openSupportWidget().then((result) => {
      if (result !== "opened") setNotice(result);
    });
  }, [autoOpen]);

  return (
    <>
      <button
        type="button"
        className={cn("cursor-pointer", className)}
        onClick={() => {
          void openSupportWidget().then((result) => {
            if (result !== "opened") setNotice(result);
          });
        }}
      >
        {children}
      </button>
      {notice ? createPortal(<WidgetNotice reason={notice} onClose={() => setNotice(null)} />, document.body) : null}
    </>
  );
}
