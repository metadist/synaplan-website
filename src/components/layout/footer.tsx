import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/constants";
import { GithubIcon, LinkedInIcon } from "@/components/icons";
import { SynaplanLogo } from "@/components/brand/synaplan-logo";

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
        { label: t("tryChat"), href: "/try-chat" },
        { label: t("widgetTrades"), href: "/solutions/chat-widget/trades" },
        { label: t("widgetHospitality"), href: "/solutions/chat-widget/hospitality" },
        { label: t("widgetReferences"), href: "/solutions/chat-widget/customers" },
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
    <footer className="border-t border-[rgb(196_197_215/0.15)] bg-[#12141f] text-neutral-300">
      <div className="container-wide section-padding py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">
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
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <SynaplanLogo variant="dark" className="max-h-8" />
          </div>
          <p className="text-xs text-neutral-500">
            {t("copyright", { year })}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 transition-colors hover:text-white"
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
