import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getMember, team } from "@/lib/team";
import { absUrl } from "@/lib/site";
import { Breadcrumbs, CtaBand, HeroCtas, JsonLd } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props) {
  const m = getMember((await params).slug);
  if (!m) return {};
  return pageMeta({ title: `${m.name}${m.credentials ? `, ${m.credentials}` : ""} | ${m.title}`, description: m.bio[0].slice(0, 155), path: `/team/${m.slug}` });
}

export default async function MemberPage({ params }: Props) {
  const m = getMember((await params).slug);
  if (!m) notFound();
  const others = team.filter((x) => x.slug !== m.slug);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.name,
          jobTitle: m.title,
          ...(m.credentials ? { honorificSuffix: m.credentials } : {}),
          image: absUrl(m.photo),
          url: absUrl(`/team/${m.slug}`),
          description: m.bio.join(" "),
          knowsLanguage: m.languages,
          worksFor: { "@id": absUrl("/#business") },
        }}
      />
      <section className="border-b border-ink-100">
        <div className="container-x pt-10 pb-16 sm:pb-20">
          <Breadcrumbs items={[{ name: "Our Team", path: "/team" }, { name: m.name, path: `/team/${m.slug}` }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="animate-fade-up lg:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.photo} alt={m.name} width={640} height={800} className="aspect-[4/5] w-full rounded-[32px] object-cover shadow-[0_40px_80px_-40px_rgba(22,22,22,0.5)]" />
            </div>
            <div className="animate-fade-up [animation-delay:80ms] lg:col-span-7">
              <span className="eyebrow">{m.title}</span>
              <h1 className="mt-5 text-[42px] leading-[1.05] font-medium text-ink-950 sm:text-[56px]">{m.name}</h1>
              {m.credentials && <p className="mt-3 text-[18px] font-semibold tracking-[0.06em] text-ink-700">{m.credentials}</p>}
              <div className="mt-8 space-y-5 border-t border-ink-950/15 pt-8 text-[18px] leading-relaxed text-ink-800">
                {m.bio.map((p) => <p key={p}>{p}</p>)}
              </div>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-ink-100 pt-6">
                <div>
                  <dt className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">Languages</dt>
                  <dd className="mt-1 font-display text-[22px] text-ink-950">{m.languages.join(" · ")}</dd>
                </div>
              </dl>
              <HeroCtas location={`team_${m.slug}`} />
            </div>
          </div>
        </div>
      </section>
      <section className="container-x py-16">
        <h2 className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">More of the team</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/team/${o.slug}`} className="lg lift group flex items-center gap-5 !rounded-[24px] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.photo} alt="" width={96} height={120} className="h-[120px] w-[96px] rounded-[18px] object-cover" loading="lazy" />
                <span>
                  <span className="block font-display text-[22px] text-ink-950 group-hover:underline">{o.name}</span>
                  <span className="mt-1 block text-[14px] text-accent-600">{o.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand location={`team_${m.slug}_bottom`} />
    </>
  );
}
