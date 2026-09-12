"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FAVORITES_KEY,
  FavoritesContext,
  emptyFavorites,
  type FavoritesState,
} from "@/lib/favorites";
import type { FavLeague, FavTeam } from "@/lib/types";

function readStore(): FavoritesState {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return emptyFavorites();
    const parsed = JSON.parse(raw) as Partial<FavoritesState>;
    return {
      teams: Array.isArray(parsed.teams) ? parsed.teams : [],
      leagues: Array.isArray(parsed.leagues) ? parsed.leagues : [],
    };
  } catch {
    return emptyFavorites();
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FavoritesState>(emptyFavorites);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readStore());
    setReady(true);
  }, []);

  const persist = useCallback((next: FavoritesState) => {
    setState(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }, []);

  const toggleTeam = useCallback(
    (team: FavTeam) => {
      persist({
        ...state,
        teams: state.teams.some((item) => item.id === team.id)
          ? state.teams.filter((item) => item.id !== team.id)
          : [...state.teams, team],
      });
    },
    [persist, state],
  );

  const toggleLeague = useCallback(
    (league: FavLeague) => {
      persist({
        ...state,
        leagues: state.leagues.some((item) => item.slug === league.slug)
          ? state.leagues.filter((item) => item.slug !== league.slug)
          : [...state.leagues, league],
      });
    },
    [persist, state],
  );

  const value = useMemo(
    () => ({
      ...state,
      ready,
      toggleTeam,
      toggleLeague,
      hasTeam: (id: string) => state.teams.some((item) => item.id === id),
      hasLeague: (slug: string) => state.leagues.some((item) => item.slug === slug),
    }),
    [ready, state, toggleLeague, toggleTeam],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
