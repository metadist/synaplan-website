"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

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
      className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-brand-500 hover:text-foreground"
      aria-label={`Switch to ${otherLocale === "de" ? "German" : "English"}`}
    >
      <span className={locale === "en" ? "text-foreground" : ""}>EN</span>
      <span className="text-border">/</span>
      <span className={locale === "de" ? "text-foreground" : ""}>DE</span>
    </button>
  );
}
