import { llmsFullTxt } from "@/lib/llms";
import { getPublishedPosts, getTestimonials } from "@/lib/content";

export const revalidate = 3600;
export async function GET() {
  return new Response(llmsFullTxt(await getPublishedPosts(), await getTestimonials()), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
