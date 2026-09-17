import { LegacyRedirect } from "@/components/legacy-redirect";

export default function CompaniesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegacyRedirect params={params} href="/product" />;
}
