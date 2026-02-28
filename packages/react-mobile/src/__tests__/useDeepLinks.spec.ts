import { Capacitor } from '@capacitor/core';
import { renderHook } from '@testing-library/react';
import { parseDeepLink, useDeepLinks } from '../hooks/useDeepLinks';

describe('parseDeepLink', () => {
  it('should parse custom scheme URL', () => {
    const result = parseDeepLink('myapp://org/my-league', {
      scheme: 'myapp',
    });

    expect(result.path).toBe('/org/my-league');
    expect(result.url).toBe('myapp://org/my-league');
  });

  it('should parse universal link URL', () => {
    const result = parseDeepLink('https://www.myapp.com/org/my-league', {
      domains: ['myapp.com'],
    });

    expect(result.path).toBe('/org/my-league');
  });

  it('should parse URL with query parameters', () => {
    const result = parseDeepLink('myapp://path?foo=bar&baz=qux', {
      scheme: 'myapp',
    });

    expect(result.path).toBe('/path');
    expect(result.params.get('foo')).toBe('bar');
    expect(result.params.get('baz')).toBe('qux');
  });

  it('should handle default config (scheme=app)', () => {
    const result = parseDeepLink('app://some/path');

    expect(result.path).toBe('/some/path');
  });

  it('should ensure path starts with /', () => {
    const result = parseDeepLink('myapp://path', { scheme: 'myapp' });

    expect(result.path).toBe('/path');
  });

  it('should handle URL without www prefix', () => {
    const result = parseDeepLink('https://myapp.com/org/league', {
      domains: ['myapp.com'],
    });

    expect(result.path).toBe('/org/league');
  });
});

describe('useDeepLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not register listeners on web', () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    const { App } = vi.mocked(require('@capacitor/app'));

    renderHook(() => useDeepLinks({ onDeepLink: vi.fn() }));

    expect(App.addListener).not.toHaveBeenCalled();
  });
});
