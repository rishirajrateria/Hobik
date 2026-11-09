export type Guide = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  readMins: number;
  /** One-paragraph direct answer — placed first so search engines and LLMs can quote it. */
  tldr: string;
  sections: { h: string; body?: string; list?: string[] }[];
};

export const guides: Guide[] = [
  {
    slug: "home-appraisal-cost-toronto",
    title: "How Much Does a Home Appraisal Cost in Toronto? (2026)",
    description:
      "What Toronto homeowners pay for a residential appraisal in 2026, what changes the price, and how to get an exact quote.",
    updated: "2026-11-01",
    readMins: 4,
    tldr:
      "A standard residential appraisal in Toronto typically costs a few hundred dollars plus HST. The fee rises for large or luxury homes, multi-unit properties, retrospective (past-date) valuations, rush service and litigation work. Always confirm the fee in writing before the inspection.",
    sections: [
      {
        h: "What affects the price",
        list: [
          "Purpose — lender, estate, divorce, CRA or court use",
          "Property type — condo, house, multiplex or rural acreage",
          "Size, value and complexity (custom, heritage, unique features)",
          "Valuation date — current vs. retrospective",
          "Turnaround — standard vs. rush",
          "Extras — court testimony, additional structures, revisions",
        ],
      },
      {
        h: "Is a cheaper appraisal worth it?",
        body:
          "For anything that may be scrutinized — an estate return, a family-law equalization, a CRA filing or an MPAC appeal — a well-supported report from an AIC-designated appraiser is worth far more than the small difference in fee.",
      },
      {
        h: "How to get an exact quote",
        body:
          "Share the address, property type, purpose and the date of value you need. Home Value Inc. confirms your fee and earliest inspection time before you book — no obligation.",
      },
    ],
  },
  {
    slug: "how-to-prepare-for-home-appraisal",
    title: "How to Prepare for a Home Appraisal: 8-Step Checklist",
    description:
      "A quick checklist to help Toronto homeowners prepare for an appraisal inspection and make sure every upgrade is counted.",
    updated: "2026-11-01",
    readMins: 3,
    tldr:
      "Give the appraiser access to every room, prepare a list of upgrades with dates and costs, and have your survey, floor plan and tax bill ready. Preparation won't inflate a value, but it makes sure nothing that adds value is missed.",
    sections: [
      {
        h: "The checklist",
        list: [
          "Unlock every room, the attic hatch, garage and basement",
          "List renovations with year and approximate cost",
          "Have a survey, floor plan or MPAC notice handy",
          "Note any legal second suite or rental income",
          "Fix small, obvious issues (lights, leaks, broken trim)",
          "Secure pets and plan to be available for questions",
          "Share recent nearby sales you think are relevant",
          "Tell us about any unusual easements or issues up front",
        ],
      },
      {
        h: "What appraisers look at",
        body:
          "Location, lot, size, layout, condition, quality of finishes, age, updates and comparable sales nearby. Clutter doesn't change value — condition does.",
      },
    ],
  },
  {
    slug: "appraisal-vs-mpac-assessment-vs-cma",
    title: "Appraisal vs. MPAC Assessment vs. Realtor CMA: What's the Difference?",
    description:
      "Three ways to put a number on an Ontario home — and which one lenders, courts, executors and the CRA actually rely on.",
    updated: "2026-11-01",
    readMins: 3,
    tldr:
      "An appraisal is an independent, standards-based market value of one specific home. An MPAC assessment is a mass valuation used for property tax. A realtor's CMA is a pricing tool for listing. Lenders, courts, the CRA and executors rely on appraisals.",
    sections: [
      {
        h: "Appraisal",
        body:
          "Prepared by a qualified, independent appraiser (AACI or CRA) under CUSPAP. Used for mortgages, estates, divorce, tax and litigation. Can be current or retrospective.",
      },
      {
        h: "MPAC assessment",
        body:
          "Ontario's Municipal Property Assessment Corporation values every property using mass-appraisal models tied to a legislated base date. It sets property taxes — it isn't today's market value.",
      },
      {
        h: "Comparative Market Analysis (CMA)",
        body:
          "A free pricing estimate from a real estate agent who hopes to list your home. Helpful for marketing, but not independent and not accepted for legal or tax purposes.",
      },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
