/**
 * @catto/react-auth - Storage
 *
 * Token storage abstraction for web and mobile (Capacitor) platforms.
 */

export type { IAuthStorage } from './auth-storage.interface';
export {
  CapacitorAuthStorage,
  type CapacitorAuthStorageOptions,
} from './capacitor-auth-storage';
