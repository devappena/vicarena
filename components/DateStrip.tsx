"use client";

import Link from "next/link";
import { espnDate, formatDayLabel, parseEspnDate, shiftEspnDate } from "@/lib/format";

export function DateStrip({
  selected,
  basePath,
}: {
  selected: string;
  basePath: string;
}) {
  const today = espnDate();
  const days = Array.from({ length: 11 }, (_, i) => shiftEspnDate(today, -3 + i));

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {days.map((value) => {
        const active = selected === value;
        return (
          <Link
            key={value}
            href={`${basePath}?date=${value}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
              active ? "bg-gold text-[#05070a]" : "bg-white/8 text-white/70 hover:bg-white/12"
            }`}
          >
            {value === today ? "Aujourd'hui" : formatDayLabel(parseEspnDate(value))}
          </Link>
        );
      })}
    </div>
  );
}
