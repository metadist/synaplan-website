import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { HomeSectionSkeleton } from "@/components/sections/home-section-skeleton";
import { getSynaplanGithubRepoStats } from "@/lib/github-synaplan-repo";

const WidgetFlowSection = dynamic(
  () =>
    import("@/components/sections/widget-flow-section").then(
      (m) => m.WidgetFlowSection,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[28rem] rounded-none bg-transparent" />
    ),
  },
);

const MemoriesSection = dynamic(
  () =>
    import("@/components/sections/memories-section").then(
      (m) => m.MemoriesSection,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[28rem] rounded-none bg-transparent" />
    ),
  },
);

const SolutionsGrid = dynamic(
  () =>
    import("@/components/sections/solutions-grid").then(
      (m) => m.SolutionsGrid,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[22rem] rounded-none bg-transparent" />
    ),
  },
);

const FeaturesShowcase = dynamic(
  () =>
    import("@/components/sections/features-showcase").then(
      (m) => m.FeaturesShowcase,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[36rem] rounded-none bg-transparent" />
    ),
  },
);

const UseCasesSection = dynamic(
  () =>
    import("@/components/sections/use-cases").then((m) => m.UseCasesSection),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[24rem] rounded-none bg-transparent" />
    ),
  },
);

const OpenSourceSection = dynamic(
  () =>
    import("@/components/sections/open-source").then(
      (m) => m.OpenSourceSection,
    ),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[20rem] rounded-none bg-transparent" />
    ),
  },
);

const CTASection = dynamic(
  () => import("@/components/sections/cta-section").then((m) => m.CTASection),
  {
    loading: () => (
      <HomeSectionSkeleton className="min-h-[16rem] rounded-none bg-transparent" />
    ),
  },
);

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const githubRepo = getSynaplanGithubRepoStats();

  return (
    <>
      <HeroSection />
      <WidgetFlowSection />
      <MemoriesSection />
      <SolutionsGrid />
      <FeaturesShowcase />
      <UseCasesSection />
      <OpenSourceSection githubRepo={githubRepo} />
      <CTASection />
    </>
  );
}
