import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getFormBySlug } from "@/lib/content";
import { DynamicForm } from "@/components/DynamicForm";
import { PageHero } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const f = await getFormBySlug((await params).slug);
  if (!f) return {};
  return pageMeta({ title: f.title, description: f.subtitle || f.title, path: `/forms/${f.slug}`, noindex: true });
}

/** Every published dashboard form is reachable at /forms/<slug> — share it in ads, email or social. */
export default async function FormPage({ params }: Props) {
  const f = await getFormBySlug((await params).slug);
  if (!f) notFound();
  return (
    <PageHero crumbs={[{ name: f.title, path: `/forms/${f.slug}` }]} eyebrow={f.subtitle || "Form"} title={f.title} aside={<DynamicForm form={f} location={`form_${f.slug}`} />} />
  );
}
