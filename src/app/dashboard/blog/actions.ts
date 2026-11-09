"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { assertCan } from "@/lib/auth";

const slugify = (s: string) => s.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const schema = z.object({
  title: z.string().trim().min(3, "Add a title").max(160),
  slug: z.string().trim().max(80),
  excerpt: z.string().trim().max(300),
  content: z.string().max(100_000),
  coverImage: z.union([z.literal(""), z.url("Cover image must be a full https:// URL")]),
  accent: z.enum(["navy", "gold", "mint", "sky", "rose"]),
  tags: z.string().max(200),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
});
export type PostPayload = z.input<typeof schema>;

export async function savePost(id: string | null, payload: PostPayload): Promise<{ ok?: true; id?: string; slug?: string; error?: string }> {
  const user = await assertCan("blog:write");
  const p = schema.safeParse(payload);
  if (!p.success) return { error: p.error.issues[0].message };
  const d = p.data;
  const slug = slugify(d.slug || d.title);
  if (!slug) return { error: "Add a URL slug" };
  const [clash] = await db.select({ id: posts.id }).from(posts).where(id ? and(eq(posts.slug, slug), ne(posts.id, id)) : eq(posts.slug, slug));
  if (clash) return { error: "Another post already uses that URL." };

  const values = {
    title: d.title,
    slug,
    excerpt: d.excerpt,
    content: d.content,
    coverImage: d.coverImage || null,
    accent: d.accent,
    tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
    status: d.status,
    seoTitle: d.seoTitle || null,
    seoDescription: d.seoDescription || null,
    updatedAt: new Date(),
  };

  let postId = id;
  if (id) {
    const [cur] = await db.select({ publishedAt: posts.publishedAt, slug: posts.slug }).from(posts).where(eq(posts.id, id));
    if (!cur) return { error: "Post not found" };
    await db.update(posts).set({ ...values, publishedAt: d.status === "published" ? cur.publishedAt ?? new Date() : cur.publishedAt }).where(eq(posts.id, id));
    if (cur.slug !== slug) revalidatePath(`/blog/${cur.slug}`);
  } else {
    const [row] = await db.insert(posts).values({ ...values, authorId: user.id, publishedAt: d.status === "published" ? new Date() : null }).returning({ id: posts.id });
    postId = row.id;
  }
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/", "layout");
  return { ok: true, id: postId!, slug };
}

export async function deletePost(id: string) {
  await assertCan("blog:write");
  const [p] = await db.select({ slug: posts.slug }).from(posts).where(eq(posts.id, id));
  await db.delete(posts).where(eq(posts.id, id));
  if (p) revalidatePath(`/blog/${p.slug}`);
  revalidatePath("/", "layout");
  redirect("/dashboard/blog");
}
