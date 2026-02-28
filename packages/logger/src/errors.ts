// @catto/logger — Smart error extraction

/**
 * Result of extracting an Error from log data.
 */
export interface ExtractedError {
  /** The Error instance, if found. */
  error?: Error;
  /** Remaining data after removing the error wrapper key. */
  data: Record<string, unknown>;
}

/**
 * Extract an Error from common wrapper patterns: { error }, { err }, { e }.
 *
 * This is the main value-add over plain Pino — it normalizes the many ways
 * callers pass errors into log.error().
 */
export function extractError(
  input?: Error | Record<string, unknown>,
): ExtractedError {
  if (!input) {
    return { data: {} };
  }

  if (input instanceof Error) {
    return { error: input, data: {} };
  }

  if (typeof input === 'object') {
    const possibleError =
      (input as Record<string, unknown>).error ||
      (input as Record<string, unknown>).err ||
      (input as Record<string, unknown>).e;

    if (possibleError instanceof Error) {
      const data = { ...input };
      delete data.error;
      delete data.err;
      delete data.e;
      return { error: possibleError, data };
    }

    return { data: input as Record<string, unknown> };
  }

  return { data: {} };
}
