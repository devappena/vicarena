import catalog from "./leagues.json";

export type CompetitionGroup =
  | "uefa"
  | "caf"
  | "fifa"
  | "afc"
  | "conmebol"
  | "concacaf"
  | "ligue"
  | "coupe"
  | "autre";

export type Competition = {
  slug: string;
  name: string;
  shortName: string;
  group: CompetitionGroup;
  accent: string;
  description: string;
  espnId?: string;
};

type CatalogRow = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  abbreviation: string;
};

const CATALOG = catalog as CatalogRow[];

const GROUP_ACCENT: Record<CompetitionGroup, string> = {
  uefa: "#e8c547",
  caf: "#2ee59d",
  fifa: "#fbbf24",
  afc: "#fb7185",
  conmebol: "#38bdf8",
  concacaf: "#c084fc",
  ligue: "#60a5fa",
  coupe: "#f59e0b",
  autre: "#94a3b8",
};

const FEATURED: Competition[] = [
  {
    slug: "uefa.champions",
    name: "UEFA Champions League",
    shortName: "UEFA Champions League",
    group: "uefa",
    accent: "#e8c547",
    description: "Ligue des champions européenne",
  },
  {
    slug: "uefa.europa",
    name: "UEFA Europa League",
    shortName: "UEFA Europa League",
    group: "uefa",
    accent: "#ff7a18",
    description: "Ligue Europa",
  },
  {
    slug: "uefa.europa.conf",
    name: "UEFA Conference League",
    shortName: "UEFA Conference League",
    group: "uefa",
    accent: "#3dd68c",
    description: "Ligue Conférence",
  },
  {
    slug: "caf.champions",
    name: "CAF Champions League",
    shortName: "CAF Champions League",
    group: "caf",
    accent: "#2ee59d",
    description: "Ligue des champions africaine",
  },
  {
    slug: "caf.confed",
    name: "CAF Confederation Cup",
    shortName: "CAF Confederation Cup",
    group: "caf",
    accent: "#6ee7b7",
    description: "Coupe de la Confédération",
  },
  {
    slug: "caf.nations",
    name: "Coupe d'Afrique des Nations",
    shortName: "Coupe d'Afrique des Nations",
    group: "caf",
    accent: "#f59e0b",
    description: "Championnat d'Afrique des nations",
  },
  {
    slug: "uefa.euro",
    name: "UEFA Euro",
    shortName: "Championnat d'Europe des nations",
    group: "uefa",
    accent: "#60a5fa",
    description: "Championnat d'Europe des nations",
  },
  {
    slug: "fifa.world",
    name: "Coupe du Monde FIFA",
    shortName: "Coupe du Monde FIFA",
    group: "fifa",
    accent: "#fbbf24",
    description: "Mondial",
  },
  {
    slug: "fra.1",
    name: "Ligue 1",
    shortName: "Ligue 1",
    group: "ligue",
    accent: "#38bdf8",
    description: "Championnat de France",
  },
  {
    slug: "eng.1",
    name: "Premier League",
    shortName: "Premier League",
    group: "ligue",
    accent: "#c084fc",
    description: "Angleterre",
  },
  {
    slug: "esp.1",
    name: "LaLiga",
    shortName: "LaLiga",
    group: "ligue",
    accent: "#fb7185",
    description: "Espagne",
  },
  {
    slug: "ita.1",
    name: "Serie A",
    shortName: "Serie A",
    group: "ligue",
    accent: "#34d399",
    description: "Italie",
  },
  {
    slug: "ger.1",
    name: "Bundesliga",
    shortName: "Bundesliga",
    group: "ligue",
    accent: "#f87171",
    description: "Allemagne",
  },
];

const featuredBySlug = new Map(FEATURED.map((c) => [c.slug, c]));

export const COMPETITIONS = FEATURED;

export const FEATURED_SLUGS = FEATURED.map((c) => c.slug);

export const GROUP_LABELS: Record<CompetitionGroup, string> = {
  uefa: "UEFA",
  caf: "CAF",
  fifa: "FIFA",
  afc: "AFC",
  conmebol: "CONMEBOL",
  concacaf: "CONCACAF",
  ligue: "Championnats",
  coupe: "Coupes",
  autre: "Autres",
};

export function groupFromSlug(slug: string): CompetitionGroup {
  if (slug.startsWith("uefa")) return "uefa";
  if (slug.startsWith("caf")) return "caf";
  if (slug.startsWith("fifa")) return "fifa";
  if (slug.startsWith("afc") || slug.startsWith("aff")) return "afc";
  if (slug.startsWith("conmebol")) return "conmebol";
  if (slug.startsWith("concacaf") || slug.startsWith("campeones")) return "concacaf";
  if (
    slug.includes("cup") ||
    slug.includes("copa") ||
    slug.includes("fa") ||
    slug.includes("pokal") ||
    slug.includes("taca") ||
    slug.includes("super_cup") ||
    slug.includes("supercup")
  ) {
    return "coupe";
  }
  if (/^[a-z]{2,4}\.\d/.test(slug)) return "ligue";
  return "autre";
}

function fromCatalog(row: CatalogRow): Competition {
  const featured = featuredBySlug.get(row.slug);
  if (featured) return { ...featured, espnId: row.id };
  const group = groupFromSlug(row.slug);
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.name,
    group,
    accent: GROUP_ACCENT[group],
    description: row.name,
    espnId: row.id,
  };
}

export const ALL_COMPETITIONS: Competition[] = CATALOG.map(fromCatalog).sort((a, b) =>
  a.name.localeCompare(b.name, "fr"),
);

const bySlug = new Map(ALL_COMPETITIONS.map((c) => [c.slug, c]));
const byId = new Map(ALL_COMPETITIONS.filter((c) => c.espnId).map((c) => [c.espnId!, c]));

export function getCompetition(slug: string) {
  return bySlug.get(slug) ?? featuredBySlug.get(slug);
}

export function getCompetitionByEspnId(id: string) {
  return byId.get(id);
}

export function isKnownLeague(slug: string) {
  return slug === "all" || bySlug.has(slug) || featuredBySlug.has(slug);
}

export function isLeagueSlug(slug: string) {
  return isKnownLeague(slug) || /^[a-z0-9]+([._][a-z0-9]+)+$/i.test(slug);
}
