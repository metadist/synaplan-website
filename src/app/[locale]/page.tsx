import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { SolutionsGrid } from "@/components/sections/solutions-grid";
import { FeaturesShowcase } from "@/components/sections/features-showcase";
import { UseCasesSection } from "@/components/sections/use-cases";
import { OpenSourceSection } from "@/components/sections/open-source";
import { CTASection } from "@/components/sections/cta-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <SolutionsGrid />
      <FeaturesShowcase />
      <UseCasesSection />
      <OpenSourceSection />
      <CTASection />
    </>
  );
}
