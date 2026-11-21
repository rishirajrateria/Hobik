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
import {
  AicBadge,
  AreaMap,
  CtaBand,
  FaqList,
  HeroCtas,
  HeroVisual,
  JsonLd,
  Process,
  SectionHead,
  ServiceGrid,
  ServiceLines,
  SouthernOntario,
  TrustStrip,
  WhyUs,
} from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Value Trust Appraisals Inc. | Real Estate Appraisers, Toronto & Southern Ontario" },
  description:
    "Residential, commercial, industrial, agricultural and institutional appraisals across the GTHA and Southern Ontario. AACI-designated appraiser, CUSPAP-compliant reports. Call (647) 783-8979.",
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
            <span className="lg inline-flex animate-fade-up items-center gap-2.5 !rounded-full py-2 pr-4 pl-2.5 text-[13px] font-medium text-ink-800"><span className="h-2 w-2 rounded-full bg-accent-500 shadow-[0_0_0_4px_rgba(232,169,65,0.2)]" aria-hidden="true" />{site.slogan}</span>
            <h1 className="mt-6 animate-fade-up text-[42px] leading-[1.05] font-medium text-ink-950 [animation-delay:60ms] sm:text-[56px] lg:text-[60px]">
              Real estate appraisal &amp; advisory in Southern Ontario.
            </h1>
            <p className="mt-6 max-w-md animate-fade-up text-[19px] leading-relaxed text-ink-700 [animation-delay:120ms]">
              Residential, commercial, industrial, agricultural and institutional property.
            </p>
            <div className="animate-fade-up [animation-delay:180ms]"><HeroCtas location="hero" /></div>
          </div>
          <div className="animate-fade-up [animation-delay:200ms] lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* SERVICES */}
      <section className="container-x py-20 sm:py-28" id="services">
        <SectionHead eyebrow="What we appraise" title="Every property type" />
        <div className="mt-12"><ServiceGrid /></div>
      </section>

      {/* SERVICE LINES */}
      <section className="dark-glow py-20 sm:py-28">
        <div className="container-x">
          <SectionHead dark eyebrow="Our services" title="Financing, non-financing and advisory" />
          <div className="mt-12"><ServiceLines dark /></div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 sm:py-28">
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

      {/* AREAS */}
      <section className="container-x py-20 sm:py-28">
        <SectionHead eyebrow="Coverage" title="GTHA + Southern Ontario" sub={site.coverageNote} />
        <div className="mt-10" data-reveal><AreaMap /></div>
        <div className="mt-10"><SouthernOntario /></div>
      </section>

      {/* TEAM */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Our team" title="Designated appraisers" />
            <Link href="/team" className="link-arrow" data-reveal>Meet the team →</Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map((m, i) => (
              <li key={m.slug} data-reveal style={{ "--d": i } as React.CSSProperties}>
                <Link href={`/team#${m.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-[28px] bg-ink-100 shadow-[0_30px_60px_-30px_rgba(22,22,22,0.45)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.photo} alt={m.name} width={640} height={800} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    <div className="lg absolute inset-x-3 bottom-3 !rounded-[20px] px-4 py-3">
                      <p className="font-display text-[20px] leading-tight font-medium text-ink-950">{m.name}{m.credentials && <span className="text-[15px] text-ink-700">, {m.credentials}</span>}</p>
                      <p className="mt-0.5 text-[13px] text-accent-600">{m.title}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-col items-start gap-5 pt-4 sm:flex-row sm:items-center sm:justify-between" data-reveal>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-700">Accredited and in good standing with the Appraisal Institute of Canada. All reports are CUSPAP compliant.</p>
            <AicBadge className="w-[300px] sm:w-[360px]" />
          </div>
        </div>
      </section>

      <Testimonials single />

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="py-20 sm:py-28">
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
      <section className="py-20 sm:py-28">
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
