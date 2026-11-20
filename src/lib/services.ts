/**
 * Services, built from the client's own service list (valuetrustappraisalsinc.ca/services):
 *  - three service lines: Mortgage Financing, Non-Financing, Advisory & Consulting
 *  - the non-financing uses they name (marital separation, tax, litigation, estates,
 *    power of sale, assessment appeals, expropriation)
 *  - the six property types they appraise
 * Every entry gets its own page at /services/[slug].
 */
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
  | "briefcase"
  | "home"
  | "shop"
  | "factory"
  | "barn"
  | "school"
  | "road";

export type ServiceGroup = "service" | "use" | "property";

export type Service = {
  slug: string;
  group: ServiceGroup;
  name: string;
  short: string;
  icon: IconName;
  /** Answer-first definition, the sentence LLMs and featured snippets quote. */
  answer: string;
  keywords: string[];
  highlights: { label: string; value: string }[];
  bullets: string[];
  forWho: string[];
  faqs: { q: string; a: string }[];
};

const STANDARD = { label: "Standard", value: "CUSPAP-compliant" };
const SIGNED = { label: "Signed by", value: "AACI-designated appraiser" };

export const services: Service[] = [
  /* ---------------- service lines ---------------- */
  {
    slug: "mortgage-financing-appraisal",
    group: "service",
    name: "Mortgage Financing",
    short: "Current market value reports for mortgage financing.",
    icon: "bank",
    answer:
      "A mortgage financing appraisal is an independent report of a property's current market value, prepared for a lender. Value Trust prepares these reports for purchases, refinances and equity take-outs on residential, multi-residential, commercial and other property types.",
    keywords: ["mortgage appraisal Toronto", "refinance appraisal GTA", "commercial mortgage appraisal Ontario"],
    highlights: [{ label: "Value type", value: "Current market value" }, STANDARD, SIGNED],
    bullets: [
      "Current market value supported by comparable sales and market data",
      "Prepared for banks, credit unions, private and alternative lenders",
      "Residential and non-residential properties",
    ],
    forWho: ["Borrowers and homeowners", "Mortgage brokers and agents", "Lenders"],
    faqs: [
      {
        q: "Will my lender accept a Value Trust appraisal?",
        a: "Many lenders accept independent reports from AIC-designated appraisers, while some order through their own panel. Ask your lender or broker which format they need and we will confirm before booking.",
      },
    ],
  },
  {
    slug: "non-financing-appraisal",
    group: "service",
    name: "Non-Financing",
    short: "Current and retrospective reports for legal, tax, estate and other uses.",
    icon: "scroll",
    answer:
      "A non-financing appraisal is a report prepared for any purpose other than a mortgage. Value Trust provides current and retrospective appraisal reports for marital separation, tax or litigation purposes, estate settlements, power of sale, assessment appeals, expropriation and more.",
    keywords: ["retrospective appraisal Ontario", "appraisal for divorce Toronto", "estate appraisal GTA", "expropriation appraisal"],
    highlights: [{ label: "Value type", value: "Current or retrospective" }, STANDARD, SIGNED],
    bullets: [
      "Marital separation and family law",
      "Tax and litigation purposes",
      "Estate settlements",
      "Power of sale",
      "Property assessment appeals",
      "Expropriation",
    ],
    forWho: ["Lawyers and paralegals", "Executors and estate trustees", "Accountants", "Owners and spouses"],
    faqs: [
      {
        q: "What is a retrospective appraisal?",
        a: "A retrospective appraisal gives a property's market value as of a past date, such as a date of death, a separation date or a tax valuation date. It relies on sales and market conditions from that time.",
      },
    ],
  },
  {
    slug: "advisory-consulting",
    group: "service",
    name: "Advisory & Consulting",
    short: "Buying, selling, or curious what a property or portfolio is worth.",
    icon: "briefcase",
    answer:
      "Value Trust's advisory and consulting service helps owners, buyers, sellers and investors understand what a property or portfolio is worth. Whether you are looking to purchase or sell a property, or simply curious about its value, we can help.",
    keywords: ["real estate advisory Toronto", "property valuation consulting Ontario", "portfolio valuation"],
    highlights: [{ label: "Scope", value: "Single property or portfolio" }, { label: "For", value: "Buying, selling, planning" }, SIGNED],
    bullets: [
      "Pre-purchase and pre-listing value opinions",
      "Portfolio valuations for owners and investors",
      "Independent advice from a designated appraiser, with no sale to make",
    ],
    forWho: ["Buyers and sellers", "Investors and portfolio owners", "Developers and businesses"],
    faqs: [
      {
        q: "Is an appraisal different from a realtor's home evaluation?",
        a: "Yes. A realtor's evaluation (CMA) gives a broad price range, often as part of winning a listing. An appraisal is an independent, detailed report with a specific value, prepared by an appraiser with no stake in the sale.",
      },
    ],
  },

  /* ---------------- non-financing uses ---------------- */
  {
    slug: "marital-separation-appraisal",
    group: "use",
    name: "Marital Separation",
    short: "Values for separation and divorce, current or as of the valuation date.",
    icon: "scale",
    answer:
      "A marital separation appraisal sets the market value of a matrimonial home or other property for family law. It can be current or retrospective (as of the valuation date) and is prepared independently for one or both spouses and their lawyers.",
    keywords: ["divorce appraisal Toronto", "matrimonial home appraisal Ontario", "separation appraisal GTA"],
    highlights: [{ label: "Value type", value: "Current or retrospective" }, STANDARD, SIGNED],
    bullets: ["Matrimonial home and other real property", "Valuation-date (retrospective) values", "Independent and impartial for both parties"],
    forWho: ["Separating spouses", "Family lawyers", "Mediators"],
    faqs: [
      {
        q: "Can one appraisal be used by both spouses?",
        a: "Yes. A jointly retained appraisal is common and often saves cost. We remain independent regardless of who retains us.",
      },
    ],
  },
  {
    slug: "estate-appraisal",
    group: "use",
    name: "Estate Settlement",
    short: "Date-of-death and current values for estates.",
    icon: "key",
    answer:
      "An estate appraisal establishes the market value of real property held by an estate, either as of the date of death or currently. Executors use it for estate administration, distribution between beneficiaries and tax filings.",
    keywords: ["estate appraisal Toronto", "date of death appraisal Ontario", "probate appraisal GTA"],
    highlights: [{ label: "Value type", value: "Date of death or current" }, STANDARD, SIGNED],
    bullets: ["Date-of-death (retrospective) values", "Fair basis for distribution between beneficiaries", "Supports estate tax filings"],
    forWho: ["Executors and estate trustees", "Estate lawyers", "Beneficiaries"],
    faqs: [
      {
        q: "Can you appraise a property as of the date of death?",
        a: "Yes. Retrospective appraisals use sales and market conditions around the date of death.",
      },
    ],
  },
  {
    slug: "tax-appraisal",
    group: "use",
    name: "Tax Purposes",
    short: "Values for CRA capital gains and other tax filings.",
    icon: "receipt",
    answer:
      "A tax appraisal provides a supportable market value for Canada Revenue Agency (CRA) purposes, such as capital gains calculations, a change in use, or a transfer between related parties. Values can be current or as of a past date.",
    keywords: ["CRA appraisal Toronto", "capital gains appraisal Ontario", "change of use appraisal"],
    highlights: [{ label: "Value type", value: "Current or retrospective" }, STANDARD, SIGNED],
    bullets: ["Capital gains and change-in-use values", "Transfers between related parties", "Retrospective values for past dates"],
    forWho: ["Owners and investors", "Accountants", "Tax lawyers"],
    faqs: [
      {
        q: "Will CRA accept an appraisal?",
        a: "CRA expects fair market value to be supportable. An independent appraisal by a designated appraiser is the usual evidence.",
      },
    ],
  },
  {
    slug: "litigation-appraisal",
    group: "use",
    name: "Litigation",
    short: "Independent values for disputes and court matters.",
    icon: "gavel",
    answer:
      "A litigation appraisal provides an independent, well-supported opinion of value for a legal dispute, such as a partnership or shareholder dispute, a partition, or a damages claim. Reports can be current or retrospective.",
    keywords: ["litigation appraisal Toronto", "expert appraisal court Ontario"],
    highlights: [{ label: "Value type", value: "Current or retrospective" }, STANDARD, SIGNED],
    bullets: ["Independent, impartial opinion of value", "Clearly documented method and support", "Current or retrospective dates"],
    forWho: ["Litigation lawyers", "Parties to a dispute", "Mediators"],
    faqs: [],
  },
  {
    slug: "power-of-sale-appraisal",
    group: "use",
    name: "Power of Sale",
    short: "Market value support for lenders selling a property.",
    icon: "tag",
    answer:
      "A power of sale appraisal gives a lender, or its lawyer, an independent market value before a property is sold under power of sale, supporting a fair list price and the lender's duty to obtain fair market value.",
    keywords: ["power of sale appraisal Ontario", "lender appraisal power of sale"],
    highlights: [{ label: "Value type", value: "Current market value" }, STANDARD, SIGNED],
    bullets: ["Independent current market value", "Supports list price decisions", "Residential and non-residential properties"],
    forWho: ["Private and institutional lenders", "Lenders' lawyers"],
    faqs: [],
  },
  {
    slug: "assessment-appeal-appraisal",
    group: "use",
    name: "Assessment Appeals",
    short: "Evidence for property assessment (MPAC) appeals.",
    icon: "coins",
    answer:
      "An assessment appeal appraisal estimates a property's market value as of the legislated valuation date, to support a Request for Reconsideration or an appeal of an MPAC property assessment.",
    keywords: ["MPAC appeal appraisal", "property tax appeal Toronto", "assessment appeal Ontario"],
    highlights: [{ label: "Value type", value: "As of valuation date" }, STANDARD, SIGNED],
    bullets: ["Value as of the legislated valuation date", "Comparable sales from that period", "Background in property taxation and assessment"],
    forWho: ["Property owners", "Tax agents", "Lawyers"],
    faqs: [],
  },
  {
    slug: "expropriation-appraisal",
    group: "use",
    name: "Expropriation",
    short: "Fair compensation when a property is taken or affected.",
    icon: "road",
    answer:
      "An expropriation appraisal estimates the market value of land or property taken by a public authority, and any loss in value to the remaining property, to support fair compensation.",
    keywords: ["expropriation appraisal Ontario", "expropriation compensation appraisal"],
    highlights: [{ label: "Value type", value: "Current or retrospective" }, STANDARD, SIGNED],
    bullets: ["Value of the property or land taken", "Effect on the remaining property", "Independent support for negotiations"],
    forWho: ["Affected owners", "Expropriation lawyers", "Public authorities"],
    faqs: [],
  },

  /* ---------------- property types ---------------- */
  {
    slug: "residential-appraisal",
    group: "property",
    name: "Residential",
    short: "Houses, condos and townhomes.",
    icon: "home",
    answer:
      "Value Trust appraises residential property across the GTHA and Southern Ontario, including detached, semi-detached and townhouses, condominiums and custom homes, for mortgage financing and non-financing purposes.",
    keywords: ["home appraisal Toronto", "residential appraiser GTA", "condo appraisal Toronto"],
    highlights: [{ label: "Property", value: "Houses · condos · townhomes" }, STANDARD, SIGNED],
    bullets: ["Detached, semi-detached and townhouses", "Condominiums", "Custom and luxury homes"],
    forWho: ["Homeowners", "Buyers and sellers", "Lenders and lawyers"],
    faqs: [],
  },
  {
    slug: "multi-residential-appraisal",
    group: "property",
    name: "Multi-Residential",
    short: "Duplexes, triplexes, multiplexes and apartment buildings.",
    icon: "building",
    answer:
      "A multi-residential appraisal values income-producing residential property, from duplexes and multiplexes to apartment buildings, considering rents, expenses and comparable sales.",
    keywords: ["multiplex appraisal Toronto", "apartment building appraisal Ontario", "income property appraisal"],
    highlights: [{ label: "Property", value: "2+ units" }, STANDARD, SIGNED],
    bullets: ["Duplexes, triplexes and multiplexes", "Apartment buildings", "Income and sales comparison approaches"],
    forWho: ["Investors and landlords", "Lenders", "Developers"],
    faqs: [],
  },
  {
    slug: "commercial-appraisal",
    group: "property",
    name: "Commercial",
    short: "Retail, office and mixed-use property.",
    icon: "shop",
    answer:
      "A commercial appraisal values retail, office and mixed-use property, typically using the income, direct comparison and cost approaches. Commercial appraisals require an AACI-designated appraiser.",
    keywords: ["commercial appraisal Toronto", "commercial appraiser GTA", "mixed-use appraisal Ontario"],
    highlights: [{ label: "Property", value: "Retail · office · mixed-use" }, STANDARD, SIGNED],
    bullets: ["Retail plazas and storefronts", "Office buildings and condos", "Mixed-use buildings"],
    forWho: ["Owners and investors", "Lenders", "Lawyers and accountants"],
    faqs: [],
  },
  {
    slug: "industrial-appraisal",
    group: "property",
    name: "Industrial",
    short: "Warehouses, plants and industrial condos.",
    icon: "factory",
    answer:
      "An industrial appraisal values warehouses, manufacturing plants, flex space and industrial condominium units, considering location, building utility and market rents.",
    keywords: ["industrial appraisal Toronto", "warehouse appraisal GTA", "industrial property appraiser Ontario"],
    highlights: [{ label: "Property", value: "Warehouse · plant · flex" }, STANDARD, SIGNED],
    bullets: ["Warehouses and distribution", "Manufacturing plants", "Industrial condominium units"],
    forWho: ["Owners and investors", "Lenders", "Businesses"],
    faqs: [],
  },
  {
    slug: "agricultural-appraisal",
    group: "property",
    name: "Agricultural",
    short: "Farms and rural land.",
    icon: "barn",
    answer:
      "An agricultural appraisal values farm property and rural land, including the land, house and farm buildings, using sales of comparable farms and rural properties.",
    keywords: ["farm appraisal Ontario", "agricultural land appraisal", "rural property appraisal Southern Ontario"],
    highlights: [{ label: "Property", value: "Farms · rural land" }, STANDARD, SIGNED],
    bullets: ["Working farms and hobby farms", "Rural and vacant land", "Farm buildings and residences"],
    forWho: ["Farm owners and families", "Lenders", "Estates"],
    faqs: [],
  },
  {
    slug: "institutional-appraisal",
    group: "property",
    name: "Institutional",
    short: "Places of worship, schools and community property.",
    icon: "school",
    answer:
      "An institutional appraisal values special-purpose property such as places of worship, schools, community centres and care facilities, where few direct sales exist and the cost approach often plays a larger role.",
    keywords: ["institutional property appraisal Ontario", "church appraisal Toronto", "special purpose property appraisal"],
    highlights: [{ label: "Property", value: "Special purpose" }, STANDARD, SIGNED],
    bullets: ["Places of worship", "Schools and community centres", "Care and other special-purpose facilities"],
    forWho: ["Boards and congregations", "Non-profits", "Lenders"],
    faqs: [],
  },
];

export const serviceLines = services.filter((s) => s.group === "service");
export const serviceUses = services.filter((s) => s.group === "use");
export const propertyTypes = services.filter((s) => s.group === "property");

export const getService = (slug: string) => services.find((s) => s.slug === slug);

/** Old service URLs, kept alive as redirects. */
export const legacyServiceRedirects: Record<string, string> = {
  "mortgage-refinance-appraisal": "mortgage-financing-appraisal",
  "private-lending-appraisal": "mortgage-financing-appraisal",
  "estate-probate-appraisal": "estate-appraisal",
  "divorce-separation-appraisal": "marital-separation-appraisal",
  "capital-gains-cra-appraisal": "tax-appraisal",
  "property-tax-assessment-appeal": "assessment-appeal-appraisal",
  "pre-listing-fsbo-appraisal": "advisory-consulting",
  "pre-purchase-appraisal": "advisory-consulting",
  "condo-appraisal": "residential-appraisal",
  "litigation-expert-witness": "litigation-appraisal",
};
