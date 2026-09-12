import { writeFileSync } from "node:fs";

const refsRes = await fetch("https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=1000");
const refs = await refsRes.json();
const items = refs.items ?? [];
console.log("refs", items.length);

const leagues = [];
const batch = 20;

for (let i = 0; i < items.length; i += batch) {
  const slice = items.slice(i, i + batch);
  const part = await Promise.all(
    slice.map(async (it) => {
      const url = String(it.$ref).replace("http://", "https://");
      try {
        const r = await fetch(url);
        if (!r.ok) return null;
        const j = await r.json();
        return {
          id: String(j.id),
          slug: j.slug,
          name: j.name,
          shortName: j.shortName || j.abbreviation || j.name,
          abbreviation: j.abbreviation || j.shortName || j.slug,
        };
      } catch {
        return null;
      }
    }),
  );
  leagues.push(...part.filter(Boolean));
  console.log("got", leagues.length);
}

writeFileSync(new URL("../lib/leagues.json", import.meta.url), JSON.stringify(leagues, null, 2));
console.log("written", leagues.length);
