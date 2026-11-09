import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { services } from "@/lib/services";
import { Icon } from "@/components/Icon";
import { Badge, Empty, PageHeader, Panel } from "@/components/dash/ui";
import { ConfirmButton } from "@/components/dash/Confirm";
import { TestimonialForm } from "@/components/dash/TestimonialForm";
import { deleteTestimonial, toggleTestimonial } from "./actions";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdmin({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireUser("testimonials:write");
  const sp = await searchParams;
  const list = await db.select().from(testimonials).orderBy(desc(testimonials.featured), desc(testimonials.createdAt));
  const editing = sp.edit ? list.find((t) => t.id === sp.edit) : undefined;
  const live = list.filter((t) => t.status === "published");
  const avg = live.length ? live.reduce((s, t) => s + t.rating, 0) / live.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" sub="Shown on the homepage, service pages, city pages and the Google Ads landing page." />
      {sp.saved && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">Saved — the website has been updated.</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-500">On website</p><p className="mt-1 font-display text-3xl font-extrabold">{live.length}</p></div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-500">Average rating</p><p className="mt-1 font-display text-3xl font-extrabold">{avg ? avg.toFixed(1) : "—"} <span className="text-gold-500">★</span></p></div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-500">Hidden</p><p className="mt-1 font-display text-3xl font-extrabold">{list.length - live.length}</p></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel title={editing ? `Edit: ${editing.name}` : "Add a testimonial"} className="xl:col-span-2 xl:self-start">
          <TestimonialForm key={editing?.id ?? "new"} t={editing} services={services.map((s) => s.name)} />
        </Panel>
        <Panel title="All testimonials" className="xl:col-span-3" pad={false}>
          {list.length ? (
            <ul className="divide-y divide-slate-100">
              {list.map((t) => (
                <li key={t.id} className={`p-5 ${editing?.id === t.id ? "bg-blue-50/60" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-navy-950">{t.name}</span>
                    <span className="text-gold-500" aria-label={`${t.rating} stars`}>{"★".repeat(t.rating)}<span className="text-slate-200">{"★".repeat(5 - t.rating)}</span></span>
                    {t.featured && <Badge tone="amber">Featured</Badge>}
                    <Badge tone={t.status === "published" ? "green" : "slate"}>{t.status === "published" ? "Live" : "Hidden"}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{[t.role, t.location, t.service, t.source && `via ${t.source}`].filter(Boolean).join(" · ")}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-700">“{t.body}”</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <Link href={`/dashboard/testimonials?edit=${t.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50">Edit</Link>
                    <form action={toggleTestimonial.bind(null, t.id, "status")}><button className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">{t.status === "published" ? "Hide" : "Show"}</button></form>
                    <form action={toggleTestimonial.bind(null, t.id, "featured")}><button className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">{t.featured ? "Unfeature" : "Feature"}</button></form>
                    <form action={deleteTestimonial.bind(null, t.id)}><ConfirmButton message="Delete this testimonial?" className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">Delete</ConfirmButton></form>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon="quote" title="No testimonials yet" sub="Add your first real client review — the testimonials section appears on the website automatically." />
          )}
        </Panel>
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-400"><Icon name="shield" className="h-4 w-4" /> The website section stays hidden until at least one testimonial is published.</p>
    </div>
  );
}
