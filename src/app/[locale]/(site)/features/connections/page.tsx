import { LegacyRedirect } from "@/components/legacy-redirect";

export default function ConnectionsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegacyRedirect params={params} href="/connect" />;
}
