import Link from "next/link";
import type { Post } from "@/db/schema";
import { readingMinutes } from "@/lib/markdown";
import { Vignette, vignetteForTags } from "./Vignettes";

/** Flat colour keys kept for posts' "card colour" setting (used in the dashboard). */
export const ACCENTS: Record<string, string> = {
  navy: "bg-ink-900",
  gold: "bg-accent-500",
  mint: "bg-sage-500",
  sky: "bg-[#5b7a8c]",
  rose: "bg-[#8e5563]",
};

/** Article teaser: rule, category, serif title, excerpt. Cover image only if one was uploaded. */
export function BlogCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group flex w-full flex-col">
      <div className="border border-ink-100 bg-paper-50 transition-colors duration-300 group-hover:border-ink-950">
        {p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverImage} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <Vignette name={vignetteForTags(p.tags)} mode="wipe" className="aspect-[4/3] w-full p-6 transition-transform duration-500 group-hover:scale-[1.03]" />
        )}
      </div>
      <p className="mt-4 text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">{p.tags[0] ?? "Guide"} · {readingMinutes(p.content)} min</p>
      <h3 className="mt-2 font-display text-[21px] leading-snug font-medium text-ink-950 decoration-accent-500 decoration-1 underline-offset-4 group-hover:underline">{p.title}</h3>
    </Link>
  );
}
