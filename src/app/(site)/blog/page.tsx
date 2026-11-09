import { pageMeta } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/content";
import { BlogCard } from "@/components/BlogCard";
import { CtaBand, PageHero } from "@/components/Sections";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Home Appraisal Blog & Guides for Ontario Homeowners",
  description: "Plain-English articles on home appraisal costs, preparing for an appraisal, estates, divorce, CRA and MPAC — from Toronto's Home Value Inc.",
  path: "/blog",
});

export default async function BlogIndex() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageHero crumbs={[{ name: "Blog", path: "/blog" }]} eyebrow="Blog & guides" title={<>Appraisals, <span className="text-gradient">explained.</span></>} answer="Short, practical reads for Toronto and Ontario homeowners, executors, lawyers and investors." />
      <section className="container-x py-20">
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <BlogCard key={p.id} p={p} />)}</div>
        ) : (
          <p className="text-center text-slate-500">New articles are coming soon.</p>
        )}
      </section>
      <CtaBand location="blog_bottom" />
    </>
  );
}
