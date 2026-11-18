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
    const targetOf = new WeakMap<Element, Element>();
    // Line drawings sketch themselves once, when they come into view.
    const drawIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = (targetOf.get(e.target) ?? e.target) as HTMLElement;
          el.classList.add("is-drawn");
          drawIo.unobserve(e.target);
          // Numbers inside the section count up as it appears.
          const nums = [el, ...el.querySelectorAll<Element>("[data-count]")].filter((n) => n.hasAttribute("data-count"));
          nums.forEach((n) => countUp(n, Number(n.getAttribute("data-count-delay")) || 300));
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
      document.querySelectorAll<Element>("[data-draw-svg]:not(.is-drawn), [data-anim-group]:not(.is-drawn)").forEach((el) => {
        // A fully clipped (wiped) drawing has no visible area, so watch its frame instead.
        const watched = el.getAttribute("data-anim") === "wipe" && el.parentElement ? el.parentElement : el;
        targetOf.set(watched, el);
        drawIo.observe(watched);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      drawIo.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

/** Counts the number inside an element up from zero (keeps any prefix/suffix, e.g. "$" or "+"). */
function countUp(el: Element, delay = 0) {
  const target = el.getAttribute("data-count") || el.textContent || "";
  const m = target.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!m) return;
  const [, pre, num, post] = m;
  const end = Number(num.replace(/,/g, ""));
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  const fmt = (v: number) => `${pre}${v.toLocaleString("en-CA", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${post}`;
  el.textContent = fmt(0);
  setTimeout(() => {
    const start = performance.now();
    const dur = 1200;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = fmt(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }, delay);
}
