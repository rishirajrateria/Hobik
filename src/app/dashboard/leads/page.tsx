import Link from "next/link";
import { and, count, desc, eq, like, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { LEAD_STATUSES, leads, users, type LeadStatus } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { flag } from "@/lib/analytics";
import { Icon } from "@/components/Icon";
import { Empty, PageHeader, Panel, STATUS_DOT, btnSecondary, inputCls, timeAgo } from "@/components/dash/ui";
import { AssigneeSelect, StatusSelect } from "@/components/dash/LeadControls";

export const dynamic = "force-dynamic";
const PER = 25;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; mine?: string; p?: string }> }) {
  const user = await requireUser("leads:view");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1);
  const status = LEAD_STATUSES.includes(sp.status as LeadStatus) ? (sp.status as LeadStatus) : undefined;
  const q = sp.q?.trim();

  const conds: SQL[] = [];
  if (status) conds.push(eq(leads.status, status));
  if (sp.mine) conds.push(eq(leads.assigneeId, user.id));
  if (q) conds.push(or(like(leads.name, `%${q}%`), like(leads.email, `%${q}%`), like(leads.phone, `%${q}%`), like(leads.service, `%${q}%`))!);
  const where = conds.length ? and(...conds) : undefined;

  const [rows, [{ n: total }], counts, team] = await Promise.all([
    db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(PER).offset((page - 1) * PER),
    db.select({ n: count() }).from(leads).where(where),
    db.select({ status: leads.status, n: count() }).from(leads).groupBy(leads.status),
    db.select({ id: users.id, name: users.name }).from(users).where(eq(users.active, true)),
  ]);
  const writable = can(user.role, "leads:write");
  const pages = Math.max(1, Math.ceil(total / PER));
  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ status, q, mine: sp.mine, ...o }).filter(([, v]) => v) as [string, string][]);
    return `/dashboard/leads?${p}`;
  };
  const all = counts.reduce((a, b) => a + b.n, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        sub="Every form submission from the website, with source and location."
        actions={can(user.role, "leads:delete") && <a href={`/dashboard/leads/export?${new URLSearchParams(Object.entries({ status, q }).filter(([, v]) => v) as [string, string][])}`} className={btnSecondary}><Icon name="download" className="h-4 w-4" /> Export CSV</a>}
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Link href={qs({ status: undefined, p: undefined })} className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-bold ring-1 ${!status ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-slate-600 ring-slate-200"}`}>All <span className="opacity-60">{all}</span></Link>
        {LEAD_STATUSES.map((s) => (
          <Link key={s} href={qs({ status: s, p: undefined })} className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold capitalize ring-1 ${status === s ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-slate-600 ring-slate-200"}`}>
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} /> {s} <span className="opacity-60">{counts.find((c) => c.status === s)?.n ?? 0}</span>
          </Link>
        ))}
      </div>

      <Panel pad={false}>
        <form className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4" action="/dashboard/leads">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative min-w-60 flex-1">
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input name="q" defaultValue={q} placeholder="Search name, email, phone or service…" className={`${inputCls} pl-9`} />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input type="checkbox" name="mine" value="1" defaultChecked={!!sp.mine} className="h-4 w-4 accent-navy-900" /> Assigned to me
          </label>
          <button className={btnSecondary}>Filter</button>
        </form>

        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3">Lead</th>
                  <th className="px-3 py-3">Service</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Assignee</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-5 py-3 text-right">Received</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/leads/${l.id}`} className="block font-bold text-navy-950 hover:text-blue-700">{l.name || "Unnamed lead"}</Link>
                      <span className="block text-xs text-slate-500">{[l.phone, l.email].filter(Boolean).join(" · ") || "—"}</span>
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-3 text-slate-700">{l.service || l.formName || "—"}</td>
                    <td className="px-3 py-3"><StatusSelect id={l.id} status={l.status} disabled={!writable} /></td>
                    <td className="px-3 py-3"><AssigneeSelect id={l.id} assigneeId={l.assigneeId} team={team} disabled={!writable} /></td>
                    <td className="px-3 py-3"><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{l.gclid ? "google-ads" : l.utmSource || "direct"}</span></td>
                    <td className="px-3 py-3 text-slate-600">{l.country ? <>{flag(l.country)} {[l.city, l.region].filter(Boolean).join(", ") || l.country}</> : "—"}</td>
                    <td className="px-5 py-3 text-right text-xs text-slate-500" title={l.createdAt.toLocaleString()}>{timeAgo(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty icon="inbox" title={q || status ? "No leads match these filters" : "No leads yet"} sub="Leads from every website form land here automatically." />
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm">
            <span className="text-slate-500">Page {page} of {pages} · {total} leads</span>
            <div className="flex gap-2">
              {page > 1 && <Link href={qs({ p: String(page - 1) })} className={btnSecondary}>Previous</Link>}
              {page < pages && <Link href={qs({ p: String(page + 1) })} className={btnSecondary}>Next</Link>}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
