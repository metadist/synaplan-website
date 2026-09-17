import { notFound } from "next/navigation";

/**
 * Catch-all so unknown URLs inside a locale render the localized
 * `[locale]/not-found.tsx` (the Mission Control "SIGNAL NOT FOUND" page)
 * instead of the framework default.
 */
export default function CatchAllPage() {
  notFound();
}
