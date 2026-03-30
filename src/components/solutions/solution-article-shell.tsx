import { Link } from "@/i18n/navigation";

export type SolutionBreadcrumbItem = {
  label: string;
  href?: string;
};

export function SolutionArticleShell({
  children,
  breadcrumbItems,
}: {
  children: React.ReactNode;
  breadcrumbItems: SolutionBreadcrumbItem[];
}) {
  return (
    <article className="relative overflow-hidden border-b border-[rgb(196_197_215/0.2)] bg-gradient-to-b from-background via-[#fff7fa]/35 to-[#f6e3f3]/25">
      <div className="container-wide section-padding py-10 sm:py-14">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
        >
          {breadcrumbItems.map((item, i) => (
            <span key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-muted-foreground/50" aria-hidden>
                  /
                </span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        {children}
      </div>
    </article>
  );
}
