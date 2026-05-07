"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === "en" ? "de" : "en";

  function switchLocale() {
    // Pages that have language-specific URLs (e.g. blog posts whose slug
    // differs between EN and DE) advertise the translated URL via
    // <link rel="alternate" hreflang="..."> tags in <head>. Prefer those
    // over a blind locale-prefix swap so the switcher always lands on a
    // real, existing page.
    if (typeof document !== "undefined") {
      const target = otherLocale === "de" ? "de" : "en";
      const link = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang^="${target}"]`,
      );
      if (link?.href) {
        window.location.assign(link.href);
        return;
      }
    }
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
