"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { storeLinksFor, storeUrlWithCampaign } from "@/lib/constants";

type DeviceOs = "ios" | "android" | "other";
type StoreId = "ios" | "android";

function detectDeviceOs(): DeviceOs {
  const ua = navigator.userAgent;
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  ) {
    return "ios";
  }
  if (/Android/i.test(ua)) {
    return "android";
  }
  return "other";
}

function subscribeDeviceOs(onChange: () => void) {
  const frame = requestAnimationFrame(() => onChange());
  return () => cancelAnimationFrame(frame);
}

export function StoreDownloadCards({ locale }: { locale: string }) {
  const t = useTranslations("appPage");
  const isDE = locale === "de";
  const deviceOs = useSyncExternalStore(subscribeDeviceOs, detectDeviceOs, () => "other");

  const storeLinks = storeLinksFor(locale);

  const stores = useMemo(() => {
    const cards: {
      id: StoreId;
      href: string;
      title: string;
      desc: string;
      button: string;
      badgeSrc: string;
      badgeAlt: string;
      qrSrc: string;
      qrAlt: string;
    }[] = [
      {
        id: "ios",
        href: storeUrlWithCampaign(storeLinks.appStore),
        title: t("iosTitle"),
        desc: t("iosDesc"),
        button: t("iosButton"),
        badgeSrc: isDE ? "/badges/app-store-de.svg" : "/badges/app-store-en.svg",
        badgeAlt: t("iosBadgeAlt"),
        qrSrc: "/app/qr-app-store.svg",
        qrAlt: t("qrIosAlt"),
      },
      {
        id: "android",
        href: storeUrlWithCampaign(storeLinks.playStore),
        title: t("androidTitle"),
        desc: t("androidDesc"),
        button: t("androidButton"),
        badgeSrc: isDE ? "/badges/google-play-de.png" : "/badges/google-play-en.png",
        badgeAlt: t("androidBadgeAlt"),
        qrSrc: "/app/qr-play-store.svg",
        qrAlt: t("qrAndroidAlt"),
      },
    ];

    if (deviceOs === "android") {
      return [...cards].reverse();
    }
    return cards;
  }, [deviceOs, isDE, storeLinks.appStore, storeLinks.playStore, t]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {stores.map((store) => {
        const recommended = deviceOs === store.id;
        return (
          <article
            key={store.id}
            className={`flex flex-col rounded-2xl border bg-background p-6 transition-shadow sm:p-8 ${
              recommended
                ? "border-brand-400 shadow-md ring-2 ring-brand-200 dark:border-brand-500 dark:ring-brand-700"
                : "border-border hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{store.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {store.desc}
                </p>
              </div>
              {recommended ? (
                <span className="shrink-0 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-200">
                  {t("recommended")}
                </span>
              ) : null}
            </div>

            <a
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-fit items-center"
            >
              {/* Official store artwork — sized to guideline minimums, not cropped. */}
              <Image
                src={store.badgeSrc}
                alt={store.badgeAlt}
                width={store.id === "ios" ? 120 : 155}
                height={store.id === "ios" ? 40 : 60}
                unoptimized={store.badgeSrc.endsWith(".svg")}
                className={store.id === "ios" ? "h-10 w-auto" : "h-14 w-auto"}
              />
            </a>

            <a
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-figma-primary mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl border-0 px-5 text-sm font-medium text-white"
            >
              {store.button}
              <ArrowUpRight className="size-4" />
            </a>

            <div className="mt-6 hidden flex-col items-center border-t border-border pt-6 md:flex">
              <Image
                src={store.qrSrc}
                alt={store.qrAlt}
                width={160}
                height={160}
                unoptimized
                className="size-40 rounded-lg bg-white p-2"
              />
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                {t("qrCaption")}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
