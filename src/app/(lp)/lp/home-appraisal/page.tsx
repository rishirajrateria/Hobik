import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { getArea } from "@/lib/areas";
import { getService, propertyTypes, serviceLines, serviceUses } from "@/lib/services";
import { faqs } from "@/lib/faqs";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand, FaqList, HeroCtas, Process, SectionHead, TrustStrip } from "@/components/Sections";

/**
 * Google Ads landing page. Not indexed (avoids duplicate content with the SEO pages).
 * Message-match the ad with URL params, e.g.
 *   /lp/home-appraisal?city=mississauga&s=estate-appraisal&gclid=...
 */
export const metadata = pageMeta({
  title: "Real Estate Appraisal | Request a Quote",
  description: `AACI-designated appraiser for residential, commercial, industrial, agricultural and institutional property in the GTHA and Southern Ontario. Call ${site.phone}.`,
  path: "/lp/home-appraisal",
  noindex: true,
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdsLanding({ searchParams }: Props) {
  const sp = await searchParams;
  const area = typeof sp.city === "string" ? getArea(sp.city) : undefined;
  const service = typeof sp.s === "string" ? getService(sp.s) : undefined;
  const place = area?.name ?? "Toronto & Southern Ontario";
  const headline = service ? `${service.name} Appraisal` : "Real Estate Appraisal";

  return (
    <>
      <section className="border-b border-ink-100">
        <div className="container-x grid gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:items-start">
          <div className="animate-fade-up lg:col-span-7">
            <span className="eyebrow">AACI-designated appraiser · AIC</span>
            <h1 className="mt-5 text-[42px] leading-[1.05] font-medium text-ink-950 sm:text-[60px]">
              {headline} in {place}
            </h1>
            <p className="mt-6 max-w-xl text-[19px] leading-relaxed text-ink-700">
              {service ? service.short : "Independent, reliable appraisal reports for residential, commercial, industrial, agricultural and institutional property."}
            </p>
            <ul className="mt-8 grid max-w-lg lg !rounded-[24px] px-5 sm:px-6 sm:grid-cols-2 sm:gap-x-8">
              {["No-obligation quote", "Fee confirmed before booking", "CUSPAP-compliant reports", "GTHA + Southern Ontario, case by case"].map((t) => (
                <li key={t} className="border-b border-ink-100 py-3 text-[15px] text-ink-950">{t}</li>
              ))}
            </ul>
            <div className="hidden lg:block"><HeroCtas location="lp_hero" /></div>
          </div>
          <div className="animate-fade-up [animation-delay:150ms] lg:col-span-5">
            <QuoteForm compact defaults={service?.group === "property" ? { property_type: service.name } : {}} location="lp_hero_form" />
          </div>
        </div>
      </section>
      <TrustStrip />
      <section className="container-x py-20">
        <SectionHead eyebrow="What we appraise" title="Every property type, every purpose" />
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {[["Property types", propertyTypes], ["Purposes", [...serviceLines.filter((s) => s.slug !== "non-financing-appraisal"), ...serviceUses]]].map(([label, list]) => (
            <div key={label as string}>
              <h2 className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">{label as string}</h2>
              <ul className="mt-4 grid lg !rounded-[24px] px-5 sm:px-6 sm:grid-cols-2 sm:gap-x-8">
                {(list as typeof propertyTypes).map((s) => (
                  <li key={s.slug} className="border-b border-ink-100 py-3.5 font-display text-[19px] text-ink-950">{s.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Testimonials service={service?.name} />
      <section className="py-20">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="Four simple steps" />
          <div className="mt-12"><Process /></div>
        </div>
      </section>
      <section className="container-x py-16">
        <div className="mx-auto max-w-3xl"><FaqList items={faqs.slice(0, 5)} /></div>
      </section>
      <CtaBand title={`Request your ${area?.name ?? ""} appraisal quote.`.replace("  ", " ")} location="lp_bottom" />
    </>
  );
}
