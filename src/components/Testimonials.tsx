import { getTestimonials } from "@/lib/content";
import { Icon } from "./Icon";
import { SectionHead } from "./Sections";

function Stars({ n, onGold = false }: { n: number; onGold?: boolean }) {
  return (
    <span className={`flex gap-0.5 ${onGold ? "text-navy-950" : "text-gold-400"}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => <Icon key={i} name="star" className={`h-5 w-5 ${i < n ? "" : "opacity-20"}`} />)}
    </span>
  );
}

/** Published testimonials from the dashboard. Renders nothing until at least one exists. */
export async function Testimonials({ service, dark = false, title = "What our clients say." }: { service?: string; dark?: boolean; title?: string }) {
  const all = await getTestimonials();
  if (!all.length) return null;
  // Prefer testimonials for this service, then the rest.
  const list = service ? [...all.filter((t) => t.service === service), ...all.filter((t) => t.service !== service)] : all;
  const shown = list.slice(0, 6);
  const avg = all.reduce((s, t) => s + t.rating, 0) / all.length;

  return (
    <section className={`relative overflow-hidden py-20 sm:py-28 ${dark ? "bg-navy-950" : "bg-gradient-to-b from-white to-navy-50"}`} data-section="testimonials">
      {dark && <div className="bg-grid absolute inset-0" aria-hidden="true" />}
      <div className="container-x relative">
        <SectionHead dark={dark} eyebrow="Client reviews" title={title} />
        <div className={`mx-auto mt-6 flex w-fit items-center gap-3 rounded-full px-5 py-2 ring-1 ${dark ? "bg-white/5 ring-white/15" : "bg-white ring-navy-100"}`}>
          <Stars n={Math.round(avg)} />
          <span className={`text-sm font-bold ${dark ? "text-white" : "text-navy-950"}`}>{avg.toFixed(1)} average · {all.length} review{all.length === 1 ? "" : "s"}</span>
        </div>
        <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
          {shown.map((t, i) => (
            <figure
              key={t.id}
              className={`relative flex w-[85%] shrink-0 snap-center flex-col rounded-3xl p-7 md:w-auto ${
                i === 0 && t.featured ? "bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950" : dark ? "bg-white/5 text-white ring-1 ring-white/10" : "card"
              }`}
            >
              <svg viewBox="0 0 32 32" className={`absolute top-6 right-6 h-10 w-10 ${i === 0 && t.featured ? "text-navy-950/15" : "text-gold-400/30"}`} fill="currentColor" aria-hidden="true">
                <path d="M9 6C5 8 3 12 3 17v9h10v-9H8c0-4 2-6 4-7zm16 0c-4 2-6 6-6 11v9h10v-9h-5c0-4 2-6 4-7z" />
              </svg>
              <Stars n={t.rating} onGold={i === 0 && t.featured} />
              <blockquote className={`mt-4 flex-1 text-[17px] leading-relaxed ${i === 0 && t.featured ? "font-semibold" : dark ? "text-white/85" : "text-slate-700"}`}>“{t.body}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-full font-display text-lg font-extrabold ${i === 0 && t.featured ? "bg-navy-950 text-gold-300" : "bg-navy-900 text-gold-300"}`}>
                  {t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <span>
                  <span className="block font-extrabold">{t.name}</span>
                  <span className={`block text-sm ${i === 0 && t.featured ? "text-navy-950/70" : dark ? "text-white/60" : "text-slate-500"}`}>
                    {[t.role, t.location, t.service].filter(Boolean).join(" · ")}
                    {t.source ? ` · via ${t.source}` : ""}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
