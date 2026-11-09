import { pageMeta } from "@/lib/seo";
import { faqs } from "@/lib/faqs";
import { services } from "@/lib/services";
import { faqSchema } from "@/lib/schema";
import { CtaBand, FaqList, HeroCtas, JsonLd, PageHero } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Home Appraisal FAQ | Toronto Appraisal Questions Answered",
  description: "Answers to common questions about home appraisals in Toronto: cost, timing, preparation, retrospective values, MPAC, estates, divorce and more.",
  path: "/faq",
});

export default function FaqPage() {
  const serviceFaqs = services.flatMap((s) => s.faqs);
  const all = [...faqs, ...serviceFaqs];
  return (
    <>
      <JsonLd data={faqSchema(all)} />
      <PageHero crumbs={[{ name: "FAQ", path: "/faq" }]} eyebrow="FAQ" title={<>Appraisal questions, <span className="text-gradient">answered.</span></>}>
        <HeroCtas location="faq_hero" />
      </PageHero>
      <section className="container-x py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          <div>
            <h2 className="mb-6 text-2xl font-extrabold text-navy-950">General</h2>
            <FaqList items={faqs} />
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-extrabold text-navy-950">By appraisal type</h2>
            <FaqList items={serviceFaqs} />
          </div>
        </div>
      </section>
      <CtaBand location="faq_bottom" />
    </>
  );
}
