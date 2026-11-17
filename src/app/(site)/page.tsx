import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { faqs } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";
import { getPublishedPosts } from "@/lib/content";
import { BlogCard } from "@/components/BlogCard";
import { Testimonials } from "@/components/Testimonials";
import { QuoteForm } from "@/components/QuoteForm";
import {
  AreaChips,
  AreaMap,
  CtaBand,
  FaqList,
  HeroCtas,
  HeroVisual,
  JsonLd,
  Process,
  SectionHead,
  ServiceGrid,
  TrustStrip,
  WhyUs,
} from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Home Appraisal Toronto | Certified Residential Appraisers | Home Value Inc." },
  description:
    "Certified home appraisals in Toronto and the GTA for mortgages, estates, divorce, CRA capital gains and MPAC appeals. AIC-member appraisers, reports in 48–72 hours. Free quote: (416) 871-9224.",
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* HERO */}
      <section>
        <div className="container-x grid items-center gap-14 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:pb-24">
          <div className="lg:col-span-6">
            <span className="eyebrow animate-fade-up">Residential appraisers · Toronto &amp; GTA</span>
            <h1 className="mt-6 animate-fade-up text-[46px] leading-[1.02] font-medium text-ink-950 [animation-delay:60ms] sm:text-[64px] lg:text-[76px]">
              Know what your home is worth.
            </h1>
            <p className="mt-7 max-w-xl animate-fade-up text-[19px] leading-relaxed text-ink-700 [animation-delay:120ms]">
              Independent, certified appraisals for mortgages, estates, separations, CRA filings and property tax appeals. Most reports are delivered in {site.turnaround}.
            </p>
            <div className="animate-fade-up [animation-delay:180ms]"><HeroCtas location="hero" /></div>
          </div>
          <div className="animate-fade-up [animation-delay:200ms] lg:col-span-6 lg:pl-6">
            <HeroVisual />
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* SERVICES */}
      <section className="container-x py-20 sm:py-28" id="services">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><SectionHead eyebrow="What we appraise" title="An appraisal for every reason you might need one" /></div>
          <p className="text-[17px] leading-relaxed text-ink-700 lg:col-span-5" data-reveal>
            Lenders, lawyers, executors, accountants and the CRA rely on our reports. Pick the purpose below to see what's included.
          </p>
        </div>
        <div className="mt-12"><ServiceGrid /></div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-ink-100 bg-paper-50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="From first call to signed report" />
          <div className="mt-12"><Process /></div>
          <div className="mt-10"><Link href="/get-a-quote" className="link-arrow">Start with a free quote →</Link></div>
        </div>
      </section>

      {/* WHY US + FORM */}
      <section className="bg-ink-950 py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionHead dark eyebrow="Why Home Value Inc." title="Reports that hold up when it matters" sub={`${site.yearsExperience} years valuing homes across Toronto and Southern Ontario.`} />
            <div className="mt-12"><WhyUs /></div>
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-5" id="quote" data-reveal>
            <QuoteForm location="home_why" />
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Service areas" title="Across Toronto and the GTA" sub="Our office is in North York. We appraise homes from Hamilton to Oshawa and north to Newmarket." />
            <div className="mt-10"><AreaChips /></div>
          </div>
          <div className="lg:col-span-7" data-reveal><AreaMap /></div>
        </div>
      </section>

      <Testimonials />

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="border-t border-ink-100 py-20 sm:py-28">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="From the blog" title="Plain answers to appraisal questions" />
              <Link href="/blog" className="link-arrow" data-reveal>All articles →</Link>
            </div>
            <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
              {posts.map((p, i) => <div key={p.id} data-reveal style={{ "--d": i } as React.CSSProperties} className="flex"><BlogCard p={p} /></div>)}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-ink-100 bg-paper-50 py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="FAQ" title="Common questions" sub="Can't find your answer? Call us and ask." />
            <Link href="/faq" className="link-arrow mt-8" data-reveal>See all FAQs →</Link>
          </div>
          <div className="lg:col-span-8"><FaqList items={faqs.slice(0, 6)} /></div>
        </div>
      </section>

      <CtaBand location="home_bottom" />
    </>
  );
}
