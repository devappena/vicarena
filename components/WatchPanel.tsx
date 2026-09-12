import { broadcastersForLeague } from "@/lib/broadcasters";

export function WatchPanel({
  league,
  broadcasts,
}: {
  league: string;
  broadcasts: string[];
}) {
  const partners = broadcastersForLeague(league);
  return (
    <aside className="glass rounded-2xl p-6">
      <h3 className="font-display text-2xl tracking-wide text-gold">Regarder en direct</h3>
      <p className="mt-2 text-sm text-white/60">
        Les droits TV dépendent du pays. Utilisez un diffuseur officiel — Arena Direct ne
        retransmet pas les matches.
      </p>
      {broadcasts.length > 0 && (
        <p className="mt-4 text-xs uppercase tracking-wider text-white/40">
          Signalé pour ce match : {broadcasts.join(" · ")}
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {partners.map((b) => (
          <li key={`${b.name}-${b.region}`}>
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
            >
              <span>
                {b.name}
                <span className="ml-2 text-white/40">{b.region}</span>
              </span>
              <span className="text-gold">Ouvrir →</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
