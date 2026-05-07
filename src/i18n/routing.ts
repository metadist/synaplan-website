import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // The URL is the single source of truth for the visitor's chosen
  // language. Do NOT auto-redirect based on Accept-Language headers or a
  // previously stored NEXT_LOCALE cookie — that overrides the visitor's
  // explicit intent (e.g. clicking the EN/DE switcher, sharing /de links,
  // search engines crawling /de) and previously made the language
  // switcher appear broken on /de for German-locale browsers.
  localeDetection: false,
});
