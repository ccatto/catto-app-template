import { censorText, isProfane, profanity } from '../profanity';

describe('profanity', () => {
  describe('isProfane()', () => {
    it('detects English profanity', () => {
      expect(isProfane('what the fuck')).toBe(true);
    });

    it('returns false for clean text', () => {
      expect(isProfane('hello world')).toBe(false);
    });

    it('returns false for whitelisted words', () => {
      expect(isProfane('arsenal')).toBe(false);
      expect(isProfane('class')).toBe(false);
      expect(isProfane('wang')).toBe(false);
      expect(isProfane('cocktail')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isProfane('')).toBe(false);
    });

    it('returns false for whitespace-only string', () => {
      expect(isProfane('   ')).toBe(false);
    });
  });

  describe('censorText()', () => {
    it('replaces profane words with censored text', () => {
      const censored = censorText('what the fuck');
      expect(censored).not.toBe('what the fuck');
      // @2toad/profanity uses @#$%&! as the default censor character
      expect(censored).toContain('@#$%&!');
    });

    it('returns clean text unchanged', () => {
      expect(censorText('hello world')).toBe('hello world');
    });

    it('returns empty string unchanged', () => {
      expect(censorText('')).toBe('');
    });
  });

  describe('profanity instance', () => {
    it('is exported and accessible', () => {
      expect(profanity).toBeDefined();
      expect(typeof profanity.exists).toBe('function');
      expect(typeof profanity.censor).toBe('function');
    });
  });
});
