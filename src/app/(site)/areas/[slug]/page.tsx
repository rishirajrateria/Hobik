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
    title: `Appraisals in ${a.name} | Residential, Commercial & Industrial Appraiser`,
    description: `Real estate appraisals in ${a.name}, Ontario, including ${a.neighbourhoods.slice(0, 3).join(", ")}. Residential, commercial, industrial and other property, for financing and non-financing purposes.`,
    path: `/areas/${a.slug}`,
  });
}

export default async function AreaPage({ params }: Props) {
  const a = getArea((await params).slug);
  if (!a) notFound();

  const faq = [
    { q: `Do you provide appraisals in ${a.name}?`, a: `Yes. ${a.name} is part of our main coverage area, the GTHA. We appraise property throughout ${a.name}, including ${a.neighbourhoods.slice(0, 4).join(", ")}. Call ${site.phone} or request a quote online.` },
    { q: `What types of ${a.name} properties do you appraise?`, a: `Residential, multi-residential, commercial, industrial, agricultural and institutional property, for mortgage financing, non-financing purposes (separation, tax, litigation, estates, power of sale, assessment appeals, expropriation) and advisory work.` },
  ];

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faq),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Real estate appraisal in ${a.name}`,
            serviceType: "Real estate appraisal",
            provider: { "@id": absUrl("/#business") },
            areaServed: { "@type": "City", name: `${a.name}, Ontario`, containedInPlace: { "@type": "AdministrativeArea", name: "Ontario, Canada" } },
            url: absUrl(`/areas/${a.slug}`),
          },
        ]}
      />
      <PageHero
        crumbs={[{ name: "Areas", path: "/areas" }, { name: a.name, path: `/areas/${a.slug}` }]}
        eyebrow={`${a.name}, Ontario`}
        title={<>Appraisals in {a.name}</>}
        answer={a.intro}
        aside={<QuoteForm compact location={`area_${a.slug}`} />}
      >
        <HeroCtas location={`area_${a.slug}_hero`} />
      </PageHero>

      <section className="container-x grid gap-14 py-20 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHead center={false} eyebrow="Local expertise" title={`Neighbourhoods we cover in ${a.name}`} />
          <ul className="mt-8 columns-2 gap-8 border-t border-ink-950">
            {a.neighbourhoods.map((n) => (
              <li key={n} className="break-inside-avoid border-b border-ink-100 py-2.5 text-[16px] text-ink-950">{n}</li>
            ))}
          </ul>
          <h3 className="mt-10 text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">Property types we see most</h3>
          <p className="mt-3 font-display text-[22px] leading-snug text-ink-950">{a.homeTypes.join(", ")}</p>
        </div>
        <div data-reveal="scale"><AreaMap highlight={a.slug} /></div>
      </section>

      <section className="border-t border-ink-100 bg-paper-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow={`${a.name} appraisal services`} title={`Every property type in ${a.name}`} />
          <div className="mt-14"><ServiceGrid citySuffix={a.name} /></div>
        </div>
      </section>

      <Testimonials title="What our clients say" />

      <section className="container-x py-20">
        <SectionHead eyebrow="How it works" title="Four simple steps" />
        <div className="mt-14"><Process /></div>
      </section>

      <section className="border-t border-ink-100 bg-paper-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionHead center={false} eyebrow="FAQ" title={`${a.name} appraisal FAQs`} /></div>
          <div className="lg:col-span-8"><FaqList items={faq} /></div>
        </div>
      </section>

      <section className="container-x py-16">
        <h2 className="text-center text-2xl font-medium text-ink-950">Nearby areas we serve</h2>
        <div className="mt-8 flex justify-center"><AreaChips exclude={a.slug} /></div>
      </section>

      <CtaBand title={`Need an appraisal in ${a.name}? Request a quote.`} location={`area_${a.slug}_bottom`} />
    </>
  );
}
