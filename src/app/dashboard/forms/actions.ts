"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { FIELD_TYPES, forms } from "@/db/schema";
import { assertCan } from "@/lib/auth";
import { defaultQuoteForm } from "@/lib/defaultForms";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const fieldSchema = z.object({
  id: z.string().min(1).max(40),
  key: z.string().trim().min(1).max(40).regex(/^[a-z0-9_]+$/, "Field keys use lowercase letters, numbers and _"),
  type: z.enum(FIELD_TYPES),
  label: z.string().trim().min(1, "Every question needs a label").max(160),
  placeholder: z.string().max(160).optional(),
  help: z.string().max(240).optional(),
  required: z.boolean(),
  options: z.array(z.string().trim().min(1).max(120)).max(40).optional(),
  width: z.enum(["full", "half"]),
});

const formSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(60).transform(slugify),
  title: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().max(160).nullable(),
  submitLabel: z.string().trim().min(1).max(40),
  successTitle: z.string().trim().min(1).max(80),
  successMessage: z.string().trim().min(1).max(300),
  style: z.enum(["card", "steps"]),
  published: z.boolean(),
  fields: z.array(fieldSchema).min(1, "Add at least one question").max(40),
});
export type FormPayload = z.input<typeof formSchema>;

export async function saveForm(id: string, payload: FormPayload): Promise<{ ok?: true; error?: string }> {
  await assertCan("forms:write");
  const parsed = formSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  const keys = d.fields.map((f) => f.key);
  if (new Set(keys).size !== keys.length) return { error: "Two questions share the same key — keys must be unique." };
  for (const f of d.fields) if (["select", "radio", "checkbox"].includes(f.type) && !f.options?.length) return { error: `"${f.label}" needs at least one option.` };
  if (!keys.includes("phone") && !keys.includes("email")) return { error: "Include a question with key \"phone\" or \"email\" so you can reply to leads." };
  const [clash] = await db.select({ id: forms.id }).from(forms).where(and(eq(forms.slug, d.slug), ne(forms.id, id)));
  if (clash) return { error: "Another form already uses that URL slug." };
  const [cur] = await db.select({ isPrimary: forms.isPrimary }).from(forms).where(eq(forms.id, id));
  if (cur?.isPrimary && !d.published) return { error: "The primary (site-wide) form can't be unpublished. Make another form primary first." };
  await db.update(forms).set({ ...d, updatedAt: new Date() }).where(eq(forms.id, id));
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function createForm() {
  await assertCan("forms:write");
  const { id: _i, slug: _s, ...base } = defaultQuoteForm;
  const [f] = await db.insert(forms).values({ ...base, name: "New form", slug: `form-${Date.now().toString(36)}`, title: "Tell us about your property", isPrimary: false, published: false }).returning({ id: forms.id });
  redirect(`/dashboard/forms/${f.id}`);
}

export async function makePrimary(id: string) {
  await assertCan("forms:write");
  const [f] = await db.select().from(forms).where(eq(forms.id, id));
  if (!f) return;
  await db.update(forms).set({ isPrimary: false }).where(eq(forms.isPrimary, true));
  await db.update(forms).set({ isPrimary: true, published: true }).where(eq(forms.id, id));
  revalidatePath("/", "layout");
}

export async function deleteForm(id: string) {
  await assertCan("forms:write");
  const [f] = await db.select({ isPrimary: forms.isPrimary, slug: forms.slug }).from(forms).where(eq(forms.id, id));
  if (!f || f.isPrimary) return;
  await db.delete(forms).where(eq(forms.id, id));
  revalidatePath("/", "layout");
  redirect("/dashboard/forms");
}
