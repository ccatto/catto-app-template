/**
 * @catto/react-auth - Session Store
 *
 * Synchronous session state store for sharing auth session with Apollo Client.
 * Avoids network calls in Apollo's authLink.
 *
 * @example
 * // Write (from SessionSync component in React tree)
 * sessionStore.setSession(session);
 *
 * // Read (from Apollo authLink — synchronous, no network call)
 * const session = sessionStore.getSession();
 */

import type { CompatSession } from '../types/session';

let currentSession: CompatSession | null = null;
const listeners: Set<(session: CompatSession | null) => void> = new Set();

export const sessionStore = {
  /** Get the current session (synchronous, no network call) */
  getSession(): CompatSession | null {
    return currentSession ? Object.freeze({ ...currentSession }) : null;
  },

  /** Update the session (called by SessionSync component) */
  setSession(session: CompatSession | null): void {
    currentSession = session;
    const snapshot = [...listeners];
    snapshot.forEach((listener) => listener(session));
  },

  /** Subscribe to session changes */
  subscribe(listener: (session: CompatSession | null) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Get the user ID from the current session (convenience method) */
  getUserId(): string | null {
    return currentSession?.user?.id ?? null;
  },
};
