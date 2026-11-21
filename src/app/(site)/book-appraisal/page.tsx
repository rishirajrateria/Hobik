import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getFormBySlug } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { DynamicForm } from "@/components/DynamicForm";
import { Testimonials } from "@/components/Testimonials";
import { PageHero, Process } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Book an Appraisal Online",
  description: `Answer a few quick questions to book an appraisal anywhere in the GTHA or Southern Ontario. Or call ${site.phone}.`,
  path: "/book-appraisal",
});

export default async function BookPage() {
  const form = await getFormBySlug("book-appraisal");
  if (!form) notFound();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Book an Appraisal", path: "/book-appraisal" }]}
        eyebrow="Book online"
        title={<>Book in 60 seconds</>}
        answer="Tell us a little about the property. An appraiser will confirm your fee and inspection time, with no obligation."
        aside={<DynamicForm form={form} location="book_page" />}
      >
        <ul className="mt-8 max-w-lg lg !rounded-[24px] px-5 sm:px-6">
          {["One question at a time", "Fee confirmed before booking", "All property types"].map((t) => (
            <li key={t} className="border-b border-ink-100 py-3 text-[16px] text-ink-950">{t}</li>
          ))}
        </ul>
      </PageHero>
      <Testimonials />
      <section className="container-x py-20"><Process /></section>
    </>
  );
}
