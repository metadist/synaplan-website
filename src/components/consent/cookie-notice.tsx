"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  discardExpiredConsent,
  installGoogleAnalytics,
  stopGoogleAnalytics,
  trackPageView,
} from "@/lib/analytics-consent";
import {
  dismissConsentNotice,
  getConsentUiServerSnapshot,
  getConsentUiSnapshot,
  publishConsent,
  subscribeConsentUi,
} from "@/components/consent/consent-ui";

/**
 * Compact consent bar. The Google tag is not inserted until Agree.
 * Ignoring the bar is not consent.
 */
export function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const pathname = usePathname();
  const locale = useLocale();
  const snapshot = useSyncExternalStore(subscribeConsentUi, getConsentUiSnapshot, getConsentUiServerSnapshot);
  const splitAt = snapshot.lastIndexOf(":");
  const choice = snapshot.slice(0, splitAt);
  const reopen = snapshot.slice(splitAt + 1) === "1";
  const countedFirstView = useRef(false);
  const stopped = useRef(false);

  useEffect(() => {
    discardExpiredConsent();
  }, []);

  useEffect(() => {
    if (choice === "pending" || choice === "unknown") return;
    if (choice === "granted") {
      stopped.current = false;
      const first = !countedFirstView.current;
      installGoogleAnalytics();
      countedFirstView.current = true;
      if (!first) trackPageView();
      return;
    }
    if (choice === "denied" && !stopped.current) {
      stopped.current = true;
      stopGoogleAnalytics();
    }
  }, [choice, pathname, locale]);

  const open = choice === "unknown" || reopen;
  if (!open) return null;

  const revisiting = choice === "granted" || choice === "denied";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-notice-title"
      aria-describedby="cookie-notice-body"
      data-testid="cookie-notice"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-start p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
    >
      <div className="pointer-events-auto relative w-[min(36rem,calc(100%-4.5rem))] rounded-2xl border border-[var(--mc-line-strong)] bg-[var(--mc-ink-2)]/95 p-3.5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.7)] backdrop-blur-md sm:p-4">
        {revisiting ? (
          <button
            type="button"
            className="absolute top-2 right-2 px-1.5 text-sm text-[var(--mc-text-faint)] hover:text-[var(--mc-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-cyan)]"
            onClick={dismissConsentNotice}
            aria-label={t("close")}
          >
            <span aria-hidden>×</span>
          </button>
        ) : null}
        <p id="cookie-notice-title" className="mc-label">
          {t("title")}
        </p>
        <p id="cookie-notice-body" className="mt-1.5 text-sm leading-relaxed text-[var(--mc-text-muted)]">
          {t("body")}{" "}
          <Link
            href="/privacy-policy"
            className="underline decoration-[var(--mc-line-strong)] underline-offset-4 hover:text-[var(--mc-text)]"
          >
            {t("privacy")}
          </Link>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="mc-btn mc-btn--sm" onClick={() => publishConsent("denied")}>
            {t("decline")}
          </button>
          <button type="button" className="mc-btn mc-btn--sm mc-btn--primary" onClick={() => publishConsent("granted")}>
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
