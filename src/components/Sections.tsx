import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { services } from "@/lib/services";
import { areas, type Area } from "@/lib/areas";
import { breadcrumbSchema } from "@/lib/schema";
import { Icon } from "./Icon";
import { CallLink, CtaLink } from "./Tracked";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/* ------------------------------------------------------------------ */
/* Hero visual: layered "appraisal report" composition (pure SVG/CSS)  */
/* ------------------------------------------------------------------ */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[5/5] w-full max-w-[560px]" aria-hidden="true">
      {/* glow */}
      <div className="absolute inset-8 rounded-full bg-gold-400/30 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-48 w-48 rounded-full bg-mint-400/25 blur-3xl" />

      {/* main card: house illustration */}
      <div className="absolute inset-x-6 top-8 bottom-16 overflow-hidden rounded-[2rem] bg-gradient-to-b from-navy-700 to-navy-900 shadow-2xl ring-1 ring-white/15">
        <svg viewBox="0 0 400 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#173a6e" />
              <stop offset="1" stopColor="#0a1a36" />
            </linearGradient>
            <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd98a" />
              <stop offset="1" stopColor="#f5b031" />
            </linearGradient>
          </defs>
          <rect width="400" height="360" fill="url(#sky)" />
          {/* skyline with tower */}
          <g fill="#0f2a55" opacity="0.9">
            <rect x="20" y="150" width="34" height="120" />
            <rect x="58" y="120" width="26" height="150" />
            <rect x="88" y="165" width="40" height="105" />
            <rect x="300" y="140" width="30" height="130" />
            <rect x="334" y="170" width="46" height="100" />
            <rect x="266" y="185" width="30" height="85" />
            <path d="M232 270V95l4-6 4 6v175z" />
            <ellipse cx="236" cy="128" rx="11" ry="6" />
            <rect x="235" y="40" width="2" height="52" />
          </g>
          {/* stars */}
          <g fill="#ffd98a" opacity="0.7">
            <circle cx="40" cy="40" r="1.6" /><circle cx="120" cy="70" r="1.2" /><circle cx="180" cy="30" r="1.4" /><circle cx="300" cy="60" r="1.2" /><circle cx="360" cy="35" r="1.6" />
          </g>
          {/* ground */}
          <path d="M0 268h400v92H0z" fill="#081530" />
          {/* house */}
          <g>
            <path d="M120 270V190l80-62 80 62v80z" fill="#f3f6fb" />
            <path d="M104 196 200 120l96 76" fill="none" stroke="#f5b031" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
            <rect x="248" y="130" width="16" height="36" fill="#e6ecf6" />
            <rect x="142" y="200" width="36" height="32" rx="3" fill="url(#win)" />
            <rect x="222" y="200" width="36" height="32" rx="3" fill="url(#win)" />
            <path d="M160 200v32M142 216h36M240 200v32M222 216h36" stroke="#d9921a" strokeWidth="2" />
            <rect x="186" y="226" width="28" height="44" rx="3" fill="#173a6e" />
            <circle cx="208" cy="250" r="2" fill="#f5b031" />
            <circle cx="200" cy="168" r="10" fill="url(#win)" />
          </g>
          {/* trees */}
          <g fill="#14c79a" opacity="0.85">
            <circle cx="92" cy="246" r="18" /><rect x="90" y="252" width="4" height="18" fill="#0e8f70" />
            <circle cx="312" cy="242" r="22" /><rect x="310" y="252" width="4" height="18" fill="#0e8f70" />
          </g>
          {/* measurement lines */}
          <g stroke="#3ee0b5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8">
            <path d="M120 290h160" /><path d="M120 284v12M280 284v12" />
          </g>
          <text x="200" y="312" fill="#3ee0b5" fontSize="12" fontFamily="sans-serif" textAnchor="middle" fontWeight="700">2,140 SQ FT</text>
        </svg>
      </div>

      {/* floating: valuation card */}
      <div className="glass absolute -left-2 bottom-2 w-60 animate-float p-4 sm:-left-6">
        <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Appraised value</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-navy-950">$1,248,000</p>
        <svg viewBox="0 0 200 48" className="mt-2 h-10 w-full">
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#14c79a" stopOpacity="0.35" />
              <stop offset="1" stopColor="#14c79a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 40 C30 36 40 30 60 32 S100 20 120 22 160 8 200 6 V48 H0Z" fill="url(#spark)" />
          <path d="M0 40 C30 36 40 30 60 32 S100 20 120 22 160 8 200 6" fill="none" stroke="#14c79a" strokeWidth="2.5" />
        </svg>
        <p className="mt-1 text-xs font-semibold text-mint-500">6 comparable sales analysed</p>
      </div>

      {/* floating: delivered */}
      <div className="glass absolute top-0 -right-1 flex animate-float-slow items-center gap-3 p-3 pr-5 sm:-right-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-400/15 text-mint-500"><Icon name="doc" className="h-5 w-5" /></span>
        <span>
          <span className="block text-sm font-extrabold text-navy-950">Report delivered</span>
          <span className="block text-xs text-slate-500">Lender-ready PDF</span>
        </span>
      </div>

      {/* floating: certified badge */}
      <div className="absolute right-2 bottom-24 grid h-24 w-24 animate-float place-items-center rounded-full bg-gold-400 text-center text-navy-950 shadow-2xl ring-8 ring-gold-400/25 [animation-delay:1.5s] sm:right-0">
        <span className="text-[10px] leading-tight font-extrabold tracking-wider uppercase">
          <Icon name="shield" className="mx-auto mb-1 h-6 w-6" />
          AIC<br />Member
        </span>
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
    <div className="relative overflow-hidden border-y border-navy-100 bg-navy-50 py-5">
      <div className="flex w-max animate-marquee gap-10 pr-10">
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-2.5 text-sm font-bold whitespace-nowrap text-navy-900" aria-hidden={i >= items.length}>
            <Icon name={it.icon} className="h-5 w-5 text-gold-600" /> {it.label}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-navy-50" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-navy-50" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function StatsBand() {
  const stats = [
    { v: site.yearsExperience, l: "Years appraising" },
    { v: "20+", l: "GTA cities served" },
    { v: "48h", l: "Typical delivery" },
    { v: "10", l: "Appraisal specialties" },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.l} className="bg-navy-900/60 p-6 text-center backdrop-blur">
          <p className="font-display text-4xl font-extrabold text-gradient sm:text-5xl">{s.v}</p>
          <p className="mt-1 text-sm font-semibold text-white/70">{s.l}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function SectionHead({ eyebrow, title, sub, center = true, dark = false }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      <span className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</span>
      <h2 className={`mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-navy-950"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? "text-white/70" : "text-slate-600"}`}>{sub}</p>}
    </div>
  );
}

export function ServiceGrid({ citySuffix }: { citySuffix?: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <Link
          key={s.slug}
          href={`/services/${s.slug}`}
          className={`group card relative flex flex-col overflow-hidden p-7 transition duration-300 hover:-translate-y-1 hover:ring-gold-400 ${i === 0 ? "lg:row-span-2 lg:bg-gradient-to-br lg:from-navy-900 lg:to-navy-700 lg:text-white" : ""} ${i === services.length - 1 ? "lg:col-span-2" : ""}`}
        >
          <span className={`grid h-14 w-14 place-items-center rounded-2xl transition group-hover:scale-110 ${i === 0 ? "bg-gold-400 text-navy-950" : "bg-navy-50 text-navy-800 group-hover:bg-gold-400 group-hover:text-navy-950"}`}>
            <Icon name={s.icon} className="h-7 w-7" />
          </span>
          <h3 className={`mt-5 text-xl font-extrabold ${i === 0 ? "lg:text-3xl" : "text-navy-950"}`}>
            {s.name}{citySuffix ? <span className="sr-only"> in {citySuffix}</span> : null}
          </h3>
          <p className={`mt-2 text-[15px] ${i === 0 ? "text-slate-600 lg:text-white/75" : "text-slate-600"}`}>{s.short}</p>
          {i === 0 && (
            <ul className="mt-6 hidden space-y-3 lg:block">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-white/85"><Icon name="check" className="h-5 w-5 shrink-0 text-gold-400" />{b}</li>
              ))}
            </ul>
          )}
          <span className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold ${i === 0 ? "text-gold-600 lg:text-gold-300" : "text-gold-600"}`}>
            Learn more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
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
      <div className="absolute top-10 right-[12%] left-[12%] hidden h-0.5 bg-gradient-to-r from-gold-400 via-mint-400 to-gold-400 md:block" aria-hidden="true" />
      {steps.map((s, i) => (
        <li key={s.t} className="relative text-center">
          <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy-900 text-gold-400 shadow-xl ring-8 ring-white">
            <Icon name={s.icon} className="h-8 w-8" />
            <span className="absolute -top-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-xs font-extrabold text-navy-950">{i + 1}</span>
          </span>
          <h3 className="mt-5 text-lg font-extrabold text-navy-950">{s.t}</h3>
          <p className="mx-auto mt-1 max-w-[16rem] text-sm text-slate-600">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Stylised GTA map with every service-area city linked                */
/* ------------------------------------------------------------------ */
export function AreaMap({ highlight }: { highlight?: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 ring-1 ring-white/10">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <svg viewBox="0 0 100 100" className="relative block aspect-[4/3] w-full sm:aspect-[16/10]" role="img" aria-label="Map of GTA service areas">
        {/* Lake Ontario */}
        <path d="M0 78 C15 74 22 92 35 76 C45 66 55 70 70 60 C80 54 90 50 100 44 V100 H0Z" fill="#173a6e" opacity="0.8" />
        <text x="62" y="86" fontSize="3" fill="#3ee0b5" opacity="0.6" fontWeight="700" letterSpacing="0.4">LAKE ONTARIO</text>
        {areas.map((a) => {
          const on = highlight === a.slug;
          return (
            <a key={a.slug} href={`/areas/${a.slug}`} aria-label={`Home appraisal in ${a.name}`}>
              {on && <circle cx={a.map.x} cy={a.map.y} r="4" fill="#f5b031" opacity="0.25" />}
              <circle cx={a.map.x} cy={a.map.y} r={on ? 1.8 : 1.2} fill={on ? "#f5b031" : "#3ee0b5"} />
              <text x={a.map.x} y={a.map.y - 2.4} fontSize={on ? 3 : 2.3} fill={on ? "#ffd98a" : "#e6ecf6"} textAnchor="middle" fontWeight="700">
                {a.name}
              </text>
            </a>
          );
        })}
        {/* HQ marker */}
        <g transform="translate(55 48)">
          <circle r="3" fill="none" stroke="#f5b031" strokeWidth="0.4" />
        </g>
      </svg>
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-gold-400" /> Office · North York
      </div>
    </div>
  );
}

export function AreaChips({ exclude }: { exclude?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {areas.filter((a) => a.slug !== exclude).map((a: Area) => (
        <Link key={a.slug} href={`/areas/${a.slug}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-900 ring-1 ring-navy-100 transition hover:bg-gold-400 hover:ring-gold-400">
          <Icon name="pin" className="h-4 w-4" /> {a.name}
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
      {items.map((it) => (
        <div key={it.t} className="group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-navy-950">
            <Icon name={it.icon} className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-lg font-extrabold text-white">{it.t}</h3>
          <p className="mt-1 text-sm text-white/65">{it.d}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-navy-100 overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100">
      {items.map((f, i) => (
        <details key={f.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-lg font-bold text-navy-950 hover:bg-navy-50 [&::-webkit-details-marker]:hidden">
            <h3 className="text-base sm:text-lg">{f.q}</h3>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-800 transition group-open:rotate-45 group-open:bg-gold-400">
              <Icon name="plus" className="h-4 w-4" />
            </span>
          </summary>
          <p className="px-6 pb-6 text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function CtaBand({ title = "Need an appraisal? Get your quote in minutes.", location = "cta_band" }: { title?: string; location?: string }) {
  return (
    <section className="container-x py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold-400/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-mint-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">Certified, independent and fast — anywhere in Toronto &amp; the GTA.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
      <nav aria-label="Breadcrumb" className="text-sm text-white/60">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((b, i) => (
            <li key={b.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < all.length - 1 ? <Link href={b.path} className="hover:text-gold-300">{b.name}</Link> : <span className="text-white/90" aria-current="page">{b.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Dark hero for inner pages. */
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
    <section className="relative overflow-hidden bg-navy-950">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-20 h-[24rem] w-[24rem] rounded-full bg-mint-400/15 blur-3xl" aria-hidden="true" />
      <div className={`container-x relative grid gap-12 py-14 sm:py-20 ${aside ? "lg:grid-cols-12 lg:items-center" : ""}`}>
        <div className={aside ? "lg:col-span-7" : "max-w-4xl"}>
          <Breadcrumbs items={crumbs} />
          <span className="eyebrow-dark mt-6">{eyebrow}</span>
          <h1 className="mt-4 text-4xl leading-[1.05] font-extrabold text-white sm:text-5xl lg:text-6xl">{title}</h1>
          {answer && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{answer}</p>}
          {children}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
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
