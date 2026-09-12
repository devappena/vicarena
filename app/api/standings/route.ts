import { NextRequest, NextResponse } from "next/server";
import { isLeagueSlug } from "@/lib/competitions";
import { fetchStandings } from "@/lib/espn";

export const revalidate = 300;

export async function GET(request: NextRequest) {
  const league = request.nextUrl.searchParams.get("league");
  if (!league || !isLeagueSlug(league) || league === "all") {
    return NextResponse.json({ groups: [] }, { status: 400 });
  }
  const groups = await fetchStandings(league);
  return NextResponse.json({ groups });
}
