import "server-only";
import { sql, type SQL } from "drizzle-orm";
import { db } from "@/db";

export type Range = { days: number; since: number; until: number; prevSince: number; page?: string };

export function makeRange(daysParam?: string, page?: string): Range {
  const days = [1, 7, 30, 90, 365].includes(Number(daysParam)) ? Number(daysParam) : 30;
  const until = Date.now();
  const since = until - days * 86400000;
  return { days, since, until, prevSince: since - days * 86400000, page: page && page.startsWith("/") ? page : undefined };
}

/** Current Toronto UTC offset in minutes (handles EST/EDT) — used to build the empty chart buckets. */
function torontoOffsetMin() {
  const d = new Date();
  const tz = new Date(d.toLocaleString("en-US", { timeZone: "America/Toronto" }));
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((tz.getTime() - utc.getTime()) / 60000);
}

async function all<T>(q: SQL): Promise<T[]> {
  const res = (await db.execute(q)) as unknown as { rows?: T[] } | T[];
  return (Array.isArray(res) ? res : res.rows ?? []) as T[];
}

/** epoch-ms → timestamptz literal for comparing against leads.created_at */
const tz = (ms: number) => sql`${new Date(ms).toISOString()}::timestamptz`;
const pageFilter = (r: Range, col = sql.raw("path")) => (r.page ? sql`and ${col} = ${r.page}` : sql``);
const views = sql.raw("sum(case when type='pageview' then 1 else 0 end)::int");
const clicksSql = sql.raw("sum(case when type='click' then 1 else 0 end)::int");
const visitors = sql.raw("count(distinct case when type='pageview' then visitor_id end)::int");

export async function kpis(r: Range) {
  const one = async (from: number, to: number) => {
    const [e] = await all<{ views: number; visitors: number; sessions: number; clicks: number }>(sql`
      select coalesce(${views}, 0) as views,
        ${visitors} as visitors,
        count(distinct case when type='pageview' then session_id end)::int as sessions,
        coalesce(${clicksSql}, 0) as clicks
      from events where created_at >= ${from} and created_at < ${to} ${pageFilter(r)}`);
    const [l] = await all<{ leads: number }>(sql`
      select count(*)::int as leads from leads where created_at >= ${tz(from)} and created_at < ${tz(to)} and status <> 'spam' ${pageFilter(r, sql.raw("page"))}`);
    return { views: e?.views ?? 0, visitors: e?.visitors ?? 0, sessions: e?.sessions ?? 0, clicks: e?.clicks ?? 0, leads: l?.leads ?? 0 };
  };
  const [cur, prev] = await Promise.all([one(r.since, r.until), one(r.prevSince, r.since)]);
  return { cur, prev };
}

export async function series(r: Range) {
  const off = torontoOffsetMin();
  const fmt = sql.raw(r.days === 1 ? "'YYYY-MM-DD HH24:00'" : "'YYYY-MM-DD'");
  const ev = await all<{ d: string; views: number; visitors: number; clicks: number }>(sql`
    select to_char(to_timestamp(created_at / 1000.0) at time zone 'America/Toronto', ${fmt}) as d,
      ${views} as views, ${visitors} as visitors, ${clicksSql} as clicks
    from events where created_at >= ${r.since} ${pageFilter(r)} group by d order by d`);
  const ld = await all<{ d: string; leads: number }>(sql`
    select to_char(created_at at time zone 'America/Toronto', ${fmt}) as d, count(*)::int as leads
    from leads where created_at >= ${tz(r.since)} and status <> 'spam' ${pageFilter(r, sql.raw("page"))} group by d`);
  const leadMap = new Map(ld.map((x) => [x.d, x.leads]));
  const evMap = new Map(ev.map((x) => [x.d, x]));
  // Fill gaps so the chart has every bucket.
  const out: { d: string; views: number; visitors: number; clicks: number; leads: number }[] = [];
  const step = r.days === 1 ? 3600000 : 86400000;
  for (let t = r.since + step; t <= r.until + 1; t += step) {
    const local = new Date(t + off * 60000).toISOString();
    const key = r.days === 1 ? `${local.slice(0, 13).replace("T", " ")}:00` : local.slice(0, 10);
    const e = evMap.get(key);
    out.push({ d: key, views: e?.views ?? 0, visitors: e?.visitors ?? 0, clicks: e?.clicks ?? 0, leads: leadMap.get(key) ?? 0 });
  }
  return out;
}

export async function topPages(r: Range, limit = 50) {
  return all<{ path: string; views: number; visitors: number; clicks: number; leads: number }>(sql`
    select e.path,
      sum(case when e.type='pageview' then 1 else 0 end)::int as views,
      count(distinct case when e.type='pageview' then e.visitor_id end)::int as visitors,
      sum(case when e.type='click' then 1 else 0 end)::int as clicks,
      (select count(*) from leads l where l.page = e.path and l.created_at >= ${tz(r.since)} and l.status <> 'spam')::int as leads
    from events e where e.created_at >= ${r.since} ${pageFilter(r, sql.raw("e.path"))}
    group by e.path order by views desc limit ${limit}`);
}

export async function breakdown(r: Range, dim: "country" | "region" | "city" | "source" | "device" | "browser", limit = 12) {
  const col = sql.raw(dim);
  const extra = dim === "region" || dim === "city" ? sql.raw(", country") : sql.raw("");
  return all<{ key: string | null; country?: string | null; visitors: number; views: number }>(sql`
    select ${col} as key ${extra},
      count(distinct visitor_id)::int as visitors,
      count(*)::int as views
    from events where type='pageview' and created_at >= ${r.since} ${pageFilter(r)}
    group by ${col} ${extra} order by visitors desc limit ${limit}`);
}

export async function leadsBySource(r: Range) {
  return all<{ key: string | null; leads: number }>(sql`
    select coalesce(utm_source, 'direct') as key, count(*)::int as leads from leads
    where created_at >= ${tz(r.since)} and status <> 'spam' ${pageFilter(r, sql.raw("page"))} group by 1 order by 2 desc limit 10`);
}

export async function topClicks(r: Range, limit = 30) {
  return all<{ label: string; location: string | null; clicks: number; visitors: number; pages: number; topPath: string }>(sql`
    select label, location, count(*)::int as clicks, count(distinct visitor_id)::int as visitors, count(distinct path)::int as pages,
      (select e2.path from events e2 where e2.type='click' and e2.label = e.label and e2.created_at >= ${r.since} ${pageFilter(r, sql.raw("e2.path"))} group by e2.path order by count(*) desc limit 1) as "topPath"
    from events e where type='click' and created_at >= ${r.since} ${pageFilter(r)}
    group by label, location order by clicks desc limit ${limit}`);
}

export async function clicksByPage(r: Range, limit = 20) {
  return all<{ path: string; clicks: number; views: number; ctr: number }>(sql`
    select path,
      ${clicksSql} as clicks,
      ${views} as views,
      round((100.0 * ${clicksSql} / greatest(1, ${views}))::numeric, 1)::float as ctr
    from events where created_at >= ${r.since} ${pageFilter(r)}
    group by path having ${clicksSql} > 0 order by clicks desc limit ${limit}`);
}

export async function leadPipeline(r: Range) {
  return all<{ status: string; n: number }>(sql`select status, count(*)::int as n from leads where created_at >= ${tz(r.since)} group by status`);
}

/* ---------- labels ---------- */
const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();
export const countryName = (c?: string | null) => (c ? regionNames?.of(c) ?? c : "Unknown");

const SUBDIVISIONS: Record<string, Record<string, string>> = {
  CA: { ON: "Ontario", QC: "Quebec", BC: "British Columbia", AB: "Alberta", MB: "Manitoba", SK: "Saskatchewan", NS: "Nova Scotia", NB: "New Brunswick", NL: "Newfoundland and Labrador", PE: "Prince Edward Island", NT: "Northwest Territories", YT: "Yukon", NU: "Nunavut" },
  US: { AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia" },
};
export const regionName = (country?: string | null, region?: string | null) =>
  region ? (country && SUBDIVISIONS[country]?.[region]) || `${region}, ${countryName(country)}` : "Unknown";

export const flag = (c?: string | null) => (c && /^[A-Z]{2}$/.test(c) ? String.fromCodePoint(...[...c].map((ch) => 127397 + ch.charCodeAt(0))) : "🌐");
