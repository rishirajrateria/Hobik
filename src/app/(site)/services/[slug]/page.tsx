import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getService, services } from "@/lib/services";
import { faqs as generalFaqs } from "@/lib/faqs";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { AreaChips, CtaBand, FaqList, HeroCtas, JsonLd, PageHero, Process, SectionHead } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: `${s.name} Toronto | Certified Appraisers`, description: `${s.answer.slice(0, 150).replace(/\s\S*$/, "")}… Free quote.`, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const faq = [...s.faqs, ...generalFaqs.slice(0, 3)];
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[serviceSchema(s), faqSchema(faq)]} />
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }]}
        eyebrow="Toronto & GTA"
        title={<>{s.name} <span className="text-gradient">in Toronto</span></>}
        answer={s.answer}
        aside={<QuoteForm compact defaultService={s.name} location={`service_${s.slug}`} />}
      >
        <HeroCtas location={`service_${s.slug}_hero`} />
      </PageHero>

      {/* highlights */}
      <section className="container-x -mt-px py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {s.highlights.map((h) => (
            <div key={h.label} className="card p-6">
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{h.label}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-navy-950">{h.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* what you get + who it's for */}
      <section className="container-x grid gap-8 pb-20 lg:grid-cols-2">
        <div className="card p-8 sm:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-400 text-navy-950"><Icon name={s.icon} className="h-7 w-7" /></span>
          <h2 className="mt-6 text-3xl font-extrabold text-navy-950">What you get</h2>
          <ul className="mt-6 space-y-4">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-lg text-slate-700"><Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-mint-500" />{b}</li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 text-white sm:p-10">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold">Who it&apos;s for</h2>
            <div className="mt-6 grid gap-3">
              {s.forWho.map((w) => (
                <div key={w} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/15 text-gold-300"><Icon name="check" className="h-5 w-5" /></span>
                  <span className="text-lg font-bold">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials service={s.name} dark />

      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow="The process" title="Booked, inspected, delivered." />
          <div className="mt-14"><Process /></div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead center={false} eyebrow="FAQ" title={`${s.name}: FAQs`} />
          </div>
          <div className="lg:col-span-8"><FaqList items={faq} /></div>
        </div>
      </section>

      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow="Where we work" title={`${s.name} across the GTA`} />
          <div className="mt-10 flex justify-center"><AreaChips /></div>
          <h2 className="mt-20 text-center text-2xl font-extrabold text-navy-950">Related services</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/services/${r.slug}`} className="card group flex items-center gap-4 p-5 hover:ring-gold-400">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-800 group-hover:bg-gold-400"><Icon name={r.icon} className="h-6 w-6" /></span>
                <span className="font-bold text-navy-950">{r.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={`Book your ${s.name.toLowerCase()} today.`} location={`service_${s.slug}_bottom`} />
    </>
  );
}
