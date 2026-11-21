import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { team } from "@/lib/team";
import { absUrl, site } from "@/lib/site";
import { AicBadge, CtaBand, JsonLd, PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Our Team | AACI-Designated Appraiser & AIC Candidate Members",
  description: "Meet the Value Trust Appraisals team: Hobikh Baleswaran, P. App., AACI, Founder & CEO, with Ramin Noushinfar and Mahir Chaudhry, Candidate Members of the AIC.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <JsonLd
        data={team.map((m) => ({
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.name,
          jobTitle: m.title,
          ...(m.credentials ? { honorificSuffix: m.credentials } : {}),
          image: absUrl(m.photo),
          url: absUrl(`/team/${m.slug}`),
          knowsLanguage: m.languages,
          worksFor: { "@id": absUrl("/#business") },
        }))}
      />
      <PageHero crumbs={[{ name: "Our Team", path: "/team" }]} eyebrow="The people behind Value Trust" title={<>Our Team</>} answer="Meet our appraisal team." />

      <section className="container-x py-16 sm:py-20">
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <li key={m.slug} id={m.slug} data-reveal style={{ "--d": i } as React.CSSProperties}>
              <Link href={`/team/${m.slug}`} className="group block">
                <div className="overflow-hidden rounded-[28px] bg-ink-100 shadow-[0_30px_60px_-30px_rgba(22,22,22,0.45)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photo} alt={m.name} width={640} height={800} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <h2 className="mt-5 text-[26px] leading-tight font-medium text-ink-950">{m.name}{m.credentials && <span className="text-[20px] text-ink-700">, {m.credentials}</span>}</h2>
                <p className="mt-1 text-[15px] text-accent-600">{m.title}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink-950 underline decoration-ink-950/25 underline-offset-4 group-hover:decoration-accent-500">View profile →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-14">
        <div className="container-x flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-[17px] leading-relaxed text-ink-800">
            {site.name} is accredited and in good standing with the Appraisal Institute of Canada (AIC). All reports conform to CUSPAP.
          </p>
          <AicBadge className="w-[300px] sm:w-[380px]" />
        </div>
      </section>
      <CtaBand location="team_bottom" />
    </>
  );
}
