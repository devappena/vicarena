"use client";

import { useEffect, useState } from "react";
import type { MatchCard } from "@/lib/types";
import { EventTimeline, MatchHero, StatsPanel } from "./MatchDetail";
import { H2HPanel } from "./H2HPanel";
import { LineupBoard } from "./LineupBoard";
import { WatchPanel } from "./WatchPanel";

const TABS = [
  ["resume", "Résumé"],
  ["compos", "Compos"],
  ["h2h", "H2H"],
  ["stats", "Stats"],
] as const;

export function MatchLive({ initial }: { initial: MatchCard }) {
  const [match, setMatch] = useState(initial);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("resume");

  useEffect(() => {
    setMatch(initial);
  }, [initial]);

  useEffect(() => {
    if (initial.status === "post") return;
    const timer = setInterval(async () => {
      const res = await fetch(
        `/api/match?league=${encodeURIComponent(initial.league)}&id=${encodeURIComponent(initial.id)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as { match: MatchCard | null };
      if (data.match) setMatch(data.match);
    }, 15000);
    return () => clearInterval(timer);
  }, [initial.id, initial.league, initial.status]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
      <div className="space-y-6">
        <MatchHero match={match} />
        <div className="flex flex-wrap gap-2">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-1.5 text-sm ${
                tab === id ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "resume" && <EventTimeline match={match} />}
        {tab === "compos" && <LineupBoard home={match.lineups?.home} away={match.lineups?.away} />}
        {tab === "h2h" && <H2HPanel h2h={match.h2h} form={match.form} league={match.league} />}
        {tab === "stats" && <StatsPanel match={match} />}
      </div>
      <WatchPanel league={match.league} broadcasts={match.broadcasts} />
    </div>
  );
}
