import "server-only";
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugifyHeading } from "./blogfile";

const md = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const id = depth <= 3 ? ` id="${slugifyHeading(text)}"` : "";
      return `<h${depth}${id}>${text}</h${depth}>\n`;
    },
  },
});

/** Markdown → sanitised HTML for public blog pages (H2/H3 get anchor ids for the TOC). */
export function renderMarkdown(src: string) {
  const html = md.parse(src, { async: false }) as string;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "h4", "figure", "figcaption"]),
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "width", "height", "loading"], "*": ["id"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tag, attribs) => ({ tagName: "a", attribs: attribs.href?.startsWith("http") ? { ...attribs, target: "_blank", rel: "noopener" } : attribs }),
      img: (tag, attribs) => ({ tagName: "img", attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

/** H2 headings for the "On this page" table of contents. */
export function tocOf(src: string) {
  return [...src.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, "").trim();
    return { text, id: slugifyHeading(md.parseInline(m[1], { async: false }) as string) };
  });
}

export const readingMinutes = (src: string) => Math.max(1, Math.round(src.split(/\s+/).length / 220));
