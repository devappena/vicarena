import { MatchLive } from "@/components/MatchLive";
import { isLeagueSlug } from "@/lib/competitions";
import { fetchMatch } from "@/lib/espn";
import { notFound } from "next/navigation";

export const revalidate = 15;

export default async function MatchPage({
  params,
}: {
  params: Promise<{ league: string; id: string }>;
}) {
  const { league, id } = await params;
  if (!isLeagueSlug(league)) notFound();
  const match = await fetchMatch(league, id);
  if (!match) notFound();
  return <MatchLive initial={match} />;
}
