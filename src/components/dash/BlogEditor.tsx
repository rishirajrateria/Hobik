"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import { deletePost, savePost, type PostPayload } from "@/app/dashboard/blog/actions";
import { Icon } from "@/components/Icon";
import { btnDanger, btnGold, btnSecondary, inputCls, labelCls } from "./ui";

const ACCENT_SWATCH: Record<string, string> = { navy: "bg-navy-800", gold: "bg-gold-400", mint: "bg-mint-500", sky: "bg-sky-500", rose: "bg-rose-500" };

type Tool = { label: string; icon?: string; text?: string; wrap?: [string, string]; line?: string };
const TOOLS: Tool[] = [
  { label: "Heading", text: "H2", line: "## " },
  { label: "Sub-heading", text: "H3", line: "### " },
  { label: "Bold", text: "B", wrap: ["**", "**"] },
  { label: "Italic", text: "I", wrap: ["_", "_"] },
  { label: "Bullet list", text: "•", line: "- " },
  { label: "Numbered list", text: "1.", line: "1. " },
  { label: "Quote / quick answer", icon: "quote", line: "> " },
  { label: "Link", text: "🔗", wrap: ["[", "](https://)"] },
  { label: "Image", text: "🖼", wrap: ["![alt text](", ")"] },
];

export function BlogEditor({ id, initial, flash }: { id: string | null; initial: PostPayload; flash?: string }) {
  const router = useRouter();
  const [v, setV] = useState<PostPayload>(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [msg, setMsg] = useState<{ ok?: boolean; text: string } | null>(flash === "published" ? { ok: true, text: "Published — live on the website." } : flash === "draft" ? { ok: true, text: "Draft saved." } : null);
  const [pending, start] = useTransition();
  const ta = useRef<HTMLTextAreaElement>(null);
  const set = (p: Partial<PostPayload>) => setV((x) => ({ ...x, ...p }));

  const html = useMemo(() => (tab === "preview" ? (marked.parse(v.content, { async: false }) as string) : ""), [tab, v.content]);
  const words = v.content.split(/\s+/).filter(Boolean).length;
  const seoTitle = v.seoTitle || v.title || "Post title";
  const seoDesc = v.seoDescription || v.excerpt || "Your meta description appears here in Google results.";
  const slugPreview = (v.slug || v.title).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function apply(t: Tool) {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    let next = value, caret = b;
    if (t.wrap) {
      const sel = value.slice(a, b) || "text";
      next = value.slice(0, a) + t.wrap[0] + sel + t.wrap[1] + value.slice(b);
      caret = a + t.wrap[0].length + sel.length;
    } else if (t.line) {
      const ls = value.lastIndexOf("\n", a - 1) + 1;
      next = value.slice(0, ls) + t.line + value.slice(ls);
      caret = b + t.line.length;
    }
    set({ content: next });
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(caret, caret); });
  }

  function save(status?: "draft" | "published") {
    setMsg(null);
    // datetime-local is the editor's local time; send an absolute ISO timestamp.
    const payload = { ...v, status: status ?? v.status, publishAt: v.publishAt ? new Date(v.publishAt).toISOString() : undefined };
    start(async () => {
      const r = await savePost(id, payload);
      if (r.error) return setMsg({ text: r.error });
      setV((x) => ({ ...x, status: payload.status, slug: r.slug ?? x.slug }));
      setMsg({ ok: true, text: payload.status === "published" ? "Published — live on the website." : "Draft saved." });
      if (!id && r.id) router.replace(`/dashboard/blog/${r.id}?saved=${payload.status}`);
      else router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <input aria-label="Title" value={v.title} onChange={(e) => set({ title: e.target.value })} placeholder="Post title" className="w-full rounded-2xl border-0 bg-white px-5 py-4 font-display text-2xl font-extrabold text-navy-950 ring-1 ring-slate-200 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none sm:text-3xl" />
        <textarea aria-label="Excerpt" value={v.excerpt} onChange={(e) => set({ excerpt: e.target.value })} rows={2} placeholder="Short summary shown on cards and under the title (1–2 sentences)" className={inputCls} />

        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-3 py-2">
            <div className="mr-2 inline-flex rounded-lg bg-slate-100 p-0.5">
              {(["write", "preview"] as const).map((t) => (
                <button type="button" key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1 text-sm font-bold capitalize ${tab === t ? "bg-white text-navy-950 shadow-sm" : "text-slate-500"}`}>{t}</button>
              ))}
            </div>
            {tab === "write" && TOOLS.map((t) => (
              <button type="button" key={t.label} title={t.label} aria-label={t.label} onClick={() => apply(t)} className="grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-sm font-extrabold text-slate-600 hover:bg-slate-100">
                {t.icon ? <Icon name={t.icon} className="h-4 w-4" /> : t.text}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400">{words} words · {Math.max(1, Math.round(words / 220))} min read</span>
          </div>
          {tab === "write" ? (
            <textarea ref={ta} aria-label="Content (Markdown)" value={v.content} onChange={(e) => set({ content: e.target.value })} className="min-h-[520px] w-full resize-y border-0 p-5 font-mono text-[14px] leading-relaxed text-slate-800 focus:outline-none" />
          ) : (
            <div className="prose-hv min-h-[520px] p-6" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
        <p className="text-xs text-slate-400">Formatting uses Markdown. Tip: start with a 1–2 sentence direct answer in a quote block — Google snippets and AI assistants love it.</p>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${v.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${v.status === "published" ? "bg-emerald-500" : "bg-slate-400"}`} /> {v.status === "published" ? "Published" : "Draft"}
            </span>
            {v.status === "published" && id && <a href={`/blog/${slugPreview}`} target="_blank" className="text-sm font-bold text-blue-700">View ↗</a>}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" className={btnSecondary} disabled={pending} onClick={() => save("draft")}>{v.status === "published" ? "Unpublish" : "Save draft"}</button>
            <button type="button" className={btnGold} disabled={pending} onClick={() => save("published")}>{pending ? "Saving…" : v.status === "published" ? "Update" : "Publish"}</button>
          </div>
          {msg && <p className={`mt-3 text-sm font-semibold ${msg.ok ? "text-emerald-700" : "text-rose-700"}`} role="status">{msg.text}</p>}
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div>
            <label className={labelCls} htmlFor="be-slug">URL</label>
            <div className="flex items-center rounded-xl ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-600">
              <span className="pl-3 text-sm text-slate-400">/blog/</span>
              <input id="be-slug" value={v.slug} onChange={(e) => set({ slug: e.target.value })} placeholder={slugPreview || "auto-from-title"} className="w-full rounded-xl border-0 bg-transparent px-1 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="be-when">Publish date <span className="font-normal normal-case">(future = scheduled)</span></label>
            <input id="be-when" type="datetime-local" value={v.publishAt ?? ""} onChange={(e) => set({ publishAt: e.target.value })} className={inputCls} />
          </div>
          <div><label className={labelCls} htmlFor="be-tags">Tags (comma separated)</label><input id="be-tags" value={v.tags} onChange={(e) => set({ tags: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls} htmlFor="be-cover">Cover image URL (optional)</label><input id="be-cover" value={v.coverImage} onChange={(e) => set({ coverImage: e.target.value })} placeholder="https://…" className={inputCls} /></div>
          <div>
            <span className={labelCls}>Card colour (when no image)</span>
            <div className="flex gap-2">
              {Object.entries(ACCENT_SWATCH).map(([k, c]) => (
                <button type="button" key={k} aria-label={k} onClick={() => set({ accent: k as PostPayload["accent"] })} className={`h-8 w-8 rounded-full ${c} ${v.accent === k ? "ring-2 ring-blue-600 ring-offset-2" : ""}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-sm font-bold text-navy-950">Search & AI preview</p>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="truncate text-xs text-slate-500">homeappraisaltoronto.ca › blog › {slugPreview || "…"}</p>
            <p className="mt-0.5 line-clamp-1 text-[17px] text-[#1a0dab]">{seoTitle} | Home Value Inc.</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{seoDesc}</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="be-st">SEO title <span className={`font-normal ${(v.seoTitle || "").length > 60 ? "text-rose-600" : ""}`}>({(v.seoTitle || "").length}/60)</span></label>
            <input id="be-st" value={v.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} placeholder="Defaults to the post title" className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="be-sd">Meta description <span className={`font-normal ${(v.seoDescription || "").length > 160 ? "text-rose-600" : ""}`}>({(v.seoDescription || "").length}/160)</span></label>
            <textarea id="be-sd" rows={3} value={v.seoDescription} onChange={(e) => set({ seoDescription: e.target.value })} placeholder="Defaults to the summary" className={inputCls} />
          </div>
        </div>

        {id && (
          <form action={deletePost.bind(null, id)} onSubmit={(e) => { if (!confirm("Delete this post permanently?")) e.preventDefault(); }}>
            <button className={`${btnDanger} w-full`}><Icon name="trash" className="h-4 w-4" /> Delete post</button>
          </form>
        )}
      </aside>
    </div>
  );
}
