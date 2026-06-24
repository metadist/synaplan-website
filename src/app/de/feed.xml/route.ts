import { buildFeedResponse } from "@/lib/feed";

export const dynamic = "force-dynamic";

/** German feed: https://www.synaplan.com/de/feed.xml */
export async function GET(): Promise<Response> {
  return buildFeedResponse("de");
}
