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
      <header className="sticky top-0 z-50 border-b border-ink-100 bg-paper">
        <div className="container-x"><div className="flex h-[72px] items-center justify-between">
          <Logo />
          <CallLink href={telHref} location="lp_header" className="btn-primary !px-4 !py-2.5 text-sm">
            <Icon name="phone" className="h-4 w-4" /> <span className="hidden sm:inline">Call</span> {site.phone}
          </CallLink>
        </div></div>
      </header>
      <main id="main">{children}</main>
      <footer className="dark-glow pb-24 text-center text-xs text-white/60 md:pb-0">
        <div className="container-x py-8">
          © {new Date().getFullYear()} {site.legalName} · {site.coverage} · {site.phone}
        </div>
      </footer>
      <MobileCtaBar />
    </>
  );
}
