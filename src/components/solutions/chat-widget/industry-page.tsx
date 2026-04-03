import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ChatWidgetIndustryLanding,
  type IndustrySlug,
} from "@/components/solutions/chat-widget/chat-widget-industry-landing";

export async function ChatWidgetIndustryPage({
  locale,
  slug,
}: {
  locale: string;
  slug: IndustrySlug;
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "chatWidget" });
  const prefix = `${slug}.`;

  return (
    <>
      <div className="container-wide section-padding border-b border-[rgb(196_197_215/0.12)] bg-page-tint/30 pb-4 pt-6 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            {t("hub.breadcrumbHome")}
          </Link>
          <span className="text-muted-foreground/50" aria-hidden>
            /
          </span>
          <Link
            href="/solutions/chat-widget"
            className="transition-colors hover:text-foreground"
          >
            {t("hub.breadcrumbChatWidget")}
          </Link>
          <span className="text-muted-foreground/50" aria-hidden>
            /
          </span>
          <span className="font-medium text-foreground">
            {t(`${prefix}breadcrumbCurrent`)}
          </span>
        </nav>
      </div>
      <ChatWidgetIndustryLanding slug={slug} />
    </>
  );
}
