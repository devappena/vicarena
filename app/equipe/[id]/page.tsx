import { FavoriteTeamButton } from "@/components/FavoriteButton";
import { Scoreboard } from "@/components/Scoreboard";
import { fetchTeam, fetchTeamSchedule } from "@/lib/espn";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 120;

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ league?: string }>;
}) {
  const { id } = await params;
  const { league } = await searchParams;
  const team = await fetchTeam(id, league);
  if (!team) notFound();
  const matches = await fetchTeamSchedule(id, team.league ?? league);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={team.logo} alt="" className="h-16 w-16 object-contain" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{team.leagueName ?? team.league}</p>
            <h1 className="font-display text-5xl tracking-wide">{team.name}</h1>
            {team.standing && <p className="mt-1 text-sm text-white/55">{team.standing}</p>}
          </div>
        </div>
        <FavoriteTeamButton
          team={{ id: team.id, name: team.name, logo: team.logo, league: team.league }}
        />
      </div>
      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        <Stat label="Bilan" value={team.record ?? "—"} />
        <Stat label="Victoires" value={team.wins ?? "—"} />
        <Stat label="Nuls" value={team.draws ?? "—"} />
        <Stat label="Points" value={team.points ?? "—"} />
      </div>
      {team.league && team.league !== "all" && (
        <p className="mb-6 text-sm">
          <Link href={`/competition/${team.league}`} className="text-gold">
            Voir la compétition
          </Link>
        </p>
      )}
      <h2 className="mb-4 font-display text-3xl tracking-wide">Calendrier</h2>
      <Scoreboard initial={matches} live={false} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}
