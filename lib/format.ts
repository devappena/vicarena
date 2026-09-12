export const APP_TZ = "Africa/Kinshasa";

type DateParts = {
  year: number;
  month: number;
  day: number;
};

function partsInKinshasa(date = new Date()): DateParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const bag = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function espnDate(date = new Date()) {
  const { year, month, day } = partsInKinshasa(date);
  return `${year}${pad(month)}${pad(day)}`;
}

export function parseEspnDate(value?: string | null) {
  const raw = value && /^\d{8}$/.test(value) ? value : espnDate();
  return new Date(
    Date.UTC(Number(raw.slice(0, 4)), Number(raw.slice(4, 6)) - 1, Number(raw.slice(6, 8)), 12, 0, 0),
  );
}

export function shiftEspnDate(value: string, days: number) {
  const date = parseEspnDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

export function formatDayLabel(date: Date, opts?: { weekday?: boolean }) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: APP_TZ,
    weekday: opts?.weekday === false ? undefined : "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function isSameEspnDay(a: string, b: string) {
  return a === b;
}

export function formatKickoff(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: APP_TZ,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: APP_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

export function statusLabel(detail: string, status: "pre" | "in" | "post") {
  const raw = detail.trim().toUpperCase();
  if (status === "post" || raw === "FT" || raw === "FULL TIME") return "Terminé";
  if (raw === "HT" || raw === "HALFTIME") return "Mi-temps";
  if (status === "in") return detail || "En direct";
  return detail;
}

export function positionLabel(code: string) {
  const labels: Record<string, string> = {
    G: "Gardien",
    GK: "Gardien",
    CB: "Défenseur central",
    "CD-L": "Défenseur central gauche",
    "CD-R": "Défenseur central droit",
    LB: "Arrière gauche",
    RB: "Arrière droit",
    LWB: "Latéral gauche",
    RWB: "Latéral droit",
    DM: "Milieu défensif",
    CDM: "Milieu défensif",
    CM: "Milieu",
    AM: "Milieu offensif",
    CAM: "Milieu offensif",
    "AM-L": "Milieu offensif gauche",
    "AM-R": "Milieu offensif droit",
    LM: "Milieu gauche",
    RM: "Milieu droit",
    F: "Attaquant",
    ST: "Attaquant",
    CF: "Avant-centre",
    LW: "Ailier gauche",
    RW: "Ailier droit",
    W: "Ailier",
    D: "Défenseur",
    M: "Milieu",
    SUB: "Remplaçant",
  };
  return labels[code] ?? code;
}

export function statLabel(name: string) {
  const labels: Record<string, string> = {
    possessionPct: "Possession",
    totalShots: "Tirs",
    shotsOnTarget: "Tirs cadrés",
    wonCorners: "Corners",
    foulsCommitted: "Fautes",
    totalGoals: "Buts",
    goalAssists: "Passes décisives",
    shotAssists: "Occasions",
    offsides: "Hors-jeu",
    saves: "Arrêts",
    yellowCards: "Jaunes",
    redCards: "Rouges",
    crosses: "Centres",
    accuratePasses: "Passes réussies",
  };
  return labels[name] ?? name;
}
