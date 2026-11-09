import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { breakdown, clicksByPage, countryName, flag, kpis, leadsBySource, makeRange, regionName, series, topClicks, topPages } from "@/lib/analytics";
import { Icon } from "@/components/Icon";
import { BarList, Panel, PageHeader, Stat } from "@/components/dash/ui";
import { RangeTabs } from "@/components/dash/RangeTabs";
import { TrendChart } from "@/components/dash/TrendChart";

export const dynamic = "force-dynamic";

const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

export default async function Analytics({ searchParams }: { searchParams: Promise<{ range?: string; page?: string }> }) {
  await requireUser("analytics:view");
  const sp = await searchParams;
  const r = makeRange(sp.range, sp.page);
  const [k, s, pages, countries, regions, cities, sources, devices, browsers, clicks, byPage, leadSrc] = await Promise.all([
    kpis(r), series(r), topPages(r, 100), breakdown(r, "country"), breakdown(r, "region"), breakdown(r, "city"),
    breakdown(r, "source"), breakdown(r, "device", 5), breakdown(r, "browser", 6), topClicks(r, 40), clicksByPage(r), leadsBySource(r),
  ]);
  const filterHref = (p?: string) => `/dashboard/analytics?range=${r.days}${p ? `&page=${encodeURIComponent(p)}` : ""}`;
  const c = k.cur;
  const conv = c.visitors ? (c.leads / c.visitors) * 100 : 0;
  const convPrev = k.prev.visitors ? (k.prev.leads / k.prev.visitors) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" sub="First-party, cookie-free traffic analytics for the website." actions={<RangeTabs base="/dashboard/analytics" days={r.days} extra={{ page: r.page }} />} />

      {r.page ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 ring-1 ring-blue-200">
          <Icon name="search" className="h-5 w-5 text-blue-700" />
          <p className="text-sm font-semibold text-blue-900">Showing only <code className="rounded bg-white px-1.5 py-0.5">{r.page}</code></p>
          <a href={r.page} target="_blank" className="text-sm font-bold text-blue-700 underline">Open page</a>
          <Link href={filterHref()} className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-blue-700"><Icon name="x" className="h-4 w-4" /> Clear filter</Link>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Tip: click any page below to see its visitors, locations and button clicks on their own.</p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Visitors" icon="users" value={c.visitors.toLocaleString()} cur={c.visitors} prev={k.prev.visitors} />
        <Stat label="Sessions" icon="clock" value={c.sessions.toLocaleString()} cur={c.sessions} prev={k.prev.sessions} />
        <Stat label="Page views" icon="eye" value={c.views.toLocaleString()} cur={c.views} prev={k.prev.views} />
        <Stat label="Button clicks" icon="cursor" value={c.clicks.toLocaleString()} cur={c.clicks} prev={k.prev.clicks} />
        <Stat label="Leads" icon="inbox" value={c.leads.toLocaleString()} cur={c.leads} prev={k.prev.leads} />
        <Stat label="Conversion" icon="bolt" value={`${conv.toFixed(1)}%`} cur={conv} prev={convPrev} />
      </div>

      <Panel title="Visitors & page views">
        <TrendChart title="Visitors and page views over time" data={s} height={280} series={[{ key: "views", label: "Page views", color: "#1d4ed8" }, { key: "visitors", label: "Visitors", color: "#d97706" }]} />
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Button clicks per day"><TrendChart title="Button clicks over time" data={s} type="bar" height={220} series={[{ key: "clicks", label: "Clicks", color: "#1d4ed8" }]} /></Panel>
        <Panel title="Leads per day"><TrendChart title="Leads over time" data={s} type="bar" height={220} series={[{ key: "leads", label: "Leads", color: "#d97706" }]} /></Panel>
      </div>

      <Panel title="Pages" sub="Views, visitors, clicks and leads per page" pad={false}>
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3">Page</th>
                <th className="px-3 py-3 text-right">Views</th>
                <th className="px-3 py-3 text-right">Visitors</th>
                <th className="px-3 py-3 text-right">Clicks</th>
                <th className="px-3 py-3 text-right">Click rate</th>
                <th className="px-3 py-3 text-right">Leads</th>
                <th className="px-5 py-3 text-right">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.path} className={`border-t border-slate-100 hover:bg-slate-50 ${r.page === p.path ? "bg-blue-50" : ""}`}>
                  <td className="max-w-xs truncate px-5 py-2.5"><Link href={filterHref(p.path)} className="font-semibold text-blue-700 hover:underline">{p.path}</Link></td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{p.views.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{p.visitors.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{p.clicks.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-500">{pct(p.clicks, p.views)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{p.leads}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-slate-500">{pct(p.leads, p.visitors)}</td>
                </tr>
              ))}
              {!pages.length && <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No traffic recorded in this period yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Countries">
          <BarList rows={countries.map((x) => ({ key: x.key ?? "unknown", label: <><span aria-hidden="true">{flag(x.key)}</span> {countryName(x.key)}</>, value: x.visitors }))} valueLabel="visitors" />
        </Panel>
        <Panel title="Provinces & states">
          <BarList rows={regions.map((x) => ({ key: `${x.country}-${x.key}`, label: <><span aria-hidden="true">{flag(x.country)}</span> {regionName(x.country, x.key)}</>, value: x.visitors }))} valueLabel="visitors" color="bg-amber-500/15" />
        </Panel>
        <Panel title="Cities">
          <BarList rows={cities.map((x) => ({ key: `${x.country}-${x.key}`, label: <><span aria-hidden="true">{flag(x.country)}</span> {x.key ?? "Unknown"}</>, value: x.visitors }))} valueLabel="visitors" />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Traffic sources" sub="utm_source, referrer or direct">
          <BarList rows={sources.map((x) => ({ key: x.key ?? "direct", label: x.key ?? "direct", value: x.visitors }))} valueLabel="visitors" />
        </Panel>
        <Panel title="Leads by source">
          <BarList rows={leadSrc.map((x) => ({ key: x.key ?? "direct", label: x.key ?? "direct", value: x.leads }))} valueLabel="leads" color="bg-amber-500/15" />
        </Panel>
        <Panel title="Devices & browsers">
          <BarList rows={devices.map((x) => ({ key: x.key ?? "?", label: <span className="capitalize">{x.key ?? "unknown"}</span>, value: x.visitors, sub: pct(x.visitors, c.visitors) }))} valueLabel="" />
          <div className="mt-4 border-t border-slate-100 pt-4">
            <BarList rows={browsers.map((x) => ({ key: x.key ?? "?", label: x.key ?? "Other", value: x.visitors }))} valueLabel="" color="bg-amber-500/15" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel title={r.page ? `Button clicks on ${r.page}` : "Button clicks (all pages)"} sub="Every button and link click, by label and position" className="xl:col-span-3" pad={false}>
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3">Button / link</th>
                  <th className="px-3 py-3">Position</th>
                  <th className="px-3 py-3 text-right">Clicks</th>
                  <th className="px-3 py-3 text-right">People</th>
                  <th className="px-5 py-3">{r.page ? "" : "Top page"}</th>
                </tr>
              </thead>
              <tbody>
                {clicks.map((x, i) => (
                  <tr key={`${x.label}-${x.location}-${i}`} className="border-t border-slate-100">
                    <td className="max-w-[220px] truncate px-5 py-2.5 font-semibold text-navy-950">{x.label}</td>
                    <td className="px-3 py-2.5">{x.location ? <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{x.location}</span> : <span className="text-slate-300">—</span>}</td>
                    <td className="px-3 py-2.5 text-right font-bold tabular-nums">{x.clicks.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-500">{x.visitors.toLocaleString()}</td>
                    <td className="max-w-[180px] truncate px-5 py-2.5">{!r.page && x.topPath && <Link href={filterHref(x.topPath)} className="text-xs font-semibold text-blue-700 hover:underline">{x.topPath}</Link>}{!r.page && x.pages > 1 && <span className="ml-1 text-xs text-slate-400">+{x.pages - 1}</span>}</td>
                  </tr>
                ))}
                {!clicks.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">No clicks recorded yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Clicks by page" sub="Click rate = clicks ÷ views" className="xl:col-span-2">
          <BarList rows={byPage.map((x) => ({ key: x.path, label: <span className="truncate">{x.path}</span>, value: x.clicks, sub: `${x.ctr}%` }))} valueLabel="clicks" hrefFor={(p) => filterHref(p)} />
        </Panel>
      </div>
    </div>
  );
}
