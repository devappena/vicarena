const EMBEDS = [
  { title: "Tous les résumés", src: "https://www.scorebat.com/embed/" },
  {
    title: "Ligue des champions",
    src: "https://www.scorebat.com/embed/league/uefa-champions-league/",
  },
  {
    title: "CAF Champions League",
    src: "https://www.scorebat.com/embed/league/africa-caf-champions-league/",
  },
];

export default function VideosPage() {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Vidéos licenciées</p>
      <h1 className="font-display text-5xl tracking-wide">Résumés officiels</h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Les extraits viennent de Scorebat, un agrégateur de highlights autorisés par les ligues.
        Ce n&apos;est pas du live TV, mais le meilleur moyen légal de revoir les buts.
      </p>
      <div className="mt-8 space-y-10">
        {EMBEDS.map((embed) => (
          <section key={embed.src}>
            <h2 className="mb-3 font-display text-2xl tracking-wide">{embed.title}</h2>
            <iframe
              src={embed.src}
              title={embed.title}
              className="h-[720px] w-full overflow-hidden rounded-2xl border border-white/10"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </section>
        ))}
      </div>
    </div>
  );
}
