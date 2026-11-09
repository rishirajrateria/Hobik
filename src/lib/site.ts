/**
 * Single source of truth for business facts (NAP, credentials, hours).
 * Everything here feeds visible copy, JSON-LD schema, llms.txt and the sitemap,
 * so keeping it accurate keeps Google, ChatGPT, Perplexity, Gemini and Claude consistent.
 *
 * Items marked VERIFY were gathered from public listings and must be confirmed
 * with the client before launch.
 */
export const site = {
  name: "Home Value Inc.",
  brand: "Home Appraisal Toronto",
  legalName: "Home Value Inc.",
  tagline: "Certified Home Appraisals Across Toronto & the GTA",
  description:
    "Home Value Inc. provides certified residential property appraisals in Toronto, the GTA and Southern Ontario — for mortgages, estates, divorce, CRA capital gains, MPAC tax appeals and private sales. Fast turnaround, lender-accepted reports.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.homeappraisaltoronto.ca").replace(/\/$/, ""),
  phone: "(416) 871-9224",
  phoneE164: "+14168719224",
  email: "info@homeappraisaltoronto.ca", // VERIFY
  address: {
    street: "36 Gwendolen Ave",
    city: "Toronto",
    region: "ON",
    regionName: "Ontario",
    postalCode: "M2N 1A2",
    country: "CA",
  },
  geo: { lat: 43.7587, lng: -79.4089 }, // approx. 36 Gwendolen Ave, North York — VERIFY
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "19:00" },
    { days: ["Saturday"], opens: "09:00", closes: "17:00" },
  ], // VERIFY
  hoursLabel: "Mon–Fri 8am–7pm · Sat 9am–5pm",
  yearsExperience: "10+",
  credentials: "Appraisal Institute of Canada (AIC) members", // VERIFY designations (AACI / CRA)
  turnaround: "48–72 hours", // VERIFY typical report turnaround
  startingPrice: null as string | null, // e.g. "$450" — set once confirmed; shown on pricing + ads landing
  priceRange: "$$",
  founded: "2014", // VERIFY
  sameAs: [
    "https://www.facebook.com/HomeAppraisal/", // VERIFY this is the client's page
  ] as string[],
};

export type Site = typeof site;

export const absUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
export const telHref = `tel:${site.phoneE164}`;
