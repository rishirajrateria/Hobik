import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Icon } from "./Icon";
import { CallLink, CtaLink } from "./Tracked";
import { HeaderShell } from "./HeaderShell";
import { DarkAurora } from "./Ambient";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — home`}>
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 shadow-lg">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg font-extrabold ${light ? "text-white" : "text-navy-950"}`}>Home Value</span>
        <span className={`block text-[9px] sm:text-[11px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] uppercase whitespace-nowrap ${light ? "text-gold-300" : "text-gold-600"}`}>Appraisals · Toronto</span>
      </span>
    </Link>
  );
}

const nav = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <HeaderShell>
      <Logo light />
      <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="group relative rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
            {n.label}
            <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-gold-400 to-mint-400 transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <CallLink href={telHref} location="header" className="hidden items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 md:inline-flex">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-mint-500" /></span>
          {site.phone}
        </CallLink>
        <CtaLink href="/get-a-quote" location="header" className="btn-gold !hidden !px-5 !py-2.5 text-sm sm:!inline-flex">
          Free Quote
        </CtaLink>
        <details className="group relative lg:hidden">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15 [&::-webkit-details-marker]:hidden" aria-label="Open menu">
            <Icon name="menu" className="h-5 w-5 group-open:hidden" />
            <Icon name="x" className="hidden h-5 w-5 group-open:block" />
          </summary>
          <div className="glass absolute right-0 mt-4 w-72 origin-top-right animate-fade-up p-2">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center justify-between rounded-xl px-4 py-3 font-semibold text-navy-900 hover:bg-white">
                {n.label} <Icon name="arrow" className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
            <CallLink href={telHref} location="mobile_menu" className="btn-navy mt-2 w-full !py-3 text-sm"><Icon name="phone" className="h-4 w-4" /> {site.phone}</CallLink>
          </div>
        </details>
      </div>
    </HeaderShell>
  );
}

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-2 bottom-2 z-50 grid grid-cols-2 gap-2 rounded-2xl bg-navy-950/70 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_20px_50px_-15px_rgba(5,13,31,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/10 backdrop-blur-2xl backdrop-saturate-150 md:hidden">
      <CallLink href={telHref} location="mobile_bar" className="btn-ghost !py-3 text-sm">
        <Icon name="phone" className="h-4 w-4" /> Call Now
      </CallLink>
      <CtaLink href="/get-a-quote" location="mobile_bar" className="btn-gold !py-3 text-sm">
        Free Quote <Icon name="arrow" className="h-4 w-4" />
      </CtaLink>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy-950 pb-24 text-white/70 md:pb-0">
      <DarkAurora />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" aria-hidden="true" />
      <div className="container-x relative grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{site.description}</p>
          <div className="mt-6 space-y-3 text-sm">
            <CallLink href={telHref} location="footer" className="flex items-center gap-3 font-semibold text-white hover:text-gold-300">
              <Icon name="phone" className="h-5 w-5 text-gold-400" /> {site.phone}
            </CallLink>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-gold-300">
              <Icon name="mail" className="h-5 w-5 text-gold-400" /> {site.email}
            </a>
            <address className="flex items-start gap-3 not-italic">
              <Icon name="pin" className="h-5 w-5 shrink-0 text-gold-400" />
              {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}
            </address>
          </div>
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold tracking-widest text-white uppercase">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}><Link className="hover:text-gold-300" href={`/services/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold tracking-widest text-white uppercase">Service Areas</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {areas.map((a) => (
              <li key={a.slug}><Link className="hover:text-gold-300" href={`/areas/${a.slug}`}>{a.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold tracking-widest text-white uppercase">Company</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[["/about", "About"], ["/pricing", "Pricing"], ["/faq", "FAQ"], ["/blog", "Blog"], ["/book-appraisal", "Book Online"], ["/contact", "Contact"], ["/get-a-quote", "Get a Quote"]].map(([h, l]) => (
              <li key={h}><Link className="hover:text-gold-300" href={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <p>Residential appraisals in Toronto, the GTA &amp; Southern Ontario.</p>
        </div>
      </div>
    </footer>
  );
}
