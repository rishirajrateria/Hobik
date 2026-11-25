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
  /** Home office: street address is intentionally NOT shown anywhere on the site, only the city. */
  address: {
    street: "",
    city: "Toronto",
    region: "ON",
    regionName: "Ontario",
    postalCode: "",
    country: "CA",
  },
  geo: { lat: 43.6532, lng: -79.3832 }, // Toronto city centre (not the home office)
  yearsExperience: "10+",
  credentials: "AACI-designated appraiser, Appraisal Institute of Canada (AIC)",
  /** Where we work: main area plus case-by-case coverage. */
  coverage: "GTHA + Southern Ontario",
  coverageNote: "Main coverage is the Greater Toronto and Hamilton Area. Elsewhere in Southern Ontario on a case-by-case basis.",
  propertyTypes: ["Residential", "Multi-residential", "Commercial", "Institutional", "Industrial", "Agricultural"],
  /** Typical turnaround by property type. VERIFY: placeholder values, confirm with the client. */
  turnaround: { residential: "2–3 business days", commercial: "5–7 business days" },
  /** The AIC member profile the AIC badge links to. */
  aicProfileUrl: "https://www.aicanada.ca/appraisers/910280/?pager=1",
  /** Link for the "Review us on Google" button. VERIFY: add the Google Business Profile review link. */
  googleReviewsUrl: "" as string,
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
