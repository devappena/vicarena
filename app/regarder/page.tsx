import { BROADCASTERS } from "@/lib/broadcasters";
import { COMPETITIONS } from "@/lib/competitions";
import Link from "next/link";

export default function WatchPage() {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Diffusion officielle</p>
      <h1 className="font-display text-5xl tracking-wide">Où regarder</h1>
      <p className="mt-4 max-w-2xl text-white/65">
        UEFA, CAF et FIFA vendent les droits par territoire. Ce site ne diffuse pas les images :
        il vous oriente vers Canal+, SuperSport, beIN, DAZN et les autres partenaires officiels.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {BROADCASTERS.map((b) => (
          <a
            key={`${b.name}-${b.region}`}
            href={b.url}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-2xl p-5 transition hover:border-gold/40"
          >
            <p className="text-xs uppercase tracking-wider text-white/40">{b.region}</p>
            <h2 className="mt-1 font-display text-3xl tracking-wide">{b.name}</h2>
            <p className="mt-2 text-sm text-white/55">
              {b.covers
                .map((slug) => COMPETITIONS.find((c) => c.slug === slug)?.name ?? slug)
                .join(" · ")}
            </p>
          </a>
        ))}
      </div>
      <p className="mt-8 text-sm text-white/45">
        Pour le suivi minute par minute sans TV, ouvrez le{" "}
        <Link href="/live" className="text-gold underline">
          tableau live
        </Link>
        .
      </p>
    </div>
  );
}
