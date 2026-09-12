import type { MatchCard } from "@/lib/types";
import { formatKickoff, statusLabel } from "@/lib/format";

export function MatchCardView({ match }: { match: MatchCard }) {
  const live = match.status === "in";
  return (
    <article className="glass group h-full rounded-2xl p-5 transition hover:border-gold/40 hover:bg-white/6">
      <div className="mb-4 flex items-center justify-between text-xs text-white/55">
        <span className="uppercase tracking-wider">{match.leagueName}</span>
        {live ? (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 font-semibold text-red-400">
            <span className="live-pulse h-1.5 w-1.5 rounded-full bg-red-500" />
            LIVE {match.clock}
          </span>
        ) : (
          <span>{match.status === "post" ? statusLabel(match.detail, match.status) : formatKickoff(match.date)}</span>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock team={match.home} align="right" />
        <div className="min-w-[4.5rem] text-center font-display text-4xl tracking-wide">
          {match.status === "pre" ? (
            <span className="text-lg text-white/40">vs</span>
          ) : (
            <>
              {match.home.score}
              <span className="mx-1 text-white/30">-</span>
              {match.away.score}
            </>
          )}
        </div>
        <TeamBlock team={match.away} align="left" />
      </div>
      {(match.venue || match.note) && (
        <p className="mt-4 truncate text-xs text-white/40">
          {[match.venue, match.city, match.note].filter(Boolean).join(" · ")}
        </p>
      )}
    </article>
  );
}

function TeamBlock({
  team,
  align,
}: {
  team: MatchCard["home"];
  align: "left" | "right";
}) {
  return (
    <div className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={team.logo}
        alt=""
        className="h-10 w-10 rounded-full bg-white/5 object-contain p-1"
      />
      <div>
        <p className="text-sm font-semibold leading-tight">{team.name}</p>
      </div>
    </div>
  );
}
