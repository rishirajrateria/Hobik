export type Area = {
  slug: string;
  name: string;
  region: "Toronto" | "Peel" | "York" | "Halton" | "Durham" | "Hamilton";
  /** Approximate position on the stylised GTA map (0–100 viewBox units). */
  map: { x: number; y: number };
  intro: string;
  neighbourhoods: string[];
  homeTypes: string[];
};

export const areas: Area[] = [
  {
    slug: "toronto",
    name: "Toronto",
    region: "Toronto",
    map: { x: 55, y: 62 },
    intro:
      "From downtown condos to century homes in the Annex and Leslieville, Toronto has some of Canada's most varied housing. Our appraisers know the street-by-street differences that move value.",
    neighbourhoods: ["Downtown", "The Annex", "Leslieville", "Leaside", "High Park", "Rosedale", "Liberty Village", "The Beaches"],
    homeTypes: ["Condos", "Semi-detached", "Victorian & Edwardian homes", "Laneway & multiplex"],
  },
  {
    slug: "north-york",
    name: "North York",
    region: "Toronto",
    map: { x: 55, y: 48 },
    intro:
      "Our office is on Gwendolen Ave in Willowdale, so North York is home turf — Yonge-Sheppard condos, Bayview Village bungalows and custom rebuilds in Lansing and Willowdale.",
    neighbourhoods: ["Willowdale", "Bayview Village", "Lansing", "Don Mills", "York Mills", "Bedford Park", "Newtonbrook", "Downsview"],
    homeTypes: ["Custom rebuilds", "Bungalows", "High-rise condos", "Townhomes"],
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    region: "Toronto",
    map: { x: 70, y: 52 },
    intro:
      "Scarborough mixes post-war bungalows, bluffs-side homes and new townhome developments. We value each against true local comparables, not city-wide averages.",
    neighbourhoods: ["Agincourt", "Scarborough Bluffs", "Guildwood", "Malvern", "Wexford", "Birch Cliff", "Highland Creek"],
    homeTypes: ["Bungalows", "Back-splits", "Townhomes", "Condos"],
  },
  {
    slug: "etobicoke",
    name: "Etobicoke",
    region: "Toronto",
    map: { x: 40, y: 60 },
    intro:
      "Etobicoke ranges from lakeside condos in Humber Bay to estate homes in the Kingsway. We account for ravine lots, rebuilds and lake proximity.",
    neighbourhoods: ["The Kingsway", "Humber Bay", "Mimico", "Islington Village", "Long Branch", "Rexdale", "Markland Wood"],
    homeTypes: ["Estate homes", "Waterfront condos", "Bungalows", "Split-levels"],
  },
  {
    slug: "east-york",
    name: "East York",
    region: "Toronto",
    map: { x: 61, y: 56 },
    intro:
      "East York's compact bungalows and semis are prime candidates for renovation and second units — we capture those upgrades in your value.",
    neighbourhoods: ["Leaside", "Thorncliffe Park", "Pape Village", "Woodbine Heights", "O'Connor-Parkview"],
    homeTypes: ["Bungalows", "Semis", "Renovated homes", "Duplexes"],
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    region: "Peel",
    map: { x: 30, y: 66 },
    intro:
      "Mississauga covers lakefront Port Credit, executive homes in Lorne Park and fast-growing condo hubs around Square One. We appraise all of it.",
    neighbourhoods: ["Port Credit", "Lorne Park", "Erin Mills", "Meadowvale", "Streetsville", "City Centre", "Churchill Meadows"],
    homeTypes: ["Detached", "Condos", "Townhomes", "Executive homes"],
  },
  {
    slug: "brampton",
    name: "Brampton",
    region: "Peel",
    map: { x: 28, y: 46 },
    intro:
      "Brampton's newer subdivisions, legal basement apartments and multigenerational homes need an appraiser who understands income potential and local sales.",
    neighbourhoods: ["Springdale", "Castlemore", "Mount Pleasant", "Bramalea", "Heart Lake", "Credit Valley"],
    homeTypes: ["New detached", "Legal second units", "Semis", "Townhomes"],
  },
  {
    slug: "vaughan",
    name: "Vaughan",
    region: "York",
    map: { x: 45, y: 36 },
    intro:
      "From Kleinburg estates to Woodbridge and the Vaughan Metropolitan Centre condo boom, we value Vaughan homes against the right micro-market.",
    neighbourhoods: ["Woodbridge", "Maple", "Kleinburg", "Thornhill", "Concord", "Vaughan Metropolitan Centre"],
    homeTypes: ["Luxury estates", "Detached", "Condos", "Townhomes"],
  },
  {
    slug: "richmond-hill",
    name: "Richmond Hill",
    region: "York",
    map: { x: 56, y: 32 },
    intro:
      "Richmond Hill's sought-after school districts and large lots drive strong demand. We factor in lot size, rebuild potential and location within top school zones.",
    neighbourhoods: ["Bayview Hill", "Oak Ridges", "Mill Pond", "Jefferson", "Richmond Hill Centre", "South Richvale"],
    homeTypes: ["Detached", "Custom homes", "Townhomes", "Condos"],
  },
  {
    slug: "markham",
    name: "Markham",
    region: "York",
    map: { x: 67, y: 36 },
    intro:
      "Markham's mix of heritage Unionville homes, new builds and tech-corridor condos calls for careful comparable selection — which is exactly what we do.",
    neighbourhoods: ["Unionville", "Cornell", "Cathedraltown", "Berczy Village", "Markham Village", "Thornhill"],
    homeTypes: ["New builds", "Heritage homes", "Townhomes", "Condos"],
  },
  {
    slug: "oakville",
    name: "Oakville",
    region: "Halton",
    map: { x: 18, y: 76 },
    intro:
      "Oakville's lakeshore estates and established family neighbourhoods carry premium values. Our reports document the features that justify them.",
    neighbourhoods: ["Old Oakville", "Glen Abbey", "Bronte", "Joshua Creek", "River Oaks", "Morrison"],
    homeTypes: ["Luxury estates", "Detached", "Townhomes", "Condos"],
  },
  {
    slug: "burlington",
    name: "Burlington",
    region: "Halton",
    map: { x: 9, y: 82 },
    intro:
      "Burlington buyers pay for lake and escarpment access. We value downtown condos, Aldershot bungalows and Millcroft family homes with precise local data.",
    neighbourhoods: ["Downtown Burlington", "Aldershot", "Millcroft", "Alton Village", "Roseland", "Tyandaga"],
    homeTypes: ["Detached", "Bungalows", "Condos", "Townhomes"],
  },
  {
    slug: "milton",
    name: "Milton",
    region: "Halton",
    map: { x: 12, y: 60 },
    intro:
      "One of Canada's fastest-growing towns, Milton is dominated by newer subdivisions where small differences in model and lot shape value.",
    neighbourhoods: ["Willmott", "Hawthorne Village", "Ford", "Beaty", "Old Milton", "Cobban"],
    homeTypes: ["New detached", "Semis", "Townhomes"],
  },
  {
    slug: "pickering",
    name: "Pickering",
    region: "Durham",
    map: { x: 79, y: 50 },
    intro:
      "Pickering's lakefront Bay Ridges, established Amberlea and new Seaton communities each trade differently. We use the right comparables for each.",
    neighbourhoods: ["Bay Ridges", "Amberlea", "Seaton", "Liverpool", "Rosebank", "Duffin Heights"],
    homeTypes: ["Detached", "New builds", "Townhomes"],
  },
  {
    slug: "ajax",
    name: "Ajax",
    region: "Durham",
    map: { x: 84, y: 48 },
    intro:
      "Ajax offers family homes close to the lake and GO line. We appraise everything from waterfront properties to newer north Ajax subdivisions.",
    neighbourhoods: ["Pickering Village", "South Ajax", "Northwest Ajax", "Riverside", "Central Ajax"],
    homeTypes: ["Detached", "Semis", "Townhomes"],
  },
  {
    slug: "whitby",
    name: "Whitby",
    region: "Durham",
    map: { x: 89, y: 44 },
    intro:
      "Whitby's Brooklin growth and historic downtown give it a wide spread of values. We pin down exactly where your home sits.",
    neighbourhoods: ["Brooklin", "Port Whitby", "Williamsburg", "Rolling Acres", "Blue Grass Meadows"],
    homeTypes: ["Detached", "New builds", "Bungalows"],
  },
  {
    slug: "oshawa",
    name: "Oshawa",
    region: "Durham",
    map: { x: 94, y: 40 },
    intro:
      "Oshawa remains one of the GTA's more affordable markets, popular with first-time buyers and investors. We value income suites and renovations accurately.",
    neighbourhoods: ["Windfields", "Kedron", "Taunton", "Centennial", "McLaughlin", "Lakeview"],
    homeTypes: ["Detached", "Duplexes", "Bungalows", "Townhomes"],
  },
  {
    slug: "newmarket",
    name: "Newmarket",
    region: "York",
    map: { x: 58, y: 16 },
    intro:
      "Newmarket's historic Main Street homes and family subdivisions attract commuters seeking space. We appraise both with local sales evidence.",
    neighbourhoods: ["Stonehaven", "Glenway", "Summerhill Estates", "Woodland Hill", "Old Main Street"],
    homeTypes: ["Detached", "Townhomes", "Heritage homes"],
  },
  {
    slug: "aurora",
    name: "Aurora",
    region: "York",
    map: { x: 55, y: 22 },
    intro:
      "Aurora's estate lots and established neighbourhoods command strong prices. Our reports document lot size, finishes and location premiums.",
    neighbourhoods: ["Aurora Highlands", "Bayview Wellington", "Hills of St. Andrew", "Aurora Village", "Aurora Grove"],
    homeTypes: ["Estate homes", "Detached", "Townhomes"],
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "Hamilton",
    map: { x: 4, y: 90 },
    intro:
      "Hamilton's character homes, escarpment views and growing investor demand make careful valuation essential. We cover the lower city, Mountain and Stoney Creek.",
    neighbourhoods: ["Westdale", "Durand", "Locke Street", "Stoney Creek", "Ancaster", "Hamilton Mountain", "Dundas"],
    homeTypes: ["Century homes", "Duplexes", "Bungalows", "Detached"],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
