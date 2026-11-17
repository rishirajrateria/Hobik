"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Quiet scroll reveal: [data-reveal] elements fade up once as they enter the viewport.
 * Skipped entirely for visitors who prefer reduced motion.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("motion");
      return;
    }
    root.classList.add("motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el);
          // Hand control back to the element's own hover transitions once revealed.
          const d = Number(getComputedStyle(el).getPropertyValue("--d")) || 0;
          setTimeout(() => {
            el.removeAttribute("data-reveal");
            el.classList.remove("is-in");
          }, 800 + d * 70);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    const scan = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
