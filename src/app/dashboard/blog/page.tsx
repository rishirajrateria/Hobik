import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { Icon } from "@/components/Icon";
import { ACCENTS } from "@/components/BlogCard";
import { Badge, Empty, PageHeader, Panel, btnPrimary, timeAgo } from "@/components/dash/ui";

export const dynamic = "force-dynamic";

export default async function BlogAdmin() {
  await requireUser("blog:write");
  const list = await db.select({ p: posts, author: users.name }).from(posts).leftJoin(users, eq(users.id, posts.authorId)).orderBy(desc(posts.updatedAt));
  return (
    <div className="space-y-6">
      <PageHeader title="Blog" sub="Write articles that rank on Google and get quoted by ChatGPT. Published posts go live instantly." actions={<Link href="/dashboard/blog/new" className={btnPrimary}><Icon name="plus" className="h-4 w-4" /> New post</Link>} />
      <Panel pad={false}>
        {list.length ? (
          <ul className="divide-y divide-slate-100">
            {list.map(({ p, author }) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                <span className={`hidden h-14 w-20 shrink-0 overflow-hidden rounded-lg sm:block ${ACCENTS[p.accent] ?? ACCENTS.navy}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.coverImage && <img src={p.coverImage} alt="" className="h-full w-full object-cover" />}
                </span>
                <Link href={`/dashboard/blog/${p.id}`} className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-navy-950">{p.title}</span>
                  <span className="block truncate text-xs text-slate-500">/blog/{p.slug} · {author ? `${author} · ` : ""}edited {timeAgo(p.updatedAt)}</span>
                </Link>
                <Badge tone={p.status === "published" ? "green" : "slate"}>{p.status === "published" ? "Published" : "Draft"}</Badge>
                {p.status === "published" && <a href={`/blog/${p.slug}`} target="_blank" className="hidden text-sm font-bold text-blue-700 sm:block">View ↗</a>}
              </li>
            ))}
          </ul>
        ) : (
          <Empty icon="pencil" title="No posts yet" sub="Your first article is one click away." action={<Link href="/dashboard/blog/new" className={btnPrimary}>Write a post</Link>} />
        )}
      </Panel>
    </div>
  );
}
