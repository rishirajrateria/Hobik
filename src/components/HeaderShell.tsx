"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Floating glass header that tightens up once the page scrolls. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // close the mobile menu on navigation
  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>("header details[open]").forEach((d) => (d.open = false));
  }, [path]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "pt-2" : "pt-3 sm:pt-4"}`}>
      <div className="container-x">
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl px-3 ring-1 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 sm:px-4 ${
            scrolled
              ? "h-14 bg-navy-950/75 shadow-[0_18px_40px_-18px_rgba(5,13,31,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] ring-white/10 lg:h-16"
              : "h-16 bg-white/[0.06] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] ring-white/12 lg:h-[72px]"
          }`}
        >
          {children}
        </div>
      </div>
    </header>
  );
}
