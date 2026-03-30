"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building2, Code2, MessageSquare, ArrowUpRight } from "lucide-react";

const solutions = [
  {
    key: "companies" as const,
    href: "/solutions/companies",
    icon: Building2,
    gradient: "from-brand-500/10 to-brand-600/5",
  },
  {
    key: "developers" as const,
    href: "/solutions/developers",
    icon: Code2,
    gradient: "from-emerald-500/10 to-emerald-600/5",
  },
  {
    key: "widget" as const,
    href: "/solutions/chat-widget",
    icon: MessageSquare,
    gradient: "from-amber-500/10 to-amber-600/5",
  },
];

export function SolutionsGrid() {
  const t = useTranslations("solutions");

  return (
    <section className="surface-rose py-20 sm:py-28">
      <div className="container-wide section-padding">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol, i) => (
            <Link
              key={sol.key}
              href={sol.href}
              className="group block h-full"
            >
              <Card className="relative h-full overflow-hidden rounded-3xl border-[rgb(196_197_215/0.2)] bg-[rgb(255_255_255/0.85)] shadow-sm transition-all duration-300 hover:border-[#002c92]/20 hover:shadow-lg hover:shadow-[#002c92]/5">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sol.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <CardHeader className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <sol.icon className="size-6" />
                    </div>
                    <ArrowUpRight className="size-5 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-500" />
                  </div>
                  <CardTitle className="text-xl">
                    {t(`${sol.key}.title`)}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t(`${sol.key}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
