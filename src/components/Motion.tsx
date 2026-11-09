"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One tiny client component that powers every subtle effect on the public site:
 *  - [data-reveal] / [data-draw]: fade/blur/slide in on scroll (IntersectionObserver)
 *  - .spotlight / [data-spot]: cursor-following glow via --mx/--my
 *  - [data-tilt]: gentle 3D tilt toward the pointer (fine pointers only)
 *  - [data-count]: numbers count up when they scroll into view
 * Everything is skipped for users who prefer reduced motion.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
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
          if (el.dataset.count !== undefined) countUp(el);
          io.unobserve(el);
          // Hand control back to the element's own hover transitions once revealed.
          if (el.hasAttribute("data-reveal")) {
            const d = Number(getComputedStyle(el).getPropertyValue("--d")) || 0;
            setTimeout(() => {
              el.removeAttribute("data-reveal");
              el.classList.remove("is-in");
            }, 1000 + d * 90);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.12 },
    );
    const scan = () => {
      // Auto-reveal glass cards that start below the fold (no flash for what's already visible).
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("main .card:not([data-auto]), main .glass-dark:not([data-auto])").forEach((el) => {
        el.dataset.auto = "1";
        if (el.hasAttribute("data-reveal") || el.parentElement?.closest("[data-reveal]") || el.getBoundingClientRect().top < vh) return;
        const idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.setProperty("--d", String(idx % 6));
        el.setAttribute("data-reveal", "");
      });
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in), [data-draw]:not(.is-in), [data-count]:not(.is-in)").forEach((el) => io.observe(el));
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Pointer-driven effects (rAF-throttled)
    let raf = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const ev = last!;
        const t = ev.target as HTMLElement | null;
        const spot = t?.closest?.<HTMLElement>(".spotlight, [data-spot]");
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${ev.clientX - r.left}px`);
          spot.style.setProperty("--my", `${ev.clientY - r.top}px`);
        }
        if (!fine) return;
        const tilt = t?.closest?.<HTMLElement>("[data-tilt]") ?? null;
        if (tilted && tilted !== tilt) tilted.style.transform = "";
        tilted = tilt;
        if (tilt) {
          const r = tilt.getBoundingClientRect();
          const x = (ev.clientX - r.left) / r.width - 0.5;
          const y = (ev.clientY - r.top) / r.height - 0.5;
          const max = Number(tilt.dataset.tilt) || 6;
          tilt.style.transform = `perspective(1200px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
        }
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}

function countUp(el: HTMLElement) {
  const target = el.dataset.count || el.textContent || "";
  const m = target.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!m) return;
  const [, pre, num, post] = m;
  const end = Number(num.replace(/,/g, ""));
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  const start = performance.now();
  const dur = 1400;
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${pre}${(end * eased).toLocaleString("en-CA", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${post}`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
