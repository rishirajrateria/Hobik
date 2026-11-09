export type IconName =
  | "bank"
  | "scroll"
  | "scale"
  | "receipt"
  | "gavel"
  | "tag"
  | "key"
  | "building"
  | "coins"
  | "briefcase";

export type Service = {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  /** Answer-first definition — what LLMs and featured snippets quote. */
  answer: string;
  keywords: string[];
  highlights: { label: string; value: string }[];
  bullets: string[];
  forWho: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "mortgage-refinance-appraisal",
    name: "Mortgage & Refinance Appraisal",
    short: "Lender-ready reports for purchases, refinances, HELOCs and switches.",
    icon: "bank",
    answer:
      "A mortgage or refinance appraisal is an independent opinion of a home's market value prepared for a lender. In Toronto it confirms how much equity you have before a refinance, HELOC, switch or purchase closing.",
    keywords: ["mortgage appraisal Toronto", "refinance appraisal Toronto", "HELOC appraisal Toronto"],
    highlights: [
      { label: "Typical turnaround", value: "48–72 hrs" },
      { label: "Accepted by", value: "Banks · B-lenders · Credit unions" },
      { label: "Report", value: "Lender-format PDF" },
    ],
    bullets: [
      "Unbiased market value backed by recent comparable sales",
      "Formatted for major banks, credit unions and alternative lenders",
      "Ideal for refinances, HELOCs, private sales and equity take-outs",
    ],
    forWho: ["Homeowners refinancing", "Mortgage brokers & agents", "Buyers in private sales"],
    faqs: [
      {
        q: "Will my bank accept a Home Value Inc. appraisal?",
        a: "Many lenders accept independent reports from AIC-member appraisers, but some order through their own panel. Ask your lender or broker which format they need and we'll prepare the report accordingly.",
      },
      {
        q: "How long does a mortgage appraisal take in Toronto?",
        a: "The site visit usually takes 30–60 minutes, and most lender reports are delivered within 48–72 hours of the inspection.",
      },
    ],
  },
  {
    slug: "estate-probate-appraisal",
    name: "Estate & Probate Appraisal",
    short: "Date-of-death valuations for executors, estate lawyers and Estate Administration Tax.",
    icon: "scroll",
    answer:
      "An estate appraisal establishes a property's fair market value as of the date of death. Ontario executors use it to calculate Estate Administration Tax, report capital gains to the CRA and divide assets fairly between beneficiaries.",
    keywords: ["estate appraisal Toronto", "probate appraisal Ontario", "date of death appraisal"],
    highlights: [
      { label: "Valuation date", value: "Date of death" },
      { label: "Used for", value: "EAT · CRA · Beneficiaries" },
      { label: "Retrospective", value: "Available" },
    ],
    bullets: [
      "Retrospective value as of the exact date of death",
      "Defensible support for Estate Administration Tax and CRA filings",
      "Discreet, respectful scheduling with executors and families",
    ],
    forWho: ["Executors & estate trustees", "Estate lawyers", "Beneficiaries"],
    faqs: [
      {
        q: "Do I need an appraisal for probate in Ontario?",
        a: "Ontario requires executors to report the fair market value of estate assets. A certified appraisal is the most defensible way to value real estate for the Estate Administration Tax return and the deceased's final CRA return.",
      },
      {
        q: "Can you appraise a home as of a past date?",
        a: "Yes. Retrospective appraisals use sales data from around the date of death, even if the home has since changed or been sold.",
      },
    ],
  },
  {
    slug: "divorce-separation-appraisal",
    name: "Divorce & Separation Appraisal",
    short: "Neutral matrimonial home valuations for equalization and family court.",
    icon: "scale",
    answer:
      "A divorce or separation appraisal values the matrimonial home as of the date of separation or a current date. Ontario family lawyers use it for net family property equalization and buy-out negotiations.",
    keywords: ["divorce appraisal Toronto", "matrimonial home appraisal", "separation home valuation Ontario"],
    highlights: [
      { label: "Valuation date", value: "Separation or current" },
      { label: "Approach", value: "Neutral & impartial" },
      { label: "Court", value: "Testimony available" },
    ],
    bullets: [
      "Impartial value both parties and their lawyers can rely on",
      "Date-of-separation (retrospective) or current values",
      "Expert testimony available if the matter goes to court",
    ],
    forWho: ["Separating spouses", "Family lawyers", "Mediators"],
    faqs: [
      {
        q: "Who pays for a divorce appraisal?",
        a: "It's often shared between both spouses, but it depends on your agreement. We can provide one neutral report addressed to both parties.",
      },
      {
        q: "Can the appraisal use our date of separation?",
        a: "Yes. Ontario equalization usually uses the valuation date, so we can value the home as of that date even if it was years ago.",
      },
    ],
  },
  {
    slug: "capital-gains-cra-appraisal",
    name: "Capital Gains & CRA Appraisal",
    short: "Retrospective values for change of use, principal residence and CRA reporting.",
    icon: "receipt",
    answer:
      "A capital gains appraisal establishes a property's fair market value at a specific past date, such as when a home became a rental, was transferred to family or was inherited. It supports the adjusted cost base reported to the Canada Revenue Agency.",
    keywords: ["capital gains appraisal Toronto", "retrospective appraisal CRA", "change of use appraisal Ontario"],
    highlights: [
      { label: "Valuation date", value: "Any past date" },
      { label: "Used for", value: "CRA · Accountants" },
      { label: "Common for", value: "Change of use" },
    ],
    bullets: [
      "Retrospective value as of change of use, transfer or acquisition",
      "Documentation your accountant can file with confidence",
      "Helps support principal residence exemption claims",
    ],
    forWho: ["Landlords & investors", "Accountants", "Family transfers"],
    faqs: [
      {
        q: "When do I need a retrospective appraisal for the CRA?",
        a: "Common triggers include converting a home to a rental (or back), gifting property to family, non-arm's-length transfers and inherited property. Your accountant will confirm the date required.",
      },
    ],
  },
  {
    slug: "property-tax-assessment-appeal",
    name: "Property Tax Assessment Appeal",
    short: "Evidence to challenge your MPAC assessment through RfR or the ARB.",
    icon: "gavel",
    answer:
      "A property tax appeal appraisal gives independent market evidence that your MPAC assessed value is too high. It can be used in a Request for Reconsideration or an appeal to Ontario's Assessment Review Board (ARB).",
    keywords: ["MPAC appeal appraisal", "property tax appeal Toronto", "Assessment Review Board appraisal"],
    highlights: [
      { label: "For", value: "MPAC · ARB" },
      { label: "Valuation date", value: "MPAC base date" },
      { label: "Testimony", value: "Available" },
    ],
    bullets: [
      "Values aligned with MPAC's legislated valuation date",
      "Comparable sales evidence presented clearly",
      "Support for Request for Reconsideration and ARB hearings",
    ],
    forWho: ["Homeowners", "Tax agents", "Paralegals"],
    faqs: [
      {
        q: "Is it worth appealing my MPAC assessment?",
        a: "If comparable homes sold for noticeably less than your assessed value as of MPAC's valuation date, an appeal may reduce your property taxes. A quick call can tell you whether the numbers support it.",
      },
    ],
  },
  {
    slug: "pre-listing-fsbo-appraisal",
    name: "Pre-Listing & FSBO Appraisal",
    short: "Price your home right before you list — with or without an agent.",
    icon: "tag",
    answer:
      "A pre-listing appraisal gives sellers an independent market value before setting a list price. It's especially useful for For Sale By Owner (FSBO) sellers in Toronto who don't have an agent's comparative market analysis.",
    keywords: ["pre-listing appraisal Toronto", "FSBO appraisal Toronto", "home value before selling"],
    highlights: [
      { label: "Best for", value: "FSBO & private sales" },
      { label: "Bias", value: "None — no commission" },
      { label: "Turnaround", value: "Fast" },
    ],
    bullets: [
      "Independent value with no commission motive",
      "Shows buyers documented support for your asking price",
      "Avoid underpricing — or sitting unsold",
    ],
    forWho: ["FSBO sellers", "Downsizers", "Family sales"],
    faqs: [
      {
        q: "Is an appraisal different from a realtor's CMA?",
        a: "Yes. A comparative market analysis is a sales tool prepared by an agent. An appraisal is an independent, impartial valuation prepared by a qualified appraiser following professional standards (CUSPAP).",
      },
    ],
  },
  {
    slug: "pre-purchase-appraisal",
    name: "Pre-Purchase Appraisal",
    short: "Know what a home is really worth before you make an offer.",
    icon: "key",
    answer:
      "A pre-purchase appraisal tells a buyer what a Toronto home is likely worth before they bid. It reduces the risk of overpaying or facing a low lender appraisal after an offer is accepted.",
    keywords: ["pre-purchase appraisal Toronto", "home appraisal before buying"],
    highlights: [
      { label: "Protects", value: "Your down payment" },
      { label: "Speed", value: "Rush available" },
      { label: "Ideal for", value: "Bidding wars" },
    ],
    bullets: [
      "Avoid an appraisal gap after your offer is accepted",
      "Negotiate with real comparable-sales evidence",
      "Rush service available for competitive offer dates",
    ],
    forWho: ["Home buyers", "Investors", "Buyer agents"],
    faqs: [
      {
        q: "What happens if my home appraises below the purchase price?",
        a: "Your lender will typically lend on the lower value, so you'd need to cover the difference in cash. Knowing the value before you bid helps you avoid that gap.",
      },
    ],
  },
  {
    slug: "condo-appraisal",
    name: "Condo Appraisal",
    short: "Condo valuations for units, townhomes and lofts.",
    icon: "building",
    answer:
      "A condo appraisal values an individual unit using recent sales in the same building and nearby comparable buildings, adjusting for floor, view, size, parking, locker and condition.",
    keywords: ["condo appraisal Toronto", "condominium appraisal"],
    highlights: [
      { label: "Comparables", value: "Same-building sales" },
      { label: "Adjusts for", value: "Floor · View · Parking" },
      { label: "Types", value: "Units · Towns · Lofts" },
    ],
    bullets: [
      "Same-building and nearby comparable sales",
      "Adjustments for floor level, exposure, parking and locker",
      "For refinance, estate, divorce or sale",
    ],
    forWho: ["Condo owners", "Investors", "Executors"],
    faqs: [
      {
        q: "Are condo appraisals cheaper than house appraisals?",
        a: "Condo appraisals are often quicker to complete because of strong in-building sales data. Request a quote and we'll confirm your exact fee.",
      },
    ],
  },
  {
    slug: "private-lending-appraisal",
    name: "Private Lending Appraisal",
    short: "Fast, defensible values for private and alternative mortgage lenders.",
    icon: "coins",
    answer:
      "A private lending appraisal gives private mortgage lenders and mortgage investment corporations an independent value to set loan-to-value before funding a first, second or bridge mortgage.",
    keywords: ["private lender appraisal Toronto", "second mortgage appraisal Ontario"],
    highlights: [
      { label: "For", value: "1st · 2nd · Bridge" },
      { label: "Speed", value: "Rush available" },
      { label: "Focus", value: "Loan-to-value" },
    ],
    bullets: [
      "Conservative, well-supported market value",
      "Rush turnaround for time-sensitive deals",
      "Addressed to the lender of record",
    ],
    forWho: ["Private lenders", "Mortgage brokers", "MICs"],
    faqs: [
      {
        q: "Can the report be addressed to my private lender?",
        a: "Yes — tell us the lender's name when you book and the report will be addressed to them as the intended user.",
      },
    ],
  },
  {
    slug: "litigation-expert-witness",
    name: "Litigation & Expert Witness",
    short: "Court-ready valuations and testimony for real estate disputes.",
    icon: "briefcase",
    answer:
      "A litigation appraisal is a detailed valuation prepared for legal disputes such as partition, estate challenges, family law or insurance claims, with the appraiser available to testify as an expert witness.",
    keywords: ["expert witness appraiser Toronto", "litigation appraisal Ontario"],
    highlights: [
      { label: "For", value: "Lawyers & courts" },
      { label: "Includes", value: "Detailed narrative" },
      { label: "Testimony", value: "Quoted separately" },
    ],
    bullets: [
      "Thorough narrative reports built to withstand scrutiny",
      "Retrospective and current valuation dates",
      "Expert testimony at court, mediation or arbitration",
    ],
    forWho: ["Litigation lawyers", "Estate disputes", "Partition actions"],
    faqs: [
      {
        q: "Is court testimony included in the appraisal fee?",
        a: "No. Court preparation and testimony are quoted separately based on the time required.",
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
