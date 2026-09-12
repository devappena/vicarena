import Link from "next/link";
import type { FormGame, MatchCard } from "@/lib/types";
import { statLabel, statusLabel } from "@/lib/format";
import { FavoriteTeamButton } from "./FavoriteButton";
import { FormDots } from "./FormDots";

export function MatchHero({ match }: { match: MatchCard }) {
  const live = match.status === "in";
  return (
    <section className="glass overflow-hidden rounded-3xl p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
        <span>{match.leagueName}</span>
        {live ? (
          <span className="flex items-center gap-2 text-red-400">
            <span className="live-pulse h-2 w-2 rounded-full bg-red-500" />
            En direct · {match.clock} · {match.detail}
          </span>
        ) : (
          <span>
            {match.status === "pre"
              ? "Coup d'envoi à venir"
              : statusLabel(match.detail, match.status)}
          </span>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Side team={match.home} align="right" league={match.league} form={match.form?.home} />
        <div className="text-center">
          {match.status === "pre" ? (
            <p className="font-display text-5xl text-white/30">VS</p>
          ) : (
            <p className="font-display text-6xl tracking-widest md:text-8xl">
              {match.home.score}
              <span className="mx-2 text-gold">:</span>
              {match.away.score}
            </p>
          )}
          {typeof match.home.shootoutScore === "number" && (
            <p className="mt-2 text-xs text-white/50">
              TAB {match.home.shootoutScore} - {match.away.shootoutScore}
            </p>
          )}
        </div>
        <Side team={match.away} align="left" league={match.league} form={match.form?.away} />
      </div>
      <p className="mt-8 text-center text-sm text-white/45">
        {[match.venue, match.city, match.country, match.note].filter(Boolean).join(" · ")}
      </p>
    </section>
  );
}

function Side({
  team,
  align,
  league,
  form,
}: {
  team: MatchCard["home"];
  align: "left" | "right";
  league: string;
  form?: FormGame[];
}) {
  return (
    <div className={`flex flex-col items-center gap-3 ${align === "right" ? "md:items-end" : "md:items-start"}`}>
      <Link href={`/equipe/${team.id}?league=${encodeURIComponent(league)}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={team.logo} alt={team.name} className="h-16 w-16 object-contain md:h-20 md:w-20" />
        <h2 className="text-center font-display text-2xl tracking-wide md:text-4xl">{team.name}</h2>
      </Link>
      {form && <FormDots games={form} />}
      <FavoriteTeamButton team={{ id: team.id, name: team.name, logo: team.logo, league }} />
    </div>
  );
}

export function EventTimeline({ match }: { match: MatchCard }) {
  if (match.events.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-white/50">
        Les événements (buts, cartons) apparaîtront ici pendant le match.
      </div>
    );
  }
  return (
    <ol className="glass space-y-3 rounded-2xl p-6">
      {[...match.events].reverse().map((event, i) => (
        <li key={`${event.clock}-${event.type}-${i}`} className="flex gap-4 text-sm">
          <span className="w-12 shrink-0 font-semibold text-gold">{event.clock || "—"}</span>
          <span
            className={
              event.scoring
                ? "text-gold"
                : event.red
                  ? "text-red-400"
                  : event.yellow
                    ? "text-yellow-300"
                    : "text-white/80"
            }
          >
            {event.type}
            {event.player ? ` · ${event.player}` : ""}
            {event.penalty ? " (pén.)" : ""}
            {event.ownGoal ? " (csc)" : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function StatsPanel({ match }: { match: MatchCard }) {
  if (match.stats.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-white/50">
        Les statistiques détaillées arrivent dès le coup d&apos;envoi.
      </div>
    );
  }
  return (
    <div className="glass space-y-4 rounded-2xl p-6">
      {match.stats.map((stat) => {
        const home = Number.parseFloat(stat.home) || 0;
        const away = Number.parseFloat(stat.away) || 0;
        const total = home + away || 1;
        return (
          <div key={stat.name}>
            <div className="mb-1 flex justify-between text-xs text-white/60">
              <span>{stat.home}</span>
              <span>{statLabel(stat.name)}</span>
              <span>{stat.away}</span>
            </div>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="bg-gold" style={{ width: `${(home / total) * 100}%` }} />
              <div className="bg-emerald-400" style={{ width: `${(away / total) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
