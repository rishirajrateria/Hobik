"use client";

import { useState, useTransition } from "react";
import { FIELD_TYPES, type FieldType, type FormField } from "@/db/constants";
import type { FormConfig } from "@/lib/defaultForms";
import { saveForm, type FormPayload } from "@/app/dashboard/forms/actions";
import { DynamicForm } from "@/components/DynamicForm";
import { Icon } from "@/components/Icon";
import { btnGold, btnSecondary, inputCls, labelCls } from "./ui";

const TYPE_LABEL: Record<FieldType, string> = {
  text: "Short text", email: "Email", tel: "Phone", textarea: "Long text", select: "Dropdown", radio: "Single choice", checkbox: "Multiple choice", date: "Date", number: "Number",
};

const PRESETS: { label: string; f: Omit<FormField, "id"> }[] = [
  { label: "Name", f: { key: "name", type: "text", label: "Full name", placeholder: "Full name", required: true, width: "half" } },
  { label: "Phone", f: { key: "phone", type: "tel", label: "Phone", placeholder: "Phone", required: true, width: "half" } },
  { label: "Email", f: { key: "email", type: "email", label: "Email", placeholder: "Email", required: false, width: "half" } },
  { label: "Address", f: { key: "address", type: "text", label: "Property address", placeholder: "Street address or city", required: true, width: "half" } },
  { label: "Property type", f: { key: "property_type", type: "radio", label: "Property type", required: false, options: ["Detached", "Semi-detached", "Townhouse", "Condo", "Multiplex"], width: "full" } },
  { label: "Deadline", f: { key: "deadline", type: "date", label: "When do you need the report?", required: false, width: "half" } },
  { label: "Message", f: { key: "message", type: "textarea", label: "Anything else?", placeholder: "Details (optional)", required: false, width: "full" } },
];

const uid = () => `q-${Math.random().toString(36).slice(2, 9)}`;
const keyify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40) || "question";

type Meta = Omit<FormPayload, "fields">;

export function FormBuilder({ initial, isPrimary }: { initial: FormConfig & { published: boolean }; isPrimary: boolean }) {
  const [meta, setMeta] = useState<Meta>({
    name: initial.name, slug: initial.slug, title: initial.title, subtitle: initial.subtitle, submitLabel: initial.submitLabel,
    successTitle: initial.successTitle, successMessage: initial.successMessage, style: initial.style, published: initial.published,
  });
  const [fields, setFields] = useState<FormField[]>(initial.fields);
  const [open, setOpen] = useState<string | null>(initial.fields[0]?.id ?? null);
  const [msg, setMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);

  const upd = (id: string, patch: Partial<FormField>) => { setDirty(true); setFields((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f))); };
  const move = (i: number, d: -1 | 1) => { setDirty(true); setFields((fs) => { const a = [...fs]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; }); };
  const remove = (id: string) => { setDirty(true); setFields((fs) => fs.filter((f) => f.id !== id)); };
  const add = (f: Omit<FormField, "id">) => {
    const used = new Set(fields.map((x) => x.key));
    let key = f.key, n = 2;
    while (used.has(key)) key = `${f.key}_${n++}`;
    const nf = { ...f, key, id: uid() };
    setDirty(true);
    setFields((fs) => [...fs, nf]);
    setOpen(nf.id);
  };
  const setM = (patch: Partial<Meta>) => { setDirty(true); setMeta((m) => ({ ...m, ...patch })); };

  function save() {
    setMsg(null);
    start(async () => {
      const r = await saveForm(initial.id, { ...meta, fields });
      if (r.error) setMsg({ text: r.error });
      else { setMsg({ ok: true, text: "Saved — live on the website." }); setDirty(false); }
    });
  }

  const previewCfg: FormConfig = { ...initial, ...meta, subtitle: meta.subtitle ?? null, fields };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
      <div className="space-y-6">
        {/* settings */}
        <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="font-bold text-navy-950">Form settings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls} htmlFor="fb-name">Internal name</label><input id="fb-name" className={inputCls} value={meta.name} onChange={(e) => setM({ name: e.target.value })} /></div>
            <div>
              <label className={labelCls} htmlFor="fb-slug">URL slug</label>
              <div className="flex items-center rounded-xl ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-600">
                <span className="pl-3 text-sm text-slate-400">/forms/</span>
                <input id="fb-slug" className="w-full rounded-xl border-0 bg-transparent px-1 py-2.5 text-sm focus:outline-none" value={meta.slug} onChange={(e) => setM({ slug: e.target.value })} />
              </div>
            </div>
            <div><label className={labelCls} htmlFor="fb-title">Heading</label><input id="fb-title" className={inputCls} value={meta.title} onChange={(e) => setM({ title: e.target.value })} /></div>
            <div><label className={labelCls} htmlFor="fb-sub">Small label above heading</label><input id="fb-sub" className={inputCls} value={meta.subtitle ?? ""} onChange={(e) => setM({ subtitle: e.target.value || null })} /></div>
            <div><label className={labelCls} htmlFor="fb-btn">Button text</label><input id="fb-btn" className={inputCls} value={meta.submitLabel} onChange={(e) => setM({ submitLabel: e.target.value })} /></div>
            <div>
              <span className={labelCls}>Layout</span>
              <div className="grid grid-cols-2 gap-2">
                {(["card", "steps"] as const).map((s) => (
                  <button type="button" key={s} onClick={() => setM({ style: s })} className={`rounded-xl px-3 py-2.5 text-sm font-bold ring-1 ${meta.style === s ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-slate-600 ring-slate-200"}`}>
                    {s === "card" ? "All on one card" : "One step at a time"}
                  </button>
                ))}
              </div>
            </div>
            <div><label className={labelCls} htmlFor="fb-st">Thank-you heading</label><input id="fb-st" className={inputCls} value={meta.successTitle} onChange={(e) => setM({ successTitle: e.target.value })} /></div>
            <div><label className={labelCls} htmlFor="fb-sm">Thank-you message</label><input id="fb-sm" className={inputCls} value={meta.successMessage} onChange={(e) => setM({ successMessage: e.target.value })} /></div>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" className="h-4 w-4 accent-navy-900" checked={meta.published} disabled={isPrimary} onChange={(e) => setM({ published: e.target.checked })} />
            Published {isPrimary && <span className="text-xs font-normal text-slate-400">(primary form is always live)</span>}
          </label>
        </section>

        {/* questions */}
        <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-navy-950">Questions <span className="text-slate-400">({fields.length})</span></h2>
          </div>
          <ol className="mt-4 space-y-2">
            {fields.map((f, i) => {
              const isOpen = open === f.id;
              return (
                <li key={f.id} className={`rounded-xl ring-1 ${isOpen ? "ring-2 ring-blue-600" : "ring-slate-200"}`}>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">{i + 1}</span>
                    <button type="button" onClick={() => setOpen(isOpen ? null : f.id)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-bold text-navy-950">{f.label || "Untitled question"}{f.required && <span className="text-gold-600"> *</span>}</span>
                      <span className="block text-xs text-slate-400">{TYPE_LABEL[f.type]} · {f.key}</span>
                    </button>
                    <button type="button" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30"><Icon name="up" className="h-4 w-4" /></button>
                    <button type="button" aria-label="Move down" onClick={() => move(i, 1)} disabled={i === fields.length - 1} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30"><Icon name="down" className="h-4 w-4" /></button>
                    <button type="button" aria-label="Delete question" onClick={() => remove(f.id)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Icon name="trash" className="h-4 w-4" /></button>
                  </div>
                  {isOpen && (
                    <div className="grid gap-4 border-t border-slate-100 p-4 sm:grid-cols-2">
                      <div className="sm:col-span-2"><label className={labelCls} htmlFor={`${f.id}-l`}>Question</label><input id={`${f.id}-l`} className={inputCls} value={f.label} onChange={(e) => upd(f.id, { label: e.target.value })} /></div>
                      <div>
                        <label className={labelCls} htmlFor={`${f.id}-t`}>Answer type</label>
                        <select id={`${f.id}-t`} className={inputCls} value={f.type} onChange={(e) => {
                          const type = e.target.value as FieldType;
                          upd(f.id, { type, options: ["select", "radio", "checkbox"].includes(type) ? f.options?.length ? f.options : ["Option 1", "Option 2"] : undefined });
                        }}>
                          {FIELD_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls} htmlFor={`${f.id}-k`}>Key <span className="font-normal normal-case">(name, phone, email, service map to lead columns)</span></label>
                        <input id={`${f.id}-k`} className={`${inputCls} font-mono`} value={f.key} onChange={(e) => upd(f.id, { key: keyify(e.target.value) })} />
                      </div>
                      {!["radio", "checkbox"].includes(f.type) && (
                        <div><label className={labelCls} htmlFor={`${f.id}-p`}>Placeholder</label><input id={`${f.id}-p`} className={inputCls} value={f.placeholder ?? ""} onChange={(e) => upd(f.id, { placeholder: e.target.value || undefined })} /></div>
                      )}
                      <div><label className={labelCls} htmlFor={`${f.id}-h`}>Help text</label><input id={`${f.id}-h`} className={inputCls} value={f.help ?? ""} onChange={(e) => upd(f.id, { help: e.target.value || undefined })} /></div>
                      {["select", "radio", "checkbox"].includes(f.type) && (
                        <div className="sm:col-span-2">
                          <label className={labelCls} htmlFor={`${f.id}-o`}>Options (one per line)</label>
                          <textarea id={`${f.id}-o`} rows={5} className={inputCls} value={(f.options ?? []).join("\n")} onChange={(e) => upd(f.id, { options: e.target.value.split("\n") })} onBlur={(e) => upd(f.id, { options: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} />
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" className="h-4 w-4 accent-navy-900" checked={f.required} onChange={(e) => upd(f.id, { required: e.target.checked })} /> Required</label>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" className="h-4 w-4 accent-navy-900" checked={f.width === "half"} onChange={(e) => upd(f.id, { width: e.target.checked ? "half" : "full" })} /> Half width (side by side)</label>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Add a question</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button type="button" key={p.label} onClick={() => add(p.f)} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy-900 ring-1 ring-slate-200 hover:ring-navy-700">+ {p.label}</button>
              ))}
              {(["text", "radio", "select", "checkbox", "textarea"] as FieldType[]).map((t) => (
                <button type="button" key={t} onClick={() => add({ key: "question", type: t, label: "New question", required: false, width: "full", ...(["select", "radio", "checkbox"].includes(t) ? { options: ["Option 1", "Option 2"] } : {}) })} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-200 hover:ring-blue-600">
                  + {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* preview + save */}
      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <span className="pl-2 text-sm font-semibold text-slate-500">{msg ? <span className={msg.ok ? "text-emerald-700" : "text-rose-700"}>{msg.text}</span> : dirty ? "Unsaved changes" : "All changes saved"}</span>
          <div className="flex gap-2">
            <button type="button" className={btnSecondary} onClick={() => { setFields(initial.fields); setDirty(false); setMsg(null); }} disabled={!dirty || pending}>Reset</button>
            <button type="button" className={btnGold} onClick={save} disabled={pending}>{pending ? "Saving…" : "Save & publish"}</button>
          </div>
        </div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase"><Icon name="eye" className="h-4 w-4" /> Live preview</p>
        <div className="rounded-3xl bg-navy-950 p-4 sm:p-6">
          <DynamicForm key={JSON.stringify(previewCfg)} form={previewCfg} location="preview" preview />
        </div>
      </div>
    </div>
  );
}
