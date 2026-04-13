"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LINKS } from "@/lib/constants";
import { Menu, ChevronDown } from "lucide-react";
import { GithubIcon, WhatsAppIcon } from "@/components/icons";
import { SynaplanLogo } from "@/components/brand/synaplan-logo";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const solutions = [
    { href: "/solutions/companies", label: t("nav.forCompanies") },
    { href: "/solutions/developers", label: t("nav.forDevelopers") },
    { href: "/solutions/chat-widget", label: t("nav.chatWidget") },
    { href: "/solutions/memories", label: t("nav.memories") },
    { href: "/solutions/plugins", label: t("nav.plugins") },
  ];

  const features = [
    { href: "/features/multi-model", label: t("nav.multiModel") },
    { href: "/features/audit-logs", label: t("nav.auditLogs") },
    { href: "/features/memories", label: t("nav.memories") },
    { href: "/features", label: t("nav.allFeatures") },
  ];

  const aboutItems = [
    { href: "/about/team", label: t("nav.team") },
    { href: "/about/philosophy", label: t("nav.philosophy") },
    { href: "/about/partners", label: t("nav.partners") },
    { href: "/about", label: t("nav.about") },
  ];

  const navItems = [
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/news", label: "News" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgb(196_197_215/0.2)] bg-page-tint/75 backdrop-blur-md dark:border-white/10 dark:bg-background/80">
      <div className="container-wide section-padding">
        <div className="relative flex h-20 items-center justify-between">
          <Link
            href="/"
            className="relative z-10 flex max-w-[min(100%,10.5rem)] shrink-0 items-center sm:max-w-none"
            aria-label="Synaplan home"
          >
            <SynaplanLogo variant="light" size="compact" className="max-w-full" />
          </Link>

          <nav className="ml-[50px] hidden items-center gap-1 xl:flex">
            {/* Solutions dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.solutions")}
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="w-60 rounded-xl border border-border bg-popover p-2 shadow-lg">
                  {solutions.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Features dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.features")}
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="w-60 rounded-xl border border-border bg-popover p-2 shadow-lg">
                  {features.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                  pathname === item.href ? "text-[#002c92]" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* About dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.about")}
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="w-52 rounded-xl border border-border bg-popover p-2 shadow-lg">
                  {aboutItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="relative z-10 flex items-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="Synaplan open-source repository on GitHub"
              className="hidden min-h-11 min-w-11 items-center justify-center rounded-lg px-2.5 py-2.5 text-muted-foreground transition-colors hover:text-foreground xl:flex"
            >
              <GithubIcon className="size-[27px]" />
            </a>

            <LanguageSwitcher />

            <div className="hidden items-center gap-2 sm:flex">
              <div className="group relative">
                <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <WhatsAppIcon className="size-4 text-[#25D366]" />
                  WhatsApp
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <div className="w-52 rounded-xl border border-border bg-popover p-2 shadow-lg">
                    <a
                      href={LINKS.whatsappDE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <span className="text-base leading-none">&#x1F1E9;&#x1F1EA;</span>
                      +49 1511 6038214
                    </a>
                    <a
                      href={LINKS.whatsappUS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <span className="text-base leading-none">&#x1F1FA;&#x1F1F8;</span>
                      +1 (628) 225-3244
                    </a>
                  </div>
                </div>
              </div>
              <a
                href={LINKS.web}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "btn-figma-primary rounded-lg border-0 px-5 text-white shadow-none hover:opacity-95"
                )}
              >
                {t("common.startForFree")}
              </a>
            </div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="xl:hidden"
                render={<Button variant="ghost" size="icon" />}
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <div className="flex flex-col gap-6 pt-8">
                  <div className="flex flex-col gap-1">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("nav.solutions")}
                    </p>
                    {solutions.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("nav.features")}
                    </p>
                    {features.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("nav.about")}
                    </p>
                    {aboutItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t border-border">
                    <a
                      href={LINKS.web}
                      className={cn(buttonVariants(), "w-full")}
                    >
                      {t("common.startForFree")}
                    </a>
                    <div className="flex gap-2">
                      <a
                        href={LINKS.whatsappDE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline" }), "flex-1 gap-2")}
                      >
                        <span className="text-base leading-none">&#x1F1E9;&#x1F1EA;</span>
                        WhatsApp
                      </a>
                      <a
                        href={LINKS.whatsappUS}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline" }), "flex-1 gap-2")}
                      >
                        <span className="text-base leading-none">&#x1F1FA;&#x1F1F8;</span>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
