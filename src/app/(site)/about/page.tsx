import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { team } from "@/lib/team";
import { AicBadge, CtaBand, HeroCtas, PageHero, SectionHead, ServiceGrid, StatsBand, WhyUs } from "@/components/Sections";

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
      <section className="py-20">
        <div className="container-x">
          <SectionHead eyebrow="What we appraise" title="Residential to institutional" sub="We provide appraisal reports for residential, multi-residential, commercial, industrial, farm, and institutional properties for a variety of use cases." />
          <div className="mt-12"><ServiceGrid /></div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Our team" title="The people behind Value Trust" />
            <Link href="/team" className="link-arrow" data-reveal>View all profiles →</Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map((m) => (
              <li key={m.slug} data-reveal>
                <Link href={`/team/${m.slug}`} className="group block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photo} alt={m.name} width={640} height={800} loading="lazy" className="aspect-[4/5] w-full rounded-[28px] object-cover shadow-[0_30px_60px_-30px_rgba(22,22,22,0.45)]" />
                  <p className="mt-4 font-display text-[22px] text-ink-950 group-hover:underline">{m.name}{m.credentials && `, ${m.credentials}`}</p>
                  <p className="mt-1 text-[14px] text-accent-600">{m.title}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-col items-start gap-5 pt-4 sm:flex-row sm:items-center sm:justify-between" data-reveal>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-700">Accredited and in good standing with the Appraisal Institute of Canada (AIC).</p>
            <AicBadge className="w-[300px] sm:w-[360px]" />
          </div>
        </div>
      </section>
      <section className="dark-glow py-20">
        <div className="container-x">
          <StatsBand dark />
          <div className="mt-16"><SectionHead dark eyebrow="Inside every report" title="Independent, reliable, professional" /></div>
          <div className="mt-12"><WhyUs /></div>
        </div>
      </section>
      <CtaBand location="about_bottom" />
    </>
  );
}
