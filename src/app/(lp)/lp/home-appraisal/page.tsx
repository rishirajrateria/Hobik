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
  title: "Certified Home Appraisal | Free Quote",
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
      <section className="border-b border-ink-100">
        <div className="container-x grid gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:items-start">
          <div className="animate-fade-up lg:col-span-7">
            <span className="eyebrow">Appraisal Institute of Canada members</span>
            <h1 className="mt-5 text-[42px] leading-[1.05] font-medium text-ink-950 sm:text-[60px]">
              {headline} in {place}
            </h1>
            <p className="mt-6 max-w-xl text-[19px] leading-relaxed text-ink-700">
              {service ? service.short : "Independent, lender-ready appraisals for mortgages, estates, divorce, CRA and tax appeals."} Reports in {site.turnaround}.
            </p>
            <ul className="mt-8 grid max-w-lg border-t border-ink-950 sm:grid-cols-2 sm:gap-x-8">
              {["Free, no-obligation quote", "Fee confirmed before booking", "Rush service available", "Current or past valuation dates"].map((t) => (
                <li key={t} className="border-b border-ink-100 py-3 text-[15px] text-ink-950">{t}</li>
              ))}
            </ul>
            <div className="hidden lg:block"><HeroCtas location="lp_hero" /></div>
          </div>
          <div className="animate-fade-up [animation-delay:150ms] lg:col-span-5">
            <QuoteForm compact defaultService={service?.name ?? ""} location="lp_hero_form" />
          </div>
        </div>
      </section>
      <TrustStrip />
      <section className="container-x py-20">
        <SectionHead eyebrow="We appraise for" title="Whatever the purpose, one independent report" />
        <ul className="mt-10 grid border-t border-ink-950 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug} className="border-b border-ink-100 py-4 font-display text-[19px] text-ink-950">{s.name}</li>
          ))}
        </ul>
      </section>
      <Testimonials service={service?.name} />
      <section className="border-t border-ink-100 bg-paper-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Quote today, report this week" />
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
