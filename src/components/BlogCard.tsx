import Link from "next/link";
import type { Post } from "@/db/schema";
import { readingMinutes } from "@/lib/markdown";

/** Flat colour keys kept for posts' "card colour" setting (used in the dashboard). */
export const ACCENTS: Record<string, string> = {
  navy: "bg-ink-900",
  gold: "bg-brick-500",
  mint: "bg-sage-500",
  sky: "bg-[#5b7a8c]",
  rose: "bg-[#8e5563]",
};

/** Article teaser: rule, category, serif title, excerpt. Cover image only if one was uploaded. */
export function BlogCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group flex w-full flex-col border-t border-ink-950 pt-5">
      {p.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.coverImage} alt="" loading="lazy" className="mb-5 aspect-[3/2] w-full object-cover" />
      )}
      <p className="text-[12px] font-semibold tracking-[0.16em] text-brick-600 uppercase">{p.tags[0] ?? "Guide"}</p>
      <h3 className="mt-3 font-display text-[23px] leading-snug font-medium text-ink-950 decoration-brick-500 decoration-1 underline-offset-4 group-hover:underline">{p.title}</h3>
      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-700">{p.excerpt}</p>
      <p className="mt-auto pt-5 text-[13px] text-ink-700">
        {readingMinutes(p.content)} min read{p.publishedAt ? ` · ${p.publishedAt.toLocaleDateString("en-CA", { month: "long", year: "numeric" })}` : ""}
      </p>
    </Link>
  );
}
