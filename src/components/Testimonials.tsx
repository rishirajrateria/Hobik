import { getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";

/** Google "G" mark. */
export function GoogleG({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-[16px] tracking-[0.12em] text-[#f5a623]" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
      <span className="text-ink-950/15">{"★".repeat(5 - n)}</span>
    </span>
  );
}

/**
 * Google-style review strip: rating summary, a "Review us on Google" button and a swipeable row of
 * review cards. Reads the testimonials added in the dashboard; renders nothing until one exists.
 * (props other than `service` and `dark` are accepted for older call sites and ignored.)
 */
export async function Testimonials({ service, dark = false }: { service?: string; dark?: boolean; title?: string; single?: boolean }) {
  const all = await getTestimonials();
  if (!all.length) return null;
  const list = service ? [...all.filter((t) => t.service === service), ...all.filter((t) => t.service !== service)] : all;
  const avg = all.reduce((s, t) => s + t.rating, 0) / all.length;
  const muted = dark ? "text-white/65" : "text-ink-700";

  return (
    <section className={`py-20 sm:py-24 ${dark ? "dark-glow" : ""}`} data-section="testimonials">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div data-reveal>
            <span className="flex items-center gap-2.5">
              <GoogleG />
              <span className={`text-[13px] font-semibold tracking-[0.16em] uppercase ${dark ? "text-accent-300" : "text-accent-600"}`}>Google reviews</span>
            </span>
            <h2 className={`mt-4 text-[34px] leading-[1.1] font-semibold sm:text-[44px] ${dark ? "text-paper" : "text-ink-950"}`}>What our clients say</h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3" data-reveal>
            <div className={dark ? "text-paper" : "text-ink-950"}>
              <p className="text-[40px] leading-none font-semibold tabular-nums">{avg.toFixed(1)}</p>
              <div className="mt-1.5"><Stars n={Math.round(avg)} /></div>
              <p className={`mt-1 text-[13px] ${muted}`}>{all.length} Google review{all.length === 1 ? "" : "s"}</p>
            </div>
            {site.googleReviewsUrl && (
              <a href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <GoogleG className="h-4 w-4" /> Review us on Google
              </a>
            )}
          </div>
        </div>

        <ul className="-mx-5 mt-10 flex snap-x scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12 [scrollbar-width:thin]">
          {list.map((t) => (
            <li key={t.id} className="snap-start">
              <figure className={`flex h-full w-[300px] flex-col p-6 sm:w-[360px] ${dark ? "lg-dark" : "lg-strong"}`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center bg-accent-500 text-[18px] font-bold text-ink-950">{(t.name || "?").slice(0, 1).toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[16px] font-semibold ${dark ? "text-paper" : "text-ink-950"}`}>{t.name}</p>
                    <p className={`truncate text-[13px] ${muted}`}>{[t.location, t.createdAt.toLocaleDateString("en-CA", { month: "long", year: "numeric" })].filter(Boolean).join(" · ")}</p>
                  </div>
                  {(t.source ?? "Google").toLowerCase().includes("google") && <GoogleG className="h-5 w-5 shrink-0" />}
                </div>
                <div className="mt-4"><Stars n={t.rating} /></div>
                <blockquote className={`mt-3 line-clamp-6 text-[15px] leading-relaxed ${dark ? "text-white/85" : "text-ink-800"}`}>{t.body}</blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
