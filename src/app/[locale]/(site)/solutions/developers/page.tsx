import { LegacyRedirect } from "@/components/legacy-redirect";

export default function DevelopersRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegacyRedirect params={params} href="/source" />;
}
