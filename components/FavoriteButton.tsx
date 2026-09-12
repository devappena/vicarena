"use client";

import { useFavorites } from "@/lib/favorites";
import type { FavLeague, FavTeam } from "@/lib/types";

export function FavoriteTeamButton({ team, className = "" }: { team: FavTeam; className?: string }) {
  const { ready, hasTeam, toggleTeam } = useFavorites();
  const active = hasTeam(team.id);
  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => toggleTeam(team)}
      className={`rounded-full px-3 py-1 text-xs ${
        active ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70 hover:bg-white/12"
      } ${className}`}
      aria-pressed={active}
    >
      {active ? "★ Suivi" : "☆ Suivre"}
    </button>
  );
}

export function FavoriteLeagueButton({
  league,
  className = "",
}: {
  league: FavLeague;
  className?: string;
}) {
  const { ready, hasLeague, toggleLeague } = useFavorites();
  const active = hasLeague(league.slug);
  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => toggleLeague(league)}
      className={`rounded-full px-3 py-1 text-xs ${
        active ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70 hover:bg-white/12"
      } ${className}`}
      aria-pressed={active}
    >
      {active ? "★ Suivie" : "☆ Suivre"}
    </button>
  );
}
