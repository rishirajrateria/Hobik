"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Testimonial } from "@/db/schema";
import { saveTestimonial, type TState } from "@/app/dashboard/testimonials/actions";
import { Icon } from "@/components/Icon";
import { btnGold, btnSecondary, inputCls, labelCls } from "./ui";

export function TestimonialForm({ t, services }: { t?: Testimonial; services: string[] }) {
  const [state, action, pending] = useActionState<TState, FormData>(saveTestimonial.bind(null, t?.id ?? null), {});
  const [rating, setRating] = useState(t?.rating ?? 5);
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls} htmlFor="t-name">Client name *</label><input id="t-name" name="name" required defaultValue={t?.name} className={inputCls} placeholder="e.g. Priya S." /></div>
        <div><label className={labelCls} htmlFor="t-loc">Location</label><input id="t-loc" name="location" defaultValue={t?.location ?? ""} className={inputCls} placeholder="e.g. North York" /></div>
        <div><label className={labelCls} htmlFor="t-role">Role / title</label><input id="t-role" name="role" defaultValue={t?.role ?? ""} className={inputCls} placeholder="e.g. Estate executor, Family lawyer" /></div>
        <div>
          <label className={labelCls} htmlFor="t-svc">Service</label>
          <select id="t-svc" name="service" defaultValue={t?.service ?? ""} className={inputCls}>
            <option value="">— General —</option>
            {services.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div><label className={labelCls} htmlFor="t-src">Source</label><input id="t-src" name="source" defaultValue={t?.source ?? ""} className={inputCls} placeholder="e.g. Google" /></div>
        <div>
          <span className={labelCls}>Rating</span>
          <input type="hidden" name="rating" value={rating} />
          <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} role="radio" aria-checked={rating === n} aria-label={`${n} stars`} onClick={() => setRating(n)} className={n <= rating ? "text-gold-500" : "text-slate-200"}>
                <Icon name="star" className="h-7 w-7" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div><label className={labelCls} htmlFor="t-body">Testimonial *</label><textarea id="t-body" name="body" required rows={4} defaultValue={t?.body} className={inputCls} placeholder="Paste the client's words exactly." /></div>
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <select name="status" defaultValue={t?.status ?? "published"} className="rounded-lg border-0 py-1.5 pr-8 pl-2 text-sm ring-1 ring-slate-200">
            <option value="published">Show on website</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" name="featured" defaultChecked={t?.featured} className="h-4 w-4 accent-navy-900" /> Featured (shown first, highlighted)</label>
      </div>
      {state.error && <p className="text-sm font-semibold text-rose-700" role="alert">{state.error}</p>}
      <div className="flex gap-2">
        <button className={btnGold} disabled={pending}>{pending ? "Saving…" : t ? "Save changes" : "Add testimonial"}</button>
        {t && <Link href="/dashboard/testimonials" className={btnSecondary}>Cancel</Link>}
      </div>
      <p className="text-xs text-slate-400">Only publish genuine client reviews you have permission to use.</p>
    </form>
  );
}
