import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { LEAD_STATUSES, leadActivity, leads, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { countryName, flag, regionName } from "@/lib/analytics";
import { Icon } from "@/components/Icon";
import { Panel, StatusBadge, STATUS_DOT, btnDanger, btnPrimary, btnSecondary, fmtDate, inputCls, timeAgo } from "@/components/dash/ui";
import { AssigneeSelect, StatusSelect } from "@/components/dash/LeadControls";
import { ConfirmButton } from "@/components/dash/Confirm";
import { addNote, deleteLead, setLeadValue } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("leads:view");
  const { id } = await params;
  const [lead] = await db.select().from(leads).where(eq(leads.id, id));
  if (!lead) notFound();
  const [activity, team] = await Promise.all([
    db.select({ a: leadActivity, by: users.name }).from(leadActivity).leftJoin(users, eq(users.id, leadActivity.userId)).where(eq(leadActivity.leadId, id)).orderBy(asc(leadActivity.createdAt)),
    db.select({ id: users.id, name: users.name }).from(users).where(eq(users.active, true)),
  ]);
  const w = can(user.role, "leads:write");
  const stage = LEAD_STATUSES.indexOf(lead.status);
  const pipeline = LEAD_STATUSES.filter((s) => s !== "lost" && s !== "spam");

  return (
    <div className="space-y-6">
      <Link href="/dashboard/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-navy-900">← All leads</Link>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 font-display text-xl font-extrabold text-gold-300">{(lead.name || "?").slice(0, 1).toUpperCase()}</span>
          <div>
            <h1 className="text-2xl font-extrabold text-navy-950">{lead.name || "Unnamed lead"}</h1>
            <p className="text-sm text-slate-500">{lead.service || lead.formName} · received {fmtDate(lead.createdAt, true)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {lead.phone && <a href={`tel:${lead.phone}`} className={btnPrimary}><Icon name="phone" className="h-4 w-4" /> Call {lead.phone}</a>}
          {lead.email && <a href={`mailto:${lead.email}?subject=${encodeURIComponent("Your appraisal quote — Home Value Inc.")}`} className={btnSecondary}><Icon name="mail" className="h-4 w-4" /> Email</a>}
        </div>
      </div>

      {/* pipeline stepper */}
      <div className="overflow-x-auto rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <ol className="flex min-w-[560px] items-center">
          {pipeline.map((s, i) => {
            const done = stage >= LEAD_STATUSES.indexOf(s) && lead.status !== "lost" && lead.status !== "spam";
            return (
              <li key={s} className="flex flex-1 items-center">
                <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold capitalize ${done ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <span className={`h-2 w-2 rounded-full ${done ? "bg-gold-400" : STATUS_DOT[s]}`} /> {s}
                </span>
                {i < pipeline.length - 1 && <span className={`mx-2 h-0.5 flex-1 rounded ${done ? "bg-navy-900" : "bg-slate-200"}`} />}
              </li>
            );
          })}
        </ol>
        {(lead.status === "lost" || lead.status === "spam") && <p className="mt-3 text-sm text-slate-500">This lead is marked <StatusBadge status={lead.status} />.</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Answers" sub={lead.formName ?? undefined}>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {lead.answers.map((a) => (
                <div key={a.key} className={a.value.length > 60 ? "sm:col-span-2" : ""}>
                  <dt className="text-xs font-bold tracking-wide text-slate-500 uppercase">{a.label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-[15px] font-semibold text-navy-950">{a.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Activity & notes">
            <ol className="relative space-y-5 border-l-2 border-slate-100 pl-6">
              {activity.map(({ a, by }) => (
                <li key={a.id} className="relative">
                  <span className={`absolute top-1 -left-[31px] grid h-4 w-4 place-items-center rounded-full ring-4 ring-white ${a.type === "note" ? "bg-gold-400" : a.type === "created" ? "bg-emerald-500" : "bg-blue-500"}`} />
                  <p className="text-xs text-slate-400">{by ?? "Website"} · {timeAgo(a.createdAt)}</p>
                  <p className={`mt-1 text-sm ${a.type === "note" ? "rounded-xl bg-amber-50 p-3 whitespace-pre-wrap text-slate-800 ring-1 ring-amber-100" : "font-semibold text-slate-700"}`}>{a.body}</p>
                </li>
              ))}
            </ol>
            {w && (
              <form action={addNote.bind(null, lead.id)} className="mt-6 space-y-3">
                <textarea name="body" rows={3} required placeholder="Add a note — call outcome, quote sent, inspection booked…" className={inputCls} />
                <button className={btnPrimary}>Add note</button>
              </form>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Manage">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-600">Status</span><StatusSelect id={lead.id} status={lead.status} disabled={!w} /></div>
              <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-600">Assignee</span><AssigneeSelect id={lead.id} assigneeId={lead.assigneeId} team={team} disabled={!w} /></div>
              <form action={setLeadValue.bind(null, lead.id)} className="flex items-center justify-between gap-3">
                <label htmlFor="value" className="text-sm font-semibold text-slate-600">Quoted fee ($)</label>
                <span className="flex gap-2">
                  <input id="value" name="value" inputMode="numeric" defaultValue={lead.value ?? ""} disabled={!w} placeholder="0" className={`${inputCls} w-24 py-1.5`} />
                  {w && <button className={`${btnSecondary} py-1.5`}>Save</button>}
                </span>
              </form>
            </div>
          </Panel>

          <Panel title="Where they came from">
            <dl className="space-y-3 text-sm">
              {[
                ["Location", lead.country ? `${flag(lead.country)} ${[lead.city, regionName(lead.country, lead.region), countryName(lead.country)].filter((x) => x && x !== "Unknown").join(", ")}` : "Unknown"],
                ["Submitted on", lead.page],
                ["Landing page", lead.landingPage],
                ["Source", lead.gclid ? "Google Ads" : lead.utmSource || "direct"],
                ["Medium", lead.utmMedium],
                ["Campaign", lead.utmCampaign],
                ["Keyword", lead.utmTerm],
                ["Referrer", lead.referrer],
                ["Google click ID", lead.gclid],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="shrink-0 text-slate-500">{k}</dt>
                  <dd className="truncate text-right font-semibold text-navy-950" title={String(v)}>{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          {can(user.role, "leads:delete") && (
            <form action={deleteLead.bind(null, lead.id)}>
              <ConfirmButton message="Delete this lead permanently?" className={`${btnDanger} w-full`}><Icon name="trash" className="h-4 w-4" /> Delete lead</ConfirmButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
