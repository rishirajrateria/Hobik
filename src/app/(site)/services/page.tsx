import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { CtaBand, HeroCtas, JsonLd, PageHero, Process, SectionHead, ServiceGrid } from "@/components/Sections";
import { absUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Home Appraisal Services in Toronto & the GTA",
  description: "Mortgage, estate, divorce, CRA capital gains, MPAC appeal, condo, pre-listing and litigation appraisals across Toronto and the GTA. Certified appraisers, fast reports.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Home appraisal services",
          itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: absUrl(`/services/${s.slug}`) })),
        }}
      />
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Our services"
        title={<>Appraisals for <span className="text-gradient">every purpose.</span></>}
        answer="Home Value Inc. prepares independent residential appraisals across Toronto and the GTA for lenders, executors, family lawyers, accountants, the CRA, MPAC and the courts."
      >
        <HeroCtas location="services_hero" />
      </PageHero>
      <section className="container-x py-20"><ServiceGrid /></section>
      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Simple from start to finish." />
          <div className="mt-14"><Process /></div>
        </div>
      </section>
      <CtaBand location="services_bottom" />
    </>
  );
}
