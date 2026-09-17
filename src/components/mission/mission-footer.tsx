import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/constants";
import { OsbaMemberBadge } from "@/components/brand/osba-member-badge";
import { ParrotGlyph } from "./parrot-glyph";
import { Lamp, Ruler } from "./primitives";
import { ParrotSwitch } from "./mission-header";
import { ModeToggle } from "./mode-toggle";

type FooterLink = { label: string; href: string; external?: boolean };

export function MissionFooter() {
  const t = useTranslations("mission.footer");
  const tn = useTranslations("mission.nav");
  const year = new Date().getFullYear();

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t("product"),
      links: [
        { label: tn("product"), href: "/product" },
        { label: tn("deploy"), href: "/deploy" },
        { label: tn("connect"), href: "/connect" },
        { label: tn("agents"), href: "/agents" },
        { label: tn("source"), href: "/source" },
        { label: t("pricing"), href: "/pricing" },
      ],
    },
    {
      title: t("deep"),
      links: [
        { label: t("features"), href: "/features" },
        { label: t("widget"), href: "/solutions/chat-widget" },
        { label: t("solutions"), href: "/solutions/companies" },
        { label: t("apps"), href: "/app" },
        { label: t("tryChat"), href: "/try-chat" },
        { label: t("blog"), href: "/blog" },
        { label: t("news"), href: "/news" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "/about" },
        { label: t("contact"), href: "/contact" },
        { label: t("support"), href: "/support" },
        { label: t("docs"), href: LINKS.docs, external: true },
        { label: t("github"), href: LINKS.github, external: true },
        { label: t("discord"), href: LINKS.discord, external: true },
        { label: t("sovereign"), href: LINKS.sovereignEU, external: true },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("imprint"), href: "/imprint" },
        { label: t("privacy"), href: "/privacy-policy" },
        { label: t("terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-[var(--mc-line)] bg-[var(--mc-ink-2)]">
      <div className="mc-wrap py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <ParrotGlyph still className="h-10 w-9" />
              <span className="mc-mono text-[0.8rem] tracking-[0.18em] uppercase">SYNAPLAN</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--mc-text-muted)]">{t("tagline")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ModeToggle />
              <ParrotSwitch />
            </div>
            <div className="mt-6">
              <OsbaMemberBadge hint="Open Source Business Alliance" />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mc-label mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--mc-text-muted)] transition-colors hover:text-[var(--mc-text)]">
                        {link.label} <span aria-hidden className="text-[var(--mc-text-faint)]">↗</span>
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-[var(--mc-text-muted)] transition-colors hover:text-[var(--mc-text)]">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Ruler left="SYS-000" center="DE-DUS · 51.2277° N 6.7735° E" right={`T+${year - 2024}Y`} />
          <div className="mc-mono mt-4 flex flex-col gap-3 text-[0.625rem] tracking-[0.14em] uppercase text-[var(--mc-text-faint)] sm:flex-row sm:items-center sm:justify-between">
            <span>{t("copyright", { year })}</span>
            <span className="flex items-center gap-2">
              <Lamp tone="green" pulse />
              {t("status")} · {t("parrotLine")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
