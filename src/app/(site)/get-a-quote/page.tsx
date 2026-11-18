import { pageMeta } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CallLink } from "@/components/Tracked";
import { PageHero, Process } from "@/components/Sections";
import { Testimonials } from "@/components/Testimonials";

export const metadata = pageMeta({
  title: "Get a Free Home Appraisal Quote | Toronto & GTA",
  description: `Request a free, no-obligation quote for a certified home appraisal in Toronto or the GTA. Or call ${site.phone}.`,
  path: "/get-a-quote",
});

export default function QuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Get a Quote", path: "/get-a-quote" }]}
        eyebrow="Free quote"
        title={<>Your appraisal quote, fast</>}
        answer="Tell us about the property and why you need the appraisal. We'll confirm your fee and the earliest inspection time."
        aside={<QuoteForm location="quote_page" />}
      >
        <ul className="mt-8 max-w-lg border-t border-ink-950">
          {["Free & no obligation", "Fee confirmed before booking", `Report typically in ${site.turnaround}`, "AIC member appraisers"].map((t) => (
            <li key={t} className="border-b border-ink-100 py-3 text-[16px] text-ink-950">{t}</li>
          ))}
        </ul>
        <p className="mt-8 text-[16px] text-ink-700">Prefer to talk? Call <CallLink href={telHref} location="quote_page" className="font-semibold text-ink-950 underline decoration-ink-950/25 underline-offset-4 hover:decoration-accent-500">{site.phone}</CallLink></p>
      </PageHero>
      <Testimonials />
      <section className="container-x py-20"><Process /></section>
    </>
  );
}
