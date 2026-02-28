import { isProfane, noProfanityCheck, noProfanityMessage } from '../zod';

describe('noProfanityCheck', () => {
  it('should return true for clean text', () => {
    expect(noProfanityCheck('hello world')).toBe(true);
  });

  it('should return false for profane text', () => {
    expect(noProfanityCheck('what the fuck')).toBe(false);
  });

  it('should return true for empty string', () => {
    expect(noProfanityCheck('')).toBe(true);
  });
});

describe('noProfanityMessage', () => {
  it('should return error message with field name', () => {
    const result = noProfanityMessage('Name');
    expect(result).toEqual({ error: 'Name contains inappropriate language' });
  });

  it('should work with different field names', () => {
    expect(noProfanityMessage('Subject')).toEqual({
      error: 'Subject contains inappropriate language',
    });
    expect(noProfanityMessage('Message')).toEqual({
      error: 'Message contains inappropriate language',
    });
  });
});

describe('re-exported isProfane', () => {
  it('should be the same function as from profanity module', () => {
    expect(typeof isProfane).toBe('function');
    expect(isProfane('hello')).toBe(false);
  });
});
