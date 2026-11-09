import Link from "next/link";
import { count, desc } from "drizzle-orm";
import { db } from "@/db";
import { forms, leads } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { Icon } from "@/components/Icon";
import { Badge, PageHeader, btnPrimary, timeAgo } from "@/components/dash/ui";
import { createForm, makePrimary } from "./actions";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  await requireUser("forms:write");
  const [list, subs] = await Promise.all([
    db.select().from(forms).orderBy(desc(forms.isPrimary), desc(forms.updatedAt)),
    db.select({ formId: leads.formId, n: count() }).from(leads).groupBy(leads.formId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forms"
        sub="Choose the questions your website asks. The primary form appears in every quote box across the site."
        actions={<form action={createForm}><button className={btnPrimary}><Icon name="plus" className="h-4 w-4" /> New form</button></form>}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((f) => (
          <div key={f.id} className={`flex flex-col rounded-2xl bg-white p-5 ring-1 ${f.isPrimary ? "ring-2 ring-gold-400" : "ring-slate-200"}`}>
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 text-navy-800"><Icon name="form" className="h-5 w-5" /></span>
              <div className="flex flex-wrap justify-end gap-1.5">
                {f.isPrimary && <Badge tone="amber">★ Primary · site-wide</Badge>}
                <Badge tone={f.published ? "green" : "slate"}>{f.published ? "Live" : "Draft"}</Badge>
                <Badge tone="blue">{f.style === "steps" ? "Multi-step" : "Card"}</Badge>
              </div>
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-navy-950">{f.name}</h2>
            <p className="text-sm text-slate-500">{f.fields.length} questions · {subs.find((s) => s.formId === f.id)?.n ?? 0} submissions · edited {timeAgo(f.updatedAt)}</p>
            <p className="mt-3 truncate rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
              {f.slug === "book-appraisal" ? "/book-appraisal" : `/forms/${f.slug}`}{f.isPrimary ? " + all quote boxes" : ""}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 pt-1">
              <Link href={`/dashboard/forms/${f.id}`} className={btnPrimary}><Icon name="pencil" className="h-4 w-4" /> Edit questions</Link>
              {!f.isPrimary && (
                <form action={makePrimary.bind(null, f.id)}>
                  <button className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Make primary</button>
                </form>
              )}
              {f.published && <a href={f.slug === "book-appraisal" ? "/book-appraisal" : `/forms/${f.slug}`} target="_blank" className="rounded-xl px-3 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">View ↗</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
