import { CompetitionExplorer } from "@/components/CompetitionExplorer";

export default function CompetitionsPage() {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Ligues & coupes</p>
      <h1 className="mb-3 font-display text-5xl tracking-wide">Compétitions</h1>
      <p className="mb-8 max-w-2xl text-white/55">
        Championnats, coupes continentales et tournois FIFA. Scores, calendrier et classements.
      </p>
      <CompetitionExplorer />
    </div>
  );
}
