import { pageMeta } from "@/lib/seo";
import { services, propertyTypes, whatWeDo } from "@/lib/services";
import { CtaBand, HeroCtas, JsonLd, PageHero, Process, SectionHead, WhatWeDo } from "@/components/Sections";
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
        title={<>What we do</>}
        answer="We provide appraisal reports for residential, multi-residential, commercial, institutional, industrial and agricultural properties for a variety of use cases. We are accredited and in good standing with the Appraisal Institute of Canada (AIC), and all our reports are CUSPAP compliant."
      >
        <HeroCtas location="services_hero" />
      </PageHero>
      <section className="container-x py-16"><WhatWeDo items={whatWeDo} /></section>
      <section className="py-16">
        <div className="container-x">
          <SectionHead eyebrow="Property types" title="What we appraise" />
          <div className="mt-12"><WhatWeDo items={propertyTypes} /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Simple from start to finish" />
          <div className="mt-14"><Process /></div>
        </div>
      </section>
      <CtaBand location="services_bottom" />
    </>
  );
}
