import { pageMeta } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/content";
import { BlogCard } from "@/components/BlogCard";
import { CtaBand, PageHero } from "@/components/Sections";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Articles: Real Estate Appraisal in Ontario",
  description: "Plain-English articles on real estate appraisal in Ontario: preparing for an appraisal, estates, separation, tax, assessment appeals and more, from Value Trust Appraisals Inc.",
  path: "/blog",
});

export default async function BlogIndex() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageHero crumbs={[{ name: "Articles", path: "/blog" }]} eyebrow="Articles" title={<>Appraisals, explained</>} answer="Short, practical reads for owners, executors, lawyers, lenders and investors in Ontario." />
      <section className="container-x py-20">
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <BlogCard key={p.id} p={p} />)}</div>
        ) : (
          <p className="text-center text-ink-700">New articles are coming soon.</p>
        )}
      </section>
      <CtaBand location="blog_bottom" />
    </>
  );
}
