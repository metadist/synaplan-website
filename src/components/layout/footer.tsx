import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/constants";
import { GithubIcon, LinkedInIcon } from "@/components/icons";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("platform"),
      links: [
        { label: tn("forCompanies"), href: "/solutions/companies" },
        { label: tn("forDevelopers"), href: "/solutions/developers" },
        { label: tn("chatWidget"), href: "/solutions/chat-widget" },
        { label: tn("pricing"), href: "/pricing" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("docs"), href: LINKS.docs, external: true },
        { label: t("github"), href: LINKS.github, external: true },
        { label: t("discord"), href: LINKS.discord, external: true },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "/about" },
        { label: t("contact"), href: "/contact" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("imprint"), href: "/imprint" },
        { label: t("privacy"), href: "/privacy-policy" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-wide section-padding py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-bold tracking-tight text-foreground">
              <span className="font-mono text-brand-500">()</span>
              <span className="font-mono text-brand-500">&gt;</span>
              <span className="ml-0.5">synaplan</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year })}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
