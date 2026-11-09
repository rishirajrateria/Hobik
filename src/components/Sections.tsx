import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { services } from "@/lib/services";
import { areas, type Area } from "@/lib/areas";
import { breadcrumbSchema } from "@/lib/schema";
import { Icon } from "./Icon";
import { CallLink, CtaLink } from "./Tracked";
import { DarkAurora } from "./Ambient";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const HQ = { x: 55, y: 48 };

/* ------------------------------------------------------------------ */
/* Hero visual: layered glass "appraisal" composition with 3D tilt      */
/* ------------------------------------------------------------------ */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[580px] [perspective:1400px]" aria-hidden="true">
      {/* orbit rings */}
      <div className="absolute inset-[4%] animate-spin-slow rounded-full border border-dashed border-white/15">
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gold-400 shadow-[0_0_20px_4px_rgba(252,199,90,0.7)]" />
      </div>
      <div className="absolute inset-[15%] animate-[spin_26s_linear_infinite_reverse] rounded-full border border-white/10">
        <span className="absolute top-1/2 -right-1 h-2 w-2 rounded-full bg-mint-400 shadow-[0_0_16px_3px_rgba(62,224,181,0.7)]" />
      </div>

      <div data-tilt="7" className="absolute inset-0 transition-transform duration-300 ease-out [transform-style:preserve-3d]">
        {/* main glass card */}
        <div className="glass-dark glow-border absolute inset-x-[8%] top-[7%] bottom-[16%] overflow-hidden !rounded-[2rem]">
          <svg viewBox="0 0 400 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="hv-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#173a6e" stopOpacity="0.85" />
                <stop offset="1" stopColor="#0a1a36" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="hv-win" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffd98a" />
                <stop offset="1" stopColor="#f5b031" />
              </linearGradient>
              <linearGradient id="hv-scan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3ee0b5" stopOpacity="0" />
                <stop offset="0.85" stopColor="#3ee0b5" stopOpacity="0.28" />
                <stop offset="1" stopColor="#3ee0b5" stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id="hv-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#fcc75a" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fcc75a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="360" fill="url(#hv-sky)" />
            <g fill="#ffd98a">
              {[[40, 40, 0], [120, 70, 0.6], [180, 30, 1.2], [300, 60, 0.3], [360, 35, 1.8], [80, 100, 0.9], [330, 110, 1.4]].map(([x, y, d]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" className="animate-blink" style={{ animationDelay: `${d}s` }} />
              ))}
            </g>
            <g fill="#11305f" opacity="0.95">
              <rect x="20" y="150" width="34" height="120" rx="2" />
              <rect x="58" y="120" width="26" height="150" rx="2" />
              <rect x="88" y="165" width="40" height="105" rx="2" />
              <rect x="300" y="140" width="30" height="130" rx="2" />
              <rect x="334" y="170" width="46" height="100" rx="2" />
              <rect x="266" y="185" width="30" height="85" rx="2" />
              <path d="M232 270V95l4-6 4 6v175z" />
              <ellipse cx="236" cy="128" rx="11" ry="6" />
              <rect x="235" y="40" width="2" height="52" />
            </g>
            <g fill="#fcc75a" opacity="0.5">
              {[[26, 160], [26, 180], [64, 135], [64, 160], [96, 180], [306, 150], [306, 175], [342, 185], [272, 200]].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="5" height="7" rx="1" className="animate-blink" style={{ animationDelay: `${i * 0.37}s` }} />
              ))}
            </g>
            <circle cx="236" cy="38" r="3" fill="#ff6b6b" className="animate-blink" />
            <path d="M0 268h400v92H0z" fill="#061430" />
            <circle cx="200" cy="215" r="110" fill="url(#hv-glow)" />
            <g>
              <path d="M120 270V190l80-62 80 62v80z" fill="#f3f6fb" />
              <path d="M104 196 200 120l96 76" fill="none" stroke="#f5b031" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
              <rect x="248" y="130" width="16" height="36" fill="#e6ecf6" />
              <rect x="142" y="200" width="36" height="32" rx="3" fill="url(#hv-win)" />
              <rect x="222" y="200" width="36" height="32" rx="3" fill="url(#hv-win)" />
              <path d="M160 200v32M142 216h36M240 200v32M222 216h36" stroke="#d9921a" strokeWidth="2" />
              <rect x="186" y="226" width="28" height="44" rx="3" fill="#173a6e" />
              <circle cx="208" cy="250" r="2" fill="#f5b031" />
              <circle cx="200" cy="168" r="10" fill="url(#hv-win)" />
            </g>
            <g fill="#14c79a" opacity="0.9">
              <circle cx="92" cy="246" r="18" /><rect x="90" y="252" width="4" height="18" fill="#0e8f70" />
              <circle cx="312" cy="242" r="22" /><rect x="310" y="252" width="4" height="18" fill="#0e8f70" />
            </g>
            {/* animated measurement */}
            <g stroke="#3ee0b5" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash">
              <path d="M120 290h160" /><path d="M300 270V128" />
            </g>
            <path d="M120 284v12M280 284v12M294 270h12M294 128h12" stroke="#3ee0b5" strokeWidth="1.5" />
            <text x="200" y="312" fill="#3ee0b5" fontSize="12" fontFamily="sans-serif" textAnchor="middle" fontWeight="700" letterSpacing="1">2,140 SQ FT</text>
            {/* scanning beam */}
            <rect x="0" y="-80" width="400" height="80" fill="url(#hv-scan)">
              <animate attributeName="y" values="-80;300;-80" dur="7s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>

        {/* floating: valuation card */}
        <div className="glass absolute bottom-[3%] -left-1 w-[62%] max-w-64 animate-float p-4 [transform:translateZ(60px)] sm:-left-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Market value</p>
            <span className="rounded-full bg-mint-400/15 px-2 py-0.5 text-[10px] font-extrabold text-mint-500">SAMPLE</span>
          </div>
          <p className="mt-1 font-display text-3xl font-extrabold text-navy-950">$1,248,000</p>
          <svg viewBox="0 0 200 48" className="mt-2 h-10 w-full">
            <defs>
              <linearGradient id="hv-spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#14c79a" stopOpacity="0.35" />
                <stop offset="1" stopColor="#14c79a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 40 C30 36 40 30 60 32 S100 20 120 22 160 8 200 6 V48 H0Z" fill="url(#hv-spark)" />
            <path d="M0 40 C30 36 40 30 60 32 S100 20 120 22 160 8 200 6" fill="none" stroke="#14c79a" strokeWidth="2.5" strokeDasharray="320" strokeDashoffset="320">
              <animate attributeName="stroke-dashoffset" from="320" to="0" dur="2.4s" fill="freeze" begin="0.6s" />
            </path>
            <circle cx="200" cy="6" r="3.5" fill="#14c79a"><animate attributeName="r" values="3.5;6;3.5" dur="2s" repeatCount="indefinite" /></circle>
          </svg>
          <p className="mt-1 text-xs font-semibold text-mint-500">6 comparable sales analysed</p>
        </div>

        {/* floating: delivered */}
        <div className="glass absolute top-0 -right-1 flex animate-float-slow items-center gap-3 p-3 pr-5 [transform:translateZ(80px)] sm:-right-4">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-mint-400/15 text-mint-500">
            <span className="absolute inset-0 animate-pulse-ring rounded-xl bg-mint-400/30" />
            <Icon name="doc" className="relative h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-extrabold text-navy-950">Report delivered</span>
            <span className="block text-xs text-slate-500">Lender-ready PDF</span>
          </span>
        </div>

        {/* floating: certified badge */}
        <div className="absolute right-[3%] bottom-[22%] grid h-24 w-24 animate-float place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-center text-navy-950 shadow-[0_20px_50px_-10px_rgba(245,176,49,0.8),inset_0_2px_0_rgba(255,255,255,0.6)] ring-8 ring-white/10 backdrop-blur [animation-delay:1.5s] [transform:translateZ(100px)]">
          <span className="text-[10px] leading-tight font-extrabold tracking-wider uppercase">
            <Icon name="shield" className="mx-auto mb-1 h-6 w-6" />
            AIC<br />Member
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function TrustStrip() {
  const items = [
    { icon: "shield", label: "AIC member appraisers" },
    { icon: "clock", label: `${site.turnaround} turnaround` },
    { icon: "bank", label: "Lender-ready reports" },
    { icon: "calendar", label: "Retrospective dates" },
    { icon: "gavel", label: "Court testimony" },
    { icon: "pin", label: "All of the GTA" },
    { icon: "doc", label: "CUSPAP-compliant" },
    { icon: "bolt", label: "Rush service" },
  ];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/70 bg-white/40 py-5 backdrop-blur-xl">
      <div className="flex w-max animate-marquee gap-4 pr-4 hover:[animation-play-state:paused]">
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-2.5 rounded-full bg-white/60 px-4 py-2 text-sm font-bold whitespace-nowrap text-navy-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-white" aria-hidden={i >= items.length}>
            <Icon name={it.icon} className="h-4 w-4 text-gold-600" /> {it.label}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f4f7fc]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f4f7fc]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function StatsBand() {
  const stats = [
    { v: site.yearsExperience, l: "Years appraising", icon: "calendar" },
    { v: "20+", l: "GTA cities served", icon: "pin" },
    { v: "48h", l: "Typical delivery", icon: "clock" },
    { v: "10", l: "Appraisal specialties", icon: "doc" },
  ];
  return (
    <div className="glass-dark grid grid-cols-2 overflow-hidden lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.l} data-spot className={`spotlight group relative p-6 text-center sm:p-8 ${i % 2 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
          <Icon name={s.icon} className="mx-auto mb-2 h-5 w-5 text-white/30 transition group-hover:-translate-y-0.5 group-hover:text-gold-300" />
          <p className="font-display text-4xl font-extrabold text-gradient tabular-nums sm:text-5xl" data-count={s.v}>{s.v}</p>
          <p className="mt-1 text-sm font-semibold text-white/60">{s.l}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function SectionHead({ eyebrow, title, sub, center = true, dark = false }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`} data-reveal>
      <span className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</span>
      <h2 className={`mt-5 text-3xl leading-[1.08] font-extrabold sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-navy-950"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? "text-white/65" : "text-slate-600"}`}>{sub}</p>}
    </div>
  );
}

export function ServiceGrid({ citySuffix }: { citySuffix?: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => {
        const feat = i === 0;
        return (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            data-reveal
            style={{ "--d": i % 6 } as React.CSSProperties}
            className={`group spotlight relative flex flex-col overflow-hidden p-7 transition duration-500 hover:-translate-y-1.5 ${
              feat ? "glass-dark glow-border !bg-navy-950 text-white lg:row-span-2" : "card hover:bg-white/75 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_30px_60px_-25px_rgba(10,26,54,0.45)]"
            } ${i === services.length - 1 ? "lg:col-span-2" : ""}`}
          >
            {feat && <DarkAurora />}
            <span className={`relative grid h-14 w-14 place-items-center rounded-2xl transition duration-500 group-hover:scale-110 group-hover:-rotate-6 ${feat ? "bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 shadow-[0_10px_30px_-8px_rgba(245,176,49,0.8)]" : "bg-white/80 text-navy-800 shadow-[inset_0_1px_0_#fff,0_8px_20px_-10px_rgba(10,26,54,0.4)] ring-1 ring-white group-hover:bg-gradient-to-br group-hover:from-gold-300 group-hover:to-gold-500 group-hover:text-navy-950"}`}>
              <Icon name={s.icon} className="h-7 w-7" />
            </span>
            <h3 className={`relative mt-5 text-xl font-extrabold ${feat ? "lg:text-3xl" : "text-navy-950"}`}>
              {s.name}{citySuffix ? <span className="sr-only"> in {citySuffix}</span> : null}
            </h3>
            <p className={`relative mt-2 text-[15px] ${feat ? "text-white/70" : "text-slate-600"}`}>{s.short}</p>
            {feat && (
              <ul className="relative mt-6 hidden space-y-3 lg:block">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-white/85"><Icon name="check" className="h-5 w-5 shrink-0 text-gold-400" />{b}</li>
                ))}
              </ul>
            )}
            <span className={`relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold ${feat ? "text-gold-300" : "text-gold-600"}`}>
              Learn more <Icon name="arrow" className="h-4 w-4 transition duration-300 group-hover:translate-x-1.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function Process() {
  const steps = [
    { icon: "phone", t: "Request a quote", d: "Call or send the form — get your fee upfront." },
    { icon: "calendar", t: "Book the visit", d: "Pick a time that works, often within days." },
    { icon: "search", t: "Inspection", d: "30–60 minutes on site, measuring and photographing." },
    { icon: "doc", t: "Get your report", d: `Signed PDF report, typically in ${site.turnaround}.` },
  ];
  return (
    <ol className="relative grid gap-6 md:grid-cols-4">
      <div className="absolute top-10 right-[12%] left-[12%] hidden h-0.5 overflow-hidden rounded-full bg-white/60 md:block" aria-hidden="true">
        <div data-draw className="h-full w-full bg-gradient-to-r from-gold-400 via-mint-400 to-gold-400" />
      </div>
      {steps.map((s, i) => (
        <li key={s.t} className="group relative text-center" data-reveal style={{ "--d": i + 1 } as React.CSSProperties}>
          <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-navy-800 to-navy-950 text-gold-400 shadow-[0_20px_40px_-15px_rgba(5,13,31,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] ring-8 ring-white/70 backdrop-blur transition duration-500 group-hover:-translate-y-1 group-hover:scale-105">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold-400/20" style={{ animationDelay: `${i * 0.6}s` }} />
            <Icon name={s.icon} className="relative h-8 w-8" />
            <span className="absolute -top-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-xs font-extrabold text-navy-950 shadow-lg">{i + 1}</span>
          </span>
          <div className="card mx-auto mt-5 max-w-[17rem] px-4 py-4">
            <h3 className="text-lg font-extrabold text-navy-950">{s.t}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Stylised GTA map: glass, animated routes from the office to each city */
/* ------------------------------------------------------------------ */
export function AreaMap({ highlight }: { highlight?: string }) {
  return (
    <div data-spot className="glass-dark spotlight relative overflow-hidden !rounded-[2rem] !bg-navy-950">
      <DarkAurora />
      <svg viewBox="0 0 100 100" className="relative block aspect-[4/3] w-full sm:aspect-[16/10]" role="img" aria-label="Map of GTA service areas">
        <defs>
          <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d4ed8" stopOpacity="0.45" />
            <stop offset="1" stopColor="#173a6e" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path d="M0 78 C15 74 22 92 35 76 C45 66 55 70 70 60 C80 54 90 50 100 44 V100 H0Z" fill="url(#lake)" />
        <path d="M0 78 C15 74 22 92 35 76 C45 66 55 70 70 60 C80 54 90 50 100 44" fill="none" stroke="#3ee0b5" strokeOpacity="0.35" strokeWidth="0.3" />
        <text x="62" y="86" fontSize="3" fill="#3ee0b5" opacity="0.6" fontWeight="700" letterSpacing="0.4">LAKE ONTARIO</text>
        {/* routes */}
        <g fill="none" strokeWidth="0.25" strokeDasharray="1 1.4">
          {areas.map((a) => (
            <path key={a.slug} d={`M${HQ.x} ${HQ.y} Q ${(HQ.x + a.map.x) / 2} ${Math.min(HQ.y, a.map.y) - 6} ${a.map.x} ${a.map.y}`} stroke={highlight === a.slug ? "#fcc75a" : "#3ee0b5"} strokeOpacity={highlight === a.slug ? 0.9 : 0.35} className="animate-dash" />
          ))}
        </g>
        {areas.map((a, i) => {
          const on = highlight === a.slug;
          return (
            <a key={a.slug} href={`/areas/${a.slug}`} aria-label={`Home appraisal in ${a.name}`} className="group">
              <circle cx={a.map.x} cy={a.map.y} r={on ? 1.8 : 1.2} fill="none" stroke={on ? "#fcc75a" : "#3ee0b5"} strokeWidth="0.3">
                <animate attributeName="r" values={`${on ? 1.8 : 1.2};${on ? 5 : 3.2}`} dur="2.6s" begin={`${(i % 7) * 0.37}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="2.6s" begin={`${(i % 7) * 0.37}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={a.map.x} cy={a.map.y} r={on ? 1.8 : 1.2} fill={on ? "#fcc75a" : "#3ee0b5"} className="transition group-hover:fill-[#fcc75a]" />
              <text x={a.map.x} y={a.map.y - 2.6} fontSize={on ? 3 : 2.3} fill={on ? "#ffd98a" : "#e6ecf6"} textAnchor="middle" fontWeight="700" className="transition group-hover:fill-[#ffd98a]">
                {a.name}
              </text>
            </a>
          );
        })}
        <g>
          <circle cx={HQ.x} cy={HQ.y} r="2.4" fill="#fcc75a" opacity="0.25">
            <animate attributeName="r" values="2.4;7;2.4" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0;0.35" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={HQ.x} cy={HQ.y} r="1.5" fill="#fcc75a" stroke="#fff" strokeWidth="0.4" />
        </g>
      </svg>
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur-xl">
        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" /></span>
        Office · North York
      </div>
    </div>
  );
}

export function AreaChips({ exclude }: { exclude?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {areas.filter((a) => a.slug !== exclude).map((a: Area) => (
        <Link key={a.slug} href={`/areas/${a.slug}`} className="group inline-flex items-center gap-1.5 rounded-full bg-white/55 px-4 py-2 text-sm font-semibold text-navy-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-white backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-gold-300 hover:to-gold-400 hover:shadow-[0_10px_24px_-10px_rgba(245,176,49,0.9)]">
          <Icon name="pin" className="h-4 w-4 text-gold-600 transition group-hover:text-navy-950" /> {a.name}
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function WhyUs() {
  const items = [
    { icon: "shield", t: "Certified & independent", d: "AIC-member appraisers following CUSPAP — no sales commission, no bias." },
    { icon: "bolt", t: "Fast turnaround", d: `Most reports in ${site.turnaround}. Rush available for tight deadlines.` },
    { icon: "chart", t: "Hyper-local data", d: "Street-level comparable sales, not city-wide averages." },
    { icon: "calendar", t: "Any valuation date", d: "Current or retrospective — date of death, separation or change of use." },
    { icon: "gavel", t: "Built to hold up", d: "Reports trusted by lenders, lawyers, accountants and the courts." },
    { icon: "phone", t: "Real people", d: "Talk directly to an appraiser — clear quotes, no surprises." },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <div key={it.t} data-reveal style={{ "--d": i } as React.CSSProperties} className="glass-dark spotlight group p-6 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.09]">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/20 transition duration-500 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-gold-300 group-hover:to-gold-500 group-hover:text-navy-950">
            <Icon name={it.icon} className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-lg font-extrabold text-white">{it.t}</h3>
          <p className="mt-1 text-sm text-white/60">{it.d}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="card divide-y divide-white/70 overflow-hidden" data-reveal>
      {items.map((f, i) => (
        <details key={f.q} className="group transition-colors open:bg-white/50" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-lg font-bold text-navy-950 transition hover:bg-white/50 [&::-webkit-details-marker]:hidden">
            <h3 className="text-base sm:text-lg">{f.q}</h3>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/80 text-navy-800 shadow-[inset_0_1px_0_#fff] ring-1 ring-white transition duration-300 group-open:rotate-45 group-open:bg-gradient-to-br group-open:from-gold-300 group-open:to-gold-500">
              <Icon name="plus" className="h-4 w-4" />
            </span>
          </summary>
          <p className="animate-fade-up px-6 pb-6 text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function CtaBand({ title = "Need an appraisal? Get your quote in minutes.", location = "cta_band" }: { title?: string; location?: string }) {
  return (
    <section className="container-x py-16 sm:py-24">
      <div data-reveal="scale" data-spot className="glow-border spotlight relative overflow-hidden rounded-[2.5rem] bg-navy-950 px-6 py-16 text-center shadow-[0_40px_100px_-40px_rgba(5,13,31,0.8)] sm:px-12 sm:py-24">
        <DarkAurora />
        {[[12, 22, 0], [85, 30, 1.2], [20, 78, 2.1], [78, 75, 0.6], [50, 12, 1.6]].map(([x, y, d], i) => (
          <span key={i} aria-hidden="true" className="absolute h-2 w-2 animate-float rounded-full bg-gold-300/70 shadow-[0_0_14px_3px_rgba(252,199,90,0.6)]" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />
        ))}
        <div className="relative">
          <span className="eyebrow-dark">Free quote · No obligation</span>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-[1.08] font-extrabold text-white sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/65">Certified, independent and fast — anywhere in Toronto &amp; the GTA.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <CtaLink href="/get-a-quote" location={location} className="btn-gold text-lg">Get a Free Quote <Icon name="arrow" className="h-5 w-5" /></CtaLink>
            <CallLink href={telHref} location={location} className="btn-ghost text-lg"><Icon name="phone" className="h-5 w-5" /> {site.phone}</CallLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="inline-flex rounded-full bg-white/[0.06] px-3 py-1 text-sm text-white/60 ring-1 ring-white/10 backdrop-blur-xl">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((b, i) => (
            <li key={b.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true" className="text-white/30">/</span>}
              {i < all.length - 1 ? <Link href={b.path} className="hover:text-gold-300">{b.name}</Link> : <span className="max-w-[16rem] truncate text-white/90" aria-current="page">{b.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Dark aurora hero for inner pages (clears the floating header). */
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
    <section data-spot className="spotlight relative overflow-hidden rounded-b-[2.5rem] bg-navy-950 pt-24 sm:pt-28">
      <DarkAurora />
      <div className={`container-x relative grid gap-12 pt-8 pb-16 sm:pb-24 ${aside ? "lg:grid-cols-12 lg:items-center" : ""}`}>
        <div className={aside ? "lg:col-span-7" : "max-w-4xl"}>
          <div className="animate-fade-up"><Breadcrumbs items={crumbs} /></div>
          <div className="mt-6 animate-fade-up [animation-delay:80ms]"><span className="eyebrow-dark">{eyebrow}</span></div>
          <h1 className="mt-5 animate-fade-up text-4xl leading-[1.04] font-extrabold text-white [animation-delay:160ms] sm:text-5xl lg:text-6xl">{title}</h1>
          {answer && <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/70 [animation-delay:240ms]">{answer}</p>}
          {children && <div className="animate-fade-up [animation-delay:320ms]">{children}</div>}
        </div>
        {aside && <div className="animate-fade-up [animation-delay:300ms] lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}

export function HeroCtas({ location }: { location: string }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <CtaLink href="/get-a-quote" location={location} className="btn-gold text-lg">Get a Free Quote <Icon name="arrow" className="h-5 w-5" /></CtaLink>
      <CallLink href={telHref} location={location} className="btn-ghost text-lg"><Icon name="phone" className="h-5 w-5" /> {site.phone}</CallLink>
    </div>
  );
}
