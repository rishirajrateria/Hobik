import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { services } from "@/lib/services";
import { areas, type Area } from "@/lib/areas";
import { breadcrumbSchema } from "@/lib/schema";
import { Icon } from "./Icon";
import { CallLink, CtaLink } from "./Tracked";
import { Vignette, drawable } from "./Vignettes";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const HQ = { x: 55, y: 48 };

/* ------------------------------------------------------------------ */
/* Hero: elevation drawing of a Toronto bay-and-gable house             */
/* ------------------------------------------------------------------ */
export function HeroVisual() {
  const ink = "var(--color-ink-950)";
  const brick = "var(--color-brick-500)";
  const pane = "var(--color-lake)";
  return (
    <figure className="relative mx-auto w-full max-w-[520px]">
      <svg viewBox="0 0 400 450" className="w-full" role="img" aria-label="Line drawing of a Toronto bay-and-gable house with survey dimensions" data-draw-svg style={{ "--base": "0.25s" } as React.CSSProperties}>
        {drawable(
          <>
        <g fill="none" stroke={ink} strokeWidth="1.4" strokeLinejoin="round">
          {/* ground */}
          <path d="M30 400h340" strokeWidth="1.8" />
          {/* walls */}
          <path d="M84 196v204M316 196v204" />
          {/* steep gable roof + eaves */}
          <path d="M66 204 200 66l134 138" strokeWidth="1.8" />
          <path d="M84 196 200 82l116 114" />
          {/* bargeboard trim */}
          <path d="M104 186 200 92l96 94" strokeDasharray="2 5" />
          {/* attic window */}
          <path d="M186 160v-22a14 14 0 0 1 28 0v22z" fill={pane} />
          <path d="M200 124v36" />
          {/* two-storey bay (left) */}
          <path d="M96 400V226l14-14h70l14 14v174" fill="var(--color-paper-50)" />
          <path d="M110 212v188M180 212v188" />
          <path d="M96 314h98" />
          {[232, 330].map((y) => (
            <g key={y}>
              <rect x="99" y={y} width="9" height="58" fill={pane} />
              <rect x="117" y={y} width="56" height="62" fill={pane} />
              <path d={`M145 ${y}v62M117 ${y + 30}h56`} />
              <rect x="182" y={y} width="9" height="58" fill={pane} />
            </g>
          ))}
          <path d="M92 226h106" strokeWidth="1.8" />
          {/* upper window (right) */}
          <rect x="226" y="222" width="62" height="64" fill={pane} />
          <path d="M257 222v64M226 254h62" />
          <path d="M220 218h74" strokeWidth="1.8" />
          {/* porch roof + posts */}
          <path d="M208 312h100l-10-14h-80z" fill="var(--color-paper-50)" />
          <path d="M214 312v88M302 312v88" />
          {/* door + transom */}
          <rect x="236" y="328" width="44" height="72" />
          <path d="M236 340h44" />
          <circle cx="272" cy="366" r="1.8" fill={ink} />
          {/* steps */}
          <path d="M226 400v-6h64v6M232 394v-6h52v6" />
          {/* brick coursing hints */}
          <g stroke={brick} strokeWidth="1" opacity="0.55">
            <path d="M296 340h14M300 350h12M296 360h14M300 370h12M296 380h14M88 250h6M88 262h6M88 274h6" />
          </g>
        </g>
        {/* survey dimensions */}
        <g stroke={brick} strokeWidth="1" fill="none">
          <path d="M84 424h232M84 418v12M316 418v12" />
          <path d="M352 66v334M346 66h12M346 400h12" />
        </g>
        <g fill={brick} fontFamily="var(--font-sans)" fontSize="10" fontWeight="600" letterSpacing="1.6">
          <text x="200" y="442" textAnchor="middle">FRONTAGE</text>
          <text x="368" y="233" textAnchor="middle" transform="rotate(90 368 233)">HEIGHT · 2½ STOREYS</text>
        </g>
          </>,
          0.035,
          1.4,
        )}
      </svg>

      {/* report excerpt */}
      <div className="hv-float-in absolute bottom-10 -left-2 w-[230px] border border-ink-950 bg-paper-50 text-[13px] sm:-left-8">
        <div className="flex items-center justify-between border-b border-ink-950 px-4 py-2">
          <span className="font-semibold tracking-[0.12em] uppercase">Appraisal summary</span>
          <span className="text-[11px] text-ink-700">Sample</span>
        </div>
        <dl className="divide-y divide-ink-100 px-4">
          <div className="flex justify-between py-2"><dt className="text-ink-700">Comparables</dt><dd className="font-semibold">6 sales</dd></div>
          <div className="flex justify-between py-2"><dt className="text-ink-700">Effective date</dt><dd className="font-semibold">Any date</dd></div>
          <div className="py-2.5">
            <dt className="text-ink-700">Market value</dt>
            <dd className="font-display text-[28px] leading-tight font-medium text-ink-950">$1,248,000</dd>
          </div>
        </dl>
      </div>
      <figcaption className="mt-3 text-right text-[12px] text-ink-700 italic">Bay-and-gable house, a Toronto staple since the 1870s.</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/** Four facts, each a drawing + one big figure + a short label. */
export function TrustStrip() {
  const items = [
    ["seal", "AIC", "Certified members"],
    ["clock", "48–72h", "Typical delivery"],
    ["past", "Any date", "Current or past values"],
    ["pin", "20+", "GTA cities served"],
  ];
  return (
    <div className="border-y border-ink-950">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map(([icon, v, l], i) => (
          <div key={l} className={`flex items-center gap-4 py-6 ${i % 2 ? "border-l border-ink-100 pl-4 sm:pl-6" : ""} ${i === 2 ? "lg:border-l lg:border-ink-100 lg:pl-6" : ""} ${i > 1 ? "border-t border-ink-100 lg:border-t-0" : ""}`}>
            <Vignette name={icon} delay={i * 0.15} className="h-14 w-[74px] shrink-0 sm:h-16 sm:w-[84px]" />
            <div className="flex flex-col-reverse">
              <dt className="text-[13px] text-ink-700">{l}</dt>
              <dd className="font-display text-[26px] leading-none font-medium text-ink-950 sm:text-[30px]">{v}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Key facts as a simple definition list. */
export function StatsBand({ dark = false }: { dark?: boolean }) {
  const stats = [
    [site.yearsExperience, "years appraising homes"],
    ["20+", "GTA cities and towns served"],
    [site.turnaround, "typical report delivery"],
    ["10", "types of appraisal"],
  ];
  return (
    <dl className={`grid grid-cols-2 gap-px lg:grid-cols-4 ${dark ? "bg-white/15" : "bg-ink-100"}`}>
      {stats.map(([v, l]) => (
        <div key={l} className={`flex flex-col-reverse p-6 ${dark ? "bg-ink-950" : "bg-paper"}`}>
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

/** Services as illustrated tiles: a drawing and a name. */
export function ServiceGrid({ citySuffix }: { citySuffix?: string }) {
  return (
    <ul className="grid grid-cols-2 border-t border-l border-ink-100 sm:grid-cols-3 lg:grid-cols-5">
      {services.map((s, i) => (
        <li key={s.slug} className="border-r border-b border-ink-100" data-reveal style={{ "--d": i % 5 } as React.CSSProperties}>
          <Link href={`/services/${s.slug}`} className="group flex h-full flex-col bg-paper p-4 transition-colors duration-300 hover:bg-paper-50 sm:p-5">
            <Vignette name={s.icon} delay={(i % 5) * 0.12} className="w-full transition-transform duration-500 group-hover:-translate-y-1" />
            <span className="mt-3 flex items-start justify-between gap-2">
              <span className="font-display text-[17px] leading-snug font-medium text-ink-950 sm:text-[18px]">
                {s.name.replace(" Appraisal", "")}{citySuffix ? <span className="sr-only"> appraisal in {citySuffix}</span> : <span className="sr-only"> appraisal</span>}
              </span>
              <Icon name="arrow" className="mt-1 h-4 w-4 shrink-0 text-brick-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
export function Process() {
  const steps = [
    { icon: "phone", t: "Ask for a quote" },
    { icon: "calendar", t: "Book a visit" },
    { icon: "measure", t: "We inspect" },
    { icon: "report", t: `Report in ${site.turnaround.replace(" hours", "h")}` },
  ];
  return (
    <ol className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.t} data-reveal style={{ "--d": i } as React.CSSProperties} className="relative">
          <Vignette name={s.icon} delay={i * 0.3} className="w-full max-w-[220px]" />
          <div className="mt-3 flex items-baseline gap-3 border-t border-ink-950 pt-3">
            <span className="font-display text-[28px] leading-none text-brick-500">{i + 1}</span>
            <h3 className="text-[20px] font-medium text-ink-950">{s.t}</h3>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Service-area map, drawn like a plan                                  */
/* ------------------------------------------------------------------ */
export function AreaMap({ highlight }: { highlight?: string }) {
  return (
    <figure className="border border-ink-100 bg-paper-50">
      <svg viewBox="-28 8 156 92" className="block aspect-[4/3] w-full sm:aspect-[17/10]" role="img" aria-label="Map of the Greater Toronto Area showing the cities we serve" data-draw-svg>
        {drawable(
          <>
        <path d="M-30 84 C-16 78 -6 72 0 78 C15 74 22 92 35 76 C45 66 55 70 70 60 C80 54 90 50 100 44 C110 40 120 37 130 34 V104 H-30Z" fill="var(--color-lake)" />
        <path d="M-30 84 C-16 78 -6 72 0 78 C15 74 22 92 35 76 C45 66 55 70 70 60 C80 54 90 50 100 44 C110 40 120 37 130 34" fill="none" stroke="var(--color-ink-700)" strokeWidth="0.25" />
        <text x="64" y="86" fontSize="2.6" fill="var(--color-ink-700)" letterSpacing="0.6" fontStyle="italic" fontFamily="var(--font-display)">Lake Ontario</text>
        {areas.map((a) => {
          const on = highlight === a.slug;
          return (
            <a key={a.slug} href={`/areas/${a.slug}`} aria-label={`Home appraisal in ${a.name}`} className="group">
              <circle cx={a.map.x} cy={a.map.y} r={on ? 1.5 : 0.9} fill={on ? "var(--color-brick-500)" : "var(--color-ink-950)"} className="transition-colors group-hover:fill-[var(--color-brick-500)]" />
              <text x={a.map.x + 1.8} y={a.map.y + 0.9} fontSize={on ? 2.8 : 2.2} fill={on ? "var(--color-brick-600)" : "var(--color-ink-800)"} fontWeight={on ? 600 : 400} className="transition-colors group-hover:fill-[var(--color-brick-600)]">
                {a.name}
              </text>
            </a>
          );
        })}
        <rect x={HQ.x - 1.4} y={HQ.y - 1.4} width="2.8" height="2.8" fill="none" stroke="var(--color-brick-500)" strokeWidth="0.4" />
          </>,
          0.06,
          1.4,
        )}
      </svg>
      <figcaption className="flex items-center justify-between border-t border-ink-100 px-4 py-2.5 text-[12px] text-ink-700">
        <span>Greater Toronto Area</span>
        <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 border border-brick-500" /> Office, North York</span>
      </figcaption>
    </figure>
  );
}

export function AreaChips({ exclude }: { exclude?: string }) {
  return (
    <ul className="columns-2 gap-8 sm:columns-3">
      {areas.filter((a) => a.slug !== exclude).map((a: Area) => (
        <li key={a.slug} className="break-inside-avoid border-b border-ink-100">
          <Link href={`/areas/${a.slug}`} className="group flex items-center justify-between py-2.5 text-[15px] text-ink-950">
            <span className="decoration-brick-500 underline-offset-4 group-hover:underline">{a.name}</span>
            <Icon name="arrow" className="h-3.5 w-3.5 text-ink-700 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/** "What's in a report": a drawn report page with numbered callouts (for dark sections). */
export function WhyUs() {
  const P = "var(--color-paper-50)";
  const I = "var(--color-ink-950)";
  const B = "var(--color-brick-500)";
  const L = "var(--color-lake)";
  const callouts: [number, number, string][] = [
    [100, 98, "Home inspected"],
    [196, 196, "Nearby sales"],
    [262, 240, "Adjustments"],
    [330, 318, "Market value"],
    [392, 392, "Signed & certified"],
  ];
  return (
    <svg viewBox="0 0 600 440" className="w-full" role="img" aria-label="Diagram of an appraisal report: inspection, comparable sales, adjustments, market value and signature" data-draw-svg>
      {drawable(
        <>
      <g stroke={I} strokeWidth="1.5" fill="none">
        <rect x="20" y="16" width="330" height="410" fill={P} stroke="none" />
        <text x="44" y="46" fill={I} stroke="none" fontSize="11" fontWeight="700" letterSpacing="2" fontFamily="var(--font-sans)">APPRAISAL REPORT</text>
        <path d="M44 56h282" />
        {/* subject */}
        <rect x="44" y="70" width="120" height="72" fill={L} />
        <path d="M76 132v-28l28-20 28 20v28" fill={P} />
        <rect x="96" y="114" width="16" height="18" fill={L} />
        <path d="M180 78h120M180 94h96M180 110h110M180 126h80" stroke="#c9c2b5" strokeWidth="5" />
        {/* comparables table */}
        <path d="M44 168h282M44 252h282" />
        {[184, 212, 240].map((y, i) => (
          <g key={y}>
            <rect x="44" y={y - 10} width="22" height="16" fill={L} />
            <path d={`M76 ${y - 2}h120`} stroke="#c9c2b5" strokeWidth="5" />
            <text x="320" y={y + 3} textAnchor="end" fill={B} stroke="none" fontSize="14" fontWeight="700" fontFamily="var(--font-sans)">{["+$12k", "−$8k", "+$4k"][i]}</text>
          </g>
        ))}
        {/* value */}
        <rect x="44" y="282" width="282" height="74" stroke={I} />
        <text x="60" y="306" fill="#4a505b" stroke="none" fontSize="12" fontFamily="var(--font-sans)">Market value</text>
        <text x="60" y="342" fill={I} stroke="none" fontSize="32" fontFamily="var(--font-display)">$1,248,000</text>
        {/* signature */}
        <path d="M44 398c18-14 30 8 46-6s22 2 34-4" />
        <path d="M44 406h130" />
        <circle cx="300" cy="392" r="18" fill={B} stroke={B} />
        <path d="M292 392l6 6 10-12" stroke={P} strokeWidth="2.2" />
      </g>
      {callouts.map(([yFrom, yTo, label], i) => (
        <g key={label}>
          <path d={`M350 ${yFrom}H376L392 ${yTo}H408`} stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
          <circle cx="420" cy={yTo} r="12" fill={B} />
          <text x="420" y={yTo + 4.5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)">{i + 1}</text>
          <text x="442" y={yTo + 6} fill="#f4f0e8" fontSize="20" fontFamily="var(--font-display)">{label}</text>
        </g>
      ))}
        </>,
        0.05,
        1.6,
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-ink-950" data-reveal>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-ink-100">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[19px] leading-snug font-medium text-ink-950">{f.q}</h3>
            <span className="relative mt-2 h-3 w-3 shrink-0" aria-hidden="true">
              <span className="absolute top-1/2 left-0 h-px w-3 bg-ink-950" />
              <span className="absolute top-0 left-1/2 h-3 w-px bg-ink-950 transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-ink-700">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function CtaBand({ title = "Need an appraisal? Get a firm quote today.", location = "cta_band" }: { title?: string; location?: string }) {
  return (
    <section className="bg-brick-500 text-white">
      <div className="container-x grid gap-8 py-16 lg:grid-cols-12 lg:items-end lg:py-20" data-reveal>
        <div className="lg:col-span-8">
          <h2 className="text-[34px] leading-[1.1] font-medium sm:text-[46px]">{title}</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
          <CtaLink href="/get-a-quote" location={location} className="btn bg-paper text-ink-950 hover:bg-white">Get a free quote</CtaLink>
          <CallLink href={telHref} location={location} className="btn-ghost">{site.phone}</CallLink>
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
    <section className="border-b border-ink-100">
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
      <CtaLink href="/get-a-quote" location={location} className="btn-primary px-6 py-3.5 text-base">Get a free quote <Icon name="arrow" className="h-4 w-4" /></CtaLink>
      <span className="text-[15px] text-ink-700">
        or call <CallLink href={telHref} location={location} className="font-semibold text-ink-950 underline decoration-ink-950/25 underline-offset-4 hover:decoration-brick-500">{site.phone}</CallLink>
      </span>
    </div>
  );
}
