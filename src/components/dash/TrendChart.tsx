"use client";

import { useMemo, useRef, useState } from "react";

type Row = { d: string } & Record<string, number | string>;
type Series = { key: string; label: string; color: string };

const W = 800;
const PAD = { t: 16, r: 12, b: 28, l: 40 };

function niceMax(v: number) {
  if (v <= 5) return 5;
  const p = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / p) * p * (v / (Math.ceil(v / p) * p) > 0.8 ? 1 : 1);
}
function fmtBucket(d: string) {
  if (d.length > 10) return `${Number(d.slice(11, 13)) % 12 || 12}${Number(d.slice(11, 13)) < 12 ? "am" : "pm"}`;
  const dt = new Date(`${d}T12:00:00`);
  return dt.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

/**
 * Accessible time-series chart: thin 2px lines over a soft area, crosshair + tooltip
 * listing every series, legend (≥2 series), and a table view.
 */
export function TrendChart({ data, series, type = "line", height = 260, title }: { data: Row[]; series: Series[]; type?: "line" | "bar"; height?: number; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  const H = height;
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const max = useMemo(() => niceMax(Math.max(1, ...data.flatMap((r) => series.map((s) => Number(r[s.key]) || 0)))), [data, series]);
  const x = (i: number) => PAD.l + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => PAD.t + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));

  function onMove(e: React.PointerEvent) {
    const svg = ref.current;
    if (!svg || !data.length) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / innerW) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  }

  const barW = Math.max(2, (innerW / Math.max(1, data.length)) * 0.6);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {series.length > 1 ? (
          <ul className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
            {series.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded" style={{ background: s.color }} aria-hidden="true" /> {s.label}
              </li>
            ))}
          </ul>
        ) : <span />}
        <button type="button" onClick={() => setTable(!table)} className="text-xs font-semibold text-slate-500 underline-offset-2 hover:underline">
          {table ? "Show chart" : "Show table"}
        </button>
      </div>

      {table ? (
        <div className="max-h-72 overflow-auto rounded-xl ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-slate-50 text-xs text-slate-500 uppercase">
              <tr><th className="px-3 py-2">Date</th>{series.map((s) => <th key={s.key} className="px-3 py-2 text-right">{s.label}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.d} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 text-slate-600">{fmtBucket(r.d)}</td>
                  {series.map((s) => <td key={s.key} className="px-3 py-1.5 text-right font-semibold tabular-nums">{Number(r[s.key]).toLocaleString()}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none" role="img" aria-label={title} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={s.color} stopOpacity="0.18" />
                  <stop offset="1" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray={t === 0 ? "" : "3 4"} />
                <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#94a3b8">{t >= 1000 ? `${(t / 1000).toFixed(1)}k` : t}</text>
              </g>
            ))}
            {data.map((r, i) => (i % labelEvery === 0 || (i === data.length - 1 && (data.length - 1) % labelEvery >= labelEvery / 2)) && (
              <text key={r.d} x={x(i)} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8">{fmtBucket(r.d)}</text>
            ))}

            {type === "bar"
              ? data.map((r, i) => {
                  const v = Number(r[series[0].key]) || 0;
                  const h = (v / max) * innerH;
                  return <rect key={r.d} x={x(i) - barW / 2} y={PAD.t + innerH - h} width={barW} height={Math.max(0, h)} rx={Math.min(4, barW / 2)} fill={series[0].color} opacity={hover === null || hover === i ? 1 : 0.55} />;
                })
              : series.map((s) => {
                  const pts = data.map((r, i) => `${x(i)},${y(Number(r[s.key]) || 0)}`);
                  const line = `M${pts.join(" L")}`;
                  const area = `${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
                  return (
                    <g key={s.key}>
                      <path d={area} fill={`url(#g-${s.key})`} />
                      <path d={line} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    </g>
                  );
                })}

            {hover !== null && data[hover] && (
              <g pointerEvents="none">
                <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + innerH} stroke="#94a3b8" strokeWidth="1" />
                {type === "line" && series.map((s) => <circle key={s.key} cx={x(hover)} cy={y(Number(data[hover][s.key]) || 0)} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2" />)}
              </g>
            )}
          </svg>
          {hover !== null && data[hover] && (
            <div
              className="pointer-events-none absolute top-2 z-10 min-w-36 rounded-xl bg-navy-950 px-3 py-2 text-xs text-white shadow-xl"
              style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${x(hover) > W * 0.7 ? "-105%" : "8px"})` }}
            >
              <p className="mb-1 font-semibold text-white/60">{fmtBucket(String(data[hover].d))}</p>
              {series.map((s) => (
                <p key={s.key} className="flex items-center gap-2">
                  <span className="h-0.5 w-3 rounded" style={{ background: s.color }} />
                  <span className="font-bold tabular-nums">{Number(data[hover][s.key]).toLocaleString()}</span>
                  <span className="text-white/60">{s.label}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
