"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push an event to GTM's dataLayer — wire Google Ads conversions to these in GTM. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/** tel: link that records a `phone_click` conversion event. */
export function CallLink({ location, ...props }: ComponentProps<"a"> & { location: string }) {
  return <a {...props} onClick={(e) => { track("phone_click", { cta_location: location }); props.onClick?.(e); }} />;
}

/** Internal link that records a `cta_click` event. */
export function CtaLink({ location, ...props }: ComponentProps<typeof Link> & { location: string }) {
  return <Link {...props} onClick={(e) => { track("cta_click", { cta_location: location }); props.onClick?.(e); }} />;
}
