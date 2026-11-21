import { pageMeta } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CallLink } from "@/components/Tracked";
import { PageHero, Process } from "@/components/Sections";
import { Testimonials } from "@/components/Testimonials";

export const metadata = pageMeta({
  title: "Request an Appraisal Quote",
  description: `Request a no-obligation quote for a residential, commercial, industrial, agricultural or institutional appraisal. Or call ${site.phone}.`,
  path: "/get-a-quote",
});

export default function QuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Request a Quote", path: "/get-a-quote" }]}
        eyebrow="Request a quote"
        title={<>Tell us about the property</>}
        answer="Fill out some info and we will be in touch shortly. We'll confirm your fee and the earliest inspection time."
        aside={<QuoteForm location="quote_page" />}
      >
        <ul className="mt-8 max-w-lg lg !rounded-[24px] px-5 sm:px-6">
          {["No obligation", "Fee confirmed before booking", "AACI-designated appraiser", "CUSPAP-compliant reports"].map((t) => (
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
