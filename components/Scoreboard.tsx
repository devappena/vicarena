"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatTime, statusLabel } from "@/lib/format";
import type { MatchCard } from "@/lib/types";

export function Scoreboard({
  initial,
  date,
  league,
  live = true,
}: {
  initial: MatchCard[];
  date?: string;
  league?: string;
  live?: boolean;
}) {
  const [matches, setMatches] = useState(initial);
  const [filter, setFilter] = useState<"all" | "in" | "pre" | "post">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMatches(initial);
  }, [initial]);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    const load = async () => {
      const params = new URLSearchParams();
      if (league) params.set("league", league);
      if (date) params.set("date", date);
      const res = await fetch(`/api/matches?${params.toString()}`, { cache: "no-store" });
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as { matches: MatchCard[] };
      if (!cancelled) setMatches(data.matches);
    };
    if (initial.length === 0) void load();
    const timer = setInterval(load, 25000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [date, initial.length, league, live]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matches.filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (!q) return true;
      return [m.leagueName, m.home.name, m.away.name, m.home.shortName, m.away.shortName]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [filter, matches, query]);

  const groups = useMemo(() => {
    const map = new Map<string, MatchCard[]>();
    for (const match of visible) {
      const key = match.leagueName;
      const list = map.get(key) ?? [];
      list.push(match);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => {
      const liveA = a[1].filter((m) => m.status === "in").length;
      const liveB = b[1].filter((m) => m.status === "in").length;
      if (liveA !== liveB) return liveB - liveA;
      return a[0].localeCompare(b[0], "fr");
    });
  }, [visible]);

  const liveCount = matches.filter((m) => m.status === "in").length;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="live-pulse inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          <p className="text-sm text-white/70">
            {liveCount} live · {matches.length} match{matches.length > 1 ? "s" : ""} · 25 s
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Club, compétition…"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-sm outline-none placeholder:text-white/35 focus:border-gold/50"
        />
      </div>
      <div className="mb-6 flex gap-2 text-xs">
        {(
          [
            ["all", "Tout"],
            ["in", "Live"],
            ["pre", "À venir"],
            ["post", "Terminés"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full px-3 py-1 ${
              filter === id ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {groups.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-white/60">
          Aucun match pour ce filtre. Change de jour ou de compétition.
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(([leagueName, items]) => (
            <section key={leagueName} className="glass overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                {items[0].league !== "all" ? (
                  <Link
                    href={`/competition/${items[0].league}`}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-white"
                  >
                    {leagueName}
                  </Link>
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    {leagueName}
                  </span>
                )}
                <span className="text-[11px] text-white/40">{items.length}</span>
              </div>
              <ul>
                {items.map((match) => (
                  <li key={`${match.league}-${match.id}`} className="border-t border-white/5 first:border-t-0">
                    <MatchRow match={match} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function MatchRow({ match }: { match: MatchCard }) {
  const live = match.status === "in";
  return (
    <Link
      href={`/match/${match.league}/${match.id}`}
      className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 px-4 py-3 transition hover:bg-white/5"
    >
      <div className="text-[11px] uppercase tracking-wide text-white/45">
        {live ? (
          <span className="flex items-center gap-1.5 font-semibold text-red-400">
            <span className="live-pulse h-1.5 w-1.5 rounded-full bg-red-500" />
            {match.clock || "En direct"}
          </span>
        ) : match.status === "post" ? (
          statusLabel(match.detail, match.status)
        ) : (
          formatTime(match.date)
        )}
      </div>
      <div className="space-y-1.5">
        <TeamLine team={match.home} live={live || match.status === "post"} />
        <TeamLine team={match.away} live={live || match.status === "post"} />
      </div>
      <span className="text-[11px] text-white/35">›</span>
    </Link>
  );
}

function TeamLine({
  team,
  live,
}: {
  team: MatchCard["home"];
  live: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_1.5rem] items-center gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={team.logo} alt="" className="h-5 w-5 object-contain" />
        <span className={`truncate text-sm ${team.winner ? "font-semibold" : ""}`}>{team.name}</span>
      </div>
      <span className="text-right font-display text-lg leading-none">
        {live ? team.score : ""}
      </span>
    </div>
  );
}
