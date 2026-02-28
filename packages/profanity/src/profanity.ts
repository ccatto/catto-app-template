// Shared profanity filter utility using @2toad/profanity
// Supports 12 languages: Arabic, Chinese, English, French, German, Hindi,
// Italian, Japanese, Korean, Portuguese, Russian, Spanish

import { Profanity, ProfanityOptions } from '@2toad/profanity';

const profanity = new Profanity({
  languages: [
    'en',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'ar',
    'zh',
    'hi',
    'ja',
    'ko',
    'ru',
  ],
  wholeWord: true,
} as ProfanityOptions);

// Whitelist common false positives (Scunthorpe problem)
profanity.whitelist.addWords([
  'arsenal',
  'class',
  'bass',
  'assassin',
  'cockatoo',
  'scunthorpe',
  'penistone',
  'cocktail',
  'buttress',
  'classic',
  'passage',
  'assume',
  // Common surnames that trigger false positives
  'wang', // Chinese surname 王
  'dong', // Chinese surname 董
  'ho', // Chinese/Vietnamese surname
  'cox', // English surname
  'dick', // English surname (Richard)
  'hancock', // English surname
  'cummings', // English surname
]);

/**
 * Check if text contains profanity in any supported language.
 */
export function isProfane(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return profanity.exists(text);
}

/**
 * Censor profane words in text, replacing them with asterisks.
 */
export function censorText(text: string): string {
  if (!text || text.trim().length === 0) return text;
  return profanity.censor(text);
}

export { profanity };
