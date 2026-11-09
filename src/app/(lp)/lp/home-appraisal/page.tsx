import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { getArea } from "@/lib/areas";
import { getService, services } from "@/lib/services";
import { faqs } from "@/lib/faqs";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand, FaqList, HeroCtas, Process, SectionHead, TrustStrip } from "@/components/Sections";

/**
 * Google Ads landing page. Not indexed (avoids duplicate content with the SEO pages).
 * Message-match the ad with URL params, e.g.
 *   /lp/home-appraisal?city=mississauga&s=estate-probate-appraisal&gclid=...
 */
export const metadata = pageMeta({
  title: "Certified Home Appraisal — Free Quote",
  description: `Certified home appraisals across Toronto & the GTA. Reports in ${site.turnaround}. Call ${site.phone}.`,
  path: "/lp/home-appraisal",
  noindex: true,
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdsLanding({ searchParams }: Props) {
  const sp = await searchParams;
  const area = typeof sp.city === "string" ? getArea(sp.city) : undefined;
  const service = typeof sp.s === "string" ? getService(sp.s) : undefined;
  const place = area?.name ?? "Toronto & the GTA";
  const headline = service ? service.name : "Certified Home Appraisal";

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
        <div className="container-x relative grid gap-10 py-10 sm:py-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="eyebrow-dark"><Icon name="shield" className="h-4 w-4" /> AIC member appraisers</span>
            <h1 className="mt-4 text-4xl leading-[1.05] font-extrabold text-white sm:text-6xl">
              {headline} in <span className="text-gradient">{place}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75 sm:text-xl">
              {service ? service.short : "Independent, lender-ready appraisals for mortgages, estates, divorce, CRA and tax appeals."} Reports in {site.turnaround}.
            </p>
            <ul className="mt-6 grid max-w-lg gap-3 text-white/90 sm:grid-cols-2">
              {["Free, no-obligation quote", "Fee confirmed upfront", "Rush service available", "Retrospective dates"].map((t) => (
                <li key={t} className="flex items-center gap-2 font-semibold"><Icon name="check" className="h-5 w-5 text-mint-400" /> {t}</li>
              ))}
            </ul>
            <div className="hidden lg:block"><HeroCtas location="lp_hero" /></div>
          </div>
          <div className="lg:col-span-5">
            <QuoteForm compact defaultService={service?.name ?? ""} location="lp_hero_form" />
          </div>
        </div>
      </section>
      <TrustStrip />
      <section className="container-x py-16">
        <SectionHead eyebrow="We appraise for" title="Any purpose. One trusted report." />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          {services.map((s) => (
            <div key={s.slug} className="card flex flex-col items-center gap-3 p-5 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-600"><Icon name={s.icon} className="h-6 w-6" /></span>
              <span className="text-sm font-bold text-navy-950">{s.name}</span>
            </div>
          ))}
        </div>
      </section>
      <Testimonials service={service?.name} />
      <section className="bg-navy-50 py-16">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Quote today. Report this week." />
          <div className="mt-12"><Process /></div>
        </div>
      </section>
      <section className="container-x py-16">
        <div className="mx-auto max-w-3xl"><FaqList items={faqs.slice(0, 5)} /></div>
      </section>
      <CtaBand title={`Get your ${place} appraisal quote now.`} location="lp_bottom" />
    </>
  );
}
