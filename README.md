# Home Value Inc. — homeappraisaltoronto.ca (Next.js rebuild)

A fast, visual, conversion-focused website for **Home Value Inc.**, a residential appraisal firm in Toronto. It's built to rank in Google and to be cited by AI assistants (ChatGPT, Perplexity, Gemini, Claude, Copilot), and it's ready for Google Ads traffic.

**Stack:** Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS 4. There are no image files: every visual is inline SVG/CSS, which keeps pages fast for Core Web Vitals.

## Run

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Deploy to Vercel (recommended) or any Node host. Set the env vars from `.env.example`.

## Pages (49 static + landing)

| Route | Purpose |
|---|---|
| `/` | Home: hero, services, process, quote form, GTA map, guides, FAQ |
| `/services`, `/services/[slug]` | 10 service pages (mortgage, estate, divorce, CRA, MPAC, FSBO, pre-purchase, condo, private lending, litigation) |
| `/areas`, `/areas/[slug]` | 20 city pages (Toronto, North York, Mississauga, Vaughan, Markham, Oakville, Hamilton …) |
| `/pricing`, `/faq`, `/about`, `/contact`, `/get-a-quote` | Core pages |
| `/guides/[slug]` | Answer-first articles for featured snippets and AI citations |
| `/lp/home-appraisal` | **Google Ads landing page**: no nav, noindex, with message match via URL params |

Edit content in `src/lib/` (`site.ts`, `services.ts`, `areas.ts`, `faqs.ts`, `guides.ts`). Every page, schema block, sitemap entry and llms.txt line is generated from those files.

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

`POST /api/quote` sends each lead by email through [Resend](https://resend.com) (`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) and/or to a webhook (`LEAD_WEBHOOK_URL` for Zapier, Make or a CRM). It includes a honeypot spam trap. If neither is configured, leads are only logged to the server console.

## ⚠️ Confirm with the client before launch

These facts came from public listings because the old site couldn't be reached during the build. They're marked `VERIFY` in `src/lib/site.ts`:

- Email address, business hours, founding year, geo coordinates
- Credentials (AACI / CRA designations, AIC membership) and the typical turnaround (currently "48–72 hours")
- Starting price (`startingPrice`, currently hidden; a directory listed "from $650", which is unverified)
- Facebook / Google Business Profile URLs (`sameAs`)
- **Real Google reviews** go in `site.reviews`. Review stars and schema appear only when real reviews are added. Never add invented ones.

## Off-site work that moves rankings

1. Claim and optimize the **Google Business Profile** with the exact same name, address and phone as `site.ts`, the category "Real estate appraiser", and service areas.
2. Ask happy clients (lawyers, brokers, executors) for Google reviews.
3. Build consistent citations: AIC directory, Yelp, BBB, YellowPages, Bing Places, Apple Business Connect.
4. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools; Bing feeds ChatGPT search.
5. Publish a new guide each month in `guides.ts`.
