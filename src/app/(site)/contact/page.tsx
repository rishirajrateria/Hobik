import { pageMeta } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { QuoteForm } from "@/components/QuoteForm";
import { CallLink } from "@/components/Tracked";
import { PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Contact Value Trust Appraisals Inc.",
  description: `Call ${site.phone} or email ${site.email} to request an appraisal quote. Serving the GTHA and Southern Ontario.`,
  path: "/contact",
});

export default function ContactPage() {
  const cards = [
    { icon: "phone", t: "Call", v: site.phone, href: telHref, call: true },
    { icon: "mail", t: "Email", v: site.email, href: `mailto:${site.email}` },
    { icon: "globe", t: "Coverage", v: `${site.coverage}, case by case` },
  ];
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title={<>Call or email us</>}
        answer="Alternatively, fill out the form and we will get back to you."
        aside={<QuoteForm location="contact" />}
      >
        <dl className="mt-10 grid max-w-2xl lg !rounded-[24px] px-5 sm:px-6 sm:grid-cols-2 sm:gap-x-10">
          {cards.map((c) => (
            <div key={c.t} className="border-b border-ink-100 py-4">
              <dt className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">{c.t}</dt>
              <dd className="mt-1.5 text-[16px] break-words text-ink-950">
                {!c.href ? c.v : c.call ? (
                  <CallLink href={c.href} location="contact_card" className="font-display text-[22px] hover:text-accent-600">{c.v}</CallLink>
                ) : (
                  <a href={c.href} className="underline decoration-ink-950/25 underline-offset-4 hover:decoration-accent-500" {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{c.v}</a>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>
    </>
  );
}
