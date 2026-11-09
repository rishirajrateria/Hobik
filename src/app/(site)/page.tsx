import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { faqs } from "@/lib/faqs";
import { getPublishedPosts } from "@/lib/content";
import { BlogCard } from "@/components/BlogCard";
import { Testimonials } from "@/components/Testimonials";
import { faqSchema } from "@/lib/schema";
import { Icon } from "@/components/Icon";
import { DarkAurora } from "@/components/Ambient";
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
  StatsBand,
  TrustStrip,
  WhyUs,
} from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Home Appraisal Toronto | Certified Residential Appraisers | Home Value Inc." },
  description:
    "Certified home appraisals in Toronto & the GTA for mortgages, estates, divorce, CRA capital gains and MPAC appeals. AIC-member appraisers, fast 48–72 hr reports. Free quote: (416) 871-9224.",
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* HERO */}
      <section data-spot className="spotlight relative overflow-hidden rounded-b-[2.5rem] bg-navy-950 pt-24 sm:pt-28">
        <DarkAurora />
        <div className="container-x relative grid items-center gap-14 pt-10 pb-12 sm:pt-14 lg:grid-cols-2 lg:pb-20">
          <div>
            <span className="eyebrow-dark animate-fade-up"><Icon name="sparkle" className="h-4 w-4" /> Toronto &amp; GTA Home Appraisers</span>
            <h1 className="mt-6 text-[2.7rem] leading-[1.0] font-extrabold text-white sm:text-6xl lg:text-[5.2rem]">
              {["Know", "your", "home\u2019s"].map((w, i) => (
                <span key={w} className="inline-block animate-fade-up pr-[0.22em]" style={{ animationDelay: `${120 + i * 90}ms` }}>{w}</span>
              ))}
              <br className="hidden sm:block" />
              <span className="inline-block animate-fade-up text-gradient [animation-delay:420ms]">true value.</span>
            </h1>
            <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/70 [animation-delay:520ms] sm:text-xl">
              Certified, independent residential appraisals for mortgages, estates, divorce, CRA and tax appeals — delivered in {site.turnaround}.
            </p>
            <div className="animate-fade-up [animation-delay:620ms]"><HeroCtas location="hero" /></div>
            <ul className="mt-8 flex max-w-xl animate-fade-up flex-wrap gap-2 [animation-delay:720ms]">
              {["AIC member appraisers", "Lender-ready reports", "Retrospective dates", "All of the GTA"].map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-sm font-semibold text-white/85 ring-1 ring-white/10 backdrop-blur-xl">
                  <Icon name="check" className="h-4 w-4 text-mint-400" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up [animation-delay:300ms]"><HeroVisual /></div>
        </div>
        <div className="container-x relative pb-14"><div data-reveal><StatsBand /></div></div>
        <a href="#services" aria-label="Scroll to services" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 lg:block">
          <span className="flex h-10 w-6 justify-center rounded-full ring-1 ring-white/25"><span className="mt-2 h-2 w-1 animate-[float_1.8s_ease-in-out_infinite] rounded-full bg-gold-300" /></span>
        </a>
      </section>

      <TrustStrip />

      {/* SERVICES */}
      <section className="container-x py-20 sm:py-28" id="services">
        <SectionHead eyebrow="What we appraise" title={<>Every reason you need <br className="hidden sm:block" />a home valued.</>} sub="One trusted appraiser for every purpose — lenders, lawyers, executors, accountants and the CRA rely on our reports." />
        <div className="mt-14"><ServiceGrid /></div>
      </section>

      {/* PROCESS */}
      <section className="relative border-y border-white/50 bg-white/20 py-20 sm:py-28">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="From call to report in 4 easy steps." />
          <div className="mt-16"><Process /></div>
          <div className="mt-14 text-center">
            <Link href="/get-a-quote" className="btn-gold text-lg">Start Step 1 — Free Quote <Icon name="arrow" className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>

      {/* WHY US + FORM */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 py-20 sm:py-28">
        <DarkAurora />
        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionHead dark center={false} eyebrow="Why Home Value Inc." title={<>Reports that <span className="text-gradient">hold up.</span></>} sub={`${site.yearsExperience} years valuing homes across Toronto & Southern Ontario.`} />
            <div className="mt-10"><WhyUs /></div>
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-5" id="quote" data-reveal="right">
            <QuoteForm location="home_why" />
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHead center={false} eyebrow="Service areas" title="Across Toronto & the GTA." sub="Based in North York, we appraise homes from Hamilton to Oshawa and north to Newmarket." />
            <div className="mt-8"><AreaChips /></div>
          </div>
          <div className="lg:col-span-7" data-reveal="scale"><AreaMap /></div>
        </div>
      </section>

      <Testimonials />

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="relative border-y border-white/50 bg-white/20 py-20 sm:py-28">
          <div className="container-x">
            <SectionHead eyebrow="From the blog" title="Quick answers, no jargon." />
            <div className="mt-12 grid gap-5 md:grid-cols-3">{posts.map((p, i) => <div key={p.id} data-reveal style={{ "--d": i } as React.CSSProperties} className="flex"><BlogCard p={p} /></div>)}</div>
            <div className="mt-10 text-center"><Link href="/blog" className="btn-outline">All articles <Icon name="arrow" className="h-4 w-4" /></Link></div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead center={false} eyebrow="FAQ" title="Questions, answered." sub="Can't find what you need? Call us — we're happy to help." />
            <Link href="/faq" className="btn-outline mt-8">All FAQs <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="lg:col-span-8"><FaqList items={faqs.slice(0, 6)} /></div>
        </div>
      </section>

      <CtaBand location="home_bottom" />
    </>
  );
}
