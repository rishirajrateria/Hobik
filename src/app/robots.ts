import type { MetadataRoute } from "next";
import { absUrl, site } from "@/lib/site";

// Explicitly welcome search + AI answer-engine crawlers so the business can be cited
// in ChatGPT, Perplexity, Claude, Gemini, Copilot and Google AI Overviews.
const aiBots = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
  "Bingbot", "CCBot", "Amazonbot", "DuckAssistBot", "meta-externalagent", "cohere-ai", "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/lp/"] },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/", "/lp/"] })),
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: site.url,
  };
}
