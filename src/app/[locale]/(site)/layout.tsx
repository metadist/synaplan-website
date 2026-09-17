import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/**
 * Classic site chrome — used by the deep content pages (features, solutions,
 * pricing, blog, legal, …). The homepage and the primary navigation pages use
 * the Mission Control chrome in the `(mission)` route group instead.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
