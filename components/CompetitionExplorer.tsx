"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL_COMPETITIONS, GROUP_LABELS, type CompetitionGroup } from "@/lib/competitions";

const GROUPS = Object.keys(GROUP_LABELS) as CompetitionGroup[];

export function CompetitionExplorer() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<CompetitionGroup | "all">("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_COMPETITIONS.filter((c) => {
      if (group !== "all" && c.group !== group) return false;
      if (!q) return true;
      return `${c.name} ${c.shortName} ${c.slug}`.toLowerCase().includes(q);
    });
  }, [group, query]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Premier League, CAN, Libertadores…"
          className="w-full max-w-md rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm outline-none placeholder:text-white/35 focus:border-gold/50"
        />
        <p className="text-xs text-white/40">{visible.length} compétitions</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroup("all")}
          className={`rounded-full px-3 py-1 text-xs ${
            group === "all" ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70"
          }`}
        >
          Tout
        </button>
        {GROUPS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setGroup(id)}
            className={`rounded-full px-3 py-1 text-xs ${
              group === id ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70"
            }`}
          >
            {GROUP_LABELS[id]}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((comp) => (
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
          </Link>
        ))}
      </div>
    </div>
  );
}
