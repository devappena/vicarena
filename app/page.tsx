import { CompetitionGrid } from "@/components/CompetitionGrid";
import { Scoreboard } from "@/components/Scoreboard";
import { Ticker } from "@/components/Ticker";
import { fetchDayMatches } from "@/lib/espn";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const matches = await fetchDayMatches();
  const live = matches.filter((m) => m.status === "in").length;

  return (
    <div>
      <section className="mb-12 grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-end">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">Toutes compétitions</p>
          <h1 className="font-display text-5xl leading-[0.9] tracking-wide md:text-7xl">
            Scores, classements
            <br />
            et calendrier
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/65">
            Tous les matches du jour, les classements des grandes ligues et le programme à venir.
            Stats et chronologie dès que le match est lancé.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/live"
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#05070a]"
            >
              Voir le live ({live})
            </Link>
            <Link
              href="/classements"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
            >
              Classements
            </Link>
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Aujourd&apos;hui</p>
          <p className="mt-2 font-display text-4xl">{matches.length} matches</p>
          <p className="mt-1 text-sm text-white/50">toutes compétitions confondues</p>
        </div>
      </section>
      <Ticker matches={matches} />
      <h2 className="mb-4 font-display text-3xl tracking-wide">Compétitions phares</h2>
      <CompetitionGrid />
      <div className="mb-4 mt-12 flex items-end justify-between">
        <h2 className="font-display text-3xl tracking-wide">Tableau du jour</h2>
        <Link href="/live" className="text-sm text-gold">
          Tout voir
        </Link>
      </div>
      <Scoreboard initial={matches} />
    </div>
  );
}
