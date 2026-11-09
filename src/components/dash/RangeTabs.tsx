import Link from "next/link";

const OPTS = [
  ["1", "24h"],
  ["7", "7d"],
  ["30", "30d"],
  ["90", "90d"],
  ["365", "12m"],
];

/** Date-range control, kept in the URL so views are shareable. */
export function RangeTabs({ base, days, extra = {} }: { base: string; days: number; extra?: Record<string, string | undefined> }) {
  return (
    <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-slate-200" role="tablist" aria-label="Date range">
      {OPTS.map(([v, l]) => {
        const qs = new URLSearchParams({ ...Object.fromEntries(Object.entries(extra).filter(([, x]) => x)) as Record<string, string>, range: v });
        const on = String(days) === v;
        return (
          <Link key={v} href={`${base}?${qs}`} role="tab" aria-selected={on} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${on ? "bg-navy-900 text-white" : "text-slate-500 hover:text-navy-900"}`}>
            {l}
          </Link>
        );
      })}
    </div>
  );
}
