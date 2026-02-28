// packages/shared/src/sports.ts
// Supported sports with their display names, default config values, and activation status
// teamFormat: 'doubles' = 2-player teams (player1/player2), 'team' = roster-based (TeamMember)

export type TeamFormat = 'doubles' | 'team';

export const SPORTS = {
  pickleball: {
    id: 'pickleball',
    name: 'Pickleball',
    teamFormat: 'doubles' as TeamFormat,
    defaultPoints: 11,
    defaultWinBy: 2,
    defaultGames: 1,
    isActive: true, // Active for v1
  },
  badminton: {
    id: 'badminton',
    name: 'Badminton',
    teamFormat: 'doubles' as TeamFormat,
    defaultPoints: 21,
    defaultWinBy: 2,
    defaultGames: 3, // Best of 3 standard
    isActive: false, // Disabled for v1
  },
  volleyball: {
    id: 'volleyball',
    name: 'Volleyball',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 25,
    defaultWinBy: 2,
    defaultGames: 3, // Best of 3 or 5
    isActive: true, // Active — roster-based team sport
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 21, // Half-court/casual
    defaultWinBy: 1,
    defaultGames: 1,
    isActive: true, // Active — roster-based team sport
  },
  soccer: {
    id: 'soccer',
    name: 'Soccer',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 1, // Goals
    defaultWinBy: 1,
    defaultGames: 1,
    isActive: true, // Active — roster-based team sport
  },
  hockey: {
    id: 'hockey',
    name: 'Hockey',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 1, // Goals
    defaultWinBy: 1,
    defaultGames: 1,
    isActive: true, // Active — roster-based team sport
  },
  softball: {
    id: 'softball',
    name: 'Softball',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 1, // Runs
    defaultWinBy: 1,
    defaultGames: 1,
    isActive: true, // Active — roster-based team sport
  },
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    teamFormat: 'doubles' as TeamFormat,
    defaultPoints: 4, // Games to win a set
    defaultWinBy: 2,
    defaultGames: 3, // Best of 3 sets
    isActive: true, // Active — doubles format
  },
  baseball: {
    id: 'baseball',
    name: 'Baseball',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 1, // Runs
    defaultWinBy: 1,
    defaultGames: 1,
    isActive: true, // Active — roster-based team sport
  },
  football: {
    id: 'football',
    name: 'Football',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 1, // Points/touchdowns
    defaultWinBy: 1,
    defaultGames: 1,
    isActive: true, // Active — roster-based team sport
  },
  cricket: {
    id: 'cricket',
    name: 'Cricket',
    teamFormat: 'team' as TeamFormat,
    defaultPoints: 1, // Runs
    defaultWinBy: 1,
    defaultGames: 1,
    isActive: true, // Active — roster-based team sport
  },
  ping_pong: {
    id: 'ping_pong',
    name: 'Ping Pong',
    teamFormat: 'doubles' as TeamFormat,
    defaultPoints: 11,
    defaultWinBy: 2,
    defaultGames: 1,
    isActive: true, // Active — doubles format (like pickleball)
  },
} as const;

export type SportId = keyof typeof SPORTS;
export type Sport = (typeof SPORTS)[SportId];

// Get all sport IDs
export const SPORT_IDS = Object.keys(SPORTS) as SportId[];

// Get only active sport IDs (for UI filtering)
export const ACTIVE_SPORT_IDS = SPORT_IDS.filter(
  (id) => SPORTS[id].isActive,
) as SportId[];

// Helper to get sport display name
export function getSportName(sportId: string): string {
  return SPORTS[sportId as SportId]?.name || sportId;
}

// Helper to check if sport is active
export function isSportActive(sportId: string): boolean {
  return SPORTS[sportId as SportId]?.isActive ?? false;
}

// Get active sports as array (for dropdowns)
export function getActiveSports(): Sport[] {
  return ACTIVE_SPORT_IDS.map((id) => SPORTS[id]);
}

// Get all sports as array (for admin views)
export function getAllSports(): Sport[] {
  return SPORT_IDS.map((id) => SPORTS[id]);
}

// Check if a sport uses roster-based teams (vs doubles player1/player2)
export function isTeamSport(sportId: string): boolean {
  return SPORTS[sportId as SportId]?.teamFormat === 'team';
}

// Get the team format for a sport (defaults to 'doubles' for unknown sports)
export function getTeamFormat(sportId: string): TeamFormat {
  return SPORTS[sportId as SportId]?.teamFormat ?? 'doubles';
}
