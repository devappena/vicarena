import { StandingsTable } from "@/components/StandingsTable";
import { FEATURED_SLUGS, getCompetition } from "@/lib/competitions";
import { fetchStandings } from "@/lib/espn";
import Link from "next/link";

export const revalidate = 300;

const TABLE_SLUGS = FEATURED_SLUGS.filter((slug) =>
  ["fra.1", "eng.1", "esp.1", "ita.1", "ger.1", "uefa.champions"].includes(slug),
);

export default async function StandingsPage() {
  const tables = await Promise.all(
    TABLE_SLUGS.map(async (slug) => ({
      slug,
      competition: getCompetition(slug),
      groups: await fetchStandings(slug),
    })),
  );

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Saison en cours</p>
      <h1 className="mb-3 font-display text-5xl tracking-wide">Classements</h1>
      <p className="mb-8 max-w-2xl text-white/55">
        Big 5, Ligue des champions… le reste est dans chaque fiche compétition.
      </p>
      <div className="space-y-12">
        {tables.map((table) => (
          <section key={table.slug}>
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-3xl tracking-wide">
                {table.competition?.name ?? table.slug}
              </h2>
              <Link href={`/competition/${table.slug}?tab=classement`} className="text-sm text-gold">
                Voir la compétition
              </Link>
            </div>
            <StandingsTable groups={table.groups.slice(0, 1)} league={table.slug} />
          </section>
        ))}
      </div>
    </div>
  );
}
