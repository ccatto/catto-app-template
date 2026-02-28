import { describe, expect, it } from 'vitest';
import { createContactSchema } from '../schema/contactSchema';

describe('createContactSchema', () => {
  const schema = createContactSchema();

  describe('default configuration', () => {
    it('accepts valid contact data with all fields', () => {
      const result = schema.safeParse({
        senderName: 'John Doe',
        senderEmail: 'john@example.com',
        senderPhone: '+1 (555) 123-4567',
        subject: 'Hello there',
        message: 'This is a test message that is long enough.',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid data with optional fields empty', () => {
      const result = schema.safeParse({
        senderName: 'Jane',
        senderEmail: '',
        senderPhone: '',
        subject: 'Question',
        message: 'I have a question about the service.',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid data with optional fields omitted', () => {
      const result = schema.safeParse({
        senderName: 'Jane',
        subject: 'Question',
        message: 'I have a question about the service.',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('required field validation', () => {
    it('rejects when senderName is too short', () => {
      const result = schema.safeParse({
        senderName: 'J',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
    });

    it('rejects when subject is too short', () => {
      const result = schema.safeParse({
        senderName: 'John',
        subject: 'Hi',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
    });

    it('rejects when message is too short', () => {
      const result = schema.safeParse({
        senderName: 'John',
        subject: 'Hello',
        message: 'Short',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('email validation', () => {
    it('rejects invalid email format', () => {
      const result = schema.safeParse({
        senderName: 'John',
        senderEmail: 'not-an-email',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('phone validation', () => {
    it('accepts valid phone formats', () => {
      const validPhones = [
        '+1 555-123-4567',
        '(555) 123-4567',
        '5551234567',
        '+44 20 7946 0958',
      ];
      for (const phone of validPhones) {
        const result = schema.safeParse({
          senderName: 'John',
          senderPhone: phone,
          subject: 'Hello',
          message: 'This is long enough for a message.',
        });
        expect(result.success, `Expected "${phone}" to be valid`).toBe(true);
      }
    });

    it('rejects invalid phone format', () => {
      const result = schema.safeParse({
        senderName: 'John',
        senderPhone: 'call me maybe',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('custom configuration', () => {
    it('applies custom min/max lengths', () => {
      const customSchema = createContactSchema({
        fields: {
          senderName: { minLength: 5, maxLength: 10 },
        },
      });

      // Too short
      const short = customSchema.safeParse({
        senderName: 'Jon',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(short.success).toBe(false);

      // Just right
      const ok = customSchema.safeParse({
        senderName: 'Jonathan',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(ok.success).toBe(true);
    });

    it('can disable a field entirely', () => {
      const noPhoneSchema = createContactSchema({
        fields: {
          senderPhone: { enabled: false },
        },
      });

      const result = noPhoneSchema.safeParse({
        senderName: 'John',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(true);
    });

    it('can make email required', () => {
      const requiredEmailSchema = createContactSchema({
        fields: {
          senderEmail: { required: true },
        },
      });

      // Missing email should fail
      const result = requiredEmailSchema.safeParse({
        senderName: 'John',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
    });

    it('uses custom error messages', () => {
      const customSchema = createContactSchema({
        fields: {
          senderName: {
            minLength: 2,
            messages: { min: 'Name is way too short!' },
          },
        },
      });

      const result = customSchema.safeParse({
        senderName: 'J',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (i) => i.path[0] === 'senderName',
        );
        expect(nameError?.message).toBe('Name is way too short!');
      }
    });
  });

  describe('profanity checking', () => {
    it('rejects profane text when checker is provided', () => {
      const badWords = ['badword', 'offensive'];
      const profanitySchema = createContactSchema({
        profanityChecker: (text) =>
          badWords.some((w) => text.toLowerCase().includes(w)),
      });

      const result = profanitySchema.safeParse({
        senderName: 'Mr Badword',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
    });

    it('allows text when no profanity checker is provided', () => {
      // Default schema has no profanityChecker, so profanityCheck flags are ignored
      const result = schema.safeParse({
        senderName: 'Mr Badword',
        subject: 'Hello',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(true);
    });

    it('uses custom profanity message', () => {
      const profanitySchema = createContactSchema({
        profanityChecker: () => true, // Everything is profane
        profanityMessage: (field) => `${field} is not allowed!`,
      });

      const result = profanitySchema.safeParse({
        senderName: 'Anything',
        subject: 'Anything',
        message: 'This is long enough for a message.',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (i) => i.path[0] === 'senderName',
        );
        expect(nameError?.message).toBe('Name is not allowed!');
      }
    });
  });
});
