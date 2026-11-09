"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { assertCan } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Add the client's name").max(80),
  location: z.string().trim().max(80),
  role: z.string().trim().max(80),
  service: z.string().trim().max(120),
  source: z.string().trim().max(40),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(10, "The testimonial is too short").max(1200),
  status: z.enum(["published", "hidden"]),
  featured: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
});

export type TState = { error?: string; ok?: boolean };

const refresh = () => {
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/", "layout");
};

export async function saveTestimonial(id: string | null, _: TState, fd: FormData): Promise<TState> {
  await assertCan("testimonials:write");
  const p = schema.safeParse({ ...Object.fromEntries(fd), featured: fd.get("featured") ?? "false" });
  if (!p.success) return { error: p.error.issues[0].message };
  const d = { ...p.data, location: p.data.location || null, role: p.data.role || null, service: p.data.service || null, source: p.data.source || null };
  if (id) await db.update(testimonials).set(d).where(eq(testimonials.id, id));
  else await db.insert(testimonials).values({ ...d, sortOrder: Date.now() % 1_000_000 });
  refresh();
  redirect("/dashboard/testimonials?saved=1");
}

export async function toggleTestimonial(id: string, field: "status" | "featured") {
  await assertCan("testimonials:write");
  const [t] = await db.select().from(testimonials).where(eq(testimonials.id, id));
  if (!t) return;
  await db.update(testimonials).set(field === "status" ? { status: t.status === "published" ? "hidden" : "published" } : { featured: !t.featured }).where(eq(testimonials.id, id));
  refresh();
}

export async function deleteTestimonial(id: string) {
  await assertCan("testimonials:write");
  await db.delete(testimonials).where(eq(testimonials.id, id));
  refresh();
}
