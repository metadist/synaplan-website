import { MissionCrumbs, type Crumb } from "@/components/mission/sub-page";

export type SolutionBreadcrumbItem = Crumb;

/**
 * Thin wrapper for leftover article pages. Chrome is Mission Control;
 * this only keeps breadcrumbs. Page bodies are restyled via `.mc` tokens.
 */
export function SolutionArticleShell({
  children,
  breadcrumbItems,
}: {
  children: React.ReactNode;
  breadcrumbItems: SolutionBreadcrumbItem[];
}) {
  return (
    <>
      <MissionCrumbs items={breadcrumbItems} />
      <div className="mc-legacy-article mc-wrap pb-16 pt-6">{children}</div>
    </>
  );
}
