import { LegacyRedirect } from "@/components/legacy-redirect";

export default function FeaturesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegacyRedirect params={params} href="/product" />;
}
