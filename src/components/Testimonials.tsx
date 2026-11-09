import { getTestimonials } from "@/lib/content";
import { Icon } from "./Icon";
import { SectionHead } from "./Sections";
import { DarkAurora } from "./Ambient";

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
    <section className={`relative overflow-hidden py-20 sm:py-28 ${dark ? "rounded-[2.5rem] bg-navy-950" : ""}`} data-section="testimonials">
      {dark && <DarkAurora />}
      <div className="container-x relative">
        <SectionHead dark={dark} eyebrow="Client reviews" title={title} />
        <div data-reveal className={`mx-auto mt-6 flex w-fit items-center gap-3 rounded-full px-5 py-2 ring-1 backdrop-blur-xl ${dark ? "bg-white/5 ring-white/15" : "bg-white/60 ring-white"}`}>
          <Stars n={Math.round(avg)} />
          <span className={`text-sm font-bold ${dark ? "text-white" : "text-navy-950"}`}>{avg.toFixed(1)} average · {all.length} review{all.length === 1 ? "" : "s"}</span>
        </div>
        <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
          {shown.map((t, i) => (
            <figure
              key={t.id}
              data-reveal
              style={{ "--d": i } as React.CSSProperties}
              className={`spotlight relative flex w-[85%] shrink-0 snap-center flex-col rounded-3xl p-7 transition duration-500 hover:-translate-y-1.5 md:w-auto ${
                i === 0 && t.featured ? "bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 text-navy-950 shadow-[0_30px_60px_-25px_rgba(245,176,49,0.9),inset_0_1px_0_rgba(255,255,255,0.6)]" : dark ? "glass-dark text-white" : "card"
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
