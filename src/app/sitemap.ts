import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE = "https://synaplan.com";

const PATHS = [
  "",
  "/solutions/chat-widget",
  "/solutions/memories",
  "/solutions/chat-widget/trades",
  "/solutions/chat-widget/hospitality",
  "/solutions/chat-widget/customers",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of PATHS) {
      const url =
        locale === routing.defaultLocale
          ? path === ""
            ? `${SITE}/`
            : `${SITE}${path}`
          : path === ""
            ? `${SITE}/${locale}`
            : `${SITE}/${locale}${path}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority:
          path === ""
            ? 1
            : path === "/solutions/chat-widget"
              ? 0.9
              : 0.75,
      });
    }
  }

  return entries;
}
