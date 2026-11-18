import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { faqSchema } from "@/lib/schema";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CtaBand, FaqList, JsonLd, PageHero, SectionHead } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Home Appraisal Cost in Toronto | Rates & Free Quote",
  description: "What a home appraisal costs in Toronto and the GTA, what affects the fee, and how to get an exact, no-obligation quote from Home Value Inc.",
  path: "/pricing",
});

const factors = [
  { icon: "home", t: "Property type", d: "Condo, house, multiplex or acreage" },
  { icon: "chart", t: "Size & value", d: "Large, luxury or custom homes take longer" },
  { icon: "calendar", t: "Valuation date", d: "Current or retrospective (past date)" },
  { icon: "doc", t: "Purpose", d: "Lender, estate, family law, CRA or court" },
  { icon: "bolt", t: "Turnaround", d: "Standard or rush delivery" },
  { icon: "gavel", t: "Extras", d: "Testimony, extra structures, revisions" },
];

const faq = [
  { q: "How much is a home appraisal in Toronto?", a: `Most standard residential appraisals in Toronto cost a few hundred dollars plus HST${site.startingPrice ? `, with Home Value Inc. reports starting from ${site.startingPrice}` : ""}. Complex, high-value, retrospective and litigation assignments cost more. We confirm your exact fee before booking.` },
  { q: "Is court testimony included?", a: "No. Court preparation and testimony, multiple structures, and complex, oversized, historical or stigmatized properties are quoted separately." },
  { q: "When do I pay?", a: "We confirm the fee upfront when you book. Payment details are provided with your booking confirmation." },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema(faq)} />
      <PageHero
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
        eyebrow="Transparent pricing"
        title={<>Clear fees. No surprises</>}
        answer="Every home is different, so we quote each appraisal individually and confirm the exact fee before we book. Tell us about the property and you'll have a firm price fast."
        aside={<QuoteForm compact location="pricing_hero" />}
      >
        {site.startingPrice && (
          <div className="mt-8 inline-flex items-baseline gap-2 border-y border-ink-950 py-4">
            <span className="text-sm font-semibold text-ink-700">Reports from</span>
            <span className="font-display text-4xl font-medium text-ink-950">{site.startingPrice}</span>
            <span className="text-sm text-ink-700">+ HST</span>
          </div>
        )}
      </PageHero>

      <section className="container-x py-20">
        <SectionHead eyebrow="What affects the price" title="Six things that set your fee" />
        <dl className="mt-12 grid border-t border-ink-950 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
          {factors.map((f, i) => (
            <div key={f.t} className="border-b border-ink-100 py-6" data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
              <dt className="font-display text-[22px] font-medium text-ink-950">{f.t}</dt>
              <dd className="mt-1.5 text-[15px] text-ink-700">{f.d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-ink-100 bg-paper-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow="Included in every report" title="What you always get" />
          <ul className="mt-12 grid max-w-4xl border-t border-ink-950 sm:grid-cols-2 sm:gap-x-10">
            {["On-site inspection and measurements", "Photos of the interior and exterior", "Comparable sales analysis", "Market value conclusion", "Signed PDF report", "Follow-up questions answered", "CUSPAP-compliant format", `Typical delivery in ${site.turnaround}`].map((t) => (
              <li key={t} className="flex gap-4 border-b border-ink-100 py-3.5 text-[16px] text-ink-950">
                <span className="mt-[0.6em] h-[5px] w-[5px] shrink-0 bg-accent-500" aria-hidden="true" />{t}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[14px] text-ink-700">Quotes available for: {services.map((s) => s.name).join(", ")}.</p>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="mx-auto max-w-3xl"><FaqList items={faq} /></div>
      </section>
      <CtaBand title="Get your exact fee in minutes" location="pricing_bottom" />
    </>
  );
}
