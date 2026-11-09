import { getFormBySlug, getPrimaryForm } from "@/lib/content";
import { DynamicForm } from "./DynamicForm";

/**
 * Site-wide lead form. Renders whichever form is marked "primary" in the dashboard
 * (or a specific one via `slug`). `compact` drops optional long-text questions for tight spaces.
 */
export async function QuoteForm({ compact = false, defaultService = "", location = "form", slug }: { compact?: boolean; defaultService?: string; location?: string; slug?: string }) {
  const form = (slug && (await getFormBySlug(slug))) || (await getPrimaryForm());
  const shown = compact ? { ...form, fields: form.fields.filter((f) => f.required || f.type !== "textarea") } : form;
  return <DynamicForm form={shown} location={location} defaults={defaultService ? { service: defaultService } : {}} />;
}
