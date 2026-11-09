import { Logo, MobileCtaBar } from "@/components/Layout";
import { PublicChrome } from "@/components/PublicChrome";
import { Icon } from "@/components/Icon";
import { CallLink } from "@/components/Tracked";
import { site, telHref } from "@/lib/site";

/** Distraction-free layout for paid-traffic landing pages: no nav, call + form only. */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicChrome />
      <header className="fixed inset-x-0 top-0 z-50 pt-3">
        <div className="container-x"><div className="flex h-16 items-center justify-between rounded-2xl bg-navy-950/60 px-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/10 backdrop-blur-2xl sm:px-4">
          <Logo light />
          <CallLink href={telHref} location="lp_header" className="btn-gold !px-5 !py-2.5 text-sm">
            <Icon name="phone" className="h-4 w-4" /> <span className="hidden sm:inline">Call</span> {site.phone}
          </CallLink>
        </div></div>
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
