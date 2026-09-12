import { NextRequest, NextResponse } from "next/server";
import { isLeagueSlug } from "@/lib/competitions";
import { fetchDayMatches, fetchLeagueMatches } from "@/lib/espn";

export const revalidate = 20;

export async function GET(request: NextRequest) {
  const league = request.nextUrl.searchParams.get("league");
  const date = request.nextUrl.searchParams.get("date") ?? undefined;
  const matches =
    league && isLeagueSlug(league) && league !== "all"
      ? await fetchLeagueMatches(league)
      : await fetchDayMatches(date);
  return NextResponse.json({ updatedAt: new Date().toISOString(), matches });
}
