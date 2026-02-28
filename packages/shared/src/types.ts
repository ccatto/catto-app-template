// packages/shared/src/types.ts
import { JSX } from 'react';
import { Session } from 'next-auth';

// Catto's Interfaces & Types
// -----------------------------  ----------------------------
// ___       _             __                        ___
// |_ _|_ __ | |_ ___ _ __ / _| __ _  ___ ___  ___   ( _ )
//  | || '_ \| __/ _ \ '__| |_ / _` |/ __/ _ \/ __|  / _ \/\
//  | || | | | ||  __/ |  |  _| (_| | (_|  __/\__ \ | (_>  <
// |___|_| |_|\__\___|_|  |_|  \__,_|\___\___||___/  \___/\/
// |_   _|   _ _ __   ___  ___
//   | || | | | '_ \ / _ \/ __|
//   | || |_| | |_) |  __/\__ \
//   |_| \__, | .__/ \___||___/
//       |___/|_|
// -----------------------------  ----------------------------

// -----------------------------------------------------------

// ┌──────────────────────────────────────────────────────┐
// │ _______  _______  _______  _______           _______ │
// │(  ___  )(  ____ )(  ____ )(  ___  )|\     /|(  ____ \│
// │| (   ) || (    )|| (    )|| (   ) |( \   / )| (    \/│
// │| (___) || (____)|| (____)|| (___) | \ (_) / | (_____ │
// │|  ___  ||     __)|     __)|  ___  |  \   /  (_____  )│
// │| (   ) || (\ (   | (\ (   | (   ) |   ) (         ) |│
// │| )   ( || ) \ \__| ) \ \__| )   ( |   | |   /\____) |│
// │|/     \||/   \__/|/   \__/|/     \|   \_/   \_______)│
// └──────────────────────────────────────────────────────┘
export type IBracketRoundStructureArray = Array<IBracketRoundStructure>;
export type ITournamentArray = Array<ITournament>;
export type ITourneyBracketArray = Array<IBracketSimple>;
export type ITourneyMatchDataArray = Array<ITourneyMatch>;
export type ITourneyTeamDataArray = Array<ITourneyTeam>;
export type ITourneyTeamTableSimpleDataArray = Array<ITourneyTeamTableSimple>;
export type ITournamentTeamzArray = Array<ITournamentTeamz>;
export type ISelectInfoElementsArray = Array<ISelectInfo>;
export type ISelectDDLCattoArray = Array<ISelectDLLCatto>;
export type IMatchArray = Array<IMatch>;
export type ITournamentSlotMapArray = Array<ITournamentSlotMap>;
export type IOrganizationArray = IOrganizationData[];
export type ITourneyTeamzArray = Array<ITourneyTeamzBackFromAPI>;

//   __  _  _ _____ _  _
//  /  \| || |_   _| || |
// | /\ | \/ | | | | >< |
// |_||_|\__/  |_| |_||_|
export interface IAuthSignInFormData {
  auth_email: string;
  auth_password: string;
}

// todo change name maybe IAuthCreateUserMemberData
export interface IAuthUserRoleFormData {
  email: string;
  // user_id: string;
  role: string;
}

export type SessionResult = {
  session: Session | null;
  isAuthenticated: boolean;
};

export interface AccountUserInfoProps {
  sessionResult: SessionResult;
}

export interface IAuthSignInForgotPassword {
  auth_email: string;
}

export interface IAuthPasswordResetFormData {
  auth_password: string;
  auth_password_verify: string;
}

// types.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IUserRz {
  id: string;
  email: string;
  password: string;
  name: string | null;
  image: string | null;
  // ... other user properties (if any)
}

export interface IUserAuth {
  id: string;
  email: string;
  password: string | null;
  name: string | null; // Updated to allow null
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationUser {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface IOrganizationRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  organizationId: string;
}

export interface IMemberRoleType {
  id: string; // Unique identifier for the role
  name: string; // Name of the role
  description: string; // Description of the role
  organizationId: string; // Associated organization ID
  permissions: string[]; // Array of permissions
  createdAt: string; // ISO timestamp for creation date
  updatedAt: string; // ISO timestamp for last update date
}

export interface Membership {
  organization: {
    id: string;
    name: string;
  };
  role: {
    name: string;
    permissions: string[];
  };
}

export interface IOrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
  user: IUser;
  role: IOrganizationRole;
}

export interface IAddMemberFormData {
  email: string;
  roleId: string;
}

// delete below:
export interface OrganizationMemberData {
  id: string;
  userId: string;
  user: {
    email: string;
    name: string | null;
    image: string | null;
  };
  organization: {
    name: string;
    slug: string;
  };
  role: {
    name: string;
    permissions: string[]; // Assuming permissions is a string array, adjust if different
  };
}

export type OrganizationMembersResponse = OrganizationMemberData[];

// Organization Member Interfaces:
export interface MappedOrganizationMember {
  id: string;
  userId: string;
  userName: string | null;
  email: string;
  orgName: string;
  slug: string;
  roleName: string;
  permissions: string[];
}
// For array of members
export type IMappedOrganizationMembersResponse = MappedOrganizationMember[];

export interface OrganizationMember {
  id: string;
  userId: string;
  user: { name: string | null; email: string };
  organization: { name: string; slug: string };
  role: { name: string; permissions: string[] };
}

export interface IUserAccountDetails {
  email: string;
  id: string;
  orgName: string;
  permissions: string[];
  roleName: string;
  slug: string;
  userId: string;
  userName: string | null;
}

export interface IUserSessionData {
  email: string;
  id: string;
  image: string | null;
  name: string | null;
  organizations: IOrgDataDetails[];
  // organizations: any[]; // Replace 'any' with a more specific type if known
}

export interface IUserAccountInfo {
  userAccountDetails: IUserAccountDetails;
  userSessionData: IUserSessionData;
}

export interface INameFormData {
  name: string;
}

interface IUserNameCreate {
  name: string;
  image?: string;
}

export interface IUserNameCreateProps {
  createUserNameData: IUserNameCreate;
}

export interface IUserIdCattoProps {
  userId: string;
}

export interface IUpdateUserNameFormProps {
  userId: string;
  onSuccess?: () => void;
}

// Types
export interface IAuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface IUserAuthUser {
  user: IAuthUser;
}
export interface IAuthUpdateUserData {
  id: string;
  name: string;
  image?: string;
}

// #todo move this to other sections since so generic
export interface IMessageAPIResult {
  message: string;
}

// Define types for permissions and roles
export type Permission =
  | 'manage_users'
  | 'view_dashboard'
  | 'edit_settings'
  | 'create_content'; // add your actual permissions

//              --- ~ ---
//  __   __        __        ___ ___  __
// |__) |__)  /\  /  ` |__/ |__   |  /__`
// |__) |  \ /--\ \__, |  \ |___  |  .__/
//
// #todo remove I think:
export interface IBracketSwitcherProps {
  numberOfMatches: number;
  matchData: ITourneyMatchDataArray;
  matchDataPlus: IMatchPlus;
  bracketData: ITourneyBracketArray;
}

// #todo update to better name:
export interface IBracketNumberTeamProps {
  numberOfMatches: number;
  matchData: ITourneyMatchDataArray;
  matchDataPlus: IMatchPlus;
}

export interface IBracket {
  is_active: boolean;
  match_date_time: Date;
  match_number: number;
  match_team_winner: number;
  match_venue: number;
  round: number;
  team_name: string;
  tourney_slot_id: number;
}

export type IBracketGameProps = {
  awayTeam?: string;
  currentAwayTeamSlotId: number;
  awayTeamId: number;
  homeTeam: string;
  currentHomeTeamSlotId: number;
  homeTeamId: number;
  gameNumber: number;
  gameDate: string;
  matchDataPlus: IMatchPlus;
  numberOfMatches: number;
};

export interface IBracketXTeamDynamicProps {
  matchDataPlus: IMatchPlus;
  matchData: ITourneyMatchDataArray;
  numberOfMatches: number;
  bracketTeamSize: number;
}

export interface IBracketWinnerDataReturned {
  message: string;
  newBracket: IBracketSimple;
  newTourneySlotId: number;
  teamName: string;
  bracketRecordsUpdated: ICount;
}
export interface IBracketTeamDisplay {
  slotId: number;
  teamId: number;
  teamName: string;
}

export interface IBracketRoundStructure {
  start: number;
  end: number;
  round: number;
}

export interface IBracketSimple {
  team_name: string;
  tourney_slot_id: number;
  tourney_slot_team_id: number;
}

export interface IBracketWinner {
  winning_slot_id: number;
  is_champion: boolean;
  is_constellation_champion: boolean;
  match_number_next: number;
}

export interface IBracketTeamSize {
  bracketTeamSize: number;
}

interface ICount {
  count: number;
}

//       ___       __        ___ __
// |    |__   /\  / _` |  | |__   /
// |___ |___ /~~\ \__> \__/ |___ /_

export interface ILeaguez {
  orgName: string;
  leagueId: string;
}

export interface leagueGet {
  orgName: string;
  slug: string;
  leagueId: string;
}

export interface ILeague {
  is_active: boolean;
  league_color: string;
  league_id: number;
  league_name: string;
  league_sport: string;
  organization_id: number;
  org_name?: string;
}

export interface ILeagueUpdate {
  leagueData: ILeague;
}

//  ----------------------
// Match
//  ----------------------
export interface IMatch {
  match_venue: number;
  match_home_team: number;
  match_away_team: number;
  match_number: number;
  round: number;
  tournament1_id: number;
}

export interface IMatchPlus {
  matchData: ITourneyMatchDataArray;
  orgName: string;
  tournamentId: string;
}

export interface IMatchRound {
  round: number;
  match_number: number;
  match_date_time: string;
}

// ------------       ---------         ----------          -----------
// Orgs
// ___                        _          _   _
// / _ \ _ __ __ _  __ _ _ __ (_)______ _| |_(_) ___  _ __  ___
// | | | | '__/ _` |/ _` | '_ \| |_  / _` | __| |/ _ \| '_ \/ __|
// | |_| | | | (_| | (_| | | | | |/ / (_| | |_| | (_) | | | \__ \
// \___/|_|  \__, |\__,_|_| |_|_/___\__,_|\__|_|\___/|_| |_|___/
//            |___/
// ------------       ---------         ----------          -----------

// #todo maybe make a better interface with a better array
// New combined interface with full type inference
export interface IOrganizationData extends IOrgDataDetails, ITournament {}

// deleted Jan 26 2025
// export interface orgName {
//   orgName: string;
// }
export interface IOrgName {
  orgName: string;
}

export type Organization = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
};

// good one as of Jan 2025 example app/(public)/[orgName]/page.tsx
// export type IOrgNameProps = {
//   params: {
//     orgName: string;
//   }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export type IOrgNameProps = {
//   params: {
//     orgName: string;
//   };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

export interface IOrgNavLinkOrgName {
  orgNavLinkOrgName: string;
}

export interface IOrgLinks {
  orgDetailsOrgName: orgDataDetails;
}

// deleted jan 26 2025 - remove later
// export interface orgDetailsName {
//   orgName: orgDataDetails;
//   // orgData: orgData;
// }

export interface orgDataDetails {
  orgData: orgData;
  is_active: boolean;
  organization_color: string;
  organization_id: number;
  organization_name: string;
  organization_owner: string;
}

export interface orgData {
  // orgData: object;
  is_active: boolean;
  organization_color: string;
  organization_id: number;
  organization_name: string;
  organization_owner: string;
}

export interface IOrgData {
  is_active: boolean;
  organization_color: string;
  organization_id: number;
  organization_name: string;
  organization_owner: string;
}

export interface IOrgDataDetails {
  is_active: boolean;
  organization_color: string;
  organization_id: number;
  organization_name: string;
  organization_owner: string;
}

export interface org {
  orgName: string;
}

export interface IOrgCreateAPIResult {
  message: string;
  orgName: number;
}

export interface IOrganizationFormData {
  organization_name: string;
  organization_color: string;
  organization_owner: string;
}

export interface IOrganizationMemberResponse {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string; // Changed from 'role' to 'roleId' to match the database schema
  createdAt: Date;
  updatedAt: Date;
  user: {
    email: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
  };
}

export interface OrgMemberTableRow {
  userName: string;
  email: string;
  orgName: string;
}

////////------------------
// Player
////////------------------
export interface iPlayerSelectInfo {
  value: string;
  name: string;
}
export interface player {
  orgName: string;
  slug: string;
  playerId: string;
}

export interface IPlayer {
  orgName: string;
  slug: string;
  playerId: string;
}

export interface IPlayerData {
  created_date: Date;
  is_active: boolean;
  organization_id?: number;
  orgName: string;
  player_email: string;
  player_first_name: string;
  player_id: number;
  player_last_name: string;
}

export interface IUpdatePlayerProps {
  playerData: IPlayerData;
}

export interface IPlayer {
  player_id: number;
  player_first_name: string;
  player_last_name: string;
  player_email: string;
}

export interface IPlayerzFormData {
  player_first_name: string;
  player_last_name: string;
  player_email: string;
}

//  __   ___       __  ___       __   __        ___  __   __
// |__) |__   /\  /  `  |  |__| /  \ /  \ |__/ |__  /  \ |__)  |\/|
// |  \ |___ /~~\ \__,  |  |  | \__/ \__/ |  \ |    \__/ |  \  |  |

export interface IFieldConfig<T> {
  // Generic type for reusability
  name: keyof T; // using keyof T - this ensures that the name property of each field configuration must be a valid key of the type T; prevents typos and ensures type safety
  label: string;
  type?: string;
  placeholder?: string;
  // renderCustom?: any;
  renderCustom?: (
    field: {
      onChange: (value: T[keyof T]) => void;
      onBlur: () => void;
      value: T[keyof T];
      ref: React.Ref<HTMLInputElement | HTMLSelectElement>;
    },
    fieldState: { error?: { message?: string } },
  ) => JSX.Element;
}

// ---------------- Slug & Select --------------
export interface ISlug {
  slug: string;
}

export interface ISelectInfo {
  value: string;
  name: string;
}

export interface ISelectDLLCatto {
  value: string;
  label: string;
}

// This LoadingContextType is used currently on tanstack table:
export interface LoadingContextType {
  showLoadingModal: boolean;
  setShowLoadingModal: (show: boolean) => void;
}

// style types:
// /========================================================================\
// || ___  ____  _  _  __    ____    ____  _   _  ____  __  __  ____  ___  ||
// ||/ __)(_  _)( \/ )(  )  ( ___)  (_  _)( )_( )( ___)(  \/  )( ___)/ __) ||
// ||\__ \  )(   \  /  )(__  )__)     )(   ) _ (  )__)  )    (  )__) \__ \ ||
// ||(___/ (__)  (__) (____)(____)   (__) (_) (_)(____)(_/\/\_)(____)(___/ ||
// \========================================================================/

// #todo change this name to something like StyleInputTheme
export type ThemeType =
  | 'light'
  | 'dark'
  | 'primary'
  | 'secondary'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'rose'
  | 'amber'
  | 'dusk'
  | 'coral'
  | 'darkBlueOrangeTheme';

export type StyleWidth =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'full'
  | 'auto';

export type StyleAnimations =
  | 'tada'
  | 'pulse'
  | 'bounce'
  | 'shrink'
  | 'wobble'
  | 'none';

export type FontSizeType =
  | 'xs' // text-xs (12px)
  | 'sm' // text-sm (14px)
  | 'base' // text-base (16px)
  | 'lg' // text-lg (18px)
  | 'xl' // text-xl (20px)
  | '2xl' // text-2xl (24px)
  | '3xl' // text-3xl (30px)
  | '4xl' // text-4xl (36px)
  | '5xl' // text-5xl (48px)
  | '6xl'; // text-6xl (60px)

export type FontWeightType =
  | 'thin' // font-thin (100)
  | 'extralight' // font-extralight (200)
  | 'light' // font-light (300)
  | 'normal' // font-normal (400)
  | 'medium' // font-medium (500)
  | 'semibold' // font-semibold (600)
  | 'bold' // font-bold (700)
  | 'extrabold' // font-extrabold (800)
  | 'black'; // font-black (900)

//  ------------------      ------------------        ------------------    ------------------
// Zustand Store
//      // _____         _                  _       _
//      // |__  /   _ ___| |_ __ _ _ __   __| |  ___| |_ ___  _ __ ___
//      //   / / | | / __| __/ _` | '_ \ / _` | / __| __/ _ \| '__/ _ \
//      //  / /| |_| \__ \ || (_| | | | | (_| | \__ \ || (_) | | |  __/
//      // /____\__,_|___/\__\__,_|_| |_|\__,_| |___/\__\___/|_|  \___|
//  ------------------      ------------------        ------------------      ------------------
// IStore interfaces are Zustand Interfaces YO!
export interface IStoreBracket {
  brackets: IBracketSimple[] | null; // array of brackets (Use 'null' to represent initial undefined state)
  setBrackets: (brackets: IBracketSimple[]) => void;
  addBracket: (bracket: IBracketSimple) => void; // function to add bracket;
  removeBracket: (tourney_slot_id: number) => void;
  updateBracket: (tourney_slot_id: number, newBracket: IBracketSimple) => void;
}

// Match Store MATCH
export interface IStoreMatch {
  zMatches: ITourneyMatchDataArray | null; // array of tournaments (Use 'null' to represent initial undefined state)
  setZMatches: (zMatches: ITourneyMatchDataArray) => void;
  // addZMatches: (zMatch: IMatch) => void;
  // updateZMatches: (tourney_slot_id: number, newBracket: IBracketSimple) => void;
}

export interface IStoreTourneyTeamz {
  zTourneyTeamz: ITourneyTeamDataArray | null; // array of tournaments (Use 'null' to represent initial undefined state)
  setZTourneyTeamz: (zTourneyTeamz: ITourneyTeamDataArray) => void;
  // addZTourneyTeamz: (zTourneyTeam: ITourneyTeam) => void;
  // updateZTourneyTeamz: (tourney_slot_id: number, newBracket: IBracketSimple) => void;
}

// Tourney Store
export interface IStoreTournament {
  tournaments: ITournament[] | null; // array of tournaments (Use 'null' to represent initial undefined state)
  setTournaments: (tournaments: ITournament[]) => void;
  // addTournament: (tournaments: ITournament) => void; // function to add tournaments;
  // removeTournament: (tourney_slot_id: number) => void;
  // updateTournament: (tourney_slot_id: number, newTournament: ITournament) => void;
}

// Tourney Teamz
export interface IZTourneyTeamzStore {
  zTourneyTeamz: ITourneyTeamTableSimpleDataArray; // The array of teams
  setZTourneyTeamz: (teams: ITourneyTeamTableSimpleDataArray) => void; // A proper setter function
  addZTourneyTeamz: (team: ITourneyTeamTableSimple) => void; // Function to add a single team
  // removeZTourneyTeam: (teamName: string) => void; // Function to remove a team by name
}

//  //  ------------------
//  //   TEAM
//  //  ------------------

export interface ITeamCreate {
  org_name: string;
  playerSelectDDL: ISelectInfoElementsArray;
}

export interface ITeamCreateProps {
  createTeamData: ITeamCreate;
}

export interface ITeamz {
  orgName: string;
  teamId: string;
}

export interface ITeamDDL {
  value: number;
  name: string;
}

// #todo remove this duplicate;
export interface ITeamDDL {
  team_id: number;
  team_name: string;
}

export interface ITeamProps {
  orgName: string;
  slug: string;
  teamId: string;
}

export interface ITeam {
  is_active: boolean;
  organization_id: number;
  player1: number;
  player2: number;
  team_color: string;
  team_id: number;
  team_name: string;
  org_name?: string;
}

// #todo rename so team is 1st word
export interface IUpdateTeamProps {
  teamData: ITeam;
}

// #todo refactor so there is only 1 interface for select with good name
export interface ITeamSelectInfo {
  value: string;
  name: string;
}

export interface ITeamFormData {
  team_name: string;
  player_1: string;
  player_2: string;
}

// ┌───────────────────────────────────────────────┐
// │ ____  __   _  _  ____  __ _  ____  _  _  ____ │
// │(_  _)/  \ / )( \(  _ \(  ( \(  __)( \/ )/ ___)│
// │  )( (  O )) \/ ( )   //    / ) _)  )  / \___ \│
// │ (__) \__/ \____/(__\_)\_)__)(____)(__/  (____/│
// └───────────────────────────────────────────────┘
// ------------------  Tournaments   ---------------

export interface Tournament1 {
  tournament_id: number;
  tournament_name: string;
  is_active: boolean;
  tournament_date: Date;
  created_date: Date;
  tournament_location_id: number;
  organization_id: number;
  tournament_style: string;
}

export interface ITournamentz {
  orgName: string;
  tournamentId: string;
  tourneyId?: string;
}

export interface ITournamentTeamzPost {
  orgName: string;
  tournamentId: string;
}

export interface ITournamentTeamId {
  teamz_id: string;
}

export interface ITournamentCreateIds {
  teamz_id: number;
}
export interface ICreateTourneyProps {
  orgData: IOrgDataDetails;
  venueOrgData: IVenueDDL;
}

export interface IUpdateTourneyTeamzProps {
  tourneyData: IUpdateTourneyTeamz;
}

export interface ITourneySlot {
  tourney_slot_team_id: number;
  tournament1_id: number;
  tourney_slot_id: number;
}

// #todo update this to singular only in the code
export interface ITourneySlots {
  tourney_slot_team_id: number;
  tournament1_id: number;
  tourney_slot_id: number;
}

export interface ITourneyTeamzTable {
  orgName: string;
  tourneyId: string;
}

export interface ITournamentData {
  is_active: boolean;
  organization_color: string;
  organization_id: number;
  organization_name: string;
  organization_owner: string;
}

export interface IUpdateTourneyTeamz {
  tourneyData: IOrganizationArray;
  teamData: ISelectInfoElementsArray;
}

export interface ITourneyTeamzTableProps {
  tourneyTeamzData: ITourneyTeamzTable;
}

export type ITournamentSlotMap = boolean;

export interface ITournamentTeam {
  created_date: Date;
  is_active: boolean;
  organization_id: number;
  player1: number;
  player2: number;
  team_color: string;
  team_id: number;
  team_name: string;
  teamz_id: string;
  tournament_id: number;
  tournament_teamz_id: number;
}

export interface ITournament {
  created_date: Date;
  is_active: boolean;
  organization_id: number;
  tournament_date: Date;
  tournament_id: number;
  tournament_location_id: number;
  tournament_name: string;
  tournament_style: string; // someday this could be an enum
  org_name?: string;
}

export interface IUpdateTournamentProps {
  tourneyData: ITournament;
}

export interface ITourneyCreate {
  // teamz_id: number;
  orgData: IOrgData;
  venueDDL: ISelectInfoElementsArray; // IVenueDDL;
}

export interface ITourneyCreateProps {
  createTourneyData: ITourneyCreate;
}

export interface ITourneyMatch {
  is_active: boolean;
  match_date_time: Date;
  match_home_team: number;
  match_number: number;
  match_venue: number;
  round: number;
  team_name: string;
  match_team_winner: number;
  tournament1_matches_id: number;
}

export interface ITournamentOrgCreateAPIResult {
  message: string;
  tournamentId: number;
}

export interface ITourneyFormData {
  tournament_name: string;
  tournament_location_id: string;
  // tournament_name: string;
}

export interface ITourneyTeamFormData {
  // tournament_id?: string;
  tournament_id?: string;
  tournament_location_id?: string;
  teamz_id: string;
  // teamz_id: string; // Ensure this is included
}

// #todo move to interfaces:
export interface ITournamentAllData {
  tournament_name: string;
  tournament_location_id: number;
  organization_id: number;
}

export interface ITourneyTeam {
  team_name: string;
  team_color?: string;
  tournament_id?: number;
  tournament_teamz_id: number; // Added
  teamz_id: number;
}

export interface ITourneyTeamTableSimple {
  team_name: string;
  team_color?: string;
  tournament_id?: number;
}

export interface ITourneyTeamTransform {
  team_name: string;
  tournament_id?: number; // Make tournament_id optional
  // color?  Other properties if any
}

export type ITournament1TeamzTransform = {
  team_name: string;
  tournament_id: number;
  tournament_teamz_id: number;
  teamz_id: number;
};

export interface ITourneyTeamzResponse {
  message: string;
  tourneyTeamCreated: ITourneyTeamTableSimple;
}

export interface ITourneyTeamzBackFromAPI {
  tournament_teamz_id: number;
  tournament_id: number;
  teamz_id: number;
  created_date: Date;
  is_active: boolean;
  team_id: number;
  player1: number;
  player2: number;
  team_name: string;
  team_color: string;
  organization_id: number;
}

export interface ITournamentTeamz {
  tournament_teamz_id: number;
  tournament_id: number;
  teamz_id: number;
  created_date: Date;
  is_active: boolean;
}
// Tournament1_Teamz?: number;

// ┌──────────────────────────────────────────────────────┐
// │ __    __    _____      __      _   __    __    _____ │
// │ ) )  ( (   / ___/     /  \    / )  ) )  ( (   / ___/ │
// │( (    ) ) ( (__      / /\ \  / /  ( (    ) ) ( (__   │
// │ \ \  / /   ) __)     ) ) ) ) ) )   ) )  ( (   ) __)  │
// │  \ \/ /   ( (       ( ( ( ( ( (   ( (    ) ) ( (     │
// │   \  /     \ \___   / /  \ \/ /    ) \__/ (   \ \___ │
// │    \/       \____\ (_/    \__/     \______/    \____\│
// └──────────────────────────────────────────────────────┘

export interface IVenue {
  created_date: Date;
  is_active: boolean;
  organization_id: number;
  updated_date: Date;
  venue_city: string;
  venue_id: number;
  venue_name: string;
  venue_state: string;
  venue_street_address: string;
  venue_zip: string;
}

export interface IVenuePostProps {
  orgName: string;
  venue_name: string;
  venue_street_address: string;
  venue_city: string;
  venue_state: string;
  venue_zip: number;
  is_active: boolean;
  organization_id: number;
}

export interface IVenuezProps {
  orgName: string;
  venueId: string;
}

// #todo update interface so venue is first word
export interface IUpdateVenueProps {
  venueDetailData: IVenue;
}

export interface IVenueProps {
  venueDetailData: IVenue;
}

export interface IVenueDDL {
  value: string;
  name: string;
}

export interface IVenueDDLArray {
  venue_id: number;
  venue_name: string;
}

export interface IVenuezFormData {
  venue_name: string;
  venue_street_address: string;
  venue_city: string;
  venue_state: string;
  venue_zip: string;
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │  ______     ______     ______         ____     _____       ______   │
// │ (____  )   (____  )   (____  )       / __ \   (_   _)     (_  __ \  │
// │     / /        / /        / /       / /  \ \    | |         ) ) \ \ │
// │ ___/ /_    ___/ /_    ___/ /_      ( ()  () )   | |        ( (   ) )│
// │/__  ___)  /__  ___)  /__  ___)     ( ()  () )   | |   __    ) )  ) )│
// │  / /____    / /____    / /____      \ \__/ /  __| |___) )  / /__/ / │
// │ (_______)  (_______)  (_______)      \____/   \________/  (______/  │
// └─────────────────────────────────────────────────────────────────────┘

// export interface playerData {
//   player_id?: string;
//   player_first_name: string;
//   player_last_name: string;
//   player_email: string;
// }
