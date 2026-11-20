import { pageMeta } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CallLink } from "@/components/Tracked";
import { PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Contact Value Trust Appraisals Inc.",
  description: `Call ${site.phone} or email ${site.email} to request an appraisal quote. Office at ${site.address.street}, ${site.address.city}.`,
  path: "/contact",
});

export default function ContactPage() {
  const addr = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`.trim();
  const mapQ = encodeURIComponent(addr);
  const cards = [
    { icon: "phone", t: "Call", v: site.phone, href: telHref, call: true },
    { icon: "mail", t: "Email", v: site.email, href: `mailto:${site.email}` },
    { icon: "pin", t: "Office", v: addr, href: `https://www.google.com/maps/search/?api=1&query=${mapQ}` },
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
        <dl className="mt-10 grid max-w-2xl border-t border-ink-950 sm:grid-cols-2 sm:gap-x-10">
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
      <section className="container-x py-16">
        <div className="overflow-hidden border border-ink-100">
          <iframe
            title={`Map to ${site.name}`}
            src={`https://www.google.com/maps?q=${mapQ}&output=embed`}
            className="h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
