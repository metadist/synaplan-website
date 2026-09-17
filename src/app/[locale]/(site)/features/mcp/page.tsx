import { LegacyRedirect } from "@/components/legacy-redirect";

export default function McpRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegacyRedirect params={params} href="/connect" />;
}
