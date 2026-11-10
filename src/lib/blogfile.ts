/** Minimal front-matter parser for content/blog/*.md (no dependencies). */
export type BlogFile = {
  slug: string;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  accent: "navy" | "gold" | "mint" | "sky" | "rose";
  /** Days after the launch date that this post goes live (0 = at launch). */
  day: number;
  content: string;
};

export function parseBlogFile(raw: string, fallbackSlug: string): BlogFile {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Missing front matter in ${fallbackSlug}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  const accent = (["navy", "gold", "mint", "sky", "rose"].includes(meta.accent) ? meta.accent : "navy") as BlogFile["accent"];
  return {
    slug: meta.slug || fallbackSlug,
    title: meta.title,
    excerpt: meta.excerpt ?? "",
    seoTitle: meta.seoTitle || undefined,
    seoDescription: meta.seoDescription || undefined,
    tags: (meta.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    accent,
    day: Number(meta.day) || 0,
    content: m[2].trim(),
  };
}

/** Pulls "## Frequently asked questions" → [{q, a}] for FAQPage schema. */
export function extractFaqs(md: string) {
  const found = md.split(/\n## /).find((s) => /^(frequently asked questions|faq)/i.test(s.trim()));
  if (!found) return [];
  const sec = found.split(/\n---/)[0];
  return sec
    .split(/\n### /)
    .slice(1)
    .map((block) => {
      const [q, ...rest] = block.split("\n");
      return { q: q.trim(), a: rest.join(" ").replace(/\s+/g, " ").replace(/[*_`>#]/g, "").trim() };
    })
    .filter((f) => f.q && f.a);
}

export const slugifyHeading = (s: string) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
