import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

/** Keep the old URL; send people to the Mission page that replaced it. */
export async function LegacyRedirect({
  params,
  href,
}: {
  params: Promise<{ locale: string }>;
  href: string;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href, locale });
}
