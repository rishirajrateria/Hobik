import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { propertyTypes, serviceLines } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Icon } from "./Icon";
import { CallLink, CtaLink } from "./Tracked";
import { HeaderShell } from "./HeaderShell";

/** Company logo: gold sun, house mark, name and slogan (dark text; light variant for black backgrounds). */
export function Logo({ light = false, className = "h-14 sm:h-[68px]" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light ? "/brand/value-trust-logo-light.png" : "/brand/value-trust-logo.png"} width={975} height={375} alt={site.name} className={`w-auto ${className}`} />
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
      <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="text-[15px] font-medium text-ink-800 underline-offset-[6px] transition-colors hover:text-ink-950 hover:underline">
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
        <details className="group relative lg:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-[3px] border border-ink-100 [&::-webkit-details-marker]:hidden" aria-label="Open menu">
            <Icon name="menu" className="h-5 w-5 group-open:hidden" />
            <Icon name="x" className="hidden h-5 w-5 group-open:block" />
          </summary>
          <div className="absolute right-0 mt-3 w-72 border border-ink-100 bg-paper-50 py-2 shadow-[0_20px_40px_-20px_rgba(21,24,29,0.45)]">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="block px-5 py-3 font-medium text-ink-950 hover:bg-ink-50">
                {n.label}
              </Link>
            ))}
            <div className="mx-5 mt-2 border-t border-ink-100 pt-3 pb-1">
              <CallLink href={telHref} location="mobile_menu" className="font-semibold text-accent-600">{site.phone}</CallLink>
            </div>
          </div>
        </details>
      </div>
    </HeaderShell>
  );
}

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-ink-950 bg-paper-50 pb-[env(safe-area-inset-bottom)] md:hidden">
      <CallLink href={telHref} location="mobile_bar" className="flex items-center justify-center gap-2 py-4 text-[15px] font-semibold text-ink-950">
        <Icon name="phone" className="h-4 w-4" /> Call
      </CallLink>
      <CtaLink href="/get-a-quote" location="mobile_bar" className="flex items-center justify-center gap-2 bg-accent-500 py-4 text-[15px] font-semibold text-ink-950">
        Request a quote
      </CtaLink>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const col = "text-[12px] font-semibold tracking-[0.16em] text-white/45 uppercase";
  return (
    <footer className="bg-ink-950 pb-20 text-[15px] text-white/70 md:pb-0">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light className="h-16" />
          <p className="mt-6 max-w-sm leading-relaxed">Real estate appraisal and advisory services for residential, multi-residential, commercial, industrial, agricultural and institutional properties in Southern Ontario.</p>
          <dl className="mt-8 space-y-3">
            <div><dt className="sr-only">Phone</dt><dd><CallLink href={telHref} location="footer" className="font-display text-2xl text-paper hover:text-accent-300">{site.phone}</CallLink></dd></div>
            <div><dt className="sr-only">Email</dt><dd><a href={`mailto:${site.email}`} className="hover:text-paper">{site.email}</a></dd></div>
            <div><dt className="sr-only">Address</dt><dd><address className="not-italic">{site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}</address></dd></div>
          </dl>
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
