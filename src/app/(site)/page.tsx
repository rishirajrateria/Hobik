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
            <p className="mt-6 max-w-md animate-fade-up text-[19px] leading-relaxed text-ink-700 [animation-delay:120ms]">
              Certified home appraisals across Toronto and the GTA.
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
        <SectionHead eyebrow="What we appraise" title="Pick your reason" />
        <div className="mt-12"><ServiceGrid /></div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-ink-100 bg-paper-50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Four simple steps" />
          <div className="mt-12"><Process /></div>
        </div>
      </section>

      {/* WHY US + FORM */}
      <section className="bg-ink-950 py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionHead dark eyebrow="Inside every report" title="Reports that hold up" />
            <div className="mt-10" data-reveal><WhyUs /></div>
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-5" id="quote" data-reveal>
            <QuoteForm location="home_why" />
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="container-x py-20 sm:py-28">
        <SectionHead eyebrow="Service areas" title="All across the GTA" />
        <div className="mt-10" data-reveal><AreaMap /></div>
      </section>

      <Testimonials single />

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="border-t border-ink-100 py-20 sm:py-28">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="From the blog" title="Quick reads" />
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
            <SectionHead eyebrow="FAQ" title="Common questions" />
            <Link href="/faq" className="link-arrow mt-8" data-reveal>See all FAQs →</Link>
          </div>
          <div className="lg:col-span-8"><FaqList items={faqs.slice(0, 4)} /></div>
        </div>
      </section>

      <CtaBand location="home_bottom" />
    </>
  );
}
