"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { site, telHref } from "@/lib/site";
import { propertyTypes } from "@/lib/services";
import { Icon } from "./Icon";
import { Vignette } from "./Vignettes";
import { CallLink, CtaLink } from "./Tracked";

/**
 * Full-screen glass menu for phones and tablets. Rendered in a portal on <body>, because the
 * header's backdrop-filter would otherwise trap a fixed-position overlay inside the header bar.
 */
export function MobileMenu({ nav }: { nav: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const path = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sheet = (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={`hv-menu fixed inset-0 z-[100] flex flex-col overflow-y-auto lg:hidden ${open ? "is-open" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div className="hv-menu-bg absolute inset-0 -z-10" aria-hidden="true">
        <span className="glow-round absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent-500/45 blur-3xl" />
        <span className="glow-round absolute bottom-10 -left-24 h-72 w-72 rounded-full bg-accent-300/40 blur-3xl" />
      </div>

      <div className="flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))]">
        <span className="font-display text-[15px] tracking-[0.2em] text-ink-700 uppercase">Menu</span>
        <button type="button" onClick={() => setOpen(false)} className="lg grid h-12 w-12 place-items-center !rounded-full" aria-label="Close menu">
          <Icon name="x" className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-3 px-5">
        <ul>
          {nav.map((n, i) => {
            const active = path === n.href || path.startsWith(`${n.href}/`);
            return (
              <li key={n.href} className="hv-menu-item" style={{ "--i": i } as React.CSSProperties}>
                <Link href={n.href} onClick={() => setOpen(false)} className="group flex items-center justify-between border-b border-ink-950/[0.07] py-2.5">
                  <span className="flex items-baseline gap-4">
                    <span className="w-6 text-[12px] font-semibold text-accent-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-display text-[28px] leading-none ${active ? "text-accent-600" : "text-ink-950"}`}>{n.label}</span>
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/80 bg-white/60 transition-transform group-active:scale-90">
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hv-menu-item mt-6" style={{ "--i": nav.length } as React.CSSProperties}>
        <p className="px-5 text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">What we appraise</p>
        <ul className="mt-3 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
          {propertyTypes.map((p) => (
            <li key={p.slug} className="snap-start">
              <Link href={`/services/${p.slug}`} onClick={() => setOpen(false)} className="lg flex w-[132px] flex-col items-start !rounded-[22px] p-3">
                {open && <Vignette name={p.icon} mode="pop" className="is-drawn w-full" />}
                <span className="mt-1.5 font-display text-[16px] text-ink-950">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hv-menu-item mt-auto px-5 pt-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))]" style={{ "--i": nav.length + 1 } as React.CSSProperties}>
        <div className="lg grid grid-cols-2 gap-2 !rounded-[26px] p-2">
          <CallLink href={telHref} location="mobile_menu" className="btn-outline !py-3.5"><Icon name="phone" className="h-4 w-4" /> Call</CallLink>
          <CtaLink href="/get-a-quote" location="mobile_menu" onClick={() => setOpen(false)} className="btn-primary !py-3.5">Request a quote</CtaLink>
        </div>
        <p className="mt-4 text-center text-[13px] text-ink-700">{site.phone} · {site.email}</p>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/60 lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <Icon name="menu" className="h-5 w-5" />
      </button>
      {mounted && createPortal(sheet, document.body)}
    </>
  );
}
