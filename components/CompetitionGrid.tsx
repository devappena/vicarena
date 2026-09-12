import Link from "next/link";
import { COMPETITIONS, GROUP_LABELS } from "@/lib/competitions";

export function CompetitionGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {COMPETITIONS.map((comp) => (
        <Link
          key={comp.slug}
          href={`/competition/${comp.slug}`}
          className="glass rounded-2xl p-5 transition hover:border-white/20"
        >
          <span
            className="mb-3 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]"
            style={{ background: `${comp.accent}22`, color: comp.accent }}
          >
            {GROUP_LABELS[comp.group]}
          </span>
          <h3 className="font-display text-2xl tracking-wide">{comp.name}</h3>
          <p className="mt-2 text-xs text-white/40">{comp.description}</p>
        </Link>
      ))}
      <Link
        href="/competitions"
        className="glass rounded-2xl p-5 transition hover:border-white/20"
      >
        <span className="mb-3 inline-block rounded-full bg-white/8 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
          Catalogue
        </span>
        <h3 className="font-display text-2xl tracking-wide">Toutes</h3>
        <p className="mt-1 text-sm text-white/60">218 ligues et coupes</p>
        <p className="mt-2 text-xs text-white/40">Championnats, coupes, tournois FIFA</p>
      </Link>
    </div>
  );
}
