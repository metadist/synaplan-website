import { LegacyRedirect } from "@/components/legacy-redirect";

export default function MemoriesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegacyRedirect params={params} href="/features/memories" />;
}
