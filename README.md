# Home Value Inc. — homeappraisaltoronto.ca (Next.js rebuild)

A fast, visual, conversion-focused website for **Home Value Inc.**, a residential appraisal firm in Toronto. It's built to rank in Google and to be cited by AI assistants (ChatGPT, Perplexity, Gemini, Claude, Copilot), and it's ready for Google Ads traffic.

**Stack:** Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS 4 · Drizzle ORM + libSQL (SQLite locally, Turso in production). Website visuals are inline SVG/CSS, which keeps pages fast for Core Web Vitals.

It also includes a **built-in dashboard** at `/dashboard` (sign in at `/login`) for analytics, leads, forms, blog, testimonials and team roles. See below.

## Run

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # migrates the DB, then http://localhost:3000
npm run build && npm start   # production
```

Then open `/login`. The **first visit creates the owner account**; after that, the owner invites everyone else from *Team & roles*.

To preview the dashboard with sample charts locally, run `npm run db:demo`. It inserts ~60 days of clearly labelled **demo** traffic and leads into your local DB only. Never run it against production.

### Deploy (Vercel + Turso)

1. Create a free Turso database and set `DATABASE_URL` (`libsql://…`) and `DATABASE_AUTH_TOKEN` in Vercel.
2. Deploy. `npm run build` applies migrations and seeds the default forms and blog posts automatically.
3. Visit `/login` to create the owner account.

Visitor country, province/state and city come from Vercel's (or Cloudflare's) geo headers. No IP addresses are stored, and analytics uses no cookies.

## Pages (49 static + landing)

| Route | Purpose |
|---|---|
| `/` | Home: hero, services, process, quote form, GTA map, guides, FAQ |
| `/services`, `/services/[slug]` | 10 service pages (mortgage, estate, divorce, CRA, MPAC, FSBO, pre-purchase, condo, private lending, litigation) |
| `/areas`, `/areas/[slug]` | 20 city pages (Toronto, North York, Mississauga, Vaughan, Markham, Oakville, Hamilton …) |
| `/pricing`, `/faq`, `/about`, `/contact`, `/get-a-quote` | Core pages |
| `/blog`, `/blog/[slug]` | Blog managed from the dashboard (seeded with 3 answer-first guides) |
| `/book-appraisal` | Multi-step booking questionnaire (questions editable in the dashboard) |
| `/lp/home-appraisal` | **Google Ads landing page**: no nav, noindex, with message match via URL params |

Edit service, city and FAQ content in `src/lib/` (`site.ts`, `services.ts`, `areas.ts`, `faqs.ts`); blog posts, forms and testimonials are edited in the dashboard. Pages, schema, the sitemap and llms.txt are generated from both.

## Dashboard (`/dashboard`)

| Section | What it does |
|---|---|
| **Overview** | Visitors, page views, leads and conversion rate vs the previous period; traffic chart; lead pipeline; latest leads; top pages and countries |
| **Analytics** | First-party analytics. Visitors, sessions, page views and button clicks over 24h / 7d / 30d / 90d / 12m. Breakdowns by **page**, **country**, **province/state** and **city**, plus traffic source, leads by source, device and browser. **Every button and link click** is listed by label and position, site-wide and per page. Click any page to filter the whole report to that page. |
| **Leads** | Status pipeline (new → contacted → quoted → booked → completed / lost / spam), assignees, notes and activity timeline, quoted fee, full attribution (landing page, UTM, Google Ads click ID, location), search and filters, CSV export |
| **Forms** | Form builder: add, remove and reorder questions (text, phone, email, dropdown, single/multiple choice, date, number, long text); required and width settings; "one card" or "one step at a time" layout; live preview. The **primary** form appears in every quote box on the site. Every form also gets a page at `/forms/<slug>`, and the multi-step questionnaire lives at `/book-appraisal`. |
| **Blog** | Markdown editor with toolbar and preview, cover image, card colour, tags, custom URL, SEO title and description with a Google snippet preview, draft/publish. Posts appear at `/blog`, in the sitemap and in `llms.txt`. |
| **Testimonials** | Add, edit, hide, feature and delete testimonials with star ratings. The website's testimonials section appears automatically once one is published. |
| **Team & roles** | Add users (email = login ID) with a set or generated password, change roles, reset passwords, deactivate or remove users. A permission matrix shows what each role can do. |
| **My account** | Change name and password (other devices are signed out) |

**Roles:** Owner (everything) · Admin (everything except managing owners) · Editor (blog, testimonials, forms, analytics) · Sales (leads + analytics) · Viewer (read-only leads + analytics).

**Security:** passwords are hashed with scrypt; sessions are random tokens in httpOnly cookies, stored hashed and revocable; an account locks for 15 minutes after 5 failed sign-ins; every server action checks permissions; at least one owner must always remain; CSV export blocks spreadsheet formula injection; blog HTML is sanitised; the dashboard and login are `noindex` and disallowed in robots.txt.

## Blog library (`content/blog/`)

The site ships with **46 in-depth articles** (~19,000 words). Each follows an answer-first format for Google featured snippets and AI assistants: a quick answer, scannable sections and tables, an FAQ section (emitted as FAQPage schema), internal links to the matching service pages, and a quote CTA.

- **16 go live at launch** (`day: 0`); **30 are scheduled** about two a week over the following 15 weeks (`day: 3` … `day: 105`). This steady publishing pattern is what search engines reward, rather than a one-time dump.
- Set `BLOG_LAUNCH_DATE=YYYY-MM-DD` **before the first production build** so the schedule starts on launch day.
- On every build, files whose slug isn't already in the database are added. Existing posts are never overwritten; once imported, edit them in *Dashboard → Blog*, where you can also change any post's publish date.
- Articles cover high-intent searches (cost, estates, divorce, MPAC appeals, refinancing, CRA) and underserved Toronto topics (garden suites, fourplex rules, knob-and-tube wiring, heritage designation, ravine lots, former grow-ops, partition sales, power of attorney sales).
- Tax and legal facts were checked in Nov 2026. Have the client review them before launch, and update the posts when rules change.

## SEO / AEO / LLM optimization

- **JSON-LD schema:** `ProfessionalService`+`LocalBusiness` (NAP, geo, hours, areaServed, AIC membership), `WebSite`, `Service`, `FAQPage`, `BreadcrumbList`, `Article`, `ItemList`.
- **`/llms.txt` and `/llms-full.txt`:** factual briefs for AI crawlers, following the llmstxt.org format.
- **`robots.txt`** explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot, Bingbot and others.
- **Answer-first copy:** each service, city and guide opens with a 1–2 sentence definition that LLMs and Google can quote.
- **Other SEO plumbing:** unique titles, descriptions and canonicals; a dynamic OG image; `sitemap.xml`; geo meta tags; and 308 redirects from the old `.php` URLs (see `next.config.ts`).

## Google Ads and conversion tracking

- Set `NEXT_PUBLIC_GTM_ID`. The site pushes these `dataLayer` events: `generate_lead` (form submit), `phone_click` (every tel: link) and `cta_click`, each with `cta_location`. In GTM, map them to Google Ads conversions and GA4.
- `gclid`/`gbraid`/`wbraid` and UTM params are captured on landing, persisted, and sent with each lead.
- To message-match ads on the landing page: `/lp/home-appraisal?city=mississauga&s=estate-probate-appraisal`. `city` takes a slug from `areas.ts` and `s` takes a slug from `services.ts`.
- A sticky call/quote bar shows on mobile, and there's a quote form above the fold on service, city and landing pages.

## Leads

`POST /api/leads` validates the submission against the form's current questions, saves it to the dashboard, and also sends it by email through [Resend](https://resend.com) (`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) and/or to a webhook (`LEAD_WEBHOOK_URL` for Zapier, Make or a CRM). It includes a honeypot spam trap. Leads are always saved in the dashboard; email and webhook delivery are optional extras.

## ⚠️ Confirm with the client before launch

These facts came from public listings because the old site couldn't be reached during the build. They're marked `VERIFY` in `src/lib/site.ts`:

- Email address, business hours, founding year, geo coordinates
- Credentials (AACI / CRA designations, AIC membership) and the typical turnaround (currently "48–72 hours")
- Starting price (`startingPrice`, currently hidden; a directory listed "from $650", which is unverified)
- Facebook / Google Business Profile URLs (`sameAs`)
- **Real client reviews** go in *Dashboard → Testimonials*. Never publish invented ones.

## Off-site work that moves rankings

1. Claim and optimize the **Google Business Profile** with the exact same name, address and phone as `site.ts`, the category "Real estate appraiser", and service areas.
2. Ask happy clients (lawyers, brokers, executors) for Google reviews.
3. Build consistent citations: AIC directory, Yelp, BBB, YellowPages, Bing Places, Apple Business Connect.
4. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools; Bing feeds ChatGPT search.
5. Publish a new blog post every month from the dashboard.
