import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getFormBySlug } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { DynamicForm } from "@/components/DynamicForm";
import { Testimonials } from "@/components/Testimonials";
import { PageHero, Process } from "@/components/Sections";

export const metadata = pageMeta({
  title: "Book a Home Appraisal Online | Toronto & GTA",
  description: `Answer a few quick questions to book a certified home appraisal in Toronto or the GTA. Reports in ${site.turnaround}.`,
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
        title={<>Book in <span className="text-gradient">60 seconds.</span></>}
        answer="Tell us a little about the property. An appraiser will confirm your fee and inspection time — no obligation."
        aside={<DynamicForm form={form} location="book_page" />}
      >
        <ul className="mt-8 space-y-3 text-white/85">
          {["One question at a time", "Fee confirmed before booking", `Report typically in ${site.turnaround}`].map((t) => (
            <li key={t} className="flex items-center gap-3 text-lg font-semibold"><Icon name="check" className="h-6 w-6 text-mint-400" /> {t}</li>
          ))}
        </ul>
      </PageHero>
      <Testimonials />
      <section className="container-x py-20"><Process /></section>
    </>
  );
}
