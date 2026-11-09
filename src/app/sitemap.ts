import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { getPublishedPosts } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({ url: absUrl(path), lastModified: now, changeFrequency, priority });
  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    page("/areas", 0.9),
    page("/pricing", 0.9),
    page("/get-a-quote", 0.8),
    page("/faq", 0.7),
    page("/about", 0.6),
    page("/contact", 0.7),
    page("/blog", 0.7, "weekly"),
    page("/book-appraisal", 0.8),
    ...services.map((s) => page(`/services/${s.slug}`, 0.85)),
    ...areas.map((a) => page(`/areas/${a.slug}`, 0.8)),
    ...posts.map((p) => ({ url: absUrl(`/blog/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
