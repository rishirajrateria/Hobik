import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { guides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
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
    page("/guides", 0.6),
    ...services.map((s) => page(`/services/${s.slug}`, 0.85)),
    ...areas.map((a) => page(`/areas/${a.slug}`, 0.8)),
    ...guides.map((g) => ({ url: absUrl(`/guides/${g.slug}`), lastModified: new Date(g.updated), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
