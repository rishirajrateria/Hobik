import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { AicBadge, CtaBand, HeroCtas, PageHero, SectionHead, StatsBand } from "@/components/Sections";

export const metadata = pageMeta({
  title: "About Value Trust Appraisals Inc.",
  description: "Value Trust specializes in real estate appraisals and advisory services within Southern Ontario, for residential, multi-residential, commercial, industrial, farm and institutional properties.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About us"
        title={<>Your trusted expert in real estate valuations</>}
        answer="Value Trust specializes in real estate appraisals and advisory services within Southern Ontario. Our mission is to deliver independent, reliable, and professional appraisal reports that empower informed decision-making for our clients."
      >
        <HeroCtas location="about_hero" />
      </PageHero>
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "shield", t: "Customer experience", d: "We understand that getting an appraisal can be confusing and overwhelming. We take the time to understand your needs, and clear communication with all parties is our top priority." },
            { icon: "scale", t: "Expertise", d: "A combined total of 11 years of experience in real estate appraisals, across a multitude of property types and intended uses. Our reports conform to CUSPAP, set out by the AIC." },
            { icon: "pin", t: "Timely reports", d: "We pride ourselves in providing accurate appraisal reports on time, and will always try to work with you to meet your deadlines." },
          ].map((c) => (
            <div key={c.t} className="lg p-7" data-reveal>
              <h2 className="text-[26px] font-medium text-ink-950">{c.t}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-700">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="dark-glow py-20">
        <div className="container-x"><StatsBand dark /></div>
      </section>
      {/* The full team lives on its own page; About only points to it. */}
      <section className="py-20">
        <div className="container-x flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between" data-reveal>
          <div className="max-w-xl">
            <SectionHead eyebrow="Our team" title="The people behind Value Trust" sub="Meet our appraisers, their experience and the languages they speak." />
            <Link href="/team" className="btn-primary mt-8">Meet the team</Link>
          </div>
          <AicBadge className="w-[300px] sm:w-[380px]" />
        </div>
      </section>
      <CtaBand location="about_bottom" />
    </>
  );
}
