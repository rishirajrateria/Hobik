import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { propertyTypes, serviceLines } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Icon } from "./Icon";
import { CallLink, CtaLink } from "./Tracked";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";
import { AicBadge } from "./Sections";

/** Header lockup: the logo mark with the company name as live, larger text. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3 sm:gap-4" aria-label={`${site.name} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light ? "/brand/value-trust-mark-light.png" : "/brand/value-trust-mark.png"} width={294} height={375} alt="" className="h-12 w-auto sm:h-[58px]" />
      <span className="leading-none">
        <span className={`block text-[24px] font-bold tracking-[-0.03em] sm:text-[30px] ${light ? "text-paper" : "text-ink-950"}`}>Value Trust</span>
        <span className={`mt-1.5 block text-[12px] font-semibold tracking-[0.18em] uppercase sm:text-[14px] ${light ? "text-white/60" : "text-ink-700"}`}>Appraisals Inc.</span>
      </span>
    </Link>
  );
}

const nav = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Coverage" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Articles" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <HeaderShell>
      <Logo />
      <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-[15px] font-medium text-ink-800 transition-colors hover:bg-white/70 hover:text-ink-950">
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-5">
        <CallLink href={telHref} location="header" className="hidden text-[15px] font-semibold text-ink-950 tabular-nums md:inline">
          {site.phone}
        </CallLink>
        <CtaLink href="/get-a-quote" location="header" className="btn-primary !hidden !px-4 !py-2.5 text-sm sm:!inline-flex">
          Request a quote
        </CtaLink>
        <MobileMenu nav={nav} />
      </div>
    </HeaderShell>
  );
}

export function MobileCtaBar() {
  return (
    <div className="lg fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 grid grid-cols-2 gap-1.5 !rounded-full p-1.5 md:hidden">
      <CallLink href={telHref} location="mobile_bar" className="flex items-center justify-center gap-2 rounded-full py-3 text-[15px] font-semibold text-ink-950">
        <Icon name="phone" className="h-4 w-4" /> Call
      </CallLink>
      <CtaLink href="/get-a-quote" location="mobile_bar" className="btn-primary !py-3 text-[15px]">
        Request a quote
      </CtaLink>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const col = "text-[12px] font-semibold tracking-[0.16em] text-white/45 uppercase";
  return (
    <footer className="dark-glow pb-28 text-[15px] text-white/70 md:pb-0">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm leading-relaxed">Real estate appraisal and advisory services for residential, multi-residential, commercial, industrial, agricultural and institutional properties in Southern Ontario.</p>
          <dl className="mt-8 space-y-3">
            <div><dt className="sr-only">Phone</dt><dd><CallLink href={telHref} location="footer" className="font-display text-2xl text-paper hover:text-accent-300">{site.phone}</CallLink></dd></div>
            <div><dt className="sr-only">Email</dt><dd><a href={`mailto:${site.email}`} className="hover:text-paper">{site.email}</a></dd></div>
            <div><dt className="sr-only">Coverage</dt><dd>{site.coverage}, case by case</dd></div>
          </dl>
          <div className="mt-8"><AicBadge className="w-[250px]" /></div>
        </div>
        <div className="lg:col-span-3">
          <h2 className={col}>Services</h2>
          <ul className="mt-5 space-y-2.5">
            {serviceLines.map((s) => (
              <li key={s.slug}><Link className="hover:text-paper" href={`/services/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
          <h2 className={`${col} mt-8`}>Property types</h2>
          <ul className="mt-5 space-y-2.5">
            {propertyTypes.map((s) => (
              <li key={s.slug}><Link className="hover:text-paper" href={`/services/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h2 className={col}>Coverage · GTHA</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {areas.map((a) => (
              <li key={a.slug}><Link className="hover:text-paper" href={`/areas/${a.slug}`}>{a.name}</Link></li>
            ))}
          </ul>
          <p className="mt-5 text-white/55">+ Southern Ontario, case by case</p>
        </div>
        <div className="lg:col-span-2">
          <h2 className={col}>Company</h2>
          <ul className="mt-5 space-y-2.5">
            {[["/about", "About"], ["/team", "Team"], ["/faq", "FAQ"], ["/blog", "Articles"], ["/pricing", "Fees"], ["/book-appraisal", "Book online"], ["/contact", "Contact"], ["/get-a-quote", "Request a quote"]].map(([h, l]) => (
              <li key={h}><Link className="hover:text-paper" href={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.legalName}</p>
          <p className="flex items-center gap-3">{site.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
