"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, Eye, TrendingUp, ExternalLink } from "lucide-react";

interface ZarazStats {
  pageviews?: number;
  visitors?: number;
  bounceRate?: number;
  avgDuration?: number;
}

interface ZarazAnalyticsProps {
  zarazToken: string;
  zarazSiteId: string;
}

export function ZarazAnalytics({ zarazToken, zarazSiteId }: ZarazAnalyticsProps) {
  const [stats, setStats] = useState<ZarazStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const configured = Boolean(zarazToken && zarazSiteId);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    const query = `{
      viewer {
        zones(filter: { zoneTag: "${zarazSiteId}" }) {
          httpRequests1dGroups(
            limit: 7
            filter: { date_geq: "${fmt(weekAgo)}", date_leq: "${fmt(today)}" }
          ) {
            sum { pageViews requests }
            uniq { uniques }
          }
        }
      }
    }`;

    fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${zarazToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((r) => r.json())
      .then((data: { data?: { viewer?: { zones?: { httpRequests1dGroups?: { sum?: { pageViews?: number; requests?: number }; uniq?: { uniques?: number } }[] }[] } }; errors?: unknown[] }) => {
        if (data.errors) throw new Error("GraphQL error");
        const groups = data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
        let pageviews = 0;
        let visitors = 0;
        for (const g of groups) {
          pageviews += g.sum?.pageViews ?? 0;
          visitors += g.uniq?.uniques ?? 0;
        }
        setStats({ pageviews, visitors });
      })
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [configured, zarazToken, zarazSiteId]);

  if (!configured) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <BarChart3 className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="font-medium">Cloudflare Zaraz not configured</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add <code className="rounded bg-muted px-1 text-xs">CLOUDFLARE_ZARAZ_TOKEN</code> and{" "}
          <code className="rounded bg-muted px-1 text-xs">CLOUDFLARE_ZARAZ_SITE_ID</code> to your{" "}
          <code className="rounded bg-muted px-1 text-xs">.env</code> file.
        </p>
        <a
          href="https://dash.cloudflare.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
        >
          Open Cloudflare Dashboard <ExternalLink className="size-3.5" />
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
        {error}
      </div>
    );
  }

  const cards = [
    { label: "Pageviews (7d)", value: stats?.pageviews?.toLocaleString() ?? "—", icon: Eye },
    { label: "Unique visitors (7d)", value: stats?.visitors?.toLocaleString() ?? "—", icon: Users },
    { label: "Bounce rate", value: stats?.bounceRate ? `${stats.bounceRate}%` : "—", icon: TrendingUp },
    { label: "Avg. duration", value: stats?.avgDuration ? `${stats.avgDuration}s` : "—", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-background p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-background p-5">
        <p className="mb-3 text-sm font-medium">Cloudflare Zaraz Dashboard</p>
        <a
          href={`https://dash.cloudflare.com/?to=/:account/zaraz`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
        >
          Open full analytics <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
