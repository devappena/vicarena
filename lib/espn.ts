import { connection } from "next/server";
import { COMPETITIONS, FEATURED_SLUGS, getCompetition, getCompetitionByEspnId } from "./competitions";
import { espnDate, shiftEspnDate } from "./format";
import type {
  FormGame,
  H2HMeeting,
  HeadToHead,
  LineupPlayer,
  LineupSide,
  MatchCard,
  MatchEvent,
  MatchStat,
  StandingGroup,
  StandingRow,
  TeamProfile,
  TeamSide,
} from "./types";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer";

type EspnStatus = {
  clock?: number;
  displayClock?: string;
  period?: number;
  type?: {
    state?: string;
    completed?: boolean;
    shortDetail?: string;
    detail?: string;
    description?: string;
  };
};

type EspnTeam = {
  id?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  logo?: string;
  logos?: { href?: string }[];
  color?: string;
};

type EspnScoreValue = string | { displayValue?: string; value?: number };

type EspnCompetitor = {
  homeAway?: "home" | "away";
  score?: EspnScoreValue;
  winner?: boolean;
  form?: string;
  aggregateScore?: number;
  shootoutScore?: number;
  team?: EspnTeam;
  statistics?: { name?: string; abbreviation?: string; displayValue?: string }[];
};

type EspnDetail = {
  type?: { text?: string };
  clock?: { displayValue?: string };
  team?: { id?: string };
  scoringPlay?: boolean;
  yellowCard?: boolean;
  redCard?: boolean;
  penaltyKick?: boolean;
  ownGoal?: boolean;
  athletesInvolved?: { displayName?: string; shortName?: string }[];
  participants?: { athlete?: { displayName?: string } }[];
};

type EspnCompetition = {
  uid?: string;
  venue?: { fullName?: string; address?: { city?: string; country?: string } };
  altGameNote?: string;
  notes?: { text?: string }[];
  broadcasts?: { names?: string[]; media?: { shortName?: string } }[];
  geoBroadcasts?: { media?: { shortName?: string } }[];
  status?: EspnStatus;
  competitors?: EspnCompetitor[];
  details?: EspnDetail[];
};

type EspnEvent = {
  id?: string;
  uid?: string;
  date?: string;
  competitions?: EspnCompetition[];
  status?: EspnStatus;
};

type EspnScoreboard = {
  leagues?: { name?: string }[];
  events?: EspnEvent[];
};

function dateRange(daysAhead = 6) {
  const start = espnDate();
  return `${start}-${shiftEspnDate(start, daysAhead)}`;
}

const SCOREBOARD_SAFE_LIMIT = 150;

const BOARD_SLUGS = [
  ...FEATURED_SLUGS,
  "eng.2",
  "fra.2",
  "esp.2",
  "ita.2",
  "ger.2",
  "ned.1",
  "por.1",
  "bel.1",
  "sco.1",
  "tur.1",
  "usa.1",
  "mex.1",
  "bra.1",
  "arg.1",
  "rsa.1",
  "egy.1",
  "mar.1",
  "jpn.1",
  "aus.1",
];

async function fetchJson<T>(url: string, revalidate = 20): Promise<T> {
  const res = await fetch(url, {
    ...(revalidate < 0 ? { cache: "no-store" as const } : { next: { revalidate } }),
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`ESPN ${res.status} for ${url}`);
  }
  return res.json() as Promise<T>;
}

function displayScore(score?: EspnScoreValue) {
  if (typeof score === "string") return score;
  if (score && typeof score === "object") return String(score.displayValue ?? score.value ?? "0");
  return "0";
}

function mapState(status?: EspnStatus): MatchCard["status"] {
  const state = status?.type?.state;
  if (state === "in") return "in";
  if (state === "post") return "post";
  return "pre";
}

function mapTeam(comp: EspnCompetitor, fallback: "home" | "away"): TeamSide {
  return {
    id: comp.team?.id ?? fallback,
    name: comp.team?.displayName ?? "Équipe",
    shortName: comp.team?.shortDisplayName ?? comp.team?.displayName ?? "Équipe",
    abbreviation: comp.team?.abbreviation ?? "?",
    logo: comp.team?.logo || comp.team?.logos?.[0]?.href || "/crest.svg",
    score: displayScore(comp.score),
    aggregateScore: comp.aggregateScore,
    shootoutScore: comp.shootoutScore,
    winner: comp.winner,
    homeAway: comp.homeAway ?? fallback,
    form: comp.form,
    color: comp.team?.color,
  };
}

function mapEvents(details?: EspnDetail[]): MatchEvent[] {
  return (Array.isArray(details) ? details : [])
    .filter((d) => !/delay|regular time|start 1st|start 2nd/i.test(d.type?.text ?? ""))
    .map((d) => {
      const type = d.type?.text ?? "Événement";
      return {
        clock: d.clock?.displayValue ?? "",
        type,
        scoring: Boolean(d.scoringPlay) || /goal/i.test(type),
        yellow: Boolean(d.yellowCard) || /yellow/i.test(type),
        red: Boolean(d.redCard) || /red card|second yellow/i.test(type),
        penalty: Boolean(d.penaltyKick) || /penalty/i.test(type),
        ownGoal: Boolean(d.ownGoal) || /own goal/i.test(type),
        teamId: d.team?.id,
        player:
          d.athletesInvolved?.[0]?.shortName ||
          d.athletesInvolved?.[0]?.displayName ||
          d.participants?.[0]?.athlete?.displayName,
      };
    });
}

function asStats(stats?: EspnCompetitor["statistics"]) {
  return Array.isArray(stats) ? stats : [];
}

function mapBroadcasts(competition: EspnCompetition) {
  const names = (Array.isArray(competition.broadcasts) ? competition.broadcasts : []).flatMap((b) => {
    if (b.names?.length) return b.names;
    return b.media?.shortName ? [b.media.shortName] : [];
  });
  const geo = (Array.isArray(competition.geoBroadcasts) ? competition.geoBroadcasts : [])
    .map((g) => g.media?.shortName)
    .filter((v): v is string => Boolean(v));
  return [...new Set([...names, ...geo])];
}

function mapStats(home?: EspnCompetitor, away?: EspnCompetitor): MatchStat[] {
  const keys = new Map<string, MatchStat>();
  for (const stat of asStats(home?.statistics)) {
    if (!stat.name) continue;
    keys.set(stat.name, {
      name: stat.name,
      abbreviation: stat.abbreviation ?? stat.name,
      home: stat.displayValue ?? "0",
      away: "0",
    });
  }
  for (const stat of asStats(away?.statistics)) {
    if (!stat.name) continue;
    const existing = keys.get(stat.name);
    if (existing) {
      existing.away = stat.displayValue ?? "0";
    } else {
      keys.set(stat.name, {
        name: stat.name,
        abbreviation: stat.abbreviation ?? stat.name,
        home: "0",
        away: stat.displayValue ?? "0",
      });
    }
  }
  const preferred = [
    "possessionPct",
    "totalShots",
    "shotsOnTarget",
    "wonCorners",
    "foulsCommitted",
    "offsides",
    "saves",
    "yellowCards",
    "redCards",
    "totalGoals",
  ];
  return [...keys.values()]
    .filter((s) => preferred.includes(s.name) || (s.abbreviation && s.abbreviation.length <= 6))
    .sort((a, b) => {
      const ia = preferred.indexOf(a.name);
      const ib = preferred.indexOf(b.name);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    })
    .slice(0, 10);
}

function leagueFromEvent(event: EspnEvent, fallbackSlug: string, fallbackName: string) {
  const uid = event.uid ?? event.competitions?.[0]?.uid ?? "";
  const espnId = uid.match(/l:(\d+)/)?.[1];
  const known = espnId ? getCompetitionByEspnId(espnId) : undefined;
  const note = event.competitions?.[0]?.altGameNote;
  return {
    slug: known?.slug ?? fallbackSlug,
    name: known?.name ?? note ?? fallbackName,
  };
}

function mapMatch(event: EspnEvent, league: string, leagueName: string): MatchCard | null {
  const competition = event.competitions?.[0];
  if (!competition || !event.id) return null;
  const competitors = competition.competitors ?? [];
  const home = competitors.find((c) => c.homeAway === "home");
  const away = competitors.find((c) => c.homeAway === "away");
  if (!home || !away) return null;
  const status = competition.status ?? event.status;
  const broadcasts = mapBroadcasts(competition);

  return {
    id: event.id,
    league,
    leagueName: getCompetition(league)?.name ?? leagueName,
    date: event.date ?? new Date().toISOString(),
    venue: competition.venue?.fullName,
    city: competition.venue?.address?.city,
    country: competition.venue?.address?.country,
    note: competition.notes?.[0]?.text || competition.altGameNote,
    status: mapState(status),
    clock: status?.displayClock ?? "",
    detail: status?.type?.shortDetail || status?.type?.detail || "",
    home: mapTeam(home, "home"),
    away: mapTeam(away, "away"),
    broadcasts,
    events: mapEvents(competition.details),
    stats: mapStats(home, away),
  };
}

export async function fetchLeagueMatches(league: string): Promise<MatchCard[]> {
  const url = `${ESPN_BASE}/${league}/scoreboard?dates=${dateRange()}&limit=80`;
  try {
    const data = await fetchJson<EspnScoreboard>(url, 25);
    const leagueName = data.leagues?.[0]?.name ?? league;
    return (data.events ?? [])
      .map((event) => mapMatch(event, league, leagueName))
      .filter((m): m is MatchCard => Boolean(m));
  } catch {
    return [];
  }
}

function sortMatches(matches: MatchCard[]) {
  return matches.sort((a, b) => {
    const rank = { in: 0, pre: 1, post: 2 } as const;
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

function mapScoreboard(data: EspnScoreboard, fallbackSlug = "all", fallbackName = "Football") {
  return (data.events ?? [])
    .map((event) => {
      const league = leagueFromEvent(event, fallbackSlug, fallbackName);
      return mapMatch(event, league.slug, league.name);
    })
    .filter((m): m is MatchCard => Boolean(m));
}

async function fetchScoreboardDay(dates: string, limit = SCOREBOARD_SAFE_LIMIT): Promise<MatchCard[]> {
  try {
    const data = await fetchJson<EspnScoreboard>(
      `${ESPN_BASE}/all/scoreboard?dates=${dates}&limit=${limit}`,
      -1,
    );
    return mapScoreboard(data);
  } catch (error) {
    console.error("fetchScoreboardDay failed", dates, error);
    return [];
  }
}

async function fetchLeaguesForDay(dates: string): Promise<MatchCard[]> {
  const slugs = [...new Set(BOARD_SLUGS)];
  const batches = await Promise.all(
    slugs.map(async (league) => {
      try {
        const data = await fetchJson<EspnScoreboard>(
          `${ESPN_BASE}/${league}/scoreboard?dates=${dates}&limit=40`,
          -1,
        );
        const leagueName = data.leagues?.[0]?.name ?? getCompetition(league)?.name ?? league;
        return mapScoreboard(data, league, leagueName);
      } catch (error) {
        console.error("fetchLeaguesForDay failed", league, dates, error);
        return [];
      }
    }),
  );
  return batches.flat();
}

function dedupeMatches(matches: MatchCard[]) {
  const seen = new Map<string, MatchCard>();
  for (const match of matches) {
    seen.set(`${match.league}-${match.id}`, match);
  }
  return [...seen.values()];
}

export async function fetchDayMatches(date?: string): Promise<MatchCard[]> {
  await connection();
  const selected = date && /^\d{8}$/.test(date) ? date : espnDate();
  const today = espnDate();
  let primary = await fetchScoreboardDay(selected);
  if (primary.length === 0) {
    primary = await fetchLeaguesForDay(selected);
  }
  if (selected !== today) return sortMatches(primary);

  const yesterday = await fetchScoreboardDay(shiftEspnDate(today, -1), 80);
  const stillLive = yesterday.filter((match) => match.status === "in");
  return sortMatches(dedupeMatches([...stillLive, ...primary]));
}

export async function fetchAllMatches(leagues = COMPETITIONS.map((c) => c.slug)) {
  if (leagues.length === 0) return fetchDayMatches();
  const batches = await Promise.all(leagues.map((league) => fetchLeagueMatches(league)));
  return sortMatches(batches.flat());
}

function statValue(
  stats: { name?: string; displayValue?: string }[] | undefined,
  name: string,
) {
  return stats?.find((s) => s.name === name)?.displayValue ?? "0";
}

function mapStandingRow(entry: {
  team?: EspnTeam & { logos?: { href?: string }[] };
  note?: { description?: string; color?: string; rank?: number };
  stats?: { name?: string; displayValue?: string }[];
}): StandingRow {
  const stats = entry.stats ?? [];
  return {
    rank: Number(statValue(stats, "rank")) || entry.note?.rank || 0,
    teamId: entry.team?.id ?? "",
    name: entry.team?.displayName ?? "Équipe",
    shortName: entry.team?.shortDisplayName ?? entry.team?.displayName ?? "Équipe",
    logo: entry.team?.logo || entry.team?.logos?.[0]?.href || "/crest.svg",
    played: statValue(stats, "gamesPlayed"),
    wins: statValue(stats, "wins"),
    draws: statValue(stats, "ties"),
    losses: statValue(stats, "losses"),
    gf: statValue(stats, "pointsFor"),
    ga: statValue(stats, "pointsAgainst"),
    gd: statValue(stats, "pointDifferential"),
    points: statValue(stats, "points"),
    note: entry.note?.description,
    noteColor: entry.note?.color,
  };
}

export async function fetchStandings(league: string): Promise<StandingGroup[]> {
  try {
    const data = await fetchJson<{
      name?: string;
      standings?: { entries?: Parameters<typeof mapStandingRow>[0][] };
      children?: {
        name?: string;
        standings?: { entries?: Parameters<typeof mapStandingRow>[0][] };
      }[];
    }>(`https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings`, 300);
    const children = data.children ?? [];
    if (children.length > 0) {
      return children
        .map((child) => ({
          name: child.name ?? "Groupe",
          rows: (child.standings?.entries ?? []).map(mapStandingRow),
        }))
        .filter((group) => group.rows.length > 0);
    }
    const rows = (data.standings?.entries ?? []).map(mapStandingRow);
    return rows.length ? [{ name: data.name ?? getCompetition(league)?.name ?? league, rows }] : [];
  } catch {
    return [];
  }
}

function mapLineupPlayer(row: {
  starter?: boolean;
  jersey?: string;
  subbedIn?: boolean;
  subbedOut?: boolean;
  formationPlace?: string;
  position?: { abbreviation?: string };
  athlete?: { id?: string; displayName?: string; shortName?: string };
}): LineupPlayer {
  return {
    id: row.athlete?.id ?? row.jersey ?? "?",
    name: row.athlete?.displayName ?? "Joueur",
    shortName: row.athlete?.shortName ?? row.athlete?.displayName ?? "Joueur",
    jersey: row.jersey ?? "",
    position: row.position?.abbreviation ?? "?",
    place: row.formationPlace,
    starter: Boolean(row.starter),
    subbedIn: Boolean(row.subbedIn),
    subbedOut: Boolean(row.subbedOut),
  };
}

function mapLineups(
  rosters?: {
    homeAway?: "home" | "away";
    formation?: string;
    team?: EspnTeam;
    roster?: Parameters<typeof mapLineupPlayer>[0][];
  }[],
): MatchCard["lineups"] {
  if (!Array.isArray(rosters) || rosters.length === 0) return undefined;
  const mapped = rosters.map((side) => {
    const players = (side.roster ?? []).map(mapLineupPlayer);
    return {
      homeAway: side.homeAway,
      lineup: {
        teamId: side.team?.id ?? "",
        teamName: side.team?.displayName ?? "Équipe",
        formation: side.formation,
        starters: players.filter((p) => p.starter),
        bench: players.filter((p) => !p.starter),
      } satisfies LineupSide,
    };
  });
  return {
    home: mapped.find((s) => s.homeAway === "home")?.lineup,
    away: mapped.find((s) => s.homeAway === "away")?.lineup,
  };
}

function mapH2H(
  series?: {
    title?: string;
    summary?: string;
    shortSummary?: string;
    events?: {
      id?: string;
      date?: string;
      competitors?: EspnCompetitor[];
    }[];
  }[],
): HeadToHead | undefined {
  const h2h = series?.find((s) => /head/i.test(s.title ?? "") || /head/i.test(s.shortSummary ?? "")) ?? series?.[0];
  if (!h2h) return undefined;
  const meetings: H2HMeeting[] = (h2h.events ?? [])
    .map((event) => {
      const home = event.competitors?.find((c) => c.homeAway === "home");
      const away = event.competitors?.find((c) => c.homeAway === "away");
      if (!event.id || !home || !away) return null;
      return {
        id: event.id,
        date: event.date ?? "",
        homeName: home.team?.displayName ?? "Domicile",
        awayName: away.team?.displayName ?? "Extérieur",
        homeScore: displayScore(home.score),
        awayScore: displayScore(away.score),
        homeId: home.team?.id ?? "",
        awayId: away.team?.id ?? "",
      };
    })
    .filter((m): m is H2HMeeting => Boolean(m));
  return {
    title: h2h.title ?? "Face-à-face",
    summary: h2h.summary ?? h2h.shortSummary ?? "",
    meetings,
  };
}

function mapForm(
  lastFive?: {
    team?: { id?: string };
    events?: {
      id?: string;
      gameDate?: string;
      score?: string;
      gameResult?: string;
      leagueAbbreviation?: string;
      opponent?: { displayName?: string };
    }[];
  }[],
  homeId?: string,
  awayId?: string,
): MatchCard["form"] {
  if (!Array.isArray(lastFive)) return undefined;
  const toGames = (teamId?: string): FormGame[] => {
    const block = lastFive.find((item) => item.team?.id === teamId);
    return (block?.events ?? [])
      .filter((event) => event.id && event.gameResult)
      .slice(0, 5)
      .map((event) => ({
        id: event.id!,
        date: event.gameDate ?? "",
        opponent: event.opponent?.displayName ?? "Adversaire",
        score: event.score ?? "",
        result: (event.gameResult === "W" || event.gameResult === "D" || event.gameResult === "L"
          ? event.gameResult
          : "D") as FormGame["result"],
        league: event.leagueAbbreviation,
      }));
  };
  return { home: toGames(homeId), away: toGames(awayId) };
}

export async function fetchMatch(league: string, id: string): Promise<MatchCard | null> {
  const slugs = league === "all" ? ["all"] : [league, "all"];
  for (const slug of slugs) {
    try {
      const data = await fetchJson<{
        header?: {
          competitions?: EspnCompetition[];
          id?: string;
          uid?: string;
          league?: { slug?: string; shortName?: string; name?: string };
        };
        boxscore?: {
          teams?: {
            team?: EspnTeam;
            statistics?: { name?: string; displayValue?: string; abbreviation?: string }[];
            homeAway?: "home" | "away";
            score?: string;
          }[];
        };
        keyEvents?: EspnDetail[];
        rosters?: {
          homeAway?: "home" | "away";
          formation?: string;
          team?: EspnTeam;
          roster?: Parameters<typeof mapLineupPlayer>[0][];
        }[];
        seasonseries?: Parameters<typeof mapH2H>[0];
        lastFiveGames?: Parameters<typeof mapForm>[0];
      }>(`${ESPN_BASE}/${slug}/summary?event=${id}`, 15);
      const headerComp = data.header?.competitions?.[0];
      if (!headerComp) continue;
      const headerLeague = data.header?.league;
      const boxHome = data.boxscore?.teams?.find((t) => t.homeAway === "home");
      const boxAway = data.boxscore?.teams?.find((t) => t.homeAway === "away");
      const competitors = (headerComp.competitors ?? []).map((comp) => {
        const box = comp.homeAway === "home" ? boxHome : boxAway;
        return {
          ...comp,
          statistics: comp.statistics?.length ? comp.statistics : box?.statistics,
          score: comp.score ?? box?.score,
        };
      });
      const fakeEvent: EspnEvent = {
        id,
        uid: data.header?.uid,
        date: (headerComp as { date?: string }).date,
        competitions: [
          {
            ...headerComp,
            details: data.keyEvents ?? headerComp.details,
            competitors,
          },
        ],
        status: headerComp.status,
      };
      const resolved = leagueFromEvent(
        fakeEvent,
        headerLeague?.slug ?? league,
        headerLeague?.name ?? getCompetition(league)?.name ?? league,
      );
      const match = mapMatch(fakeEvent, resolved.slug, resolved.name);
      if (!match) continue;
      const headerDate = (headerComp as { date?: string }).date;
      if (headerDate) match.date = headerDate;
      match.lineups = mapLineups(data.rosters);
      match.h2h = mapH2H(data.seasonseries);
      match.form = mapForm(data.lastFiveGames, match.home.id, match.away.id);
      return match;
    } catch {
      continue;
    }
  }
  if (league !== "all") {
    return (await fetchLeagueMatches(league)).find((m) => m.id === id) ?? null;
  }
  return null;
}

function recordStat(items: { name?: string; value?: number }[] | undefined, name: string) {
  const value = items?.find((item) => item.name === name)?.value;
  return value == null ? undefined : String(value);
}

export async function fetchTeam(id: string, league?: string): Promise<TeamProfile | null> {
  const slugs = [league, "all"].filter((value, index, arr): value is string => Boolean(value) && arr.indexOf(value) === index);
  for (const slug of slugs) {
    const candidates =
      slug === "all"
        ? [`https://site.api.espn.com/apis/site/v2/sports/soccer/teams/${id}`]
        : [
            `${ESPN_BASE}/${slug}/teams/${id}`,
            `https://site.api.espn.com/apis/site/v2/sports/soccer/teams/${id}`,
          ];
    for (const url of candidates) {
      try {
        const data = await fetchJson<{
          team?: EspnTeam & {
            standingSummary?: string;
            leagueAbbrev?: string;
            defaultLeague?: { slug?: string; shortName?: string; name?: string };
            record?: { items?: { type?: string; summary?: string; stats?: { name?: string; value?: number }[] }[] };
          };
        }>(url, 120);
        const team = data.team;
        if (!team?.id) continue;
        const total = team.record?.items?.find((item) => item.type === "total");
        return {
          id: team.id,
          name: team.displayName ?? "Équipe",
          shortName: team.shortDisplayName ?? team.displayName ?? "Équipe",
          abbreviation: team.abbreviation ?? "?",
          logo: team.logo || team.logos?.[0]?.href || "/crest.svg",
          color: team.color,
          league: team.defaultLeague?.slug ?? team.leagueAbbrev ?? slug,
          leagueName: team.defaultLeague?.name ?? team.defaultLeague?.shortName,
          standing: team.standingSummary,
          record: total?.summary,
          wins: recordStat(total?.stats, "wins"),
          draws: recordStat(total?.stats, "ties"),
          losses: recordStat(total?.stats, "losses"),
          points: recordStat(total?.stats, "points"),
        };
      } catch {
        continue;
      }
    }
  }
  return null;
}

export async function fetchTeamSchedule(id: string, league?: string): Promise<MatchCard[]> {
  const slug = league && league !== "all" ? league : undefined;
  const urls = slug
    ? [`${ESPN_BASE}/${slug}/teams/${id}/schedule`, `https://site.api.espn.com/apis/site/v2/sports/soccer/teams/${id}/schedule`]
    : [`https://site.api.espn.com/apis/site/v2/sports/soccer/teams/${id}/schedule`];
  for (const url of urls) {
    try {
      const data = await fetchJson<EspnScoreboard & { team?: EspnTeam }>(url, 120);
      const leagueName = getCompetition(slug ?? "")?.name ?? slug ?? "Football";
      return sortMatches(
        (data.events ?? [])
          .map((event) => mapMatch(event, slug ?? "all", leagueName))
          .filter((m): m is MatchCard => Boolean(m)),
      );
    } catch {
      continue;
    }
  }
  return [];
}
