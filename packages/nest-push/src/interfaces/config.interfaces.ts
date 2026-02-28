export interface CattoPushConfig {
  /** JSON string of Firebase service account credentials. Undefined = push disabled. */
  firebaseServiceAccountJson?: string;
  /** Force disable push notifications */
  disabled?: boolean;
}
