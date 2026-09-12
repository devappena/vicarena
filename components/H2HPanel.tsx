import Link from "next/link";
import { formatDayLabel } from "@/lib/format";
import type { FormGame, HeadToHead } from "@/lib/types";
import { FormDots } from "./FormDots";

export function H2HPanel({
  h2h,
  form,
  league,
}: {
  h2h?: HeadToHead;
  form?: { home: FormGame[]; away: FormGame[] };
  league: string;
}) {
  if (!h2h && !form) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-white/50">
        Pas encore d&apos;historique disponible pour ce face-à-face.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {form && (form.home.length > 0 || form.away.length > 0) && (
        <section className="glass rounded-2xl p-5">
          <h3 className="mb-4 font-display text-2xl tracking-wide">Forme</h3>
          <div className="space-y-3">
            {form.home.length > 0 && (
              <FormLine label="Domicile" games={form.home} />
            )}
            {form.away.length > 0 && (
              <FormLine label="Extérieur" games={form.away} />
            )}
          </div>
        </section>
      )}
      {h2h && (
        <section className="glass rounded-2xl p-5">
          <h3 className="font-display text-2xl tracking-wide">{h2h.title}</h3>
          {h2h.summary && <p className="mt-1 text-sm text-white/55">{h2h.summary}</p>}
          <ul className="mt-4 divide-y divide-white/8">
            {h2h.meetings.map((meeting) => (
              <li key={meeting.id} className="py-3">
                <Link href={`/match/${league || "all"}/${meeting.id}`} className="block hover:text-gold">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    {meeting.date ? formatDayLabel(new Date(meeting.date), { weekday: true }) : ""}
                  </p>
                  <p className="mt-1 flex items-center justify-between text-sm">
                    <span>
                      {meeting.homeName} — {meeting.awayName}
                    </span>
                    <span className="font-display text-xl">
                      {meeting.homeScore}:{meeting.awayScore}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function FormLine({ label, games }: { label: string; games: FormGame[] }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <FormDots games={games} />
      </div>
      <ul className="space-y-1 text-xs text-white/50">
        {games.map((game) => (
          <li key={game.id}>
            {game.result === "W" ? "Victoire" : game.result === "D" ? "Nul" : "Défaite"} · {game.score} contre {game.opponent}
            {game.league ? ` · ${game.league}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
