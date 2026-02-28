import { describe, expect, it } from 'vitest';
import { extractError } from '../errors';

describe('extractError', () => {
  it('returns empty data when input is undefined', () => {
    const result = extractError(undefined);
    expect(result.error).toBeUndefined();
    expect(result.data).toEqual({});
  });

  it('extracts a direct Error instance', () => {
    const err = new Error('direct error');
    const result = extractError(err);
    expect(result.error).toBe(err);
    expect(result.data).toEqual({});
  });

  it('extracts Error from { error } wrapper', () => {
    const err = new Error('wrapped in error');
    const result = extractError({ error: err, context: 'test' });
    expect(result.error).toBe(err);
    expect(result.data).toEqual({ context: 'test' });
    expect(result.data).not.toHaveProperty('error');
  });

  it('extracts Error from { err } wrapper', () => {
    const err = new Error('wrapped in err');
    const result = extractError({ err, requestId: '123' });
    expect(result.error).toBe(err);
    expect(result.data).toEqual({ requestId: '123' });
    expect(result.data).not.toHaveProperty('err');
  });

  it('extracts Error from { e } wrapper', () => {
    const err = new Error('wrapped in e');
    const result = extractError({ e: err });
    expect(result.error).toBe(err);
    expect(result.data).toEqual({});
  });

  it('returns data as-is when no Error is found in object', () => {
    const data = { message: 'not an error', code: 42 };
    const result = extractError(data);
    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(data);
  });

  it('does not extract non-Error values from wrapper keys', () => {
    const data = { error: 'string error', code: 42 };
    const result = extractError(data);
    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(data);
  });

  it('prefers { error } over { err } when both exist', () => {
    const err1 = new Error('from error');
    const err2 = new Error('from err');
    const result = extractError({ error: err1, err: err2 });
    expect(result.error).toBe(err1);
  });
});
