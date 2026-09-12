import { positionLabel } from "@/lib/format";
import type { LineupPlayer, LineupSide } from "@/lib/types";

function rowsFromFormation(side: LineupSide): LineupPlayer[][] {
  const starters = [...side.starters].sort((a, b) => Number(a.place ?? 99) - Number(b.place ?? 99));
  const gk = starters.filter((p) => p.position === "G");
  const outfield = starters.filter((p) => p.position !== "G");
  const counts = (side.formation ?? "")
    .split("-")
    .map((n) => Number(n))
    .filter((n) => n > 0);
  if (gk.length + counts.reduce((a, b) => a + b, 0) !== starters.length) {
    return [starters];
  }
  const rows = [gk];
  let index = 0;
  for (const count of counts) {
    rows.push(outfield.slice(index, index + count));
    index += count;
  }
  return rows;
}

function PlayerChip({ player }: { player: LineupPlayer }) {
  return (
    <div className="min-w-[4.5rem] text-center">
      <p className="font-display text-lg leading-none text-gold">{player.jersey || "—"}</p>
      <p className="mt-1 truncate text-[11px] text-white/80">{player.shortName}</p>
      <p className="text-[10px] text-white/35">{positionLabel(player.position)}</p>
    </div>
  );
}

export function LineupBoard({ home, away }: { home?: LineupSide; away?: LineupSide }) {
  if (!home && !away) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-white/50">
        Les compositions seront affichées dès qu&apos;elles sont communiquées.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {home && <LineupCard side={home} />}
      {away && <LineupCard side={away} />}
    </div>
  );
}

function LineupCard({ side }: { side: LineupSide }) {
  const rows = rowsFromFormation(side);
  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-2xl tracking-wide">{side.teamName}</h3>
        {side.formation && <span className="text-sm text-gold">{side.formation}</span>}
      </div>
      <div className="space-y-4 rounded-xl bg-emerald-950/40 p-4">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-wrap justify-center gap-3">
            {row.map((player) => (
              <PlayerChip key={player.id} player={player} />
            ))}
          </div>
        ))}
      </div>
      {side.bench.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-white/40">Banc</p>
          <ul className="space-y-1 text-sm text-white/70">
            {side.bench.map((player) => (
              <li key={player.id} className="flex justify-between gap-3">
                <span>
                  <span className="mr-2 text-white/35">{player.jersey}</span>
                  {player.shortName}
                </span>
                <span className="text-[11px] text-white/35">{positionLabel(player.position)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
