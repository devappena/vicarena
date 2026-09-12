import { DateStrip } from "@/components/DateStrip";
import { Scoreboard } from "@/components/Scoreboard";
import { fetchDayMatches } from "@/lib/espn";
import { espnDate, formatDayLabel, parseEspnDate } from "@/lib/format";

export const revalidate = 30;

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: rawDate } = await searchParams;
  const date = rawDate && /^\d{8}$/.test(rawDate) ? rawDate : espnDate();
  const matches = await fetchDayMatches(date);

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Programme</p>
      <h1 className="mb-2 font-display text-5xl tracking-wide">Calendrier</h1>
      <p className="mb-6 text-sm text-white/55">
        {formatDayLabel(parseEspnDate(date), { weekday: true })} · heure de Kinshasa
      </p>
      <DateStrip selected={date} basePath="/calendrier" />
      <Scoreboard initial={matches} date={date} />
    </div>
  );
}
