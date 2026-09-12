"use client";

import { createContext, useContext } from "react";
import type { FavLeague, FavTeam } from "./types";

export const FAVORITES_KEY = "vicarena-favorites";

export type FavoritesState = {
  teams: FavTeam[];
  leagues: FavLeague[];
};

export const emptyFavorites = (): FavoritesState => ({ teams: [], leagues: [] });

export type FavoritesContextValue = FavoritesState & {
  ready: boolean;
  toggleTeam: (team: FavTeam) => void;
  toggleLeague: (league: FavLeague) => void;
  hasTeam: (id: string) => boolean;
  hasLeague: (slug: string) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextValue>({
  ...emptyFavorites(),
  ready: false,
  toggleTeam: () => undefined,
  toggleLeague: () => undefined,
  hasTeam: () => false,
  hasLeague: () => false,
});

export function useFavorites() {
  return useContext(FavoritesContext);
}
