"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AppleIcon, GooglePlayIcon } from "@/components/icons";
import { storeLinksFor } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StoreBadgesProps = {
  className?: string;
  size?: "sm" | "md";
  variant?: "dark" | "onDark";
};

export function StoreBadges({
  className,
  size = "md",
  variant = "dark",
}: StoreBadgesProps) {
  const locale = useLocale();
  const t = useTranslations("apps");
  const links = storeLinksFor(locale);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <StoreBadge
        href={links.appStore}
        icon={<AppleIcon className={size === "sm" ? "size-5" : "size-6"} />}
        eyebrow={t("appStoreEyebrow")}
        label={t("appStoreLabel")}
        ariaLabel={t("appStoreAria")}
        size={size}
        variant={variant}
      />
      <StoreBadge
        href={links.playStore}
        icon={<GooglePlayIcon className={size === "sm" ? "size-5" : "size-6"} />}
        eyebrow={t("playStoreEyebrow")}
        label={t("playStoreLabel")}
        ariaLabel={t("playStoreAria")}
        size={size}
        variant={variant}
      />
    </div>
  );
}

function StoreBadge({
  href,
  icon,
  eyebrow,
  label,
  ariaLabel,
  size,
  variant,
}: {
  href: string;
  icon: ReactNode;
  eyebrow: string;
  label: string;
  ariaLabel: string;
  size: "sm" | "md";
  variant: "dark" | "onDark";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-3 rounded-xl shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "onDark"
          ? "border border-white/20 bg-white text-[#12141f] hover:bg-white/95 focus-visible:ring-white/40 focus-visible:ring-offset-[#12141f]"
          : "bg-[#12141f] text-white hover:bg-black focus-visible:ring-[#002c92]/40 focus-visible:ring-offset-2",
        size === "sm" ? "min-h-11 px-3 py-1.5" : "min-h-12 px-4 py-2",
      )}
    >
      <span className="shrink-0" aria-hidden>
        {icon}
      </span>
      <span className="flex min-w-0 flex-col items-start leading-none">
        <span
          className={cn(
            "font-medium uppercase tracking-[0.08em]",
            variant === "onDark" ? "text-[#12141f]/60" : "text-white/70",
            size === "sm" ? "text-[0.58rem]" : "text-[0.62rem]",
          )}
        >
          {eyebrow}
        </span>
        <span
          className={cn(
            "mt-0.5 font-semibold tracking-tight",
            size === "sm" ? "text-sm" : "text-[0.95rem]",
          )}
        >
          {label}
        </span>
      </span>
    </a>
  );
}
