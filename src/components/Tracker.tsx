"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ATTR_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const SESSION_MS = 30 * 60 * 1000;

function store(k: string, v?: string) {
  try {
    if (v === undefined) return localStorage.getItem(k);
    localStorage.setItem(k, v);
  } catch {
    /* storage blocked */
  }
  return null;
}

/** Stable anonymous IDs: visitor (long-lived) and session (30-min inactivity). */
export function ids() {
  let vid = store("hv_vid");
  if (!vid) store("hv_vid", (vid = crypto.randomUUID()));
  let sid = store("hv_sid");
  const last = Number(store("hv_sid_t") || 0);
  if (!sid || Date.now() - last > SESSION_MS) store("hv_sid", (sid = crypto.randomUUID()));
  store("hv_sid_t", String(Date.now()));
  return { vid: vid!, sid: sid! };
}

/** Ad-click IDs + UTMs captured on landing, persisted for lead attribution. */
export function attribution(): Record<string, string> {
  try {
    const params = new URLSearchParams(window.location.search);
    const stored = JSON.parse(store("hv_attr") || "{}");
    for (const k of ATTR_KEYS) {
      const v = params.get(k);
      if (v) stored[k] = v;
    }
    if (!stored.landing_page) stored.landing_page = window.location.pathname;
    if (!stored.referrer && document.referrer && !document.referrer.includes(window.location.host)) stored.referrer = document.referrer;
    store("hv_attr", JSON.stringify(stored));
    return stored;
  } catch {
    return {};
  }
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify({ ...payload, ...ids(), path: window.location.pathname });
  if (navigator.sendBeacon) navigator.sendBeacon("/api/t", new Blob([body], { type: "text/plain" }));
  else fetch("/api/t", { method: "POST", body, keepalive: true });
}

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    const a = attribution();
    const ref = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : "";
    send({ type: "pageview", referrer: ref, utm_source: a.utm_source, gclid: a.gclid });
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, summary");
      if (!el || el.closest("[data-no-track]")) return;
      const label = (el.dataset.label || el.getAttribute("aria-label") || el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 80);
      if (!label) return;
      send({ type: "click", label, location: el.dataset.cta || el.closest<HTMLElement>("[data-section]")?.dataset.section || null, href: el.getAttribute("href") });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
