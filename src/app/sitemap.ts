import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

const SITE = "https://synaplan.com";

/**
 * Priority mapping based on SISTRIX keyword research (25.03.2026):
 * - Homepage:              1.0  (ki plattform, ai platform)
 * - Chat-Widget:           0.95 (ki chatbot 2.100 SV, ki kundenservice €15 CPC — highest commercial value)
 * - Pricing:               0.90
 * - Companies:             0.85 (chatgpt für unternehmen)
 * - Developers:            0.85 (open source ki 400 SV, ai gateway €13 CPC)
 * - Widget sub-pages:      0.80
 * - Memories / Plugins:    0.75
 * - Legal pages:           0.30
 */
type PathConfig = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const PATHS: PathConfig[] = [
  // ── Core ──────────────────────────────────────────────────────────────────
  { path: "",                                   priority: 1.0,  changeFrequency: "weekly" },
  { path: "/pricing",                           priority: 0.90, changeFrequency: "monthly" },

  // ── Solutions ──────────────────────────────────────────────────────────────
  { path: "/solutions/chat-widget",             priority: 0.95, changeFrequency: "monthly" },
  { path: "/solutions/companies",               priority: 0.85, changeFrequency: "monthly" },
  { path: "/solutions/developers",              priority: 0.85, changeFrequency: "monthly" },
  { path: "/solutions/memories",               priority: 0.75, changeFrequency: "monthly" },
  { path: "/solutions/plugins",                priority: 0.75, changeFrequency: "monthly" },

  // ── Chat-Widget sub-pages ─────────────────────────────────────────────────
  { path: "/solutions/chat-widget/trades",      priority: 0.80, changeFrequency: "monthly" },
  { path: "/solutions/chat-widget/hospitality", priority: 0.80, changeFrequency: "monthly" },
  { path: "/solutions/chat-widget/customers",   priority: 0.80, changeFrequency: "monthly" },

  // ── Features (new) ────────────────────────────────────────────────────────
  { path: "/features",                          priority: 0.85, changeFrequency: "monthly" },
  { path: "/features/multi-model",              priority: 0.82, changeFrequency: "monthly" },
  { path: "/features/audit-logs",               priority: 0.82, changeFrequency: "monthly" },
  { path: "/features/memories",                 priority: 0.78, changeFrequency: "monthly" },

  // ── About (new) ───────────────────────────────────────────────────────────
  { path: "/about",                             priority: 0.70, changeFrequency: "monthly" },
  { path: "/about/team",                        priority: 0.65, changeFrequency: "monthly" },
  { path: "/about/philosophy",                  priority: 0.60, changeFrequency: "yearly"  },
  { path: "/about/partners",                    priority: 0.65, changeFrequency: "monthly" },

  // ── Utility ───────────────────────────────────────────────────────────────
  { path: "/try-chat",                          priority: 0.65, changeFrequency: "monthly" },

  // ── Blog ──────────────────────────────────────────────────────────────────
  { path: "/blog",                              priority: 0.60, changeFrequency: "weekly" },

  // ── Legal — low priority but must be indexed ──────────────────────────────
  { path: "/imprint",                           priority: 0.30, changeFrequency: "yearly" },
  { path: "/privacy-policy",                    priority: 0.30, changeFrequency: "yearly" },
];

function buildUrl(locale: string, path: string): string {
  const isDefault = locale === routing.defaultLocale;
  if (path === "") {
    return isDefault ? `${SITE}/` : `${SITE}/${locale}`;
  }
  return isDefault ? `${SITE}${path}` : `${SITE}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const { path, priority, changeFrequency } of PATHS) {
      const url = buildUrl(locale, path);

      const alternates: Record<string, string> = {};
      for (const loc of routing.locales) {
        alternates[loc] = buildUrl(loc, path);
      }
      alternates["x-default"] = buildUrl(routing.defaultLocale, path);

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages: alternates },
      });
    }
  }

  // Dynamic blog posts from the database
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        locale: true,
        translationKey: true,
        updatedAt: true,
      },
    });

    const translationMap = new Map<string, Map<string, string>>();
    for (const post of posts) {
      if (post.translationKey) {
        if (!translationMap.has(post.translationKey)) {
          translationMap.set(post.translationKey, new Map());
        }
        translationMap.get(post.translationKey)!.set(post.locale, post.slug);
      }
    }

    for (const post of posts) {
      const blogPath = `/blog/${post.slug}`;
      const locale = routing.locales.includes(post.locale as "en" | "de")
        ? post.locale
        : routing.defaultLocale;
      const url = buildUrl(locale, blogPath);

      const alternates: Record<string, string> = {};
      alternates[locale] = url;

      if (post.translationKey) {
        const translations = translationMap.get(post.translationKey);
        if (translations) {
          for (const [loc, slug] of translations) {
            alternates[loc] = buildUrl(loc, `/blog/${slug}`);
          }
        }
      }
      alternates["x-default"] = alternates[routing.defaultLocale] ?? url;

      entries.push({
        url,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.70,
        alternates: { languages: alternates },
      });
    }
  } catch {
    // DB unavailable at build time (e.g. CI without DATABASE_URL) — skip blog posts
  }

  return entries;
}
