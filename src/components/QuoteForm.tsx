"use client";

import { useEffect, useState } from "react";
import { services } from "@/lib/services";
import { site, telHref } from "@/lib/site";
import { Icon } from "./Icon";
import { track } from "./Tracked";

const ATTR_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

type Status = "idle" | "sending" | "done" | "error";

export function QuoteForm({ compact = false, defaultService = "", location = "form" }: { compact?: boolean; defaultService?: string; location?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [attr, setAttr] = useState<Record<string, string>>({});

  // Persist ad-click IDs + UTMs so a lead submitted pages later is still attributed.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stored = JSON.parse(localStorage.getItem("hv_attr") || "{}");
      for (const k of ATTR_KEYS) {
        const v = params.get(k);
        if (v) stored[k] = v;
      }
      if (!stored.landing_page) stored.landing_page = window.location.pathname;
      localStorage.setItem("hv_attr", JSON.stringify(stored));
      setAttr(stored);
    } catch {
      /* storage blocked — attribution is best-effort */
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...attr, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", { form_location: location, service: data.service });
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint-400/15 text-mint-500">
          <Icon name="check" className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-2xl font-extrabold text-navy-950">Request received!</h3>
        <p className="mt-2 text-slate-600">We&apos;ll call you shortly with your quote. Need it faster?</p>
        <a href={telHref} onClick={() => track("phone_click", { cta_location: `${location}_success` })} className="btn-navy mt-6">
          <Icon name="phone" className="h-4 w-4" /> Call {site.phone}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card relative p-6 sm:p-8" aria-label="Request a free appraisal quote">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest text-gold-600 uppercase">Free · No obligation</p>
          <h2 className="mt-1 text-2xl font-extrabold text-navy-950">Get your appraisal quote</h2>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-mint-400/15 px-3 py-1 text-xs font-bold text-mint-500 sm:inline-flex">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-mint-500" /></span>
          Replying today
        </span>
      </div>

      <div className={`mt-6 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label className="sr-only" htmlFor={`${location}-name`}>Full name</label>
        <input id={`${location}-name`} name="name" required autoComplete="name" placeholder="Full name" className="input" />
        <label className="sr-only" htmlFor={`${location}-phone`}>Phone</label>
        <input id={`${location}-phone`} name="phone" required type="tel" autoComplete="tel" placeholder="Phone" className="input" />
        {!compact && (
          <>
            <label className="sr-only" htmlFor={`${location}-email`}>Email</label>
            <input id={`${location}-email`} name="email" type="email" autoComplete="email" placeholder="Email (optional)" className="input" />
          </>
        )}
        <label className="sr-only" htmlFor={`${location}-address`}>Property address or city</label>
        <input id={`${location}-address`} name="address" required autoComplete="street-address" placeholder="Property address or city" className="input" />
        <label className="sr-only" htmlFor={`${location}-service`}>Appraisal purpose</label>
        <select id={`${location}-service`} name="service" defaultValue={defaultService} required className={`input ${compact ? "" : "sm:col-span-2"}`}>
          <option value="" disabled>What is the appraisal for?</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
          <option value="Other">Other / not sure</option>
        </select>
        {!compact && (
          <>
            <label className="sr-only" htmlFor={`${location}-message`}>Details</label>
            <textarea id={`${location}-message`} name="message" rows={3} placeholder="Property type, deadline, anything else (optional)" className="input sm:col-span-2" />
          </>
        )}
        {/* Honeypot — bots fill it, humans never see it */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </div>

      <button type="submit" disabled={status === "sending"} className="btn-gold mt-5 w-full text-lg disabled:opacity-70">
        {status === "sending" ? "Sending…" : "Get My Free Quote"} <Icon name="arrow" className="h-5 w-5" />
      </button>
      {status === "error" && (
        <p className="mt-3 text-sm font-semibold text-red-600" role="alert">
          Something went wrong. Please call <a className="underline" href={telHref}>{site.phone}</a>.
        </p>
      )}
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Icon name="shield" className="h-4 w-4" /> Your details are private and never shared.
      </p>
    </form>
  );
}
