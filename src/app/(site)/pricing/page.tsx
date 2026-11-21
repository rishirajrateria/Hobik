import { pageMeta } from "@/lib/seo";
import { faqs } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CtaBand, FaqList, JsonLd, PageHero, SectionHead } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Appraisal Fees & Payment | Value Trust Appraisals Inc.",
  description: "What affects an appraisal fee, what every report includes, and how to pay. Request a no-obligation quote from Value Trust Appraisals Inc.",
  path: "/pricing",
});

const factors = [
  { icon: "home", t: "Property type", d: "Residential, multi-residential, commercial, industrial, agricultural or institutional" },
  { icon: "chart", t: "Size & complexity", d: "Larger and special-purpose properties take longer" },
  { icon: "calendar", t: "Valuation date", d: "Current or retrospective" },
  { icon: "doc", t: "Purpose", d: "Financing, non-financing or advisory" },
  { icon: "pin", t: "Location", d: "GTHA, or elsewhere in Southern Ontario" },
  { icon: "bolt", t: "Deadline", d: "We will always try to meet your timeline" },
];

const faq = [
  { q: "How much does an appraisal cost?", a: "Every assignment is quoted individually, based on the property type, purpose, valuation date and complexity. We confirm your fee before booking." },
  faqs.find((f) => f.q.startsWith("What payment methods"))!,
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema(faq)} />
      <PageHero
        crumbs={[{ name: "Fees", path: "/pricing" }]}
        eyebrow="Fees"
        title={<>Quoted for your property</>}
        answer="Every property and purpose is different, so we quote each appraisal individually and confirm the fee before we book."
        aside={<QuoteForm compact location="pricing_hero" />}
      >
      </PageHero>

      <section className="container-x py-20">
        <SectionHead eyebrow="What affects the price" title="What sets your fee" />
        <dl className="mt-12 grid lg !rounded-[24px] px-5 sm:px-6 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
          {factors.map((f, i) => (
            <div key={f.t} className="border-b border-ink-100 py-6" data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
              <dt className="font-display text-[22px] font-medium text-ink-950">{f.t}</dt>
              <dd className="mt-1.5 text-[15px] text-ink-700">{f.d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHead eyebrow="Included in every report" title="What you always get" />
          <ul className="mt-12 grid max-w-4xl lg !rounded-[24px] px-5 sm:px-6 sm:grid-cols-2 sm:gap-x-10">
            {["Property inspection", "Photographs", "Market and comparable sales analysis", "Clearly stated purpose, method and conclusion of value", "Signed report", "CUSPAP-compliant format", "Prepared under an AACI-designated appraiser", "Clear communication with all parties"].map((t) => (
              <li key={t} className="flex gap-4 border-b border-ink-100 py-3.5 text-[16px] text-ink-950">
                <span className="mt-[0.6em] h-[5px] w-[5px] shrink-0 bg-accent-500" aria-hidden="true" />{t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="mx-auto max-w-3xl"><FaqList items={faq} /></div>
      </section>
      <CtaBand title="Request a quote for your property." location="pricing_bottom" />
    </>
  );
}
