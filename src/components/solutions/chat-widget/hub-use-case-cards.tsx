"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Hammer, Hotel, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  {
    key: "trades" as const,
    href: "/solutions/chat-widget/trades",
    icon: Hammer,
    titleKey: "hub.cardTradesTitle",
    descKey: "hub.cardTradesDesc",
  },
  {
    key: "hospitality" as const,
    href: "/solutions/chat-widget/hospitality",
    icon: Hotel,
    titleKey: "hub.cardHospitalityTitle",
    descKey: "hub.cardHospitalityDesc",
  },
  {
    key: "customers" as const,
    href: "/solutions/chat-widget/customers",
    icon: Users,
    titleKey: "hub.cardCustomersTitle",
    descKey: "hub.cardCustomersDesc",
  },
];

export function ChatWidgetHubUseCaseCards() {
  const t = useTranslations("chatWidget");

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
        >
          <Link
            href={c.href}
            className={cn(
              "group flex h-full flex-col rounded-2xl border border-[rgb(196_197_215/0.35)] bg-[rgb(255_255_255/0.75)] p-5 shadow-sm transition-all",
              "hover:border-[#002c92]/25 hover:shadow-md hover:shadow-[#002c92]/8",
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#002c92]/10 text-[#002c92] ring-1 ring-[#002c92]/15">
                <c.icon className="size-5" strokeWidth={1.75} />
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-[#002c92]" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {t(c.titleKey)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(c.descKey)}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
