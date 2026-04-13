import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const token = process.env.CLOUDFLARE_ZARAZ_TOKEN ?? ''
  const zoneId = process.env.CLOUDFLARE_ZARAZ_SITE_ID ?? ''

  if (!token || !zoneId) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  const query = `{
    viewer {
      zones(filter: { zoneTag: "${zoneId}" }) {
        httpRequests1dGroups(
          limit: 7
          filter: { date_geq: "${fmt(weekAgo)}", date_leq: "${fmt(today)}" }
        ) {
          sum { pageViews requests }
          uniq { uniques }
        }
      }
    }
  }`

  try {
    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    const data = await res.json() as {
      data?: { viewer?: { zones?: { httpRequests1dGroups?: { sum?: { pageViews?: number; requests?: number }; uniq?: { uniques?: number } }[] }[] } }
      errors?: unknown[]
    }

    if (data.errors) {
      return NextResponse.json({ error: 'graphql_error' }, { status: 502 })
    }

    const groups = data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? []
    let pageviews = 0
    let visitors = 0
    for (const g of groups) {
      pageviews += g.sum?.pageViews ?? 0
      visitors += g.uniq?.uniques ?? 0
    }

    return NextResponse.json({ pageviews, visitors })
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
  }
}
