import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { FormBuilder } from "@/components/dash/FormBuilder";
import { ConfirmButton } from "@/components/dash/Confirm";
import { Badge, btnDanger } from "@/components/dash/ui";
import { deleteForm } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("forms:write");
  const { id } = await params;
  const [f] = await db.select().from(forms).where(eq(forms.id, id));
  if (!f) notFound();

  return (
    <div className="space-y-6">
      <Link href="/dashboard/forms" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-navy-900">← All forms</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">{f.name}</h1>
          {f.isPrimary && <Badge tone="amber">★ Primary · shown in every quote box</Badge>}
        </div>
        {!f.isPrimary && (
          <form action={deleteForm.bind(null, f.id)}>
            <ConfirmButton message="Delete this form? Past leads are kept." className={btnDanger}>Delete form</ConfirmButton>
          </form>
        )}
      </div>
      <FormBuilder
        isPrimary={f.isPrimary}
        initial={{ id: f.id, slug: f.slug, name: f.name, title: f.title, subtitle: f.subtitle, submitLabel: f.submitLabel, successTitle: f.successTitle, successMessage: f.successMessage, style: f.style, fields: f.fields, published: f.published }}
      />
    </div>
  );
}
