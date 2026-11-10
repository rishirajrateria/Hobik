import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { BlogEditor } from "@/components/dash/BlogEditor";

export const dynamic = "force-dynamic";

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireUser("blog:write");
  const { id } = await params;
  let post = null;
  if (id !== "new") {
    [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) notFound();
  }
  return (
    <div className="space-y-6">
      <Link href="/dashboard/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-navy-900">← All posts</Link>
      <BlogEditor
        flash={(await searchParams).saved}
        id={post?.id ?? null}
        initial={{
          title: post?.title ?? "",
          slug: post?.slug ?? "",
          excerpt: post?.excerpt ?? "",
          content: post?.content ?? "## Start with a direct answer\n\nWrite the 1–2 sentence answer people (and AI assistants) are looking for first.\n\n## Details\n\n- Point one\n- Point two\n",
          coverImage: post?.coverImage ?? "",
          accent: (post?.accent as "navy") ?? "navy",
          tags: post?.tags.join(", ") ?? "Guides",
          status: post?.status ?? "draft",
          seoTitle: post?.seoTitle ?? "",
          seoDescription: post?.seoDescription ?? "",
          publishAt: post?.publishedAt ? new Date(post.publishedAt.getTime() - post.publishedAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "",
        }}
      />
    </div>
  );
}
