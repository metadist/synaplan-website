"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

/**
 * EN / DE switcher.
 *
 * Deliberately dumb: it swaps the locale on the *current* pathname and
 * navigates there. Nothing else.
 *
 * No <link rel="alternate"> sniffing, no cookies, no Accept-Language, no
 * "remember last choice", no redirect to a marketing-preferred locale. If
 * the visitor clicks EN, they go to the EN URL — period. If that URL does
 * not exist (e.g. a German-only blog post slug), they get a normal 404 and
 * can navigate from there. That is the user's call to make, not ours.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === "en" ? "de" : "en";

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <button
      onClick={switchLocale}
      className="flex min-h-11 min-w-11 items-center gap-1 rounded-lg border border-border px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-brand-500 hover:text-foreground"
      aria-label={`Switch to ${otherLocale === "de" ? "German" : "English"}`}
    >
      <span className={locale === "en" ? "text-foreground" : ""}>EN</span>
      <span className="text-border">/</span>
      <span className={locale === "de" ? "text-foreground" : ""}>DE</span>
    </button>
  );
}
