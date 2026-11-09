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
        title={<>Let&apos;s value <span className="text-gradient">your home.</span></>}
        answer="Call for the fastest answer, or send the form and we'll get back to you with a quote."
        aside={<QuoteForm location="contact" />}
      >
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {cards.map((c) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-400 text-navy-950"><Icon name={c.icon} className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold tracking-widest text-white/50 uppercase">{c.t}</span>
                  <span className="block font-semibold break-words text-white">{c.v}</span>
                </span>
              </>
            );
            const cls = "flex items-start gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10";
            if (!c.href) return <div key={c.t} className={cls}>{inner}</div>;
            if (c.call) return <CallLink key={c.t} href={c.href} location="contact_card" className={cls}>{inner}</CallLink>;
            return <a key={c.t} href={c.href} className={cls} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{inner}</a>;
          })}
        </div>
      </PageHero>
      <section className="container-x py-16">
        <div className="overflow-hidden rounded-3xl ring-1 ring-navy-100">
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
