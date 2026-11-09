import { pageMeta } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CallLink } from "@/components/Tracked";
import { PageHero, Process } from "@/components/Sections";

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
        title={<>Your appraisal quote, <span className="text-gradient">fast.</span></>}
        answer="Tell us about the property and why you need the appraisal. We'll confirm your fee and the earliest inspection time."
        aside={<QuoteForm location="quote_page" />}
      >
        <ul className="mt-8 space-y-3 text-white/85">
          {["Free & no obligation", "Fee confirmed before booking", `Report typically in ${site.turnaround}`, "AIC member appraisers"].map((t) => (
            <li key={t} className="flex items-center gap-3 text-lg font-semibold"><Icon name="check" className="h-6 w-6 text-mint-400" /> {t}</li>
          ))}
        </ul>
        <CallLink href={telHref} location="quote_page" className="btn-ghost mt-8 text-lg"><Icon name="phone" className="h-5 w-5" /> Prefer to talk? {site.phone}</CallLink>
      </PageHero>
      <section className="container-x py-20"><Process /></section>
    </>
  );
}
