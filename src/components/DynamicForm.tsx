"use client";

import { useMemo, useState } from "react";
import type { FormField } from "@/db/constants";
import type { FormConfig } from "@/lib/defaultForms";
import { site, telHref } from "@/lib/site";
import { Icon } from "./Icon";
import { track } from "./Tracked";
import { attribution, ids } from "./Tracker";

type Values = Record<string, string | string[]>;
type Status = "idle" | "sending" | "done" | "error";

/**
 * Renders any form built in the dashboard. `card` = classic form, `steps` = one
 * question per screen with big tap targets (great on mobile / for paid traffic).
 */
export function DynamicForm({
  form,
  location = "form",
  defaults = {},
  preview = false,
}: {
  form: FormConfig;
  location?: string;
  defaults?: Values;
  preview?: boolean;
}) {
  const [values, setValues] = useState<Values>(() => {
    const v: Values = {};
    for (const f of form.fields) {
      const d = defaults[f.key];
      if (typeof d === "string" && f.options && !f.options.includes(d)) continue;
      if (d !== undefined) v[f.key] = d;
    }
    return v;
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const uid = `${location}-${form.slug}`;

  const steps = useMemo(() => groupSteps(form.fields), [form.fields]);
  const set = (k: string, v: string | string[]) => setValues((p) => ({ ...p, [k]: v }));

  function missing(fields: FormField[]) {
    return fields.find((f) => f.required && !(Array.isArray(values[f.key]) ? (values[f.key] as string[]).length : String(values[f.key] ?? "").trim()));
  }

  async function submit() {
    const m = missing(form.fields);
    if (m) return setError(`Please complete: ${m.label}`);
    if (preview) return setStatus("done");
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: form.slug, values, attribution: attribution(), ...ids(), page: window.location.pathname, company: (document.getElementById(`${uid}-hp`) as HTMLInputElement | null)?.value }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Error");
      track("generate_lead", { form_location: location, form: form.slug, service: values.service });
      setStatus("done");
    } catch (e) {
      setError((e as Error).message === "Error" ? "" : (e as Error).message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="animate-fade-up border border-ink-950 bg-paper-50 p-8 text-ink-950" role="status">
        <span className="eyebrow !text-sage-500">Received</span>
        <h3 className="mt-4 text-[28px] leading-tight font-medium">{form.successTitle}</h3>
        <p className="mt-2 text-[16px] text-ink-700">{form.successMessage}</p>
        <a href={telHref} data-cta={`${location}_success`} onClick={() => track("phone_click", { cta_location: `${location}_success` })} className="btn-ink mt-6">
          <Icon name="phone" className="h-4 w-4" /> Call {site.phone}
        </a>
        {preview && <button type="button" onClick={() => setStatus("idle")} className="mt-4 block text-sm font-semibold text-ink-700 underline">Reset preview</button>}
      </div>
    );
  }

  const header = (
    <div className="flex items-center justify-between gap-3">
      <div>
        {form.subtitle && <p className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">{form.subtitle}</p>}
        <h2 className="mt-2 text-[28px] leading-tight font-medium text-ink-950">{form.title}</h2>
      </div>
    </div>
  );
  const footer = (
    <>
      {(status === "error" || error) && (
        <p className="mt-3 text-sm font-semibold text-red-600" role="alert">
          {error || <>Something went wrong. Please call <a className="underline" href={telHref}>{site.phone}</a>.</>}
        </p>
      )}
      <p className="mt-4 text-[13px] text-ink-700">Your details stay private. We only use them to reply to you.</p>
      <input id={`${uid}-hp`} type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    </>
  );

  /* ---------------- multi-step ---------------- */
  if (form.style === "steps") {
    const cur = steps[step] ?? [];
    const last = step === steps.length - 1;
    const next = () => {
      const m = missing(cur);
      if (m) return setError(`Please complete: ${m.label}`);
      setError("");
      if (last) submit();
      else setStep(step + 1);
    };
    return (
      <form onSubmit={(e) => { e.preventDefault(); next(); }} className="relative overflow-hidden border border-ink-950 bg-paper-50 p-6 text-ink-950 sm:p-8" aria-label={form.title} data-no-track={preview || undefined}>
        <div className="absolute inset-x-0 top-0 h-[3px] bg-ink-100">
          <div className="h-full bg-accent-500 transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between">
          {header}
          <span className="shrink-0 text-[13px] text-ink-700 tabular-nums">{step + 1} of {steps.length}</span>
        </div>
        <div key={step} className="mt-6 grid animate-fade-up gap-4 sm:grid-cols-2">
          {cur.map((f) => (
            <Field key={f.id} f={f} uid={uid} value={values[f.key]} onChange={(v) => {
              set(f.key, v);
              // single-choice question on its own step → auto-advance
              if (f.type === "radio" && cur.length === 1 && !last) setTimeout(() => { setError(""); setStep((s) => s + 1); }, 180);
            }} big />
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          {step > 0 && <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="btn-outline !px-5">Back</button>}
          <button type="submit" disabled={status === "sending"} className="btn-primary flex-1 text-lg disabled:opacity-70">
            {last ? (status === "sending" ? "Sending…" : form.submitLabel) : "Continue"} <Icon name="arrow" className="h-5 w-5" />
          </button>
        </div>
        {footer}
      </form>
    );
  }

  /* ---------------- single card ---------------- */
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="relative border border-ink-950 bg-paper-50 p-6 text-ink-950 sm:p-8" aria-label={form.title} data-no-track={preview || undefined}>
      {header}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {form.fields.map((f) => <Field key={f.id} f={f} uid={uid} value={values[f.key]} onChange={(v) => set(f.key, v)} />)}
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary mt-5 w-full text-lg disabled:opacity-70">
        {status === "sending" ? "Sending…" : form.submitLabel} <Icon name="arrow" className="h-5 w-5" />
      </button>
      {footer}
    </form>
  );
}

/** Choice questions get their own step; consecutive text inputs share one. */
function groupSteps(fields: FormField[]) {
  const out: FormField[][] = [];
  let buf: FormField[] = [];
  for (const f of fields) {
    if (["radio", "checkbox", "select", "textarea"].includes(f.type)) {
      if (buf.length) out.push(buf), (buf = []);
      out.push([f]);
    } else buf.push(f);
  }
  if (buf.length) out.push(buf);
  return out.length ? out : [[]];
}

function Field({ f, uid, value, onChange, big = false }: { f: FormField; uid: string; value: string | string[] | undefined; onChange: (v: string | string[]) => void; big?: boolean }) {
  const id = `${uid}-${f.key}`;
  const span = f.width === "full" || ["textarea", "radio", "checkbox"].includes(f.type) ? "sm:col-span-2" : "";
  const label = (
    <label htmlFor={id} className={big ? "mb-2 block font-display text-[20px] font-medium text-ink-950" : "mb-1.5 block text-[13px] font-semibold text-ink-800"}>
      {f.label}{f.required && big ? <span className="text-accent-600"> *</span> : null}
    </label>
  );
  const help = f.help ? <p className="mt-1 text-xs text-ink-700">{f.help}</p> : null;
  const str = typeof value === "string" ? value : "";

  if (f.type === "radio" || f.type === "checkbox") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <fieldset className={span}>
        <legend className={big ? "mb-3 font-display text-[20px] font-medium text-ink-950" : "mb-1.5 text-[13px] font-semibold text-ink-800"}>{f.label}{f.required && <span className="text-accent-600"> *</span>}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(f.options ?? []).map((o) => {
            const on = f.type === "radio" ? str === o : arr.includes(o);
            return (
              <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-[3px] border px-4 py-3 text-[15px] transition-colors ${on ? "border-ink-950 bg-white font-semibold text-ink-950" : "border-ink-100 bg-white text-ink-800 hover:border-ink-700"}`}>
                <input
                  type={f.type}
                  name={id}
                  value={o}
                  checked={on}
                  onChange={() => onChange(f.type === "radio" ? o : on ? arr.filter((x) => x !== o) : [...arr, o])}
                  className="h-4 w-4 accent-accent-500"
                />
                {o}
              </label>
            );
          })}
        </div>
        {help}
      </fieldset>
    );
  }
  if (f.type === "select") {
    return (
      <div className={span}>
        {label}
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)} className="input" required={f.required}>
          <option value="" disabled>Choose one</option>
          {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {help}
      </div>
    );
  }
  if (f.type === "textarea") {
    return (
      <div className={span}>
        {label}
        <textarea id={id} rows={3} value={str} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder && f.placeholder !== f.label ? f.placeholder : undefined} className="input" required={f.required} />
        {help}
      </div>
    );
  }
  const auto: Record<string, string> = { name: "name", email: "email", phone: "tel", address: "street-address" };
  return (
    <div className={span}>
      {label}
      <input
        id={id}
        type={f.type}
        value={str}
        onChange={(e) => onChange(e.target.value)}
        placeholder={f.placeholder && f.placeholder !== f.label ? f.placeholder : undefined}
        autoComplete={auto[f.key]}
        className="input"
        required={f.required}
      />
      {help}
    </div>
  );
}
