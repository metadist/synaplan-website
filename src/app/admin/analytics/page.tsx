import type { Metadata } from "next";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import { AdminShell, AdminPageHeader } from "@/components/admin/admin-shell";
import { ZarazAnalytics } from "@/components/admin/zaraz-analytics";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const session = await getAdminSessionFromCookies();

  const zarazToken = process.env.CLOUDFLARE_ZARAZ_TOKEN ?? "";
  const zarazSiteId = process.env.CLOUDFLARE_ZARAZ_SITE_ID ?? "";

  return (
    <AdminShell userName={session?.name}>
      <AdminPageHeader
        title="Analytics"
        description="Cloudflare Zaraz web analytics"
      />
      <div className="p-6">
        <ZarazAnalytics zarazToken={zarazToken} zarazSiteId={zarazSiteId} />
      </div>
    </AdminShell>
  );
}
