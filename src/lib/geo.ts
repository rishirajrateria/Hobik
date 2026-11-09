/**
 * Visitor location from edge/CDN headers — no IP is stored.
 * Works automatically on Vercel and Cloudflare (enable "Add visitor location headers").
 */
export function geoFromHeaders(h: Headers) {
  const dec = (v: string | null) => {
    if (!v) return null;
    try {
      return decodeURIComponent(v).slice(0, 80);
    } catch {
      return v.slice(0, 80);
    }
  };
  const country = h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || h.get("x-country-code");
  const region = h.get("x-vercel-ip-country-region") || h.get("cf-region-code") || h.get("x-region-code");
  const city = h.get("x-vercel-ip-city") || h.get("cf-ipcity") || h.get("x-city");
  return {
    country: country && country !== "XX" ? country.toUpperCase().slice(0, 2) : null,
    region: dec(region)?.toUpperCase().slice(0, 6) ?? null,
    city: dec(city),
  };
}

export function parseUA(ua: string) {
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Other";
  return { device, browser };
}

export const isBot = (ua: string) => !ua || /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|gptbot|claude|perplexity|bingpreview/i.test(ua);

/** Normalise the traffic source: utm_source wins, else referrer host, else "direct". */
export function sourceOf(referrer: string | null | undefined, utmSource: string | null | undefined, gclid?: string | null, selfHost?: string) {
  if (gclid) return "google-ads";
  if (utmSource) return utmSource.toLowerCase().slice(0, 60);
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (selfHost && host === selfHost.replace(/^www\./, "")) return "internal";
    if (/google\./.test(host)) return "google";
    if (/bing\./.test(host)) return "bing";
    if (/chatgpt\.com|openai\.com/.test(host)) return "chatgpt.com";
    if (/perplexity/.test(host)) return "perplexity.ai";
    if (/facebook|fb\.com/.test(host)) return "facebook";
    if (/instagram/.test(host)) return "instagram";
    if (/linkedin|lnkd/.test(host)) return "linkedin";
    return host.slice(0, 60);
  } catch {
    return "direct";
  }
}
