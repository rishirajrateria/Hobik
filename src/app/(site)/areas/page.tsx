import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { areas } from "@/lib/areas";
import { Icon } from "@/components/Icon";
import { AreaMap, CtaBand, HeroCtas, PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Home Appraisers Serving Toronto, the GTA & Southern Ontario",
  description: "Certified home appraisals in Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Durham, Hamilton and more.",
  path: "/areas",
});

const regions = ["Toronto", "Peel", "York", "Halton", "Durham", "Hamilton"] as const;

export default function AreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Service Areas", path: "/areas" }]}
        eyebrow="Service areas"
        title={<>Appraising homes <span className="text-gradient">across the GTA.</span></>}
        answer="Home Value Inc. is based in North York and appraises residential properties throughout Toronto, Peel, York, Halton and Durham regions and Hamilton."
        aside={<AreaMap />}
      >
        <HeroCtas location="areas_hero" />
      </PageHero>
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <div key={r} className="card p-7">
              <h2 className="text-xl font-extrabold text-navy-950">{r === "Toronto" ? "City of Toronto" : r === "Hamilton" ? "Hamilton" : `${r} Region`}</h2>
              <ul className="mt-4 space-y-1">
                {areas.filter((a) => a.region === r).map((a) => (
                  <li key={a.slug}>
                    <Link href={`/areas/${a.slug}`} className="group flex items-center justify-between rounded-xl px-3 py-2.5 font-semibold text-navy-900 hover:bg-navy-50">
                      <span className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4 text-gold-600" /> {a.name}</span>
                      <Icon name="arrow" className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBand location="areas_bottom" />
    </>
  );
}
