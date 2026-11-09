import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Markdown → sanitised HTML for public blog pages. */
export function renderMarkdown(md: string) {
  const html = marked.parse(md, { async: false, gfm: true, breaks: false }) as string;
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

export const readingMinutes = (md: string) => Math.max(1, Math.round(md.split(/\s+/).length / 220));
