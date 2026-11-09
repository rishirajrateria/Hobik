import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getGuide, guides } from "@/lib/guides";
import { articleSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CtaBand, JsonLd, PageHero } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return { ...pageMeta({ title: g.title, description: g.description, path: `/guides/${g.slug}` }), openGraph: { type: "article", title: g.title, description: g.description, url: `/guides/${g.slug}`, modifiedTime: g.updated } };
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  return (
    <>
      <JsonLd data={articleSchema({ title: g.title, description: g.description, path: `/guides/${g.slug}`, updated: g.updated })} />
      <PageHero crumbs={[{ name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]} eyebrow={`${g.readMins} min read · Updated ${new Date(g.updated).toLocaleDateString("en-CA", { month: "long", year: "numeric" })}`} title={g.title} />
      <section className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <div className="rounded-3xl bg-gold-400/10 p-7 ring-1 ring-gold-400/40">
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-gold-600 uppercase"><Icon name="bolt" className="h-4 w-4" /> Quick answer</p>
            <p className="mt-3 text-lg leading-relaxed text-navy-950">{g.tldr}</p>
          </div>
          {g.sections.map((s) => (
            <section key={s.h} className="mt-12">
              <h2 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">{s.h}</h2>
              {s.body && <p className="mt-4 text-lg leading-relaxed text-slate-700">{s.body}</p>}
              {s.list && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.list.map((li) => (
                    <li key={li} className="flex gap-3 rounded-2xl bg-navy-50 p-4 text-slate-800"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-mint-500" />{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="mt-12 text-sm text-slate-500">
            Written by the appraisal team at {site.name}, Toronto. This guide is general information, not a valuation of your property. <Link href="/get-a-quote" className="font-semibold text-gold-600 underline">Get a quote</Link> for an appraisal.
          </p>
        </article>
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28"><QuoteForm compact location={`guide_${g.slug}`} /></div>
        </aside>
      </section>
      <CtaBand location={`guide_${g.slug}_bottom`} />
    </>
  );
}
