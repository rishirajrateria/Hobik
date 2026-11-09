import { Logo, MobileCtaBar } from "@/components/Layout";
import { Icon } from "@/components/Icon";
import { CallLink } from "@/components/Tracked";
import { site, telHref } from "@/lib/site";

/** Distraction-free layout for paid-traffic landing pages: no nav, call + form only. */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-navy-100/70 bg-white/90 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between lg:h-20">
          <Logo />
          <CallLink href={telHref} location="lp_header" className="btn-navy !px-5 !py-2.5 text-sm">
            <Icon name="phone" className="h-4 w-4" /> <span className="hidden sm:inline">Call</span> {site.phone}
          </CallLink>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="bg-navy-950 pb-24 text-center text-xs text-white/60 md:pb-0">
        <div className="container-x py-8">
          © {new Date().getFullYear()} {site.legalName} · {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode} · {site.phone}
        </div>
      </footer>
      <MobileCtaBar />
    </>
  );
}
