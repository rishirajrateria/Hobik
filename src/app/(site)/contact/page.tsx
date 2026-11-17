import { pageMeta } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CallLink } from "@/components/Tracked";
import { PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Contact Home Value Inc. | Toronto Home Appraisers",
  description: `Call ${site.phone} or send a message to book a certified home appraisal in Toronto or the GTA. Office at ${site.address.street}, North York.`,
  path: "/contact",
});

export default function ContactPage() {
  const mapQ = encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`);
  const cards = [
    { icon: "phone", t: "Call", v: site.phone, href: telHref, call: true },
    { icon: "mail", t: "Email", v: site.email, href: `mailto:${site.email}` },
    { icon: "pin", t: "Office", v: `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`, href: `https://www.google.com/maps/search/?api=1&query=${mapQ}` },
    { icon: "clock", t: "Hours", v: site.hoursLabel },
  ];
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title={<>Let&apos;s value your home</>}
        answer="Call for the fastest answer, or send the form and we'll get back to you with a quote."
        aside={<QuoteForm location="contact" />}
      >
        <dl className="mt-10 grid max-w-2xl border-t border-ink-950 sm:grid-cols-2 sm:gap-x-10">
          {cards.map((c) => (
            <div key={c.t} className="border-b border-ink-100 py-4">
              <dt className="text-[12px] font-semibold tracking-[0.16em] text-brick-600 uppercase">{c.t}</dt>
              <dd className="mt-1.5 text-[16px] break-words text-ink-950">
                {!c.href ? c.v : c.call ? (
                  <CallLink href={c.href} location="contact_card" className="font-display text-[22px] hover:text-brick-600">{c.v}</CallLink>
                ) : (
                  <a href={c.href} className="underline decoration-ink-950/25 underline-offset-4 hover:decoration-brick-500" {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{c.v}</a>
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
