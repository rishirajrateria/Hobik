import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { DarkAurora } from "@/components/Ambient";
import { CtaBand, HeroCtas, PageHero, SectionHead, StatsBand, WhyUs } from "@/components/Sections";

export const metadata = pageMeta({
  title: "About Home Value Inc. | Toronto Residential Appraisers",
  description: `Home Value Inc. is a Toronto residential appraisal firm with ${site.yearsExperience} years of experience serving homeowners, lenders, lawyers and executors across the GTA.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About us"
        title={<>Independent appraisers. <span className="text-gradient">Local experts.</span></>}
        answer={`Home Value Inc. is a residential property appraisal firm based at ${site.address.street} in North York, Toronto. For ${site.yearsExperience} years our ${site.credentials.toLowerCase()} have helped homeowners, lenders, lawyers, executors and accountants understand what Southern Ontario homes are really worth.`}
      >
        <HeroCtas location="about_hero" />
      </PageHero>
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "shield", t: "Our standard", d: "Every report follows the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP)." },
            { icon: "scale", t: "Our promise", d: "Independent, impartial values. We're paid for our opinion — never for a number." },
            { icon: "pin", t: "Our market", d: "Toronto, the GTA and Southern Ontario — the market we live and work in every day." },
          ].map((c) => (
            <div key={c.t} className="card p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 shadow-[0_10px_30px_-8px_rgba(245,176,49,0.8)]"><Icon name={c.icon} className="h-7 w-7" /></span>
              <h2 className="mt-5 text-2xl font-extrabold text-navy-950">{c.t}</h2>
              <p className="mt-2 text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 py-20">
        <DarkAurora />
        <div className="container-x relative">
          <StatsBand />
          <div className="mt-16"><SectionHead dark eyebrow="Why clients choose us" title="Trusted by the people who rely on values." /></div>
          <div className="mt-12"><WhyUs /></div>
        </div>
      </section>
      <CtaBand location="about_bottom" />
    </>
  );
}
