import { db } from "@/db";
import { events } from "@/db/schema";
import { geoFromHeaders, isBot, parseUA, sourceOf } from "@/lib/geo";

const s = (v: unknown, max: number) => (typeof v === "string" && v ? v.slice(0, max) : null);

/** First-party analytics beacon: page views and clicks. No cookies, no IP stored. */
export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  if (isBot(ua)) return new Response(null, { status: 204 });
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(await req.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const type = b.type === "click" ? "click" : b.type === "pageview" ? "pageview" : null;
  const path = s(b.path, 300);
  if (!type || !path || !path.startsWith("/") || path.startsWith("/dashboard")) return new Response(null, { status: 204 });

  const { device, browser } = parseUA(ua);
  const referrer = s(b.referrer, 300);
  try {
    await db.insert(events).values({
      type,
      path: path.split("?")[0],
      label: s(b.label, 80),
      location: s(b.location, 60),
      href: s(b.href, 300),
      visitorId: s(b.vid, 64),
      sessionId: s(b.sid, 64),
      referrer,
      source: sourceOf(referrer, s(b.utm_source, 60), s(b.gclid, 200), new URL(req.url).hostname),
      ...geoFromHeaders(req.headers),
      device,
      browser,
      createdAt: Date.now(),
    });
  } catch (e) {
    console.warn("[t] insert failed", (e as Error).message);
  }
  return new Response(null, { status: 204 });
}
