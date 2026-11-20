import { pageMeta } from "@/lib/seo";
import { faqs } from "@/lib/faqs";
import { services } from "@/lib/services";
import { faqSchema } from "@/lib/schema";
import { CtaBand, FaqList, HeroCtas, JsonLd, PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Appraisal FAQ | Value Trust Appraisals Inc.",
  description: "Appraisal vs. home evaluation, the main purposes of an appraisal, preparing for the inspection, AACI vs. CRA designations, coverage area and payment methods.",
  path: "/faq",
});

export default function FaqPage() {
  const serviceFaqs = services.flatMap((s) => s.faqs);
  const all = [...faqs, ...serviceFaqs];
  return (
    <>
      <JsonLd data={faqSchema(all)} />
      <PageHero crumbs={[{ name: "FAQ", path: "/faq" }]} eyebrow="FAQ" title={<>Frequently asked questions</>}>
        <HeroCtas location="faq_hero" />
      </PageHero>
      <section className="container-x py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          <div>
            <h2 className="mb-6 text-2xl font-medium text-ink-950">General</h2>
            <FaqList items={faqs} />
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-medium text-ink-950">By service</h2>
            <FaqList items={serviceFaqs} />
          </div>
        </div>
      </section>
      <CtaBand location="faq_bottom" />
    </>
  );
}
