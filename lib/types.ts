export type MatchState = "pre" | "in" | "post";

export type TeamSide = {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  logo: string;
  score: string;
  aggregateScore?: number;
  shootoutScore?: number;
  winner?: boolean;
  homeAway: "home" | "away";
  form?: string;
  color?: string;
};

export type MatchEvent = {
  clock: string;
  type: string;
  scoring: boolean;
  yellow: boolean;
  red: boolean;
  penalty: boolean;
  ownGoal: boolean;
  teamId?: string;
  player?: string;
};

export type MatchStat = {
  name: string;
  abbreviation: string;
  home: string;
  away: string;
};

export type LineupPlayer = {
  id: string;
  name: string;
  shortName: string;
  jersey: string;
  position: string;
  place?: string;
  starter: boolean;
  subbedIn?: boolean;
  subbedOut?: boolean;
};

export type LineupSide = {
  teamId: string;
  teamName: string;
  formation?: string;
  starters: LineupPlayer[];
  bench: LineupPlayer[];
};

export type FormGame = {
  id: string;
  date: string;
  opponent: string;
  score: string;
  result: "W" | "D" | "L";
  league?: string;
};

export type H2HMeeting = {
  id: string;
  date: string;
  league?: string;
  homeName: string;
  awayName: string;
  homeScore: string;
  awayScore: string;
  homeId: string;
  awayId: string;
};

export type HeadToHead = {
  title: string;
  summary: string;
  meetings: H2HMeeting[];
};

export type MatchCard = {
  id: string;
  league: string;
  leagueName: string;
  date: string;
  venue?: string;
  city?: string;
  country?: string;
  note?: string;
  status: MatchState;
  clock: string;
  detail: string;
  home: TeamSide;
  away: TeamSide;
  broadcasts: string[];
  events: MatchEvent[];
  stats: MatchStat[];
  lineups?: { home?: LineupSide; away?: LineupSide };
  h2h?: HeadToHead;
  form?: { home: FormGame[]; away: FormGame[] };
};

export type TeamProfile = {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  logo: string;
  color?: string;
  league?: string;
  leagueName?: string;
  standing?: string;
  record?: string;
  wins?: string;
  draws?: string;
  losses?: string;
  points?: string;
};

export type FavTeam = {
  id: string;
  name: string;
  logo: string;
  league?: string;
};

export type FavLeague = {
  slug: string;
  name: string;
};

export type MatchesPayload = {
  updatedAt: string;
  matches: MatchCard[];
};

export type StandingRow = {
  rank: number;
  teamId: string;
  name: string;
  shortName: string;
  logo: string;
  played: string;
  wins: string;
  draws: string;
  losses: string;
  gf: string;
  ga: string;
  gd: string;
  points: string;
  note?: string;
  noteColor?: string;
};

export type StandingGroup = {
  name: string;
  rows: StandingRow[];
};
