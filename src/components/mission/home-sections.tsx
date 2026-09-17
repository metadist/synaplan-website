import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LINKS, USE_CASES } from "@/lib/constants";
import { formatGithubRepoStatNumber, type SynaplanGithubRepoStats } from "@/lib/github-synaplan-repo";
import { GithubIcon } from "@/components/icons";
import { Lamp, Reveal, Ruler, SectionHead } from "./primitives";
import { MissionConsole } from "./mission-console";
import { SignalsDiagram } from "./signals-diagram";
import { Pipeline } from "./pipeline";
import { Topology } from "./topology";
import { DeployTabs } from "./deploy-tabs";
import { ApiSample, ComposeSample, HelmSample, InspectSample } from "./code-samples";

type Channel = { key: string; label: string; desc: string };
type Step = { key: string; label: string; desc: string };
type Fact = { label: string; value: string };
type LadderStep = { label: string; desc: string };
type InspectRow = { key: string; value: string };
export type CtaLink = { label: string; href: string; external?: boolean; newTab?: boolean };

/* ─── HERO ───────────────────────────────────────────────────────────────── */

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission.hero" });
  return (
    <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 lg:pt-24 lg:pb-24" data-parrot="hello">
      <div className="mc-grid" aria-hidden />
      <div className="mc-wrap relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p className="mc-label flex items-center gap-2">
            <Lamp tone="green" pulse />
            {t("eyebrow")}
          </p>
          <h1 className="mc-display mt-6 text-[clamp(2.6rem,6.2vw,5.4rem)]">
            <span className="mc-marketing">{t("title")}</span>
            <span className="mc-engineer">{t("engineerTitle")}</span>
          </h1>
          <p className="mc-lead mt-6">
            <span className="mc-marketing">{t("subtitle")}</span>
            <span className="mc-engineer">{t("engineerSubtitle")}</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={LINKS.web} className="mc-btn mc-btn--primary">
              [ {t("primary")} ]
            </a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="mc-btn" data-parrot-hover="github">
              <GithubIcon className="size-4" />
              {t("secondary")}
            </a>
          </div>
          <p className="mc-label mt-6 text-[0.6rem]">{t("note")}</p>
        </div>
        <div className="relative">
          <MissionConsole />
        </div>
      </div>
    </section>
  );
}

/* ─── TICKER ─────────────────────────────────────────────────────────────── */

export async function Ticker({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission" });
  const items = t.raw("ticker") as string[];
  const doubled = [...items, ...items];
  return (
    <div className="mc-ticker" aria-hidden>
      <div className="mc-ticker-track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="mc-ticker-item">
            <Lamp tone={i % 3 === 0 ? "green" : i % 3 === 1 ? "blue" : "amber"} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── 01 INCOMING SIGNALS ───────────────────────────────────────────────── */

export async function SignalsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission.signals" });
  const channels = t.raw("channels") as Channel[];
  return (
    <section id="signals" className="mc-section" data-parrot="signals">
      <div className="mc-wrap">
        <SectionHead num={t("num")} title={t("title")} tag="CH-01…06" />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <h2 className="mc-display text-[clamp(1.9rem,3.6vw,3rem)]">{t("heading")}</h2>
            <p className="mc-lead mt-5 mc-marketing">{t("text")}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {channels.map((c, i) => (
                <Reveal key={c.key} as="li" delay={i * 60} className="mc-card mc-card-tight">
                  <div className="flex items-center gap-2">
                    <Lamp tone="green" />
                    <span className="mc-mono text-[0.75rem] tracking-[0.14em] uppercase">{c.label}</span>
                  </div>
                  <p className="mt-1.5 text-[0.8rem] leading-snug text-[var(--mc-text-muted)]">{c.desc}</p>
                </Reveal>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="mc-card mc-frame p-3 sm:p-5">
            <SignalsDiagram channels={channels} coreLabel={t("core")} />
            <Ruler left="INBOUND" center="SIG-01 … SIG-06" right="CORE" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 02 AGENT CORE ─────────────────────────────────────────────────────── */

export async function CoreSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission.core" });
  const steps = t.raw("steps") as Step[];
  const facts = t.raw("facts") as Fact[];
  return (
    <section id="core" className="mc-section mc-panel-light" data-parrot="core">
      <div className="mc-grid" aria-hidden />
      <div className="mc-wrap relative">
        <SectionHead num={t("num")} title={t("title")} tag="SYS-03" />
        <Reveal>
          <h2 className="mc-display max-w-4xl text-[clamp(1.9rem,3.6vw,3rem)]">{t("heading")}</h2>
          <p className="mc-lead mt-5 mc-marketing">{t("text")}</p>
        </Reveal>
        <Reveal delay={100} className="mt-10">
          <Pipeline steps={steps} />
        </Reveal>
        <Reveal delay={160} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="mc-card mc-card-tight">
              <p className="mc-label">{f.label}</p>
              <p className="mt-2 text-[0.85rem] leading-snug">{f.value}</p>
            </div>
          ))}
        </Reveal>
        <div className="mc-engineer mt-8">
          <ApiSample />
        </div>
      </div>
    </section>
  );
}

/* ─── 03 CONNECT EVERYTHING ─────────────────────────────────────────────── */

export async function ConnectSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission.connect" });
  return (
    <section id="connect" className="mc-section" data-parrot="connect">
      <div className="mc-wrap">
        <SectionHead num={t("num")} title={t("title")} tag="TOPO-01" />
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <h2 className="mc-display text-[clamp(1.9rem,3.6vw,3rem)]">{t("heading")}</h2>
            <p className="mc-lead mt-5 mc-marketing">{t("text")}</p>
            <Link href="/connect" className="mc-btn mt-8">
              {t("title")} →
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <Topology />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 04 RUN IT ANYWHERE ────────────────────────────────────────────────── */

export async function RunSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission.run" });
  const ladder = t.raw("ladder") as LadderStep[];
  return (
    <section id="run" className="mc-section" data-parrot="run">
      <div className="mc-grid" aria-hidden />
      <div className="mc-wrap relative">
        <SectionHead num={t("num")} title={t("title")} tag="DEPLOY" />
        <Reveal>
          <h2 className="mc-display max-w-4xl text-[clamp(1.9rem,3.6vw,3rem)]">{t("heading")}</h2>
          <p className="mc-lead mt-5 mc-marketing">{t("text")}</p>
        </Reveal>
        <Reveal delay={100} className="mt-10">
          <DeployTabs
            tabs={[
              { key: "compose", label: t("tabs.compose"), panel: <ComposeSample /> },
              { key: "helm", label: t("tabs.helm"), panel: <HelmSample /> },
              {
                key: "cloud",
                label: t("tabs.cloud"),
                panel: (
                  <div className="mc-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl text-[0.95rem] leading-relaxed text-[var(--mc-text-muted)]">{t("cloudText")}</p>
                    <a href={LINKS.web} className="mc-btn mc-btn--primary shrink-0">
                      {t("cloudCta")}
                    </a>
                  </div>
                ),
              },
            ]}
          />
        </Reveal>
        <Reveal delay={160} className="mt-10">
          <ol className="mc-ladder">
            {ladder.map((s, i) => (
              <li key={s.label} className="mc-ladder-step">
                <p className="mc-label">{String(i + 1).padStart(2, "0")}</p>
                <p className="mc-mono mt-1 text-[0.85rem] tracking-[0.06em] uppercase">{s.label}</p>
                <p className="mt-1 text-[0.8rem] text-[var(--mc-text-muted)]">{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/deploy" className="mc-btn">
              {t("title")} →
            </Link>
            <a href={`${LINKS.docs}`} target="_blank" rel="noopener noreferrer" className="mc-btn">
              {t("docs")} ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── 05 FLIGHT LOG ─────────────────────────────────────────────────────── */

export async function FlightLogSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission.log" });
  const isDE = locale === "de";
  return (
    <section id="log" className="mc-section mc-panel-light">
      <div className="mc-wrap">
        <SectionHead num={t("num")} title={t("title")} tag="LOG" />
        <Reveal>
          <h2 className="mc-display text-[clamp(1.9rem,3.6vw,3rem)]">{t("heading")}</h2>
          <p className="mc-lead mt-5 mc-marketing">{t("text")}</p>
        </Reveal>
        <ol className="mt-10 grid gap-3 md:grid-cols-2">
          {USE_CASES.map((u, i) => (
            <Reveal key={u.company} as="li" delay={i * 70} className="mc-card">
              <div className="flex items-center justify-between gap-3">
                <span className="mc-label">LOG-{String(i + 1).padStart(3, "0")}</span>
                <span className="mc-chip">
                  <Lamp tone="green" />
                  {t("status")}
                </span>
              </div>
              <p className="mc-mono mt-3 text-[0.8rem] tracking-[0.08em] uppercase">{u.company}</p>
              <p className="mt-2 text-[1.05rem] leading-snug">“{isDE ? u.quoteDE : u.quote}”</p>
              <p className="mt-2 text-[0.85rem] text-[var(--mc-muted-on-cream)]">{isDE ? u.descriptionDE : u.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── 06 THE SOURCE ─────────────────────────────────────────────────────── */

export async function SourceSection({ locale, stats }: { locale: string; stats: SynaplanGithubRepoStats | null }) {
  const t = await getTranslations({ locale, namespace: "mission.source" });
  const ti = await getTranslations({ locale, namespace: "mission.inspect" });
  const rows = ti.raw("rows") as InspectRow[];
  return (
    <section id="source" className="mc-section" data-parrot="source">
      <div className="mc-wrap grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <SectionHead num={t("num")} title={t("title")} tag="Apache-2.0" />
          <Reveal>
            <h2 className="mc-display text-[clamp(1.9rem,3.6vw,3rem)]">{t("heading")}</h2>
            <p className="mc-lead mt-5 mc-marketing">{t("text")}</p>
          </Reveal>
          <Reveal delay={80} className="mt-8 grid grid-cols-3 gap-3">
            <div className="mc-card mc-card-tight">
              <p className="mc-label">{t("stars")}</p>
              <p className="mc-mono mt-2 text-2xl tabular-nums">{formatGithubRepoStatNumber(stats?.stars, locale)}</p>
            </div>
            <div className="mc-card mc-card-tight">
              <p className="mc-label">{t("forks")}</p>
              <p className="mc-mono mt-2 text-2xl tabular-nums">{formatGithubRepoStatNumber(stats?.forks, locale)}</p>
            </div>
            <div className="mc-card mc-card-tight">
              <p className="mc-label">{t("license")}</p>
              <p className="mc-mono mt-2 text-lg">{stats?.licenseLabel ?? "Apache-2.0"}</p>
            </div>
          </Reveal>
          <Reveal delay={140} className="mt-6 flex flex-wrap gap-3">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="mc-btn mc-btn--primary" data-parrot-hover="github">
              <GithubIcon className="size-4" /> {t("cta")}
            </a>
            <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="mc-btn">
              {t("docs")} ↗
            </a>
            <a href={LINKS.sovereignEU} target="_blank" rel="noopener noreferrer" className="mc-btn">
              {t("eu")} ↗
            </a>
          </Reveal>
        </div>
        <Reveal delay={120} className="lg:pt-12">
          <InspectSample title={ti("title")} rows={rows} />
        </Reveal>
      </div>
    </section>
  );
}

/* ─── 07 BRIEFING (FAQ) ─────────────────────────────────────────────────── */

export async function BriefingSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "mission.faq" });
  const tf = await getTranslations({ locale, namespace: "faq" });
  const items = tf.raw("items") as { q: string; a: string }[];
  return (
    <section id="briefing" className="mc-section mc-panel-light mc-marketing">
      <div className="mc-wrap grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <SectionHead num={t("num")} title={t("title")} />
          <Reveal>
            <h2 className="mc-display text-[clamp(1.9rem,3.6vw,3rem)]">{tf("title")}</h2>
            <p className="mc-lead mt-5">{tf("subtitle")}</p>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="divide-y divide-[var(--mc-line-on-cream)] border-y border-[var(--mc-line-on-cream)]">
            {items.map((item, i) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="mc-section-num mt-1.5 shrink-0">Q-{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-[1.02rem] font-medium leading-snug">{item.q}</span>
                  <span aria-hidden className="mc-mono mt-1 text-[var(--mc-muted-on-cream)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pl-[3.2rem] text-[0.92rem] leading-relaxed text-[var(--mc-muted-on-cream)]">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── LAUNCH CTA ────────────────────────────────────────────────────────── */

export async function LaunchCta({
  locale,
  title,
  text,
  primary,
  secondary,
}: {
  locale: string;
  title?: string;
  text?: string;
  primary?: CtaLink;
  secondary?: CtaLink;
}) {
  const t = await getTranslations({ locale, namespace: "mission.cta" });
  const p = primary ?? { label: t("primary"), href: LINKS.web, external: true };
  const s = secondary ?? { label: t("secondary"), href: "/contact" };
  return (
    <section className="mc-section relative overflow-hidden">
      <div className="mc-grid" aria-hidden />
      <div className="mc-wrap relative">
        <Reveal className="mc-card mc-frame overflow-hidden p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mc-label flex items-center gap-2">
                <Lamp tone="green" blink />
                T-00:00:10
              </p>
              <h2 className="mc-display mt-4 text-[clamp(2rem,4.2vw,3.6rem)]">{title ?? t("title")}</h2>
              <p className="mc-lead mt-4">{text ?? t("text")}</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              {p.external ? (
                <a href={p.href} className="mc-btn mc-btn--primary" target={p.newTab ? "_blank" : undefined} rel="noopener noreferrer">
                  [ {p.label} ]
                </a>
              ) : (
                <Link href={p.href} className="mc-btn mc-btn--primary">
                  [ {p.label} ]
                </Link>
              )}
              {s.external ? (
                <a href={s.href} className="mc-btn" target={s.newTab ? "_blank" : undefined} rel="noopener noreferrer">
                  {s.label} {s.newTab ? "↗" : ""}
                </a>
              ) : (
                <Link href={s.href} className="mc-btn">
                  {s.label}
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
