import { cn } from "@/lib/utils";

type SynaplanLogoProps = {
  /**
   * `light` — dark glyph on light UI (site header).
   * `dark` — white logo on dark UI (footer).
   * `onBrand` — original white artwork on brand blue (e.g. widget chrome `#002c92`).
   */
  variant: "light" | "dark" | "onBrand";
  className?: string;
  /** Shorter height on very small screens */
  size?: "default" | "compact";
};

/**
 * Brand mark from `/public/synaplan_logo.svg` (wordmark + icon).
 */
export function SynaplanLogo({
  variant,
  className,
  size = "default",
}: SynaplanLogoProps) {
  return (
    <img
      src="/synaplan_logo.svg"
      alt="Synaplan — Open-Source AI Platform"
      width={151}
      height={33}
      decoding="async"
      className={cn(
        "w-auto shrink-0 object-contain object-left",
        size === "compact" ? "h-6 sm:h-7" : "h-7 sm:h-8",
        variant === "light" && "brightness-0",
        variant === "dark" && "opacity-95",
        variant === "onBrand" && "opacity-[0.98]",
        className,
      )}
    />
  );
}
