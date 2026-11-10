import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getPostBySlug, getPublishedPosts } from "@/lib/content";
import { renderMarkdown, readingMinutes, tocOf } from "@/lib/markdown";
import { extractFaqs } from "@/lib/blogfile";
import { articleSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { BlogCard } from "@/components/BlogCard";
import { QuoteForm } from "@/components/QuoteForm";
import { CtaBand, JsonLd, PageHero } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = await getPostBySlug((await params).slug);
  if (!p) return {};
  const title = p.seoTitle || p.title;
  const description = p.seoDescription || p.excerpt;
  const meta = pageMeta({ title, description, path: `/blog/${p.slug}` });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", modifiedTime: p.updatedAt.toISOString(), publishedTime: p.publishedAt?.toISOString(), ...(p.coverImage ? { images: [p.coverImage] } : {}) } };
}

export default async function PostPage({ params }: Props) {
  const p = await getPostBySlug((await params).slug);
  if (!p) notFound();
  const all = (await getPublishedPosts()).filter((x) => x.id !== p.id);
  // Related: share a tag first, then most recent.
  const more = [...all.filter((x) => x.tags.some((t) => p.tags.includes(t))), ...all].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
  const toc = tocOf(p.content);
  const faqs = extractFaqs(p.content);
  const date = (p.publishedAt ?? p.updatedAt).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      <JsonLd data={[articleSchema({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, updated: p.updatedAt.toISOString(), published: p.publishedAt?.toISOString(), image: p.coverImage ?? undefined }), ...(faqs.length ? [faqSchema(faqs)] : [])]} />
      <PageHero crumbs={[{ name: "Blog", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]} eyebrow={`${readingMinutes(p.content)} min read · ${date}`} title={p.title} answer={p.excerpt} />
      <section className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <article className="prose-hv lg:col-span-8">
          {p.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.coverImage} alt="" className="mb-10 aspect-[16/9] w-full rounded-3xl object-cover" />
          )}
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }} />
          <p className="mt-12 border-t border-navy-100 pt-6 text-sm text-slate-500">
            Written by the appraisal team at {site.name}, Toronto. General information only — not a valuation of your property. <Link href="/get-a-quote" className="font-semibold text-gold-600 underline">Get a quote</Link>.
          </p>
        </article>
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            {toc.length > 2 && (
              <nav aria-label="On this page" className="card hidden p-5 lg:block">
                <p className="text-xs font-bold tracking-widest text-gold-600 uppercase">On this page</p>
                <ol className="mt-3 space-y-1.5 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`} className="block rounded-lg px-2 py-1 text-slate-600 transition hover:bg-white/70 hover:text-navy-950">{t.text}</a></li>
                  ))}
                </ol>
              </nav>
            )}
            <QuoteForm compact location={`blog_${p.slug}`} />
          </div>
        </aside>
      </section>
      {more.length > 0 && (
        <section className="relative border-y border-white/50 bg-white/20 py-16">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold text-navy-950">Keep reading</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">{more.map((m) => <BlogCard key={m.id} p={m} />)}</div>
          </div>
        </section>
      )}
      <CtaBand location={`blog_${p.slug}_bottom`} />
    </>
  );
}
