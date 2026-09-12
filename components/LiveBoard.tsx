"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MatchCard } from "@/lib/types";
import { MatchCardView } from "./MatchCardView";

export function LiveBoard({
  initial,
  league,
}: {
  initial: MatchCard[];
  league?: string;
}) {
  const [matches, setMatches] = useState(initial);
  const [filter, setFilter] = useState<"all" | "in" | "pre" | "post">("all");

  useEffect(() => {
    setMatches(initial);
  }, [initial]);

  useEffect(() => {
    const timer = setInterval(async () => {
      const query = league ? `?league=${encodeURIComponent(league)}` : "";
      const res = await fetch(`/api/matches${query}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { matches: MatchCard[] };
      setMatches(data.matches);
    }, 25000);
    return () => clearInterval(timer);
  }, [league]);

  const visible = matches.filter((m) => (filter === "all" ? true : m.status === filter));
  const liveCount = matches.filter((m) => m.status === "in").length;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="live-pulse inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          <p className="text-sm text-white/70">
            {liveCount} match{liveCount > 1 ? "s" : ""} en direct · actualisé toutes les 25 s
          </p>
        </div>
        <div className="flex gap-2 text-xs">
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
      </div>
      {visible.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-white/60">
          Aucun match dans ce filtre. Revenez pendant les soirs d&apos;Europe ou de CAF.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((match) => (
            <Link key={`${match.league}-${match.id}`} href={`/match/${match.league}/${match.id}`}>
              <MatchCardView match={match} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
