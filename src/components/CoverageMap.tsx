"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GTHA_BOX, lakePath, regions, viewBox, MAIN_IDS } from "@/lib/coverage";
import { CtaLink } from "./Tracked";

type Box = [number, number, number, number];
const FULL: Box = [...viewBox];

/**
 * Clickable coverage map: GTHA regions are gold (main coverage), the rest of Southern Ontario is
 * light (case by case). Click or tap a region for details; zoom to the GTHA for the city-level view.
 */
export function CoverageMap({ initial }: { initial?: string }) {
  const [sel, setSel] = useState<string | null>(initial ?? null);
  const [zoomed, setZoomed] = useState(false);
  const [box, setBox] = useState<Box>(initial && (MAIN_IDS as readonly string[]).includes(initial) ? GTHA_BOX : FULL);
  const raf = useRef<number | null>(null);
  const cur = useRef<Box>(box);

  // Ease the viewBox toward the target.
  useEffect(() => {
    const to = zoomed ? GTHA_BOX : FULL;
    const from = cur.current;
    const t0 = performance.now();
    if (raf.current) cancelAnimationFrame(raf.current);
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 650);
      const e = 1 - Math.pow(1 - k, 3);
      const next = from.map((v, i) => v + (to[i] - v) * e) as Box;
      cur.current = next;
      setBox(next);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [zoomed]);
  useEffect(() => { if (initial && (MAIN_IDS as readonly string[]).includes(initial)) setZoomed(true); }, [initial]);

  const active = regions.find((r) => r.id === sel) ?? null;
  const main = regions.filter((r) => r.main);
  const rest = regions.filter((r) => !r.main);
  const ordered = active ? [...regions.filter((r) => r.id !== active.id), active] : regions;
  const pick = (id: string) => setSel(id);

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <figure className="lg relative overflow-hidden lg:col-span-8">
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          {([["Southern Ontario", false], ["GTHA close-up", true]] as const).map(([label, z]) => (
            <button key={label} type="button" onClick={() => setZoomed(z)} aria-pressed={zoomed === z} className={`px-3.5 py-2 text-[13px] font-semibold backdrop-blur-xl transition-colors ${zoomed === z ? "bg-ink-950 text-paper" : "border border-white/80 bg-white/70 text-ink-950 hover:bg-white"}`}>
              {label}
            </button>
          ))}
        </div>
        <svg viewBox={box.map((v) => v.toFixed(2)).join(" ")} className="block aspect-[750/497] w-full touch-manipulation" role="group" aria-label="Map of Southern Ontario. Select a region for details.">
          <rect x="-400" y="-300" width="1600" height="1100" fill="rgba(226,232,235,0.55)" />
          {[["Lake Huron", 52, 150], ["Lake Erie", 175, 452], ["Lake Ontario", 520, 290]].map(([t, x, y]) => (
            <text key={t as string} x={x as number} y={y as number} fontSize="8" letterSpacing="2.4" fill="rgba(22,22,22,0.28)" fontWeight="600" textAnchor="middle" className="uppercase" style={{ pointerEvents: "none" }}>{(t as string).toUpperCase()}</text>
          ))}
          <path d={lakePath} fill="rgba(226,232,235,0.9)" stroke="rgba(22,22,22,0.25)" strokeWidth="0.5" fillRule="evenodd" />
          {ordered.map((r) => (
            <path
              key={r.id}
              d={r.d}
              fillRule="evenodd"
              className={`cov-r ${r.main ? "cov-main" : "cov-case"} ${sel === r.id ? "is-sel" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={sel === r.id}
              aria-label={`${r.name}, ${r.main ? "main coverage area" : "case by case"}`}
              onClick={() => pick(r.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(r.id); } }}
            />
          ))}
          {regions.map((r) => {
            const f = Math.min(8.2, Math.max(r.main ? 5 : 4.6, r.r * 0.42));
            const lines = r.label;
            return (
              <text key={r.id} textAnchor="middle" fontSize={f} fontWeight={r.main ? 700 : 500} fill="#161616" style={{ pointerEvents: "none" }}>
                {lines.map((l, i) => <tspan key={l} x={r.lx} y={r.ly + (i - (lines.length - 1) / 2) * f * 1.12 + f * 0.34}>{l}</tspan>)}
              </text>
            );
          })}
        </svg>
        <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/70 px-5 py-3 text-[13px] text-ink-700">
          <span className="flex items-center gap-2"><i className="inline-block h-3 w-5 bg-accent-500" /> Main coverage area (GTHA)</span>
          <span className="flex items-center gap-2"><i className="inline-block h-3 w-5 border border-ink-950/20 bg-[#ebe8e0]" /> Case by case</span>
          <span className="ml-auto hidden sm:inline">Click a region for details</span>
        </figcaption>
      </figure>

      <aside className="lg-strong flex flex-col p-6 sm:p-7 lg:col-span-4" aria-live="polite">
        {active ? (
          <>
            <span className={`inline-flex w-fit items-center gap-2 px-3 py-1 text-[12px] font-semibold tracking-[0.14em] uppercase ${active.main ? "bg-accent-500 text-ink-950" : "bg-ink-950/[0.07] text-ink-800"}`}>
              {active.main ? "Main coverage area" : "Case by case"}
            </span>
            <h3 className="mt-4 text-[30px] leading-tight font-semibold text-ink-950">{active.name}</h3>
            {active.main ? (
              <>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{active.name} is part of the Greater Toronto and Hamilton Area, our main coverage area. All property types, for financing and non-financing purposes.</p>
                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {active.cities.map((c) => (
                    <li key={c.slug}><Link href={`/areas/${c.slug}`} className="block border border-white/80 bg-white/70 px-3.5 py-2.5 text-[15px] font-medium text-ink-950 transition-colors hover:border-accent-500">{c.name} →</Link></li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-[15px] leading-relaxed text-ink-700">We complete appraisals in {active.name} on a case-by-case basis. Contact us to confirm availability, timing and fee for your property.</p>
            )}
            <CtaLink href="/get-a-quote" location={`coverage_${active.id}`} className="btn-primary mt-6 w-full">Request a quote</CtaLink>
            <button type="button" onClick={() => setSel(null)} className="mt-3 text-left text-[14px] font-semibold text-ink-700 underline underline-offset-4">Back to overview</button>
          </>
        ) : (
          <>
            <span className="inline-flex w-fit bg-accent-500 px-3 py-1 text-[12px] font-semibold tracking-[0.14em] text-ink-950 uppercase">Main coverage area</span>
            <h3 className="mt-4 text-[30px] leading-tight font-semibold text-ink-950">GTHA</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">Greater Toronto and Hamilton Area.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {main.map((r) => <li key={r.id}><button type="button" onClick={() => { pick(r.id); setZoomed(true); }} className="border border-white/80 bg-white/70 px-3.5 py-2 text-[14px] font-semibold text-ink-950 transition-colors hover:border-accent-500">{r.name}</button></li>)}
            </ul>
            <span className="mt-7 inline-flex w-fit bg-ink-950/[0.07] px-3 py-1 text-[12px] font-semibold tracking-[0.14em] text-ink-800 uppercase">Case by case</span>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">Everywhere else in Southern Ontario. Property outside the GTHA? Contact us anyway. We will always try to work with you.</p>
            <ul className="mt-4 flex max-h-[168px] flex-wrap gap-1.5 overflow-y-auto pr-1">
              {rest.map((r) => <li key={r.id}><button type="button" onClick={() => pick(r.id)} className="border border-ink-950/10 bg-white/55 px-2.5 py-1 text-[13px] text-ink-800 transition-colors hover:border-accent-500">{r.name}</button></li>)}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}
