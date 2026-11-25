import map from "./coverage-map.json";
import { areas } from "./areas";

/**
 * Clickable coverage map data. Shapes were traced from the client's Southern Ontario county map
 * (public/brand/southern-ontario.png). Main coverage = the GTHA; everything else is case by case.
 */
export type CoverageRegion = {
  id: string;
  name: string;
  main: boolean;
  d: string;
  lx: number;
  ly: number;
  r: number;
  /** Label lines, for names too long for one line. */
  label: string[];
  cities: { slug: string; name: string }[];
};

export const MAIN_IDS = ["toronto", "peel", "york", "halton", "durham", "hamilton"] as const;

const LABELS: Record<string, string[]> = {
  "stormont-dundas-glengarry": ["Stormont,", "Dundas &", "Glengarry"],
  "prescott-russell": ["Prescott", "& Russell"],
  "leeds-grenville": ["Leeds &", "Grenville"],
  "lennox-addington": ["Lennox &", "Addington"],
  "kawartha-lakes": ["Kawartha", "Lakes"],
  "prince-edward": ["Prince", "Edward"],
  "chatham-kent": ["Chatham-", "Kent"],
  essex: ["Windsor-", "Essex"],
};

const REGION_OF_AREA: Record<string, string> = { Toronto: "toronto", Peel: "peel", York: "york", Halton: "halton", Durham: "durham", Hamilton: "hamilton" };

/** Hand-placed label anchors where the widest point of the shape is not the best spot. */
const ANCHOR: Record<string, [number, number]> = {
  "stormont-dundas-glengarry": [672, 58],
  "prescott-russell": [650, 27],
  "lennox-addington": [524, 172],
};

export const regions: CoverageRegion[] = map.regions.map((r) => ({
  id: r.id,
  name: r.name,
  main: (MAIN_IDS as readonly string[]).includes(r.id),
  d: r.d,
  lx: ANCHOR[r.id]?.[0] ?? r.lx,
  ly: ANCHOR[r.id]?.[1] ?? r.ly,
  r: r.r,
  label: LABELS[r.id] ?? [r.name],
  cities: areas.filter((a) => REGION_OF_AREA[a.region] === r.id).map((a) => ({ slug: a.slug, name: a.name })),
}));

export const lakePath: string = map.lake;
export const viewBox: [number, number, number, number] = [-12, -8, 750, 497];
/** Close-up of the GTHA, same aspect ratio as the full map. */
export const GTHA_BOX: [number, number, number, number] = [212, 190, 218, 144.4];

export const regionOfArea = (region: string) => REGION_OF_AREA[region];
