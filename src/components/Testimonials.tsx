import { getTestimonials } from "@/lib/content";
import { SectionHead } from "./Sections";

function Rating({ n, dark }: { n: number; dark?: boolean }) {
  return (
    <span className={`text-[13px] tracking-[0.2em] ${dark ? "text-accent-300" : "text-accent-500"}`} aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
      <span className={dark ? "text-white/20" : "text-ink-100"}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

/** Published testimonials from the dashboard, set as pull quotes. Renders nothing until one exists. */
export async function Testimonials({ service, dark = false, title = "What our clients say", single = false }: { service?: string; dark?: boolean; title?: string; single?: boolean }) {
  const all = await getTestimonials();
  if (!all.length) return null;
  // Prefer testimonials for this service, then the rest.
  const list = service ? [...all.filter((t) => t.service === service), ...all.filter((t) => t.service !== service)] : all;
  const [lead, ...rest] = list.slice(0, 4);
  const avg = all.reduce((s, t) => s + t.rating, 0) / all.length;
  const muted = dark ? "text-white/60" : "text-ink-700";

  return (
    <section className={`py-20 sm:py-28 ${dark ? "bg-ink-950" : "border-t border-ink-100"}`} data-section="testimonials">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead dark={dark} eyebrow="Client reviews" title={title} />
          <p className={`text-[15px] ${muted}`} data-reveal>
            {avg.toFixed(1)} out of 5 from {all.length} review{all.length === 1 ? "" : "s"}
          </p>
        </div>

        <figure className={`mt-12 border-t pt-10 ${dark ? "border-white/20" : "border-ink-950"}`} data-reveal>
          <Rating n={lead.rating} dark={dark} />
          <blockquote className={`mt-5 max-w-4xl font-display text-[26px] leading-[1.35] sm:text-[34px] ${dark ? "text-paper" : "text-ink-950"}`}>“{lead.body}”</blockquote>
          <figcaption className={`mt-6 text-[15px] ${muted}`}>
            <span className={`font-semibold ${dark ? "text-paper" : "text-ink-950"}`}>{lead.name}</span>
            {[lead.role, lead.location, lead.service].filter(Boolean).map((x) => ` · ${x}`)}
            {lead.source ? ` · via ${lead.source}` : ""}
          </figcaption>
        </figure>

        {!single && rest.length > 0 && (
          <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {rest.map((t, i) => (
              <figure key={t.id} data-reveal style={{ "--d": i } as React.CSSProperties} className={`border-t pt-6 ${dark ? "border-white/15" : "border-ink-100"}`}>
                <Rating n={t.rating} dark={dark} />
                <blockquote className={`mt-3 text-[17px] leading-relaxed ${dark ? "text-white/85" : "text-ink-800"}`}>“{t.body}”</blockquote>
                <figcaption className={`mt-4 text-[14px] ${muted}`}>
                  <span className={`font-semibold ${dark ? "text-paper" : "text-ink-950"}`}>{t.name}</span>
                  {[t.location, t.service].filter(Boolean).map((x) => ` · ${x}`)}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
