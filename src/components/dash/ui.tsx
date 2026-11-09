import Link from "next/link";
import { Icon } from "@/components/Icon";
import type { LeadStatus } from "@/db/constants";

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, sub, actions, children, className = "", pad = true }: { title?: React.ReactNode; sub?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={`min-w-0 rounded-2xl bg-white ring-1 ring-slate-200 ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            {title && <h2 className="text-[15px] font-bold text-navy-950">{title}</h2>}
            {sub && <p className="text-xs text-slate-500">{sub}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function Delta({ cur, prev }: { cur: number; prev: number }) {
  if (!prev) return <span className="text-xs font-semibold text-slate-400">—</span>;
  const pct = ((cur - prev) / prev) * 100;
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold ${up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

export function Stat({ label, value, cur, prev, icon, hint }: { label: string; value: string; cur?: number; prev?: number; icon: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-50 text-navy-800"><Icon name={icon} className="h-[18px] w-[18px]" /></span>
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold text-navy-950 tabular-nums">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
        {cur !== undefined && prev !== undefined && <Delta cur={cur} prev={prev} />}
        {hint ?? "vs previous period"}
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-violet-50 text-violet-700 ring-violet-200",
  quoted: "bg-amber-50 text-amber-800 ring-amber-200",
  booked: "bg-teal-50 text-teal-700 ring-teal-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost: "bg-slate-100 text-slate-600 ring-slate-200",
  spam: "bg-rose-50 text-rose-700 ring-rose-200",
};
export const STATUS_DOT: Record<LeadStatus, string> = {
  new: "bg-blue-500", contacted: "bg-violet-500", quoted: "bg-amber-500", booked: "bg-teal-500", completed: "bg-emerald-500", lost: "bg-slate-400", spam: "bg-rose-500",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ring-1 ${STATUS_STYLE[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "amber" | "blue" | "rose" | "navy" }) {
  const t = { slate: "bg-slate-100 text-slate-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-800", blue: "bg-blue-50 text-blue-700", rose: "bg-rose-50 text-rose-700", navy: "bg-navy-900 text-white" }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${t}`}>{children}</span>;
}

export function Empty({ icon = "sparkle", title, sub, action }: { icon?: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="grid place-items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-navy-700"><Icon name={icon} className="h-7 w-7" /></span>
      <p className="mt-4 font-bold text-navy-950">{title}</p>
      {sub && <p className="mt-1 max-w-sm text-sm text-slate-500">{sub}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Horizontal bar list with values printed (no hover needed to read a number). */
export function BarList({ rows, valueLabel = "", color = "bg-blue-600/15", hrefFor }: { rows: { key: string; label: React.ReactNode; value: number; sub?: string }[]; valueLabel?: string; color?: string; hrefFor?: (key: string) => string }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-slate-400">No data yet for this period.</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-1.5" role="list">
      {rows.map((r) => {
        const inner = (
          <>
            <span className={`absolute inset-y-0 left-0 rounded-lg ${color}`} style={{ width: `${(r.value / max) * 100}%` }} aria-hidden="true" />
            <span className="relative flex min-w-0 items-center gap-2 truncate">{r.label}</span>
            <span className="relative shrink-0 font-semibold text-navy-950 tabular-nums">
              {r.value.toLocaleString()} <span className="text-xs font-normal text-slate-400">{valueLabel}</span>
              {r.sub && <span className="ml-2 text-xs font-normal text-slate-400">{r.sub}</span>}
            </span>
          </>
        );
        const cls = "relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-2 text-sm text-slate-700";
        return (
          <li key={r.key} title={`${r.key}: ${r.value.toLocaleString()} ${valueLabel}`}>
            {hrefFor ? <Link href={hrefFor(r.key)} className={`${cls} hover:bg-slate-50`}>{inner}</Link> : <div className={cls}>{inner}</div>}
          </li>
        );
      })}
    </ul>
  );
}

export const inputCls = "w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-navy-950 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none";
export const labelCls = "mb-1.5 block text-xs font-bold tracking-wide text-slate-600 uppercase";
export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800 disabled:opacity-60";
export const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-navy-900 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-60";
export const btnDanger = "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-50 disabled:opacity-60";
export const btnGold = "inline-flex items-center justify-center gap-2 rounded-xl bg-gold-400 px-4 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-gold-300 disabled:opacity-60";

export function fmtDate(d: Date | number | null | undefined, withTime = false) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-CA", { timeZone: "America/Toronto", month: "short", day: "numeric", year: "numeric", ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}) });
}
export function timeAgo(d: Date | number) {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(d);
}
