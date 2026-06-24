import { routing } from "@/i18n/routing";
import { buildFeedResponse } from "@/lib/feed";

export const dynamic = "force-dynamic";

/** English (default-locale) feed: https://www.synaplan.com/feed.xml */
export async function GET(): Promise<Response> {
  return buildFeedResponse(routing.defaultLocale);
}
