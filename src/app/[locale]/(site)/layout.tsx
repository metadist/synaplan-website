import { MissionChrome } from "@/components/mission/mission-chrome";

/**
 * Deep content routes (features, solutions, pricing, blog, …) use the same
 * Mission Control chrome as the homepage. The classic white header/footer
 * is gone.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <MissionChrome locale={locale}>{children}</MissionChrome>;
}
