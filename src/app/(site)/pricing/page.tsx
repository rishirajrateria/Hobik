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
        title={<>Clear fees. <span className="text-gradient">No surprises.</span></>}
        answer="Every home is different, so we quote each appraisal individually — and confirm the exact fee before we book. Tell us about the property and you'll have a firm price fast."
        aside={<QuoteForm compact location="pricing_hero" />}
      >
        {site.startingPrice && (
          <div className="mt-8 inline-flex items-baseline gap-2 rounded-2xl bg-white/10 px-6 py-4 ring-1 ring-white/15">
            <span className="text-sm font-semibold text-white/70">Reports from</span>
            <span className="font-display text-4xl font-extrabold text-gold-300">{site.startingPrice}</span>
            <span className="text-sm text-white/60">+ HST</span>
          </div>
        )}
      </PageHero>

      <section className="container-x py-20">
        <SectionHead eyebrow="What affects the price" title="Six things that set your fee." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {factors.map((f) => (
            <div key={f.t} className="card flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-400/15 text-gold-600"><Icon name={f.icon} className="h-6 w-6" /></span>
              <div>
                <h3 className="font-extrabold text-navy-950">{f.t}</h3>
                <p className="text-sm text-slate-600">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHead eyebrow="Included in every report" title="What you always get." />
          <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
            {["On-site inspection & measurements", "Photos of interior & exterior", "Comparable sales analysis", "Market value conclusion", "Signed PDF report", "Follow-up questions answered", "CUSPAP-compliant format", `Typical delivery in ${site.turnaround}`].map((t) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold text-navy-900 ring-1 ring-navy-100">
                <Icon name="check" className="h-5 w-5 text-mint-500" /> {t}
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-500">Quotes available for: {services.map((s) => s.name).join(" · ")}</p>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="mx-auto max-w-3xl"><FaqList items={faq} /></div>
      </section>
      <CtaBand title="Get your exact fee in minutes." location="pricing_bottom" />
    </>
  );
}
