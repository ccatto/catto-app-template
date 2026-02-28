import { censorText, isProfane, profanity } from '../profanity';

describe('isProfane', () => {
  it('should detect English profanity', () => {
    expect(isProfane('what the fuck')).toBe(true);
  });

  it('should return false for clean text', () => {
    expect(isProfane('hello world')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isProfane('')).toBe(false);
  });

  it('should return false for whitespace-only string', () => {
    expect(isProfane('   ')).toBe(false);
  });

  it('should not flag whitelisted words (Scunthorpe problem)', () => {
    expect(isProfane('arsenal')).toBe(false);
    expect(isProfane('class')).toBe(false);
    expect(isProfane('cocktail')).toBe(false);
    expect(isProfane('classic')).toBe(false);
    expect(isProfane('assume')).toBe(false);
  });

  it('should not flag whitelisted surnames', () => {
    expect(isProfane('wang')).toBe(false);
    expect(isProfane('dong')).toBe(false);
    expect(isProfane('cox')).toBe(false);
    expect(isProfane('hancock')).toBe(false);
    expect(isProfane('cummings')).toBe(false);
  });
});

describe('censorText', () => {
  it('should censor profane words', () => {
    const result = censorText('what the fuck');
    expect(result).not.toBe('what the fuck');
    expect(result).toContain('@#$%&!');
  });

  it('should return clean text unchanged', () => {
    expect(censorText('hello world')).toBe('hello world');
  });

  it('should return empty string unchanged', () => {
    expect(censorText('')).toBe('');
  });

  it('should return whitespace-only string unchanged', () => {
    expect(censorText('   ')).toBe('   ');
  });
});

describe('profanity instance', () => {
  it('should be exported', () => {
    expect(profanity).toBeDefined();
    expect(typeof profanity.exists).toBe('function');
    expect(typeof profanity.censor).toBe('function');
  });

  it('should have whitelist configured', () => {
    expect(profanity.whitelist).toBeDefined();
  });
});
