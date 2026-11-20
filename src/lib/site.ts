/**
 * Single source of truth for business facts (NAP, credentials, hours).
 * Everything here feeds visible copy, JSON-LD schema, llms.txt and the sitemap,
 * so keeping it accurate keeps Google, ChatGPT, Perplexity, Gemini and Claude consistent.
 *
 * Facts come from valuetrustappraisalsinc.ca. Items marked VERIFY still need the client's confirmation.
 */
export const site = {
  name: "Value Trust Appraisals Inc.",
  brand: "Value Trust",
  legalName: "Value Trust Appraisals Inc.",
  /** Company slogan, as on the logo. */
  slogan: "Trust in Every Valuation, Excellence in Every Service.",
  tagline: "Real estate appraisal and advisory services in Southern Ontario",
  description:
    "Value Trust Appraisals Inc. provides real estate appraisal and advisory services for residential, multi-residential, commercial, industrial, agricultural and institutional properties across the GTHA and Southern Ontario. AACI-designated appraiser, CUSPAP-compliant reports.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.valuetrustappraisalsinc.ca").replace(/\/$/, ""),
  phone: "(647) 783-8979",
  phoneE164: "+16477838979",
  email: "hobikh@valuetrustappraisalsinc.ca",
  address: {
    street: "1195 The Queensway",
    city: "Etobicoke",
    region: "ON",
    regionName: "Ontario",
    postalCode: "", // VERIFY: confirm postal code with the client
    country: "CA",
  },
  geo: { lat: 43.6215, lng: -79.5205 }, // approx. 1195 The Queensway, Etobicoke
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
  ], // VERIFY business hours
  hoursLabel: "Mon–Fri 9am–5pm", // VERIFY
  yearsExperience: "10+",
  credentials: "AACI-designated appraiser, Appraisal Institute of Canada (AIC)",
  /** Where we work: main area plus case-by-case coverage. */
  coverage: "GTHA + Southern Ontario",
  coverageNote: "Main coverage is the Greater Toronto and Hamilton Area. Elsewhere in Southern Ontario on a case-by-case basis.",
  propertyTypes: ["Residential", "Multi-residential", "Commercial", "Industrial", "Agricultural", "Institutional"],
  priceRange: "$$",
  sameAs: [] as string[], // add the LinkedIn company page and Google Business Profile URLs when supplied
};

export type Site = typeof site;

/**
 * Search engines may index the site only once it's launched on its real domain.
 * On Vercel, a deployment stays noindex until NEXT_PUBLIC_SITE_URL is set.
 */
export const indexable = !process.env.VERCEL || !!process.env.NEXT_PUBLIC_SITE_URL;

export const absUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
export const telHref = `tel:${site.phoneE164}`;
