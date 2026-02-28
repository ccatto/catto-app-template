/**
 * @catto/react-auth - Auth Storage Interface
 *
 * Platform-agnostic interface for auth token storage.
 * Implementations handle platform-specific storage (web vs mobile).
 */
export interface IAuthStorage {
  /** Store access token */
  setAccessToken(token: string): Promise<void>;

  /** Retrieve access token */
  getAccessToken(): Promise<string | null>;

  /** Store refresh token */
  setRefreshToken(token: string): Promise<void>;

  /** Retrieve refresh token */
  getRefreshToken(): Promise<string | null>;

  /** Remove all tokens (logout) */
  clearTokens(): Promise<void>;

  /** Check if user has valid tokens */
  hasTokens(): Promise<boolean>;
}
