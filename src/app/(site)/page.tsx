import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { faqs } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";
import { getPublishedPosts } from "@/lib/content";
import { BlogCard } from "@/components/BlogCard";
import { Testimonials } from "@/components/Testimonials";
import { QuoteForm } from "@/components/QuoteForm";
import { team } from "@/lib/team";
import { whatWeDo } from "@/lib/services";
import { CoverageMap } from "@/components/CoverageMap";
import {
  AicBadge,
  CtaBand,
  FaqList,
  HeroCtas,
  HeroVisual,
  JsonLd,
  Process,
  SectionHead,
  TrustStrip,
  TurnaroundBand,
  WhatWeDo,
  WhyUs,
} from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Value Trust Appraisals Inc. | Real Estate Appraisers, Toronto & Southern Ontario" },
  description:
    "Residential, commercial, institutional, industrial and agricultural appraisals across the GTHA and Southern Ontario. AACI-designated appraiser, CUSPAP-compliant reports. Call (647) 783-8979.",
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
            <h1 className="animate-fade-up text-[40px] leading-[1.06] font-semibold text-ink-950 [animation-delay:60ms] sm:text-[52px] lg:text-[56px] 2xl:text-[70px]">
              Real estate appraisal &amp; advisory services in Southern Ontario.
            </h1>
            <p className="mt-6 max-w-md animate-fade-up text-[19px] leading-relaxed text-ink-700 [animation-delay:120ms] 2xl:max-w-lg 2xl:text-[21px]">
              Residential, commercial, institutional, industrial and agricultural property.
            </p>
            <div className="animate-fade-up [animation-delay:180ms]"><HeroCtas location="hero" /></div>
          </div>
          <div className="animate-fade-up [animation-delay:200ms] lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* QUICK TURNAROUND */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHead eyebrow="Quick turnaround" title="Reports on time, every time" />
          <div className="mt-10"><TurnaroundBand /></div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-20 sm:py-24" id="services">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center" data-reveal>
            <h2 className="text-[34px] leading-[1.1] font-semibold text-ink-950 sm:text-[46px]">What we do</h2>
            <p className="mt-5 text-[18px] leading-relaxed text-ink-700">
              We provide appraisal reports for residential, multi-residential, commercial, institutional, industrial and agricultural properties for a variety of use cases.
            </p>
          </div>
          <div className="mt-14"><WhatWeDo items={whatWeDo} /></div>
          <div className="mt-14 text-center" data-reveal>
            <Link href="/services" className="btn-primary">All services</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Four simple steps" />
          <div className="mt-12"><Process /></div>
        </div>
      </section>

      {/* WHY US + FORM */}
      <section className="dark-glow py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionHead dark eyebrow="Inside every report" title="Independent. Reliable. CUSPAP-compliant." />
            <div className="lg-dark mt-10 p-4 sm:p-6" data-reveal><WhyUs /></div>
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-5" id="quote" data-reveal>
            <QuoteForm location="home_why" />
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHead eyebrow="Coverage" title="GTHA + Southern Ontario" sub={site.coverageNote} />
          <div className="mt-10" data-reveal><CoverageMap /></div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Our team" title="Designated appraisers" />
            <Link href="/team" className="link-arrow" data-reveal>Meet the team →</Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map((m, i) => (
              <li key={m.slug} data-reveal style={{ "--d": i } as React.CSSProperties}>
                <Link href={`/team/${m.slug}`} className="group block">
                  <div className="relative overflow-hidden bg-ink-100 shadow-[0_30px_60px_-30px_rgba(22,22,22,0.45)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.photo} alt={m.name} width={640} height={800} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    <div className="lg absolute inset-x-3 bottom-3 px-4 py-3">
                      <p className="text-[19px] leading-tight font-semibold text-ink-950">{m.name}{m.credentials && <span className="text-[15px] font-medium text-ink-700">, {m.credentials}</span>}</p>
                      <p className="mt-0.5 text-[13px] text-accent-600">{m.title}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between" data-reveal>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-700">Our appraisers are all good-standing members of the Appraisal Institute of Canada (AIC).</p>
            <AicBadge className="w-[300px] sm:w-[360px]" />
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      {posts.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="Articles" title="Quick reads" />
              <Link href="/blog" className="link-arrow" data-reveal>All articles →</Link>
            </div>
            <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
              {posts.map((p, i) => <div key={p.id} data-reveal style={{ "--d": i } as React.CSSProperties} className="flex"><BlogCard p={p} /></div>)}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="FAQ" title="Common questions" />
            <Link href="/faq" className="link-arrow mt-8" data-reveal>See all FAQs →</Link>
          </div>
          <div className="lg:col-span-8"><FaqList items={faqs.slice(0, 4)} /></div>
        </div>
      </section>

      {/* GOOGLE REVIEWS: at the bottom, just above the closing call to action */}
      <Testimonials />

      <CtaBand location="home_bottom" />
    </>
  );
}
