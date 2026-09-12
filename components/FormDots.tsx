import type { FormGame } from "@/lib/types";

const COLORS = {
  W: "bg-emerald-400",
  D: "bg-white/35",
  L: "bg-red-400",
};

export function FormDots({ games }: { games: FormGame[] }) {
  if (games.length === 0) return null;
  return (
    <div className="flex items-center gap-1">
      {games.map((game) => (
        <span
          key={game.id}
          title={`${game.result} ${game.score} vs ${game.opponent}`}
          className={`inline-block h-2.5 w-2.5 rounded-full ${COLORS[game.result]}`}
        />
      ))}
    </div>
  );
}
