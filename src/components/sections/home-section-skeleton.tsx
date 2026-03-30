import { cn } from "@/lib/utils";

/** Lightweight placeholder for below-the-fold sections while chunks load. */
export function HomeSectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl animate-pulse rounded-2xl bg-muted/25",
        className,
      )}
      aria-hidden
    />
  );
}
