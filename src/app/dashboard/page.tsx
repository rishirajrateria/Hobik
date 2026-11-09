import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { LEAD_STATUSES, leads, type LeadStatus } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { breakdown, countryName, flag, kpis, leadPipeline, makeRange, series, topPages } from "@/lib/analytics";
import { Icon } from "@/components/Icon";
import { BarList, Empty, Panel, PageHeader, Stat, STATUS_DOT, StatusBadge, timeAgo, btnSecondary } from "@/components/dash/ui";
import { RangeTabs } from "@/components/dash/RangeTabs";
import { TrendChart } from "@/components/dash/TrendChart";

export const dynamic = "force-dynamic";

export default async function Overview({ searchParams }: { searchParams: Promise<{ range?: string; denied?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const r = makeRange(sp.range);
  const showA = can(user.role, "analytics:view");
  const showL = can(user.role, "leads:view");

  const [k, s, pages, countries, pipe, recent] = await Promise.all([
    showA ? kpis(r) : null,
    showA ? series(r) : [],
    showA ? topPages(r, 6) : [],
    showA ? breakdown(r, "country", 6) : [],
    showL ? leadPipeline(r) : [],
    showL ? db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6) : [],
  ]);
  const conv = k && k.cur.visitors ? (k.cur.leads / k.cur.visitors) * 100 : 0;
  const convPrev = k && k.prev.visitors ? (k.prev.leads / k.prev.visitors) * 100 : 0;
  const hour = Number(new Date().toLocaleString("en-CA", { timeZone: "America/Toronto", hour: "numeric", hour12: false }));
  const pipeTotal = pipe.reduce((a, b) => a + b.n, 0);

  return (
    <div className="space-y-6">
      {sp.denied && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">Your role doesn&apos;t have access to that section.</p>}
      <PageHeader title={`Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}, ${user.name.split(" ")[0]}`} sub="Here's how the website is performing." actions={showA && <RangeTabs base="/dashboard" days={r.days} />} />

      {k && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Visitors" icon="users" value={k.cur.visitors.toLocaleString()} cur={k.cur.visitors} prev={k.prev.visitors} />
          <Stat label="Page views" icon="eye" value={k.cur.views.toLocaleString()} cur={k.cur.views} prev={k.prev.views} />
          <Stat label="Leads" icon="inbox" value={k.cur.leads.toLocaleString()} cur={k.cur.leads} prev={k.prev.leads} />
          <Stat label="Conversion rate" icon="bolt" value={`${conv.toFixed(1)}%`} cur={conv} prev={convPrev} />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {showA && (
          <Panel title="Traffic" sub="Visitors and page views" className="xl:col-span-2" actions={<Link href={`/dashboard/analytics?range=${r.days}`} className="text-sm font-bold text-blue-700">Full analytics →</Link>}>
            <TrendChart title="Visitors and page views over time" data={s} series={[{ key: "views", label: "Page views", color: "#1d4ed8" }, { key: "visitors", label: "Visitors", color: "#d97706" }]} />
          </Panel>
        )}
        {showL && (
          <Panel title="Lead pipeline" sub={`${pipeTotal} leads in period`}>
            {pipeTotal ? (
              <>
                <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
                  {LEAD_STATUSES.map((st) => {
                    const n = pipe.find((p) => p.status === st)?.n ?? 0;
                    return n ? <span key={st} className={STATUS_DOT[st]} style={{ width: `${(n / pipeTotal) * 100}%` }} /> : null;
                  })}
                </div>
                <ul className="mt-5 space-y-2">
                  {LEAD_STATUSES.map((st) => {
                    const n = pipe.find((p) => p.status === st)?.n ?? 0;
                    return (
                      <li key={st}>
                        <Link href={`/dashboard/leads?status=${st}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                          <span className="flex items-center gap-2 font-semibold text-slate-700 capitalize"><span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[st as LeadStatus]}`} /> {st}</span>
                          <span className="font-bold text-navy-950 tabular-nums">{n}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <Empty icon="inbox" title="No leads yet" sub="New form submissions from the website will appear here." />
            )}
          </Panel>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {showL && (
          <Panel title="Latest leads" className="xl:col-span-2" pad={false} actions={<Link href="/dashboard/leads" className={btnSecondary}>View all</Link>}>
            {recent.length ? (
              <ul className="divide-y divide-slate-100">
                {recent.map((l) => (
                  <li key={l.id}>
                    <Link href={`/dashboard/leads/${l.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-50 text-sm font-extrabold text-navy-800">{(l.name || "?").slice(0, 1).toUpperCase()}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-navy-950">{l.name || "Unnamed"}</span>
                        <span className="block truncate text-xs text-slate-500">{l.service || l.formName} · {l.city || l.page || "website"}</span>
                      </span>
                      <StatusBadge status={l.status} />
                      <span className="hidden w-20 text-right text-xs text-slate-400 sm:block">{timeAgo(l.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <Empty icon="inbox" title="No leads yet" />}
          </Panel>
        )}
        {showA && (
          <div className="space-y-6">
            <Panel title="Top pages">
              <BarList rows={pages.map((p) => ({ key: p.path, label: <span className="truncate">{p.path}</span>, value: p.views }))} valueLabel="views" hrefFor={(k) => `/dashboard/analytics?range=${r.days}&page=${encodeURIComponent(k)}`} />
            </Panel>
            <Panel title="Top countries">
              <BarList rows={countries.map((c) => ({ key: c.key ?? "??", label: <><span aria-hidden="true">{flag(c.key)}</span> {countryName(c.key)}</>, value: c.visitors }))} valueLabel="visitors" color="bg-amber-500/15" />
            </Panel>
          </div>
        )}
      </div>

      {!showA && !showL && (
        <Panel><Empty icon="pencil" title="Welcome!" sub="Use the sidebar to manage the blog, testimonials and forms." action={<Link href="/dashboard/blog" className={btnSecondary}><Icon name="pencil" className="h-4 w-4" /> Go to blog</Link>} /></Panel>
      )}
    </div>
  );
}
