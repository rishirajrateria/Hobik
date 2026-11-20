import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { areas } from "@/lib/areas";
import { Icon } from "@/components/Icon";
import { AreaMap, CtaBand, HeroCtas, PageHero, SectionHead, SouthernOntario } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Coverage Area: GTHA + Southern Ontario",
  description: "Based in Toronto, our main coverage area is the Greater Toronto and Hamilton Area. We also complete appraisals on a case by case basis throughout Southern Ontario.",
  path: "/areas",
});

const regions = ["Toronto", "Peel", "York", "Halton", "Durham", "Hamilton"] as const;

export default function AreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Service Areas", path: "/areas" }]}
        eyebrow="Coverage area"
        title={<>GTHA + Southern Ontario</>}
        answer="We are based in Toronto, and our main coverage area is the Greater Toronto and Hamilton Area. We also complete appraisals on a case by case basis all throughout Southern Ontario. If the property is outside the GTHA, please still contact us. We will always try to work with you!"
        aside={<AreaMap />}
      >
        <HeroCtas location="areas_hero" />
      </PageHero>
      <section className="container-x py-20">
        <SectionHead eyebrow="Main coverage" title="Greater Toronto & Hamilton Area" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <div key={r} className="card p-7">
              <h2 className="text-xl font-medium text-ink-950">{r === "Toronto" ? "City of Toronto" : r === "Hamilton" ? "Hamilton" : `${r} Region`}</h2>
              <ul className="mt-4 space-y-1">
                {areas.filter((a) => a.region === r).map((a) => (
                  <li key={a.slug}>
                    <Link href={`/areas/${a.slug}`} className="group flex items-center justify-between border-b border-ink-100 py-2.5 text-[16px] text-ink-950 hover:text-accent-600">
                      <span className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4 text-accent-600" /> {a.name}</span>
                      <Icon name="arrow" className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-ink-100 bg-paper-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Beyond the GTHA" title="Southern Ontario, case by case" />
            <div className="mt-8"><SouthernOntario label={false} /></div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/southern-ontario.png" alt="Map of Southern Ontario" className="w-full border border-ink-100 bg-white" loading="lazy" />
          </div>
        </div>
      </section>
      <CtaBand location="areas_bottom" />
    </>
  );
}
