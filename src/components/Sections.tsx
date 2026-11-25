import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { propertyTypes, services, type Service } from "@/lib/services";
import { areas, type Area } from "@/lib/areas";
import { breadcrumbSchema } from "@/lib/schema";
import { Icon } from "./Icon";
import { CallLink, CtaLink } from "./Tracked";
import { Vignette, drawable, type VignetteMode } from "./Vignettes";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}


/* ------------------------------------------------------------------ */
/* Hero: a Southern Ontario streetscape, one building per property type */
/* ------------------------------------------------------------------ */
export function HeroVisual() {
  const ink = "var(--color-ink-950)";
  const gold = "var(--color-accent-500)";
  const pane = "var(--color-lake)";
  const paper = "var(--color-paper-50)";
  // One building per property type, agricultural last. Each group is translated into its slot.
  const labels: [number, string][] = [
    [56, "RESIDENTIAL"],
    [156, "MULTI-RES"],
    [260, "COMMERCIAL"],
    [372, "INSTITUTIONAL"],
    [484, "INDUSTRIAL"],
    [591, "AGRICULTURAL"],
  ];
  return (
    <figure className="relative mx-auto w-full max-w-[640px] 2xl:max-w-[760px]">
      <div className="orb -top-10 -right-6 h-40 w-40 sm:h-56 sm:w-56" aria-hidden="true" />
      <div className="orb-soft bottom-0 -left-10 h-56 w-56" aria-hidden="true" />
      <div className="lg p-5 sm:p-8">
      <svg viewBox="0 92 646 290" className="relative w-full" role="img" aria-label="Line drawing of a street with a house, an apartment building, a store, an institution, a factory and a farm" data-draw-svg data-anim="sketch" style={{ "--base": "0.25s" } as React.CSSProperties}>
        {drawable(
          <>
            <g fill="none" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
              <path d="M4 330h638" strokeWidth="1.8" />
              {/* house */}
              <g transform="translate(-110 0)">
                <path d="M128 330V266l38-34 38 34v64z" fill={paper} />
                <path d="M120 270 166 226l46 44" strokeWidth="1.8" />
                <path d="M138 250v-18h10v8" fill={paper} />
                <rect x="138" y="278" width="16" height="16" fill={pane} />
                <rect x="178" y="278" width="16" height="16" fill={pane} />
                <rect x="158" y="302" width="14" height="28" fill={paper} />
              </g>
              {/* multi-residential tower */}
              <g transform="translate(-114 0)">
                <rect x="230" y="120" width="80" height="210" fill={paper} />
                <path d="M226 120h88" strokeWidth="1.8" />
                {[136, 160, 184, 208, 232, 256, 280].map((y) => [242, 262, 282].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="14" height="14" fill={x === 262 && y === 184 ? gold : pane} stroke={x === 262 && y === 184 ? gold : ink} />))}
                <rect x="258" y="304" width="24" height="26" fill={paper} />
              </g>
              {/* commercial storefront */}
              <g transform="translate(-116 0)">
                <rect x="330" y="206" width="92" height="124" fill={paper} />
                <path d="M326 206h100" strokeWidth="1.8" />
                <rect x="342" y="218" width="68" height="18" fill={paper} />
                <path d="M330 248h92l-6 12h-80z" fill={gold} stroke={gold} />
                <rect x="338" y="270" width="44" height="40" fill={pane} />
                <rect x="390" y="270" width="24" height="60" fill={paper} />
              </g>
              {/* institution: pediment + columns + flag */}
              <g transform="translate(-110 0)">
                <path d="M436 330V246h88v84z" fill={paper} />
                <path d="M430 246 480 212l50 34z" fill={paper} />
                {[448, 468, 492, 512].map((x) => <path key={x} d={`M${x} 256v62`} />)}
                <path d="M432 318h96M428 330v-6h104v6" />
                <path d="M480 212v-34" />
                <path d="M480 178h18l-4 5 4 5h-18" fill={gold} stroke={gold} />
              </g>
              {/* industrial: saw-tooth roof + stack */}
              <g transform="translate(-106 0)">
                <path d="M540 330V268l22 14v-14l22 14v-14l22 14v-30h20v78z" fill={paper} />
                <rect x="606" y="200" width="12" height="52" fill={paper} />
                <rect x="586" y="298" width="24" height="32" fill={gold} stroke={gold} />
                <path d="M586 306h24M586 314h24M586 322h24" stroke={paper} />
                <rect x="550" y="300" width="14" height="12" fill={pane} />
              </g>
              {/* agricultural: barn + silo */}
              <g transform="translate(526 0)">
                <path d="M22 330V270l14-16h40l14 16v60z" fill={paper} />
                <path d="M18 272 36 250h40l18 22" />
                <rect x="42" y="290" width="28" height="40" fill={paper} />
                <path d="M42 290l28 40M70 290l-28 40" stroke={gold} />
                <path d="M96 330V258a8 8 0 0 1 16 0v72" fill={paper} />
              </g>
            </g>
            <g stroke={gold} strokeWidth="1" fill="none">
              <path d="M10 352h630" strokeDasharray="2 5" />
            </g>
            <g fill={gold} fontFamily="var(--font-sans)" fontSize="9" fontWeight="700" letterSpacing="1.4" textAnchor="middle">
              {labels.map(([x, t]) => <text key={t} x={x} y="372" fill="var(--color-accent-600)">{t}</text>)}
            </g>
          </>,
          0.03,
          1.4,
        )}
      </svg>
      </div>
      <figcaption className="sr-only">Residential, multi-residential, commercial, institutional, industrial and agricultural property.</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/** Four facts, each with its own entrance: stamp, pop, page-flip, drop. */
export function TrustStrip() {
  const items: [string, string, string, VignetteMode, boolean][] = [
    ["seal", "AACI", "Designated appraiser", "stamp", false],
    ["report", "CUSPAP", "Compliant reports", "pop", false],
    ["clock", "On time", "Timely reports", "flip", false],
    ["pin", "GTHA", "+ Southern Ontario, case by case", "drop", false],
  ];
  return (
    <div className="container-x">
      <dl className="lg grid grid-cols-2 px-4 sm:px-6 lg:grid-cols-4" data-anim-group="facts">
        {items.map(([icon, v, l, mode, count], i) => (
          <div key={l} className={`flex items-center gap-4 py-6 ${i % 2 ? "border-l border-ink-950/[0.07] pl-4 sm:pl-6" : ""} ${i === 2 ? "lg:border-l lg:border-ink-950/[0.07] lg:pl-6" : ""} ${i > 1 ? "border-t border-ink-950/[0.07] lg:border-t-0" : ""}`}>
            <Vignette name={icon} mode={mode} delay={0.15 + i * 0.18} className="h-14 w-[74px] shrink-0 sm:h-16 sm:w-[84px]" />
            <div className="flex flex-col-reverse">
              <dt className="text-[13px] leading-snug text-ink-700">{l}</dt>
              <dd className="font-display text-[26px] leading-none font-semibold text-ink-950 sm:text-[30px]" {...(count ? { "data-count": v } : {})}>{v}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** AIC membership badge, linked to the appraiser's profile on the AIC website. */
export function AicBadge({ className = "" }: { className?: string }) {
  return (
    <a href={site.aicProfileUrl} target="_blank" rel="noopener noreferrer" className="lg-strong lift inline-block px-5 py-3.5" style={{ background: "#fff" }} aria-label="View our Appraisal Institute of Canada (AIC) member profile (opens in a new tab)" data-cta="aic_badge">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/aic-badge.png" width={861} height={131} alt="Appraisal Institute of Canada: Professional Appraisers. Know the value." className={`h-auto ${className}`} loading="lazy" />
    </a>
  );
}

/** Key facts as a simple definition list. */
export function StatsBand({ dark = false }: { dark?: boolean }) {
  const stats = [
    [site.yearsExperience, "years in valuation, taxation & assessment"],
    ["6", "property types appraised"],
    ["AACI", "designated appraiser"],
    ["GTHA", "+ Southern Ontario, case by case"],
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(([v, l]) => (
        <div key={l} className={`flex flex-col-reverse p-6 ${dark ? "lg-dark" : "lg"}`}>
          <dt className={`mt-2 text-[14px] ${dark ? "text-white/60" : "text-ink-700"}`}>{l}</dt>
          <dd className={`font-display text-[34px] leading-none font-medium ${dark ? "text-paper" : "text-ink-950"}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
export function SectionHead({ eyebrow, title, sub, center = false, dark = false }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`} data-reveal>
      <span className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</span>
      <h2 className={`mt-5 text-[34px] leading-[1.1] font-medium sm:text-[44px] ${dark ? "text-paper" : "text-ink-950"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-[17px] leading-relaxed ${dark ? "text-white/65" : "text-ink-700"}`}>{sub}</p>}
    </div>
  );
}

/** Illustrated tiles: a drawing and a name. Defaults to the six property types. */
export function ServiceGrid({ items = propertyTypes, citySuffix }: { items?: Service[]; citySuffix?: string }) {
  const cols = items.length === 6 ? "lg:grid-cols-6" : items.length === 7 ? "lg:grid-cols-4" : "lg:grid-cols-5";
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 ${cols}`}>
      {items.map((s, i) => (
        <li key={s.slug} className="flex">
          <Link href={`/services/${s.slug}`} className="lg lift group flex w-full flex-col !rounded-[24px] p-4 sm:p-5">
            <Vignette name={s.icon} mode="build" delay={(i % 6) * 0.12} className="w-full transition-transform duration-500 group-hover:-translate-y-1" />
            <span className="mt-3 flex items-start justify-between gap-2">
              <span className="font-display text-[17px] leading-snug font-medium text-ink-950 sm:text-[18px]">
                {s.name}<span className="sr-only"> appraisal{citySuffix ? ` in ${citySuffix}` : ""}</span>
              </span>
              <Icon name="arrow" className="mt-1 h-4 w-4 shrink-0 text-accent-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** "What we do": an open grid of ruled columns, one per service (title, short text, learn more). */
export function WhatWeDo({ items, cols = 3 }: { items: Service[]; cols?: 3 | 4 }) {
  return (
    <ul className={`grid gap-x-10 gap-y-12 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((s, i) => (
        <li key={s.slug} data-reveal style={{ "--d": i % cols } as React.CSSProperties}>
          <Link href={`/services/${s.slug}`} className="group flex h-full flex-col border-t-2 border-ink-950 pt-6 transition-colors duration-300 hover:border-accent-500">
            <Vignette name={s.icon} mode="build" delay={(i % cols) * 0.12} className="mb-5 h-[72px] w-[96px] transition-transform duration-500 group-hover:-translate-y-1" />
            <h3 className="text-[24px] leading-snug font-semibold text-ink-950">{s.name}</h3>
            <p className="mt-3 line-clamp-4 text-[16px] leading-relaxed text-ink-700">{s.answer}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-accent-600">
              Learn more <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Quick turnaround: typical times by property type, plus the "we will meet your deadline" promise. */
export function TurnaroundBand() {
  const t = site.turnaround;
  const cards: [string, string, string, string, VignetteMode][] = [
    ["home", "Residential", t.residential, "Typical turnaround", "pop"],
    ["shop", "Commercial & industrial", t.commercial, "Typical turnaround", "pop"],
    ["clock", "Tight deadline?", "Let us know", "We will always try to work with you to meet it.", "pop"],
  ];
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3" data-anim-group="facts">
        {cards.map(([icon, label, value, note, mode], i) => (
          <div key={label} className="lg flex items-center gap-5 p-6 sm:p-7" data-reveal style={{ "--d": i } as React.CSSProperties}>
            <Vignette name={icon} mode={mode} delay={0.1 + i * 0.2} className="h-[72px] w-[96px] shrink-0" />
            <div>
              <p className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">{label}</p>
              <p className="mt-1.5 text-[26px] leading-tight font-semibold text-ink-950 sm:text-[30px]">{value}</p>
              <p className="mt-1 text-[14px] text-ink-700">{note}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[16px] text-ink-700" data-reveal>
        Accurate appraisal reports, delivered on time.{" "}
        <CallLink href={telHref} location="turnaround" className="font-semibold text-ink-950 underline decoration-accent-500 underline-offset-4">Call {site.phone}</CallLink>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/** Steps appear one by one, each icon pops in, and a gold progress line runs under them. */
export function Process() {
  const steps = [
    { icon: "phone", t: "Request a quote" },
    { icon: "calendar", t: "Book the inspection" },
    { icon: "measure", t: "We inspect" },
    { icon: "report", t: "Report delivered" },
  ];
  return (
    <ol className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4" data-anim-group="steps">
      {steps.map((s, i) => (
        <li key={s.t} className="hv-step lg relative !rounded-[24px] p-4 sm:p-5" style={{ "--i": i } as React.CSSProperties}>
          <Vignette name={s.icon} mode="pop" delay={0.15 + i * 0.35} className="w-full max-w-[220px]" />
          <div className="relative mt-3 flex items-baseline gap-3 border-t border-ink-950/15 pt-3">
            <span className="hv-step-fill" aria-hidden="true" />
            <span className="font-display text-[28px] leading-none text-accent-600">{i + 1}</span>
            <h3 className="text-[20px] font-medium text-ink-950">{s.t}</h3>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function AreaChips({ exclude }: { exclude?: string }) {
  return (
    <ul className="columns-2 gap-8 sm:columns-3">
      {areas.filter((a) => a.slug !== exclude).map((a: Area) => (
        <li key={a.slug} className="break-inside-avoid border-b border-ink-100">
          <Link href={`/areas/${a.slug}`} className="group flex items-center justify-between py-2.5 text-[15px] text-ink-950">
            <span className="decoration-accent-500 underline-offset-4 group-hover:underline">{a.name}</span>
            <Icon name="arrow" className="h-3.5 w-3.5 text-ink-700 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/**
 * "What's in a report": the page fills in like a form. Text bars grow, adjustments slide in,
 * the value counts up, the signature writes itself, the check stamps on, callouts slide in.
 */
export function WhyUs() {
  const P = "var(--color-paper-50)";
  const I = "var(--color-ink-950)";
  const B = "var(--color-accent-500)";
  const L = "var(--color-lake)";
  const G = "#e2ded5";
  const callouts: [number, number, string][] = [
    [100, 98, "Property inspected"],
    [196, 196, "Nearby sales"],
    [262, 240, "Adjustments"],
    [330, 318, "Market value"],
    [392, 392, "Signed by an AACI"],
  ];
  const t = (s: number) => ({ "--dd": `${s}s` }) as React.CSSProperties;
  return (
    <svg viewBox="0 0 720 440" className="w-full" role="img" aria-label="Diagram of an appraisal report: inspection, comparable sales, adjustments, market value and signature by a designated appraiser" data-draw-svg data-anim="report">
      <g stroke={I} strokeWidth="1.5" fill="none">
        <rect x="20" y="16" width="330" height="410" fill={P} stroke="none" />
        <text x="44" y="46" fill={I} stroke="none" fontSize="11" fontWeight="700" letterSpacing="2" fontFamily="var(--font-sans)">APPRAISAL REPORT</text>
        <path d="M44 56h282" />
        {/* subject photo + details */}
        <g className="hv-in" style={t(0.1)}>
          <rect x="44" y="70" width="120" height="72" fill={L} />
          <path d="M76 132v-28l28-20 28 20v28" fill={P} />
          <rect x="96" y="114" width="16" height="18" fill={L} />
        </g>
        {[[78, 120], [94, 96], [110, 110], [126, 80]].map(([y, w], i) => (
          <path key={y} className="hv-bar" style={t(0.25 + i * 0.08)} d={`M180 ${y}h${w}`} stroke={G} strokeWidth="5" />
        ))}
        {/* comparables */}
        <path d="M44 168h282M44 252h282" />
        {[184, 212, 240].map((y, i) => (
          <g key={y}>
            <rect className="hv-in" style={t(0.6 + i * 0.12)} x="44" y={y - 10} width="22" height="16" fill={L} />
            <path className="hv-bar" style={t(0.65 + i * 0.12)} d={`M76 ${y - 2}h120`} stroke={G} strokeWidth="5" />
            <text className="hv-slide" style={t(0.9 + i * 0.15)} x="320" y={y + 3} textAnchor="end" fill={B} stroke="none" fontSize="14" fontWeight="700" fontFamily="var(--font-sans)">{["+$12k", "−$8k", "+$4k"][i]}</text>
          </g>
        ))}
        {/* value */}
        <rect x="44" y="282" width="282" height="74" stroke={I} />
        <text x="60" y="306" fill="#555555" stroke="none" fontSize="12" fontFamily="var(--font-sans)">Market value</text>
        <text x="60" y="342" fill={I} stroke="none" fontSize="32" fontFamily="var(--font-display)" data-count="$1,248,000" data-count-delay="1300">$1,248,000</text>
        {/* signature writes itself, then the check stamps on */}
        <path className="hv-sign" style={t(2.1)} pathLength={1} d="M44 398c18-14 30 8 46-6s22 2 34-4" />
        <path d="M44 406h130" />
        <g className="hv-stamp" style={t(2.7)}>
          <circle cx="300" cy="392" r="18" fill={B} stroke={B} />
          <path d="M292 392l6 6 10-12" stroke={I} strokeWidth="2.2" />
        </g>
      </g>
      {callouts.map(([yFrom, yTo, label], i) => (
        <g key={label} className="hv-callout" style={t(0.5 + i * 0.45)}>
          <path d={`M350 ${yFrom}H376L392 ${yTo}H408`} stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
          <circle cx="420" cy={yTo} r="12" fill={B} />
          <text x="420" y={yTo + 4.5} textAnchor="middle" fill="#161616" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)">{i + 1}</text>
          <text x="442" y={yTo + 6} fill="#ffffff" fontSize="19" fontWeight="500" fontFamily="var(--font-sans)">{label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/** Renders an answer: plain lines become paragraphs, "- " lines become a bullet list. */
export function FaqAnswer({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const line of text.split("\n")) {
    const list = line.startsWith("- ");
    const last = blocks[blocks.length - 1];
    if (last && last.list && list) last.lines.push(line.slice(2));
    else blocks.push({ list, lines: [list ? line.slice(2) : line] });
  }
  return (
    <div className="max-w-2xl space-y-3 pb-6 text-[16px] leading-relaxed text-ink-700">
      {blocks.map((b, i) =>
        b.list ? (
          <ul key={i} className="space-y-1.5">
            {b.lines.map((l) => (
              <li key={l} className="relative pl-5"><span className="absolute top-[0.7em] left-0 h-[5px] w-[5px] bg-accent-500" aria-hidden="true" />{l}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{b.lines[0]}</p>
        ),
      )}
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="lg px-5 sm:px-7" data-reveal>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-ink-950/[0.07] last:border-b-0">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[19px] leading-snug font-medium text-ink-950">{f.q}</h3>
            <span className="relative mt-2 h-3 w-3 shrink-0" aria-hidden="true">
              <span className="absolute top-1/2 left-0 h-px w-3 bg-ink-950" />
              <span className="absolute top-0 left-1/2 h-3 w-px bg-ink-950 transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <FaqAnswer text={f.a} />
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function CtaBand({ title = "Need an appraisal? Request a quote today.", location = "cta_band" }: { title?: string; location?: string }) {
  return (
    <section className="py-10 text-ink-950 sm:py-14">
      <div className="container-x">
      <div className="relative grid gap-8 overflow-hidden rounded-[36px] px-6 py-14 sm:px-12 lg:grid-cols-12 lg:items-end lg:py-16" style={{ background: "linear-gradient(135deg, #f4c870 0%, #e8a941 45%, #d9952b 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.6), inset 0 -1px 0 rgba(120,72,0,.2), 0 40px 80px -40px rgba(200,130,30,.8)" }} data-reveal>
        <div className="glow-round pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.22)_48%,transparent_60%)]" aria-hidden="true" />
        <div className="relative lg:col-span-8">
          <p className="mb-4 text-[13px] font-semibold tracking-[0.14em] text-ink-950/70 uppercase">{site.slogan}</p>
          <h2 className="text-[34px] leading-[1.1] font-medium sm:text-[46px]">{title}</h2>
        </div>
        <div className="relative flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
          <CtaLink href="/get-a-quote" location={location} className="btn-ink">Request a quote</CtaLink>
          <CallLink href={telHref} location={location} className="btn border border-white/60 bg-white/35 text-ink-950 backdrop-blur-xl hover:bg-white/55" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.8)" }}>{site.phone}</CallLink>
        </div>
      </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function Breadcrumbs({ items, dark = false }: { items: { name: string; path: string }[]; dark?: boolean }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className={`text-[13px] ${dark ? "text-white/55" : "text-ink-700"}`}>
        <ol className="flex flex-wrap items-center gap-2">
          {all.map((b, i) => (
            <li key={b.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < all.length - 1 ? <Link href={b.path} className="hover:underline">{b.name}</Link> : <span className={`max-w-[18rem] truncate ${dark ? "text-paper" : "text-ink-950"}`} aria-current="page">{b.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Inner-page header on paper, with an optional aside (usually the quote form). */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  answer,
  children,
  aside,
}: {
  crumbs: { name: string; path: string }[];
  eyebrow: string;
  title: React.ReactNode;
  answer?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section>
      <div className={`container-x grid gap-12 pt-10 pb-16 sm:pb-20 ${aside ? "lg:grid-cols-12 lg:items-start" : ""}`}>
        <div className={aside ? "lg:col-span-7" : "max-w-3xl"}>
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 animate-fade-up"><span className="eyebrow">{eyebrow}</span></div>
          <h1 className="mt-5 animate-fade-up text-[40px] leading-[1.06] font-medium text-ink-950 [animation-delay:60ms] sm:text-[54px] lg:text-[62px]">{title}</h1>
          {answer && <p className="mt-6 max-w-2xl animate-fade-up text-[18px] leading-relaxed text-ink-700 [animation-delay:120ms]">{answer}</p>}
          {children && <div className="animate-fade-up [animation-delay:180ms]">{children}</div>}
        </div>
        {aside && <div className="animate-fade-up [animation-delay:160ms] lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}

export function HeroCtas({ location }: { location: string }) {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
      <CtaLink href="/get-a-quote" location={location} className="btn-primary px-6 py-3.5 text-base">Request a quote <Icon name="arrow" className="h-4 w-4" /></CtaLink>
      <span className="text-[15px] text-ink-700">
        or call <CallLink href={telHref} location={location} className="font-semibold text-ink-950 underline decoration-ink-950/25 underline-offset-4 hover:decoration-accent-500">{site.phone}</CallLink>
      </span>
    </div>
  );
}
