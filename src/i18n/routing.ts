import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // The URL is the ONLY source of truth for the visitor's chosen language.
  //
  // - `localeDetection: false` → never redirect based on Accept-Language.
  // - `localeCookie: false`    → never write a NEXT_LOCALE cookie.
  //
  // Together these guarantee that clicking EN on a /de page actually lands
  // the visitor on the EN page, instead of being silently re-routed back to
  // DE by a leftover cookie or a browser-language sniffer. If you ever feel
  // tempted to flip these on for "convenience", DON'T — it's the exact bug
  // we removed.
  localeDetection: false,
  localeCookie: false,
});
