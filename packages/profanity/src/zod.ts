// Zod integration helpers for profanity validation
// These are plain functions — no Zod dependency required.
//
// Usage with Zod:
//   name: z.string().min(2).refine(noProfanityCheck, noProfanityMessage('Name'))
//
// Usage with manual validation:
//   if (isProfane(value)) { setError('Field contains inappropriate language'); }

import { isProfane } from './profanity';

/**
 * Zod .refine() predicate — returns true for clean text, false for profane text.
 */
export const noProfanityCheck = (val: string) => !isProfane(val);

/**
 * Zod .refine() error message factory.
 */
export const noProfanityMessage = (fieldName: string) => ({
  error: `${fieldName} contains inappropriate language`,
});

export { isProfane };
