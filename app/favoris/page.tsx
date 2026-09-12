"use client";

import Link from "next/link";
import { FavoriteLeagueButton, FavoriteTeamButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/lib/favorites";

export default function FavoritesPage() {
  const { ready, teams, leagues } = useFavorites();

  if (!ready) {
    return <p className="text-sm text-white/50">Chargement des favoris…</p>;
  }

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Suivi</p>
      <h1 className="mb-3 font-display text-5xl tracking-wide">Favoris</h1>
      <p className="mb-8 max-w-xl text-white/55">
        Tes clubs et compétitions restent sur cet appareil. Aucun compte n&apos;est requis.
      </p>

      <h2 className="mb-4 font-display text-3xl tracking-wide">Équipes</h2>
      {teams.length === 0 ? (
        <p className="mb-10 text-sm text-white/50">
          Pas encore d&apos;équipe. Ouvre un match et clique sur Suivre.
        </p>
      ) : (
        <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div key={team.id} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
              <Link href={`/equipe/${team.id}${team.league ? `?league=${team.league}` : ""}`} className="flex min-w-0 items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={team.logo} alt="" className="h-10 w-10 object-contain" />
                <span className="truncate font-semibold">{team.name}</span>
              </Link>
              <FavoriteTeamButton team={team} />
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 font-display text-3xl tracking-wide">Compétitions</h2>
      {leagues.length === 0 ? (
        <p className="text-sm text-white/50">
          Ajoute une ligue depuis sa page pour la retrouver ici.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <div key={league.slug} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
              <Link href={`/competition/${league.slug}`} className="truncate font-semibold">
                {league.name}
              </Link>
              <FavoriteLeagueButton league={league} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
