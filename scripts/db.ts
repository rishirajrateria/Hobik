/**
 * Migrate the database and seed defaults (idempotent). Runs before every build.
 *   npx tsx scripts/db.ts           migrate + seed
 *   npx tsx scripts/db.ts --demo    also insert ~60 days of SAMPLE analytics + leads (local preview only)
 */
import { mkdirSync } from "node:fs";
import { migrate } from "drizzle-orm/libsql/migrator";
import { count, eq } from "drizzle-orm";
import { db, dbUrl } from "../src/db";
import { forms, posts, events, leads, testimonials } from "../src/db/schema";
import { defaultBookingForm, defaultQuoteForm } from "../src/lib/defaultForms";
import { readdirSync, readFileSync } from "node:fs";
import { parseBlogFile } from "../src/lib/blogfile";

async function main() {
  if (dbUrl.startsWith("file:")) mkdirSync("data", { recursive: true });
  if (process.env.VERCEL && dbUrl.startsWith("file:")) {
    console.warn("[db] DATABASE_URL not set on Vercel — skipping migrate. The dashboard needs a persistent database (Turso).");
    return;
  }
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log(`[db] migrated (${dbUrl.replace(/\/\/.*@/, "//***@")})`);

  const [{ n: formCount }] = await db.select({ n: count() }).from(forms);
  if (formCount === 0) {
    for (const f of [defaultQuoteForm, defaultBookingForm]) {
      const { id: _ignored, ...rest } = f;
      await db.insert(forms).values({ ...rest, isPrimary: f.slug === "quote" });
    }
    console.log("[db] seeded default forms");
  }

  await seedBlog();

  if (process.argv.includes("--demo")) await demo();
}

/**
 * Loads content/blog/*.md and inserts any post whose slug isn't in the DB yet.
 * Never overwrites — once a post exists, it's edited in the dashboard.
 * `day:` in front matter schedules it N days after BLOG_LAUNCH_DATE (default: today),
 * so the library drips out a few posts a week instead of appearing all at once.
 */
async function seedBlog() {
  const dir = "content/blog";
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  } catch {
    return;
  }
  const launch = process.env.BLOG_LAUNCH_DATE ? new Date(`${process.env.BLOG_LAUNCH_DATE}T08:00:00-05:00`) : new Date();
  const existing = new Set((await db.select({ slug: posts.slug }).from(posts)).map((p) => p.slug));
  let added = 0;
  for (const f of files) {
    const b = parseBlogFile(readFileSync(`${dir}/${f}`, "utf8"), f.replace(/\.md$/, ""));
    if (existing.has(b.slug)) continue;
    await db.insert(posts).values({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      tags: b.tags,
      accent: b.accent,
      seoTitle: b.seoTitle ?? null,
      seoDescription: b.seoDescription ?? null,
      status: "published",
      publishedAt: new Date(launch.getTime() + b.day * 86400000),
    });
    added++;
  }
  if (added) console.log(`[db] added ${added} blog posts from content/blog`);
}

/** SAMPLE data for local previews only — never run against production. */
async function demo() {
  const [{ n }] = await db.select({ n: count() }).from(events);
  if (n > 0) return console.log("[db] events exist, skipping demo data");
  const pick = <T,>(a: T[], w?: number[]) => {
    if (!w) return a[Math.floor(Math.random() * a.length)];
    let r = Math.random() * w.reduce((s, x) => s + x, 0);
    for (let i = 0; i < a.length; i++) if ((r -= w[i]) < 0) return a[i];
    return a[0];
  };
  const pages = ["/", "/services/estate-probate-appraisal", "/services/mortgage-refinance-appraisal", "/areas/toronto", "/areas/mississauga", "/pricing", "/get-a-quote", "/lp/home-appraisal", "/blog/home-appraisal-cost-toronto", "/services/divorce-separation-appraisal", "/areas/vaughan", "/contact"];
  const pw = [30, 10, 9, 8, 6, 8, 6, 14, 6, 5, 4, 4];
  const geo: [string, string, string][] = [["CA", "ON", "Toronto"], ["CA", "ON", "Mississauga"], ["CA", "ON", "Vaughan"], ["CA", "ON", "Markham"], ["CA", "ON", "Brampton"], ["CA", "ON", "Hamilton"], ["CA", "BC", "Vancouver"], ["CA", "QC", "Montreal"], ["CA", "AB", "Calgary"], ["US", "NY", "New York"], ["US", "CA", "San Francisco"], ["IN", "MH", "Mumbai"], ["GB", "ENG", "London"]];
  const gw = [40, 14, 8, 7, 7, 5, 4, 3, 2, 3, 2, 3, 2];
  const sources = ["google", "google-ads", "direct", "chatgpt.com", "bing", "facebook", "perplexity.ai"];
  const sw = [40, 25, 18, 6, 5, 4, 2];
  const clicks = [["Get a Free Quote", "hero"], ["(416) 871-9224", "hero"], ["Free Quote", "header"], ["Call Now", "mobile_bar"], ["Free Quote", "mobile_bar"], ["Get My Free Quote", "form"], ["Learn more", "services"]];
  const rows: (typeof events.$inferInsert)[] = [];
  const DAY = 86400000;
  for (let d = 60; d >= 0; d--) {
    const sessions = Math.round(40 + Math.random() * 30 + (60 - d) * 0.8 + (new Date(Date.now() - d * DAY).getDay() % 6 === 0 ? -15 : 0));
    for (let s = 0; s < sessions; s++) {
      const [country, region, city] = pick(geo, gw);
      const visitorId = crypto.randomUUID();
      const sessionId = crypto.randomUUID();
      const source = pick(sources, sw);
      const device = pick(["mobile", "desktop", "tablet"], [62, 33, 5]);
      const browser = pick(["Chrome", "Safari", "Edge", "Firefox"], [55, 32, 9, 4]);
      const base = Date.now() - d * DAY - Math.random() * DAY;
      const views = 1 + Math.floor(Math.random() * 3);
      for (let v = 0; v < views; v++) {
        const path = pick(pages, pw);
        const t = base + v * 45000;
        rows.push({ type: "pageview", path, visitorId, sessionId, source, country, region, city, device, browser, createdAt: t });
        if (Math.random() < 0.35) {
          const [label, location] = pick(clicks, [30, 20, 15, 14, 10, 8, 12]);
          rows.push({ type: "click", path, label, location, visitorId, sessionId, source, country, region, city, device, browser, createdAt: t + 9000 });
        }
      }
      if (Math.random() < 0.035) {
        await db.insert(leads).values({
          name: pick(["Sample Lead A", "Sample Lead B", "Sample Lead C"]),
          phone: "4165550100",
          service: pick(["Estate & Probate Appraisal", "Mortgage & Refinance Appraisal", "Divorce & Separation Appraisal", "Condo Appraisal"]),
          formName: "Quote request (site-wide)",
          status: pick(["new", "contacted", "quoted", "booked", "completed", "lost"], [30, 20, 15, 15, 12, 8]),
          answers: [{ key: "note", label: "Note", value: "DEMO DATA — generated for preview" }],
          page: pick(pages, pw),
          utmSource: source,
          country, region, city, sessionId, visitorId,
          createdAt: new Date(base),
          updatedAt: new Date(base),
        });
      }
    }
  }
  for (let i = 0; i < rows.length; i += 500) await db.insert(events).values(rows.slice(i, i + 500));
  const [{ n: tn }] = await db.select({ n: count() }).from(testimonials).where(eq(testimonials.status, "published"));
  if (tn === 0) {
    await db.insert(testimonials).values([
      { name: "Sample Client", location: "North York", rating: 5, body: "DEMO testimonial — replace with a real client review in the dashboard.", service: "Estate & Probate Appraisal", featured: true },
      { name: "Sample Lawyer", location: "Toronto", rating: 5, body: "DEMO testimonial — replace with a real client review in the dashboard.", service: "Divorce & Separation Appraisal" },
    ]);
  }
  console.log(`[db] inserted ${rows.length} DEMO events`);
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
