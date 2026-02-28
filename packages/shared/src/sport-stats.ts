// packages/shared/src/sport-stats.ts
// Sport-specific stat definitions and scoring structures
// Shared between frontend and backend

import type { SportId } from './sports';

// ─────────────────────────────────────────────────────────────
// Stat Field Definitions
// ─────────────────────────────────────────────────────────────

export type StatFieldType = 'integer' | 'float' | 'percentage';

export type StatCategory =
  | 'offense'
  | 'defense'
  | 'general'
  | 'batting'
  | 'pitching'
  | 'bowling'
  | 'fielding';

export interface StatFieldDefinition {
  key: string;
  name: string;
  abbreviation: string;
  type: StatFieldType;
  category: StatCategory;
  min?: number;
  max?: number;
  /** If true, this stat is computed from other stats (not entered manually) */
  isComputed?: boolean;
  /** Formula description for computed stats (e.g., "FGM / FGA") */
  computeFormula?: string;
}

// ─────────────────────────────────────────────────────────────
// Scoring Structures
// ─────────────────────────────────────────────────────────────

export type ScoringStructureType =
  | 'game_based'
  | 'period_based'
  | 'set_based'
  | 'inning_based'
  | 'cricket_innings';

export interface SportScoringStructure {
  structure: ScoringStructureType;
  periodName: string;
  defaultPeriodCount: number;
  hasOvertime: boolean;
  overtimeName?: string;
  hasShootout?: boolean;
  hasMercyRule?: boolean;
  mercyRunDiff?: number;
  mercyInning?: number;
  pointsToWin?: number;
  winBy?: number;
  decidingSetPoints?: number;
}

// ─────────────────────────────────────────────────────────────
// Score Details — JSON shapes stored in MatchScore.score_details
// ─────────────────────────────────────────────────────────────

export type PeriodType =
  | 'regulation'
  | 'overtime'
  | 'shootout'
  | 'penalty_kicks'
  | 'extra_time'
  | 'extra_innings';

export interface ScorePeriod {
  period: number;
  periodType: PeriodType;
  team1Score: number;
  team2Score: number;
}

/** Generic score breakdown — works for most sports */
export interface ScoreDetails {
  sport: string;
  _schemaVersion: number;
  periods: ScorePeriod[];
  overtime?: ScorePeriod[];
  finalTeam1: number;
  finalTeam2: number;
  metadata?: Record<string, unknown>;
}

/** Tennis — sets with games and optional tiebreaks */
export interface TennisSetDetail {
  setNumber: number;
  team1Games: number;
  team2Games: number;
  tiebreak?: {
    team1Points: number;
    team2Points: number;
  };
}

export interface TennisScoreDetails extends Omit<ScoreDetails, 'periods'> {
  sport: 'tennis';
  sets: TennisSetDetail[];
  /** Total sets won */
  finalTeam1: number;
  finalTeam2: number;
}

/** Inning-based sports (baseball, softball) */
export interface InningHalf {
  inning: number;
  half: 'top' | 'bottom';
  runs: number;
}

export interface InningScoreDetails extends Omit<ScoreDetails, 'periods'> {
  sport: 'baseball' | 'softball';
  innings: InningHalf[];
  totalInnings: number;
  mercyRule?: boolean;
  finalTeam1: number;
  finalTeam2: number;
}

/** Cricket — runs, wickets, overs per innings */
export interface CricketInningsDetail {
  inningsNumber: number;
  battingTeam: 1 | 2;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  declared?: boolean;
}

export interface CricketScoreDetails extends Omit<ScoreDetails, 'periods'> {
  sport: 'cricket';
  innings: CricketInningsDetail[];
  finalTeam1: number;
  finalTeam2: number;
}

/** Union type for all score detail variants */
export type AnyScoreDetails =
  | ScoreDetails
  | TennisScoreDetails
  | InningScoreDetails
  | CricketScoreDetails;

// ─────────────────────────────────────────────────────────────
// Player Match Stats — JSON shape stored in PlayerMatchStats.stats
// ─────────────────────────────────────────────────────────────

export interface PlayerMatchStatsData {
  _schemaVersion: number;
  sport: string;
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// Sport Stat Definitions — all 11 sports
// ─────────────────────────────────────────────────────────────

const PICKLEBALL_STATS: StatFieldDefinition[] = [
  {
    key: 'aces',
    name: 'Aces',
    abbreviation: 'ACE',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'faults',
    name: 'Faults',
    abbreviation: 'FLT',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'winners',
    name: 'Winners',
    abbreviation: 'WIN',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'unforced_errors',
    name: 'Unforced Errors',
    abbreviation: 'UE',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'dinks',
    name: 'Dinks',
    abbreviation: 'DNK',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'thirds',
    name: 'Third Shot Drops',
    abbreviation: '3RD',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'eres',
    name: 'Earned Rally Endings',
    abbreviation: 'ERE',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
];

const BASKETBALL_STATS: StatFieldDefinition[] = [
  {
    key: 'pts',
    name: 'Points',
    abbreviation: 'PTS',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'reb',
    name: 'Rebounds',
    abbreviation: 'REB',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'ast',
    name: 'Assists',
    abbreviation: 'AST',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'stl',
    name: 'Steals',
    abbreviation: 'STL',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'blk',
    name: 'Blocks',
    abbreviation: 'BLK',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'to',
    name: 'Turnovers',
    abbreviation: 'TO',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'fgm',
    name: 'Field Goals Made',
    abbreviation: 'FGM',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'fga',
    name: 'Field Goals Attempted',
    abbreviation: 'FGA',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'fg_pct',
    name: 'Field Goal %',
    abbreviation: 'FG%',
    type: 'percentage',
    category: 'offense',
    min: 0,
    max: 100,
    isComputed: true,
    computeFormula: 'FGM / FGA * 100',
  },
  {
    key: 'tpm',
    name: '3-Pointers Made',
    abbreviation: '3PM',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'tpa',
    name: '3-Pointers Attempted',
    abbreviation: '3PA',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'tp_pct',
    name: '3-Point %',
    abbreviation: '3P%',
    type: 'percentage',
    category: 'offense',
    min: 0,
    max: 100,
    isComputed: true,
    computeFormula: '3PM / 3PA * 100',
  },
  {
    key: 'ftm',
    name: 'Free Throws Made',
    abbreviation: 'FTM',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'fta',
    name: 'Free Throws Attempted',
    abbreviation: 'FTA',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'ft_pct',
    name: 'Free Throw %',
    abbreviation: 'FT%',
    type: 'percentage',
    category: 'offense',
    min: 0,
    max: 100,
    isComputed: true,
    computeFormula: 'FTM / FTA * 100',
  },
  {
    key: 'min',
    name: 'Minutes',
    abbreviation: 'MIN',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'pf',
    name: 'Personal Fouls',
    abbreviation: 'PF',
    type: 'integer',
    category: 'general',
    min: 0,
  },
];

const SOCCER_STATS: StatFieldDefinition[] = [
  {
    key: 'goals',
    name: 'Goals',
    abbreviation: 'G',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'assists',
    name: 'Assists',
    abbreviation: 'A',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'shots',
    name: 'Shots',
    abbreviation: 'SH',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'shots_on_target',
    name: 'Shots on Target',
    abbreviation: 'SOT',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'saves',
    name: 'Saves',
    abbreviation: 'SV',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'fouls',
    name: 'Fouls',
    abbreviation: 'FL',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'yellow_cards',
    name: 'Yellow Cards',
    abbreviation: 'YC',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'red_cards',
    name: 'Red Cards',
    abbreviation: 'RC',
    type: 'integer',
    category: 'general',
    min: 0,
  },
];

const HOCKEY_STATS: StatFieldDefinition[] = [
  {
    key: 'goals',
    name: 'Goals',
    abbreviation: 'G',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'assists',
    name: 'Assists',
    abbreviation: 'A',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'sog',
    name: 'Shots on Goal',
    abbreviation: 'SOG',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'saves',
    name: 'Saves',
    abbreviation: 'SV',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'goals_against',
    name: 'Goals Against',
    abbreviation: 'GA',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'pim',
    name: 'Penalty Minutes',
    abbreviation: 'PIM',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'plus_minus',
    name: 'Plus/Minus',
    abbreviation: '+/-',
    type: 'integer',
    category: 'general',
  },
];

const TENNIS_STATS: StatFieldDefinition[] = [
  {
    key: 'aces',
    name: 'Aces',
    abbreviation: 'ACE',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'double_faults',
    name: 'Double Faults',
    abbreviation: 'DF',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'winners',
    name: 'Winners',
    abbreviation: 'WIN',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'unforced_errors',
    name: 'Unforced Errors',
    abbreviation: 'UE',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'first_serve_pct',
    name: '1st Serve %',
    abbreviation: '1st%',
    type: 'percentage',
    category: 'general',
    min: 0,
    max: 100,
  },
  {
    key: 'break_points_won',
    name: 'Break Points Won',
    abbreviation: 'BPW',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'break_points_faced',
    name: 'Break Points Faced',
    abbreviation: 'BPF',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
];

const VOLLEYBALL_STATS: StatFieldDefinition[] = [
  {
    key: 'kills',
    name: 'Kills',
    abbreviation: 'K',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'assists',
    name: 'Assists',
    abbreviation: 'A',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'aces',
    name: 'Aces',
    abbreviation: 'ACE',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'digs',
    name: 'Digs',
    abbreviation: 'D',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'blocks',
    name: 'Blocks',
    abbreviation: 'BLK',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'service_errors',
    name: 'Service Errors',
    abbreviation: 'SE',
    type: 'integer',
    category: 'general',
    min: 0,
  },
];

const BASEBALL_STATS: StatFieldDefinition[] = [
  // Batting
  {
    key: 'ab',
    name: 'At Bats',
    abbreviation: 'AB',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'hits',
    name: 'Hits',
    abbreviation: 'H',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'hr',
    name: 'Home Runs',
    abbreviation: 'HR',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'rbi',
    name: 'Runs Batted In',
    abbreviation: 'RBI',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'runs',
    name: 'Runs',
    abbreviation: 'R',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'bb',
    name: 'Walks',
    abbreviation: 'BB',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'so',
    name: 'Strikeouts',
    abbreviation: 'SO',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'sb',
    name: 'Stolen Bases',
    abbreviation: 'SB',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'avg',
    name: 'Batting Average',
    abbreviation: 'AVG',
    type: 'float',
    category: 'batting',
    min: 0,
    max: 1,
    isComputed: true,
    computeFormula: 'H / AB',
  },
  {
    key: 'obp',
    name: 'On-Base %',
    abbreviation: 'OBP',
    type: 'float',
    category: 'batting',
    min: 0,
    max: 1,
    isComputed: true,
    computeFormula: '(H + BB) / (AB + BB)',
  },
  {
    key: 'slg',
    name: 'Slugging %',
    abbreviation: 'SLG',
    type: 'float',
    category: 'batting',
    min: 0,
    isComputed: true,
    computeFormula: 'Total bases / AB',
  },
  // Pitching
  {
    key: 'ip',
    name: 'Innings Pitched',
    abbreviation: 'IP',
    type: 'float',
    category: 'pitching',
    min: 0,
  },
  {
    key: 'er',
    name: 'Earned Runs',
    abbreviation: 'ER',
    type: 'integer',
    category: 'pitching',
    min: 0,
  },
  {
    key: 'k',
    name: 'Strikeouts (Pitcher)',
    abbreviation: 'K',
    type: 'integer',
    category: 'pitching',
    min: 0,
  },
  {
    key: 'era',
    name: 'Earned Run Average',
    abbreviation: 'ERA',
    type: 'float',
    category: 'pitching',
    min: 0,
    isComputed: true,
    computeFormula: '(ER / IP) * 9',
  },
  {
    key: 'pitcher_w',
    name: 'Wins (Pitcher)',
    abbreviation: 'W',
    type: 'integer',
    category: 'pitching',
    min: 0,
  },
  {
    key: 'pitcher_l',
    name: 'Losses (Pitcher)',
    abbreviation: 'L',
    type: 'integer',
    category: 'pitching',
    min: 0,
  },
];

const SOFTBALL_STATS: StatFieldDefinition[] = [
  // Batting
  {
    key: 'ab',
    name: 'At Bats',
    abbreviation: 'AB',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'hits',
    name: 'Hits',
    abbreviation: 'H',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'hr',
    name: 'Home Runs',
    abbreviation: 'HR',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'rbi',
    name: 'Runs Batted In',
    abbreviation: 'RBI',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'runs',
    name: 'Runs',
    abbreviation: 'R',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'so',
    name: 'Strikeouts',
    abbreviation: 'SO',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'sb',
    name: 'Stolen Bases',
    abbreviation: 'SB',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  // Pitching
  {
    key: 'ip',
    name: 'Innings Pitched',
    abbreviation: 'IP',
    type: 'float',
    category: 'pitching',
    min: 0,
  },
  {
    key: 'k',
    name: 'Strikeouts (Pitcher)',
    abbreviation: 'K',
    type: 'integer',
    category: 'pitching',
    min: 0,
  },
  {
    key: 'er',
    name: 'Earned Runs',
    abbreviation: 'ER',
    type: 'integer',
    category: 'pitching',
    min: 0,
  },
  {
    key: 'era',
    name: 'Earned Run Average',
    abbreviation: 'ERA',
    type: 'float',
    category: 'pitching',
    min: 0,
    isComputed: true,
    computeFormula: '(ER / IP) * 7',
  },
];

const FOOTBALL_STATS: StatFieldDefinition[] = [
  {
    key: 'pass_yds',
    name: 'Passing Yards',
    abbreviation: 'PYD',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'rush_yds',
    name: 'Rushing Yards',
    abbreviation: 'RYD',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'tds',
    name: 'Touchdowns',
    abbreviation: 'TD',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'ints',
    name: 'Interceptions Thrown',
    abbreviation: 'INT',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'receptions',
    name: 'Receptions',
    abbreviation: 'REC',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'rec_yds',
    name: 'Receiving Yards',
    abbreviation: 'RECY',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'tackles',
    name: 'Tackles',
    abbreviation: 'TKL',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
  {
    key: 'sacks',
    name: 'Sacks',
    abbreviation: 'SCK',
    type: 'float',
    category: 'defense',
    min: 0,
  },
  {
    key: 'def_ints',
    name: 'Interceptions (Def)',
    abbreviation: 'DINT',
    type: 'integer',
    category: 'defense',
    min: 0,
  },
];

const PING_PONG_STATS: StatFieldDefinition[] = [
  {
    key: 'aces',
    name: 'Aces',
    abbreviation: 'ACE',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'winners',
    name: 'Winners',
    abbreviation: 'WIN',
    type: 'integer',
    category: 'offense',
    min: 0,
  },
  {
    key: 'unforced_errors',
    name: 'Unforced Errors',
    abbreviation: 'UE',
    type: 'integer',
    category: 'general',
    min: 0,
  },
  {
    key: 'net_errors',
    name: 'Net Errors',
    abbreviation: 'NE',
    type: 'integer',
    category: 'general',
    min: 0,
  },
];

const CRICKET_STATS: StatFieldDefinition[] = [
  // Batting
  {
    key: 'runs',
    name: 'Runs',
    abbreviation: 'R',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'balls_faced',
    name: 'Balls Faced',
    abbreviation: 'BF',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'fours',
    name: 'Fours',
    abbreviation: '4s',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'sixes',
    name: 'Sixes',
    abbreviation: '6s',
    type: 'integer',
    category: 'batting',
    min: 0,
  },
  {
    key: 'strike_rate',
    name: 'Strike Rate',
    abbreviation: 'SR',
    type: 'float',
    category: 'batting',
    min: 0,
    isComputed: true,
    computeFormula: '(R / BF) * 100',
  },
  // Bowling
  {
    key: 'overs_bowled',
    name: 'Overs Bowled',
    abbreviation: 'O',
    type: 'float',
    category: 'bowling',
    min: 0,
  },
  {
    key: 'wickets',
    name: 'Wickets',
    abbreviation: 'W',
    type: 'integer',
    category: 'bowling',
    min: 0,
  },
  {
    key: 'runs_conceded',
    name: 'Runs Conceded',
    abbreviation: 'RC',
    type: 'integer',
    category: 'bowling',
    min: 0,
  },
  {
    key: 'maidens',
    name: 'Maidens',
    abbreviation: 'M',
    type: 'integer',
    category: 'bowling',
    min: 0,
  },
  {
    key: 'economy',
    name: 'Economy Rate',
    abbreviation: 'ECON',
    type: 'float',
    category: 'bowling',
    min: 0,
    isComputed: true,
    computeFormula: 'RC / O',
  },
  // Fielding
  {
    key: 'catches',
    name: 'Catches',
    abbreviation: 'CT',
    type: 'integer',
    category: 'fielding',
    min: 0,
  },
  {
    key: 'run_outs',
    name: 'Run Outs',
    abbreviation: 'RO',
    type: 'integer',
    category: 'fielding',
    min: 0,
  },
  {
    key: 'stumpings',
    name: 'Stumpings',
    abbreviation: 'ST',
    type: 'integer',
    category: 'fielding',
    min: 0,
  },
];

// ─────────────────────────────────────────────────────────────
// Master Map: Sport → Stat Definitions
// ─────────────────────────────────────────────────────────────

export const SPORT_STAT_DEFINITIONS: Record<string, StatFieldDefinition[]> = {
  pickleball: PICKLEBALL_STATS,
  basketball: BASKETBALL_STATS,
  soccer: SOCCER_STATS,
  hockey: HOCKEY_STATS,
  tennis: TENNIS_STATS,
  volleyball: VOLLEYBALL_STATS,
  baseball: BASEBALL_STATS,
  softball: SOFTBALL_STATS,
  football: FOOTBALL_STATS,
  ping_pong: PING_PONG_STATS,
  cricket: CRICKET_STATS,
};

// ─────────────────────────────────────────────────────────────
// Scoring Structures — how each sport is scored
// ─────────────────────────────────────────────────────────────

export const SPORT_SCORING_STRUCTURES: Record<string, SportScoringStructure> = {
  pickleball: {
    structure: 'game_based',
    periodName: 'Game',
    defaultPeriodCount: 1,
    hasOvertime: false,
    pointsToWin: 11,
    winBy: 2,
  },
  basketball: {
    structure: 'period_based',
    periodName: 'Quarter',
    defaultPeriodCount: 4,
    hasOvertime: true,
    overtimeName: 'OT',
  },
  soccer: {
    structure: 'period_based',
    periodName: 'Half',
    defaultPeriodCount: 2,
    hasOvertime: true,
    overtimeName: 'Extra Time',
    hasShootout: true,
  },
  hockey: {
    structure: 'period_based',
    periodName: 'Period',
    defaultPeriodCount: 3,
    hasOvertime: true,
    overtimeName: 'OT',
    hasShootout: true,
  },
  tennis: {
    structure: 'set_based',
    periodName: 'Set',
    defaultPeriodCount: 3,
    hasOvertime: false,
    decidingSetPoints: 7, // Tiebreak at 6-6
  },
  volleyball: {
    structure: 'game_based',
    periodName: 'Set',
    defaultPeriodCount: 5,
    hasOvertime: false,
    pointsToWin: 25,
    winBy: 2,
    decidingSetPoints: 15,
  },
  baseball: {
    structure: 'inning_based',
    periodName: 'Inning',
    defaultPeriodCount: 9,
    hasOvertime: true,
    overtimeName: 'Extra Innings',
  },
  softball: {
    structure: 'inning_based',
    periodName: 'Inning',
    defaultPeriodCount: 7,
    hasOvertime: true,
    overtimeName: 'Extra Innings',
    hasMercyRule: true,
    mercyRunDiff: 10,
    mercyInning: 5,
  },
  football: {
    structure: 'period_based',
    periodName: 'Quarter',
    defaultPeriodCount: 4,
    hasOvertime: true,
    overtimeName: 'OT',
  },
  ping_pong: {
    structure: 'game_based',
    periodName: 'Game',
    defaultPeriodCount: 5,
    hasOvertime: false,
    pointsToWin: 11,
    winBy: 2,
  },
  cricket: {
    structure: 'cricket_innings',
    periodName: 'Innings',
    defaultPeriodCount: 2,
    hasOvertime: false,
  },
};

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

/** Get stat definitions for a sport (empty array if unknown) */
export function getStatDefinitions(sport: string): StatFieldDefinition[] {
  return SPORT_STAT_DEFINITIONS[sport] ?? [];
}

/** Get scoring structure for a sport */
export function getScoringStructure(
  sport: string,
): SportScoringStructure | undefined {
  return SPORT_SCORING_STRUCTURES[sport];
}

/** Get only manually-entered stat fields (excludes computed fields) */
export function getEntryStatFields(sport: string): StatFieldDefinition[] {
  return getStatDefinitions(sport).filter((f) => !f.isComputed);
}

/** Get stat fields grouped by category */
export function getStatFieldsByCategory(
  sport: string,
): Record<StatCategory, StatFieldDefinition[]> {
  const defs = getStatDefinitions(sport);
  const grouped = {} as Record<StatCategory, StatFieldDefinition[]>;
  for (const def of defs) {
    if (!grouped[def.category]) {
      grouped[def.category] = [];
    }
    grouped[def.category].push(def);
  }
  return grouped;
}

/** Get all unique categories for a sport */
export function getStatCategories(sport: string): StatCategory[] {
  const defs = getStatDefinitions(sport);
  const categories = new Set<StatCategory>();
  for (const def of defs) {
    categories.add(def.category);
  }
  return Array.from(categories);
}

/** Validate stat values against definitions */
export function validateStatValues(
  sport: string,
  stats: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
  const defs = getStatDefinitions(sport);
  const errors: string[] = [];
  const validKeys = new Set(defs.map((d) => d.key));

  for (const [key, value] of Object.entries(stats)) {
    if (key.startsWith('_')) continue; // Skip meta fields
    if (key === 'sport') continue;

    if (!validKeys.has(key)) {
      errors.push(`Unknown stat field "${key}" for ${sport}`);
      continue;
    }

    const def = defs.find((d) => d.key === key);
    if (!def) continue;

    if (typeof value !== 'number') {
      errors.push(`"${def.name}" must be a number`);
      continue;
    }

    if (def.min !== undefined && value < def.min) {
      errors.push(`"${def.name}" cannot be less than ${def.min}`);
    }
    if (def.max !== undefined && value > def.max) {
      errors.push(`"${def.name}" cannot be greater than ${def.max}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
