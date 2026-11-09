import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { guides } from "@/lib/guides";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Home Appraisal Guides for Ontario Homeowners",
  description: "Plain-English guides on home appraisal costs, preparing for an appraisal and how appraisals differ from MPAC assessments and realtor CMAs.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Guides", path: "/guides" }]} eyebrow="Guides" title={<>Appraisals, <span className="text-gradient">explained.</span></>} answer="Short, practical guides for Toronto and Ontario homeowners." />
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="group card flex flex-col p-7 transition hover:-translate-y-1 hover:ring-gold-400">
              <p className="text-xs font-bold tracking-widest text-gold-600 uppercase">{g.readMins} min read</p>
              <h2 className="mt-3 text-xl font-extrabold text-navy-950">{g.title}</h2>
              <p className="mt-2 text-slate-600">{g.description}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-gold-600">Read guide <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand location="guides_bottom" />
    </>
  );
}
