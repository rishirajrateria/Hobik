import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { faqs } from "@/lib/faqs";
import { guides } from "@/lib/guides";
import { faqSchema } from "@/lib/schema";
import { Icon } from "@/components/Icon";
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

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-48 -right-24 h-[36rem] w-[36rem] rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-48 -left-24 h-[30rem] w-[30rem] rounded-full bg-mint-400/15 blur-3xl" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="eyebrow-dark"><Icon name="sparkle" className="h-4 w-4" /> Toronto &amp; GTA Home Appraisers</span>
            <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-extrabold text-white sm:text-6xl lg:text-7xl">
              Know your home&apos;s <span className="text-gradient">true value.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Certified, independent residential appraisals for mortgages, estates, divorce, CRA and tax appeals — delivered in {site.turnaround}.
            </p>
            <HeroCtas location="hero" />
            <ul className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
              {["AIC member appraisers", "Lender-ready reports", "Retrospective dates", "Serving all of the GTA"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-mint-400" /> {t}</li>
              ))}
            </ul>
          </div>
          <HeroVisual />
        </div>
        <div className="container-x relative pb-14"><StatsBand /></div>
      </section>

      <TrustStrip />

      {/* SERVICES */}
      <section className="container-x py-20 sm:py-28" id="services">
        <SectionHead eyebrow="What we appraise" title={<>Every reason you need <br className="hidden sm:block" />a home valued.</>} sub="One trusted appraiser for every purpose — lenders, lawyers, executors, accountants and the CRA rely on our reports." />
        <div className="mt-14"><ServiceGrid /></div>
      </section>

      {/* PROCESS */}
      <section className="bg-navy-50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="From call to report in 4 easy steps." />
          <div className="mt-16"><Process /></div>
          <div className="mt-14 text-center">
            <Link href="/get-a-quote" className="btn-gold text-lg">Start Step 1 — Free Quote <Icon name="arrow" className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>

      {/* WHY US + FORM */}
      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-28">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionHead dark center={false} eyebrow="Why Home Value Inc." title={<>Reports that <span className="text-gradient">hold up.</span></>} sub={`${site.yearsExperience} years valuing homes across Toronto & Southern Ontario.`} />
            <div className="mt-10"><WhyUs /></div>
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-5" id="quote">
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
          <div className="lg:col-span-7"><AreaMap /></div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="bg-navy-50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Appraisal guides" title="Quick answers, no jargon." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {guides.map((g, i) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="group card overflow-hidden transition hover:-translate-y-1">
                <div className={`flex h-36 items-end p-6 ${["bg-gradient-to-br from-navy-900 to-navy-700", "bg-gradient-to-br from-gold-400 to-gold-600", "bg-gradient-to-br from-mint-500 to-navy-700"][i % 3]}`}>
                  <Icon name={["coins", "check", "scale"][i % 3]} className={`h-12 w-12 ${i === 1 ? "text-navy-950" : "text-white"}`} />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold tracking-widest text-gold-600 uppercase">{g.readMins} min read</p>
                  <h3 className="mt-2 text-lg font-extrabold text-navy-950 group-hover:text-navy-700">{g.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
