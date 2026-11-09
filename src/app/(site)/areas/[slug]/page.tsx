import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { areas, getArea } from "@/lib/areas";
import { site } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { AreaChips, AreaMap, CtaBand, FaqList, HeroCtas, JsonLd, PageHero, Process, SectionHead, ServiceGrid } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const a = getArea((await params).slug);
  if (!a) return {};
  return pageMeta({
    title: `Home Appraisal ${a.name} | Certified ${a.name} Appraisers`,
    description: `Certified home appraisals in ${a.name}, Ontario — ${a.neighbourhoods.slice(0, 3).join(", ")} & more. Mortgage, estate, divorce, CRA & tax appeal reports in ${site.turnaround}. Free quote.`,
    path: `/areas/${a.slug}`,
  });
}

export default async function AreaPage({ params }: Props) {
  const a = getArea((await params).slug);
  if (!a) notFound();

  const faq = [
    { q: `Do you provide home appraisals in ${a.name}?`, a: `Yes. Home Value Inc. appraises houses, condos and townhomes throughout ${a.name}, including ${a.neighbourhoods.slice(0, 4).join(", ")}. Call ${site.phone} or request a free quote online.` },
    { q: `How long does a home appraisal take in ${a.name}?`, a: `The inspection takes 30–60 minutes and most ${a.name} appraisal reports are delivered within ${site.turnaround}. Rush service is available.` },
    { q: `What types of ${a.name} properties do you appraise?`, a: `We regularly appraise ${a.homeTypes.join(", ").toLowerCase()} in ${a.name}, for mortgages, estates, separations, CRA capital gains and MPAC appeals.` },
  ];

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faq),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Home Appraisal in ${a.name}`,
            serviceType: "Residential real estate appraisal",
            provider: { "@id": absUrl("/#business") },
            areaServed: { "@type": "City", name: `${a.name}, Ontario`, containedInPlace: { "@type": "AdministrativeArea", name: "Ontario, Canada" } },
            url: absUrl(`/areas/${a.slug}`),
          },
        ]}
      />
      <PageHero
        crumbs={[{ name: "Areas", path: "/areas" }, { name: a.name, path: `/areas/${a.slug}` }]}
        eyebrow={`${a.name}, Ontario`}
        title={<>Home Appraisal in <span className="text-gradient">{a.name}</span></>}
        answer={a.intro}
        aside={<QuoteForm compact location={`area_${a.slug}`} />}
      >
        <HeroCtas location={`area_${a.slug}_hero`} />
      </PageHero>

      <section className="container-x grid gap-8 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHead center={false} eyebrow="Local expertise" title={`Neighbourhoods we cover in ${a.name}`} />
          <div className="mt-8 flex flex-wrap gap-2">
            {a.neighbourhoods.map((n) => (
              <span key={n} className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-4 py-2 text-sm font-semibold text-navy-900 ring-1 ring-navy-100">
                <Icon name="pin" className="h-4 w-4 text-gold-600" /> {n}
              </span>
            ))}
          </div>
          <h3 className="mt-10 text-lg font-extrabold text-navy-950">Property types</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {a.homeTypes.map((t) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold text-navy-900 ring-1 ring-navy-100">
                <Icon name="home" className="h-5 w-5 text-gold-600" /> {t}
              </div>
            ))}
          </div>
        </div>
        <AreaMap highlight={a.slug} />
      </section>

      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow={`${a.name} appraisal services`} title={`Every appraisal type in ${a.name}.`} />
          <div className="mt-14"><ServiceGrid citySuffix={a.name} /></div>
        </div>
      </section>

      <Testimonials title={`Trusted by homeowners across the GTA.`} />

      <section className="container-x py-20">
        <SectionHead eyebrow="How it works" title="Four steps. Zero hassle." />
        <div className="mt-14"><Process /></div>
      </section>

      <section className="bg-navy-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionHead center={false} eyebrow="FAQ" title={`${a.name} appraisal FAQs`} /></div>
          <div className="lg:col-span-8"><FaqList items={faq} /></div>
        </div>
      </section>

      <section className="container-x py-16">
        <h2 className="text-center text-2xl font-extrabold text-navy-950">Nearby areas we serve</h2>
        <div className="mt-8 flex justify-center"><AreaChips exclude={a.slug} /></div>
      </section>

      <CtaBand title={`Need a ${a.name} appraisal? Get a free quote.`} location={`area_${a.slug}_bottom`} />
    </>
  );
}
