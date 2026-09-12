import { FavoriteLeagueButton } from "@/components/FavoriteButton";
import { Scoreboard } from "@/components/Scoreboard";
import { StandingsTable } from "@/components/StandingsTable";
import { WatchPanel } from "@/components/WatchPanel";
import { COMPETITIONS, GROUP_LABELS, getCompetition, isLeagueSlug } from "@/lib/competitions";
import { fetchLeagueMatches, fetchStandings } from "@/lib/espn";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 30;
export const dynamicParams = true;

export function generateStaticParams() {
  return COMPETITIONS.map((c) => ({ slug: c.slug }));
}

export default async function CompetitionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab } = await searchParams;
  if (!isLeagueSlug(slug) || slug === "all") notFound();

  const competition = getCompetition(slug) ?? {
    slug,
    name: slug,
    shortName: slug,
    group: "autre" as const,
    accent: "#94a3b8",
    description: slug,
  };
  const active = tab === "classement" ? "classement" : "matches";
  const [matches, standings] = await Promise.all([
    fetchLeagueMatches(slug),
    fetchStandings(slug),
  ]);

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em]" style={{ color: competition.accent }}>
        {GROUP_LABELS[competition.group]}
      </p>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-5xl tracking-wide">{competition.name}</h1>
        <FavoriteLeagueButton league={{ slug, name: competition.name }} />
      </div>
      <p className="mb-6 mt-2 text-white/55">{competition.description}</p>
      <div className="mb-6 flex gap-2">
        <Link
          href={`/competition/${slug}`}
          className={`rounded-full px-4 py-1.5 text-sm ${
            active === "matches" ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70"
          }`}
        >
          Matches
        </Link>
        <Link
          href={`/competition/${slug}?tab=classement`}
          className={`rounded-full px-4 py-1.5 text-sm ${
            active === "classement" ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70"
          }`}
        >
          Classement
        </Link>
      </div>
      {active === "classement" ? (
        <StandingsTable groups={standings} league={slug} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <Scoreboard initial={matches} league={slug} />
          </div>
          <WatchPanel league={slug} broadcasts={[]} />
        </div>
      )}
    </div>
  );
}
