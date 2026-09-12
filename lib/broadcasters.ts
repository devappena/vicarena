export type Broadcaster = {
  name: string;
  region: string;
  url: string;
  covers: string[];
};

export const BROADCASTERS: Broadcaster[] = [
  {
    name: "Canal+",
    region: "France",
    url: "https://www.canalplus.com/",
    covers: ["uefa.champions", "uefa.europa", "uefa.europa.conf", "fra.1"],
  },
  {
    name: "Canal+ Afrique",
    region: "Afrique",
    url: "https://www.canalplus.com/",
    covers: ["caf.champions", "caf.confed", "caf.nations", "uefa.champions"],
  },
  {
    name: "SuperSport",
    region: "Afrique",
    url: "https://supersport.com/",
    covers: ["caf.champions", "caf.confed", "caf.nations", "uefa.champions"],
  },
  {
    name: "beIN Sports",
    region: "MENA / Afrique",
    url: "https://www.beinsports.com/",
    covers: ["uefa.champions", "uefa.europa", "caf.nations", "fifa.world"],
  },
  {
    name: "StarTimes",
    region: "Afrique",
    url: "https://www.startimes.com/",
    covers: ["caf.champions", "caf.confed", "caf.nations"],
  },
  {
    name: "Paramount+",
    region: "États-Unis",
    url: "https://www.paramountplus.com/",
    covers: ["uefa.champions", "uefa.europa", "uefa.europa.conf"],
  },
  {
    name: "Amazon Prime Video",
    region: "Europe",
    url: "https://www.primevideo.com/",
    covers: ["uefa.champions", "uefa.europa"],
  },
  {
    name: "DAZN",
    region: "Europe",
    url: "https://www.dazn.com/",
    covers: ["uefa.champions", "ita.1", "ger.1"],
  },
  {
    name: "Sky Sports",
    region: "Royaume-Uni",
    url: "https://www.skysports.com/",
    covers: ["eng.1", "uefa.champions"],
  },
  {
    name: "TNT Sports",
    region: "Royaume-Uni",
    url: "https://www.tntsports.co.uk/",
    covers: ["uefa.champions", "uefa.europa"],
  },
  {
    name: "YouTube UEFA",
    region: "Officiel",
    url: "https://www.youtube.com/@UEFA",
    covers: ["uefa.champions", "uefa.europa", "uefa.europa.conf", "uefa.euro"],
  },
  {
    name: "YouTube CAF",
    region: "Officiel",
    url: "https://www.youtube.com/@CAFONline",
    covers: ["caf.champions", "caf.confed", "caf.nations"],
  },
]

export function broadcastersForLeague(slug: string) {
  return BROADCASTERS.filter((b) => b.covers.includes(slug));
}
