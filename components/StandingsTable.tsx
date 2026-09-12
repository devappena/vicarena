import Link from "next/link";
import type { StandingGroup } from "@/lib/types";

export function StandingsTable({ groups, league }: { groups: StandingGroup[]; league?: string }) {
  if (groups.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-sm text-white/55">
        Classement indisponible pour cette compétition (coupe, phase unique, ou saison à venir).
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.name} className="glass overflow-hidden rounded-2xl">
          {groups.length > 1 && (
            <h3 className="border-b border-white/8 px-4 py-3 text-sm font-semibold">{group.name}</h3>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Équipe</th>
                  <th className="px-2 py-2 text-center font-medium">Joués</th>
                  <th className="px-2 py-2 text-center font-medium">Gagnés</th>
                  <th className="px-2 py-2 text-center font-medium">Nuls</th>
                  <th className="px-2 py-2 text-center font-medium">Perdus</th>
                  <th className="px-2 py-2 text-center font-medium">Buts pour</th>
                  <th className="px-2 py-2 text-center font-medium">Buts contre</th>
                  <th className="px-2 py-2 text-center font-medium">Différence</th>
                  <th className="px-3 py-2 text-right font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => (
                  <tr key={row.teamId || `${row.rank}-${row.name}`} className="border-t border-white/5">
                    <td className="px-3 py-2 text-white/50">
                      <span
                        className="inline-block min-w-[1.25rem]"
                        style={row.noteColor ? { color: row.noteColor } : undefined}
                        title={row.note}
                      >
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {row.teamId ? (
                        <Link
                          href={`/equipe/${row.teamId}${league ? `?league=${league}` : ""}`}
                          className="flex items-center gap-2 hover:text-gold"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.logo} alt="" className="h-5 w-5 object-contain" />
                          <span>{row.name}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.logo} alt="" className="h-5 w-5 object-contain" />
                          <span>{row.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center text-white/70">{row.played}</td>
                    <td className="px-2 py-2 text-center text-white/70">{row.wins}</td>
                    <td className="px-2 py-2 text-center text-white/70">{row.draws}</td>
                    <td className="px-2 py-2 text-center text-white/70">{row.losses}</td>
                    <td className="px-2 py-2 text-center text-white/70">{row.gf}</td>
                    <td className="px-2 py-2 text-center text-white/70">{row.ga}</td>
                    <td className="px-2 py-2 text-center text-white/70">{row.gd}</td>
                    <td className="px-3 py-2 text-right font-semibold">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
