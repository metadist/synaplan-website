"use client";

import { openConsentNotice } from "@/components/consent/consent-ui";

/** Reopens the analytics notice so a previous choice can be changed. */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      data-testid="cookie-settings"
      className="text-left text-base text-[var(--mc-text)] transition-colors hover:text-[var(--mc-text)]"
      onClick={openConsentNotice}
    >
      {label}
    </button>
  );
}
