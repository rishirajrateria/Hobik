import Link from "next/link";
import type { Post } from "@/db/schema";
import { readingMinutes } from "@/lib/markdown";
import { Icon } from "./Icon";

export const ACCENTS: Record<string, string> = {
  navy: "bg-gradient-to-br from-navy-900 to-navy-700",
  gold: "bg-gradient-to-br from-gold-400 to-gold-600",
  mint: "bg-gradient-to-br from-mint-500 to-navy-700",
  sky: "bg-gradient-to-br from-sky-500 to-navy-800",
  rose: "bg-gradient-to-br from-rose-500 to-navy-800",
};

export function BlogCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:ring-gold-400">
      <div className={`relative h-44 overflow-hidden ${ACCENTS[p.accent] ?? ACCENTS.navy}`}>
        {p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <>
            <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
            <p className={`absolute inset-x-6 bottom-5 line-clamp-2 font-display text-xl font-extrabold ${p.accent === "gold" ? "text-navy-950" : "text-white"}`}>{p.tags[0] ?? "Guide"}</p>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold tracking-widest text-gold-600 uppercase">
          {readingMinutes(p.content)} min read{p.publishedAt ? ` · ${p.publishedAt.toLocaleDateString("en-CA", { month: "short", year: "numeric" })}` : ""}
        </p>
        <h3 className="mt-2 text-lg font-extrabold text-navy-950">{p.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-gold-600">Read <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  );
}
