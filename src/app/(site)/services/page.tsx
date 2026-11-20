import { pageMeta } from "@/lib/seo";
import { services, serviceUses } from "@/lib/services";
import { CtaBand, HeroCtas, JsonLd, PageHero, Process, SectionHead, ServiceGrid, ServiceLines } from "@/components/Sections";
import { absUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Appraisal Services: Mortgage Financing, Non-Financing & Advisory",
  description: "Mortgage financing, non-financing (separation, tax, litigation, estates, power of sale, assessment appeals, expropriation) and advisory appraisals for every property type in the GTHA and Southern Ontario.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Appraisal services",
          itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: `${s.name} appraisal`, url: absUrl(`/services/${s.slug}`) })),
        }}
      />
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Our services"
        title={<>Appraisal and advisory services</>}
        answer="We provide appraisal reports for residential, multi-residential, commercial, industrial, farm and institutional properties for a variety of use cases. We are accredited and in good standing with the Appraisal Institute of Canada (AIC), and all our reports are CUSPAP compliant."
      >
        <HeroCtas location="services_hero" />
      </PageHero>
      <section className="container-x py-20"><ServiceLines /></section>
      <section className="border-t border-ink-100 py-20">
        <div className="container-x">
          <SectionHead eyebrow="Non-financing" title="Current and retrospective reports" />
          <div className="mt-12"><ServiceGrid items={serviceUses} /></div>
        </div>
      </section>
      <section className="border-t border-ink-100 py-20">
        <div className="container-x">
          <SectionHead eyebrow="Property types" title="What we appraise" />
          <div className="mt-12"><ServiceGrid /></div>
        </div>
      </section>
      <section className="border-t border-ink-100 bg-paper-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Simple from start to finish" />
          <div className="mt-14"><Process /></div>
        </div>
      </section>
      <CtaBand location="services_bottom" />
    </>
  );
}
