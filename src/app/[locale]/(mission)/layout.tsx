import { MissionChrome } from "@/components/mission/mission-chrome";

/**
 * Mission Control chrome for the homepage and the primary navigation pages
 * (product / deploy / connect / agents / source) plus legal pages.
 */
export default async function MissionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <MissionChrome locale={locale}>{children}</MissionChrome>;
}
