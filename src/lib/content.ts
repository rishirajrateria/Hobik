import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import { forms, posts, testimonials, type Post, type Testimonial } from "@/db/schema";
import { defaultBookingForm, defaultQuoteForm, type FormConfig } from "./defaultForms";

/**
 * Public-site reads. Each one falls back gracefully if the database is unreachable
 * (e.g. during a first build), so the marketing site never goes down with the dashboard.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.warn("[content] db read failed, using fallback:", (e as Error).message);
    return fallback;
  }
}

const toConfig = (f: typeof forms.$inferSelect): FormConfig => ({
  id: f.id,
  slug: f.slug,
  name: f.name,
  title: f.title,
  subtitle: f.subtitle,
  submitLabel: f.submitLabel,
  successTitle: f.successTitle,
  successMessage: f.successMessage,
  style: f.style,
  fields: f.fields,
});

export const getPrimaryForm = cache(() =>
  safe(async () => {
    const [f] = await db.select().from(forms).where(and(eq(forms.isPrimary, true), eq(forms.published, true))).limit(1);
    return f ? toConfig(f) : defaultQuoteForm;
  }, defaultQuoteForm),
);

export const getFormBySlug = cache((slug: string) =>
  safe(async () => {
    const [f] = await db.select().from(forms).where(and(eq(forms.slug, slug), eq(forms.published, true))).limit(1);
    return f ? toConfig(f) : null;
  }, slug === "book-appraisal" ? defaultBookingForm : slug === "quote" ? defaultQuoteForm : null),
);

export const getPublishedForms = cache(() =>
  safe(async () => (await db.select().from(forms).where(eq(forms.published, true))).map(toConfig), [defaultQuoteForm, defaultBookingForm]),
);

export const getTestimonials = cache(() =>
  safe<Testimonial[]>(
    () => db.select().from(testimonials).where(eq(testimonials.status, "published")).orderBy(desc(testimonials.featured), asc(testimonials.sortOrder), desc(testimonials.createdAt)),
    [],
  ),
);

export const getPublishedPosts = cache(() =>
  safe<Post[]>(() => db.select().from(posts).where(and(eq(posts.status, "published"), lte(posts.publishedAt, new Date()))).orderBy(desc(posts.publishedAt)), []),
);

export const getPostBySlug = cache((slug: string) =>
  safe<Post | null>(async () => {
    const [p] = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.status, "published"), lte(posts.publishedAt, new Date()))).limit(1);
    return p ?? null;
  }, null),
);
