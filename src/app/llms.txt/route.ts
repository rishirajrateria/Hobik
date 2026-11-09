import { llmsTxt } from "@/lib/llms";
import { getPublishedPosts, getTestimonials } from "@/lib/content";

export const revalidate = 3600;
export async function GET() {
  return new Response(llmsTxt(await getPublishedPosts()), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
