import type { MatchCard } from "@/lib/types";

export function Ticker({ matches }: { matches: MatchCard[] }) {
  const live = matches.filter((m) => m.status === "in");
  if (live.length === 0) return null;
  const loop = [...live, ...live];
  return (
    <div className="mb-8 overflow-hidden rounded-full border border-red-500/20 bg-red-500/8 py-2">
      <div className="ticker flex w-max gap-8 whitespace-nowrap px-6 text-sm">
        {loop.map((match, i) => (
          <span key={`${match.id}-${i}`} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {match.home.name} {match.home.score}-{match.away.score} {match.away.name}
            <span className="text-white/40">{match.clock}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
