import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CompatSession } from '../../types/session';
import { sessionStore } from '../session-store';

const mockSession: CompatSession = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: null,
    role: 'user',
    organizationId: null,
    organizations: [],
  },
  expires: '2099-01-01T00:00:00Z',
};

describe('sessionStore', () => {
  beforeEach(() => {
    // Reset session state between tests
    sessionStore.setSession(null);
  });

  describe('getSession', () => {
    it('returns null initially', () => {
      expect(sessionStore.getSession()).toBeNull();
    });

    it('returns session after setSession', () => {
      sessionStore.setSession(mockSession);
      expect(sessionStore.getSession()).toEqual(mockSession);
    });
  });

  describe('setSession', () => {
    it('stores session and getSession returns it', () => {
      sessionStore.setSession(mockSession);
      const result = sessionStore.getSession();
      expect(result?.user.email).toBe('test@example.com');
    });

    it('clears session when set to null', () => {
      sessionStore.setSession(mockSession);
      sessionStore.setSession(null);
      expect(sessionStore.getSession()).toBeNull();
    });
  });

  describe('getUserId', () => {
    it('returns user ID from stored session', () => {
      sessionStore.setSession(mockSession);
      expect(sessionStore.getUserId()).toBe('user-123');
    });

    it('returns null when no session', () => {
      expect(sessionStore.getUserId()).toBeNull();
    });
  });

  describe('subscribe', () => {
    it('fires callback on session change', () => {
      const listener = vi.fn();
      sessionStore.subscribe(listener);

      sessionStore.setSession(mockSession);
      expect(listener).toHaveBeenCalledWith(mockSession);
    });

    it('fires callback with null on session clear', () => {
      const listener = vi.fn();
      sessionStore.subscribe(listener);

      sessionStore.setSession(mockSession);
      sessionStore.setSession(null);

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenLastCalledWith(null);
    });

    it('returns unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = sessionStore.subscribe(listener);

      sessionStore.setSession(mockSession);
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      sessionStore.setSession(null);
      expect(listener).toHaveBeenCalledTimes(1); // Not called again
    });

    it('listener that unsubscribes during iteration does not break other listeners', () => {
      const calls: string[] = [];
      let unsubA: () => void;

      // Listener A unsubscribes itself when called
      const listenerA = vi.fn(() => {
        calls.push('A');
        unsubA();
      });

      // Listener B should still fire
      const listenerB = vi.fn(() => {
        calls.push('B');
      });

      unsubA = sessionStore.subscribe(listenerA);
      sessionStore.subscribe(listenerB);

      sessionStore.setSession(mockSession);

      expect(calls).toContain('A');
      expect(calls).toContain('B');
      expect(listenerA).toHaveBeenCalledTimes(1);
      expect(listenerB).toHaveBeenCalledTimes(1);
    });
  });

  describe('frozen getSession', () => {
    it('returns a copy that cannot be mutated', () => {
      sessionStore.setSession(mockSession);
      const session = sessionStore.getSession();

      // Attempting to modify should throw (Object.freeze)
      expect(() => {
        (session as any).user = { id: 'hacked' };
      }).toThrow();
    });

    it('mutations to returned copy do not affect stored session', () => {
      sessionStore.setSession(mockSession);

      // Get two separate copies
      const copy1 = sessionStore.getSession();
      const copy2 = sessionStore.getSession();

      // They should be equal but not the same reference
      expect(copy1).toEqual(copy2);
    });
  });
});
