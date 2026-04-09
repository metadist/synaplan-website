import { routing } from "@/i18n/routing";

const SITE = "https://synaplan.com";

/** Path must start with `/` (e.g. `/solutions/chat-widget`). */
export function canonicalUrl(locale: string, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return `${SITE}${p}`;
  }
  return `${SITE}/${locale}${p}`;
}

export const OG_IMAGE = { url: "/og/homepage.png", width: 1200, height: 630 };

/** hreflang-style alternate URLs for `alternates.languages`. */
export function alternateLanguageUrls(path: string): Record<string, string> {
  const p = path.startsWith("/") ? path : `/${path}`;
  return {
    en: `${SITE}${p}`,
    de: `${SITE}/de${p}`,
  };
}
