import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { missionMetadata, missionPageJsonLd } from "@/lib/mission-seo";
import { PageHero } from "@/components/mission/sub-page";

const PATH = "/terms";

type Section = { title: string; body: string[] };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsOfUse" });
  return missionMetadata(locale, PATH, t("metaTitle"), t("metaDescription"));
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "termsOfUse" });
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(missionPageJsonLd(locale, PATH, t("metaTitle"), t("metaDescription"))) }}
      />
      <PageHero eyebrow={t("badge")} title={t("pageTitle")} lead={`${t("pageSubtitle")} ${t("lastUpdated")}`} />

      <section className="mc-section">
        <div className="mc-wrap max-w-3xl space-y-8">
          {sections.map((section, i) => (
            <article key={section.title} className="mc-card">
              <p className="mc-section-num">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mc-mono mt-3 text-[0.95rem] tracking-[0.06em] uppercase">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-[0.95rem] leading-relaxed text-[var(--mc-text-muted)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="mc-btn">
              {t("linkPrivacy")} →
            </Link>
            <Link href="/imprint" className="mc-btn">
              {t("linkImprint")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
