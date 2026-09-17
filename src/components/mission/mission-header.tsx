"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LINKS } from "@/lib/constants";
import { GithubIcon } from "@/components/icons";
import { ParrotGlyph } from "./parrot-glyph";
import { ModeToggle } from "./mode-toggle";
import { Lamp } from "./primitives";
import { applyParrotEnabled, useParrotEnabled } from "./mode";

export const MISSION_NAV = [
  { key: "product", href: "/product" },
  { key: "deploy", href: "/deploy" },
  { key: "connect", href: "/connect" },
  { key: "agents", href: "/agents" },
  { key: "source", href: "/source" },
] as const;

function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("mission.nav");
  const other = locale === "en" ? "de" : "en";
  return (
    <div className={`mc-switch ${className ?? ""}`} role="group" aria-label={t("language")}>
      <button type="button" aria-pressed={locale === "en"} onClick={() => locale !== "en" && router.replace(pathname, { locale: "en" })}>
        EN
      </button>
      <button type="button" aria-pressed={locale === "de"} onClick={() => locale !== "de" && router.replace(pathname, { locale: "de" })}>
        DE
      </button>
      <span className="mc-sr">{other}</span>
    </div>
  );
}

function ParrotSwitch() {
  const t = useTranslations("mission.nav");
  const on = useParrotEnabled();
  return (
    <div className="mc-switch" role="group" aria-label={t("parrot")}>
      <span className="px-2 text-[var(--mc-text-faint)]">{t("parrot")}</span>
      <button type="button" aria-pressed={on} onClick={() => applyParrotEnabled(true)}>
        {t("on")}
      </button>
      <button type="button" aria-pressed={!on} onClick={() => applyParrotEnabled(false)}>
        {t("off")}
      </button>
    </div>
  );
}

export function MissionHeader() {
  const t = useTranslations("mission");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open; Escape closes it
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="mc-header">
      <div className="mc-wrap flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Synaplan — Mission Control">
          <ParrotGlyph still color="var(--mc-text)" className="h-8 w-7" />
          <span className="mc-mono whitespace-nowrap text-[0.8rem] tracking-[0.18em] uppercase">
            <span className="text-[var(--mc-text)]">SYNAPLAN</span>
            <span className="hidden text-[var(--mc-text-faint)] sm:inline xl:hidden">{" //"}</span>
            <span className="hidden text-[var(--mc-text-faint)] min-[1400px]:inline">{" // "}</span>
            <span className="hidden text-[var(--mc-text-muted)] min-[1400px]:inline">{t("brand")}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {MISSION_NAV.map((item) => (
            <Link key={item.key} href={item.href} className="mc-nav-link" aria-current={isActive(item.href) ? "page" : undefined}>
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="mc-nav-link">
            {t("nav.docs")} ↗
          </a>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <div className="mc-mono hidden items-center gap-2 text-[0.625rem] tracking-[0.16em] uppercase text-[var(--mc-text-muted)] xl:flex" title={`${t("nav.status")}: ${t("nav.nominal")}`}>
            <span className="text-[var(--mc-text-faint)]">{t("nav.status")}</span>
            <Lamp tone="green" pulse />
            <span className="text-[var(--mc-text)]">{t("nav.nominal")}</span>
          </div>
          <ModeToggle className="hidden md:block" />
          <LocaleSwitch className="hidden md:inline-flex" />
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mc-nav-link hidden items-center md:inline-flex"
            aria-label={t("nav.github")}
            data-parrot-hover="github"
          >
            <GithubIcon className="size-4" />
          </a>
          <a href={LINKS.web} className="mc-btn mc-btn--primary mc-btn--sm hidden sm:inline-flex">
            {t("nav.launch")}
          </a>
          <button
            type="button"
            className="mc-btn mc-btn--sm lg:hidden"
            aria-expanded={open}
            aria-controls="mc-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mc-drawer" className="mc-drawer lg:hidden" role="dialog" aria-modal="true" aria-label={t("nav.menu")}>
          <div className="flex h-16 items-center justify-between">
            <span className="mc-mono text-[0.8rem] tracking-[0.18em] uppercase">{`SYNAPLAN // ${t("brand")}`}</span>
            <button type="button" className="mc-btn mc-btn--sm" onClick={() => setOpen(false)}>
              {t("nav.close")}
            </button>
          </div>
          <nav className="mt-4 flex flex-col" aria-label="Primary mobile">
            {MISSION_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="mc-nav-link"
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {t(`nav.${item.key}`)}
                <span aria-hidden>→</span>
              </Link>
            ))}
            <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="mc-nav-link">
              {t("nav.docs")} <span aria-hidden>↗</span>
            </a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="mc-nav-link" data-parrot-hover="github">
              {t("nav.github")} <span aria-hidden>↗</span>
            </a>
          </nav>
          <div className="mt-8 flex flex-col gap-4">
            <p className="mc-label">{t("nav.options")}</p>
            <div className="flex flex-wrap items-center gap-3">
              <ModeToggle />
              <LocaleSwitch />
              <ParrotSwitch />
            </div>
            <a href={LINKS.web} className="mc-btn mc-btn--primary mt-4">
              {t("nav.launch")}
            </a>
            <div className="mc-mono mt-4 flex items-center gap-2 text-[0.625rem] tracking-[0.16em] uppercase text-[var(--mc-text-muted)]">
              <span>{t("nav.status")}</span>
              <Lamp tone="green" pulse />
              <span className="text-[var(--mc-text)]">{t("nav.nominal")}</span>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export { ParrotSwitch };
