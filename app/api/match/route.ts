import { NextRequest, NextResponse } from "next/server";
import { isLeagueSlug } from "@/lib/competitions";
import { fetchMatch } from "@/lib/espn";

export const revalidate = 10;

export async function GET(request: NextRequest) {
  const league = request.nextUrl.searchParams.get("league");
  const id = request.nextUrl.searchParams.get("id");
  if (!league || !id || !isLeagueSlug(league)) {
    return NextResponse.json({ match: null }, { status: 400 });
  }
  const match = await fetchMatch(league, id);
  return NextResponse.json({ match });
}
