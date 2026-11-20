import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getService, services, type Service } from "@/lib/services";
import { serviceOptions } from "@/lib/defaultForms";
import { faqs as generalFaqs } from "@/lib/faqs";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { QuoteForm } from "@/components/QuoteForm";
import { Vignette } from "@/components/Vignettes";
import { Testimonials } from "@/components/Testimonials";
import { AreaChips, CtaBand, SouthernOntario, FaqList, HeroCtas, JsonLd, PageHero, Process, SectionHead } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: `${s.name} Appraisal Toronto & Southern Ontario | AACI Appraiser`, description: `${s.answer.slice(0, 150).replace(/\s\S*$/, "")}…`, path: `/services/${s.slug}` });
}

/** Pre-select the matching option in the quote form. */
function formDefaults(s: Service): Record<string, string> {
  if (s.group === "property") return { property_type: s.name };
  const opt = serviceOptions.find((o) => o.toLowerCase().startsWith(s.name.toLowerCase().slice(0, 8)));
  return opt && s.slug !== "non-financing-appraisal" ? { service: opt } : {};
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const faq = [...s.faqs, ...generalFaqs.slice(0, 2)];
  const related = services.filter((x) => x.slug !== s.slug && x.group === s.group).slice(0, 4);

  return (
    <>
      <JsonLd data={[serviceSchema(s), faqSchema(faq)]} />
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }]}
        eyebrow={s.group === "property" ? "Property type" : s.group === "use" ? "Non-financing appraisal" : "Service"}
        title={<>{s.slug === "advisory-consulting" ? s.name : `${s.name} appraisals`}</>}
        answer={s.answer}
        aside={<QuoteForm compact defaults={formDefaults(s)} location={`service_${s.slug}`} />}
      >
        <HeroCtas location={`service_${s.slug}_hero`} />
      </PageHero>

      {/* key facts */}
      <section className="container-x grid items-center gap-10 py-14 lg:grid-cols-12">
        <Vignette name={s.icon} className="mx-auto w-full max-w-[340px] lg:col-span-4" title={s.name} />
        <dl className="grid border-y border-ink-950 sm:grid-cols-3 lg:col-span-8">
          {s.highlights.map((h, i) => (
            <div key={h.label} className={`py-6 ${i > 0 ? "border-t border-ink-100 sm:border-t-0 sm:border-l sm:pl-6" : ""}`}>
              <dt className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">{h.label}</dt>
              <dd className="mt-2 font-display text-[24px] leading-snug font-medium text-ink-950">{h.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* what you get + who it's for */}
      <section className="container-x grid gap-14 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          <h2 className="text-[32px] font-medium text-ink-950">What you get</h2>
          <ul className="mt-6 border-t border-ink-950">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-4 border-b border-ink-100 py-4 text-[17px] text-ink-800">
                <span className="mt-[0.6em] h-[5px] w-[5px] shrink-0 bg-accent-500" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5" data-reveal>
          <h2 className="text-[32px] font-medium text-ink-950">Who it&apos;s for</h2>
          <ul className="mt-6 border-t border-ink-950">
            {s.forWho.map((w) => (
              <li key={w} className="border-b border-ink-100 py-4 font-display text-[20px] text-ink-950">{w}</li>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials service={s.name} dark single />

      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHead eyebrow="The process" title="Booked, inspected, delivered" />
          <div className="mt-12"><Process /></div>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-paper-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="FAQ" title="Questions" />
          </div>
          <div className="lg:col-span-8"><FaqList items={faq} /></div>
        </div>
      </section>

      <section className="border-t border-ink-100 py-20">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead eyebrow="Coverage" title="GTHA + Southern Ontario" />
            <div className="mt-10"><AreaChips /></div>
            <div className="mt-10"><SouthernOntario /></div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">{s.group === "property" ? "Other property types" : "Related services"}</h2>
            <ul className="mt-5 border-t border-ink-950">
              {related.map((r) => (
                <li key={r.slug} className="border-b border-ink-100">
                  <Link href={`/services/${r.slug}`} className="group block py-4">
                    <span className="font-display text-[20px] text-ink-950 decoration-accent-500 underline-offset-4 group-hover:underline">{r.name}</span>
                    <span className="mt-1 block text-[14px] text-ink-700">{r.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand title={`Need a ${s.name.toLowerCase()} appraisal? Request a quote.`} location={`service_${s.slug}_bottom`} />
    </>
  );
}
