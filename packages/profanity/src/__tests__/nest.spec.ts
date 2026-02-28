import 'reflect-metadata';
import { validate } from 'class-validator';
import { NoProfanity } from '../nest';

class TestDto {
  @NoProfanity()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

describe('@NoProfanity() decorator', () => {
  it('should pass validation for clean text', async () => {
    const dto = new TestDto('John Doe');
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation for profane text', async () => {
    const dto = new TestDto('what the fuck');
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toBeDefined();
    const message = Object.values(errors[0].constraints!)[0];
    expect(message).toContain('contains inappropriate language');
  });

  it('should pass validation for non-string values', async () => {
    const dto = new TestDto(undefined as any);
    const errors = await validate(dto);
    // @NoProfanity only validates strings, non-string values pass
    const profanityErrors = errors.filter(
      (e) => e.constraints && 'noProfanity' in e.constraints,
    );
    expect(profanityErrors).toHaveLength(0);
  });

  it('should pass validation for whitelisted words', async () => {
    const dto = new TestDto('arsenal');
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept custom validation options', () => {
    class CustomDto {
      @NoProfanity({ message: 'Custom error message' })
      field: string;

      constructor(field: string) {
        this.field = field;
      }
    }

    expect(new CustomDto('test')).toBeDefined();
  });

  it('should use custom error message when provided', async () => {
    class CustomDto {
      @NoProfanity({ message: 'No bad words allowed!' })
      field: string;

      constructor(field: string) {
        this.field = field;
      }
    }

    const dto = new CustomDto('what the fuck');
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const message = Object.values(errors[0].constraints!)[0];
    expect(message).toBe('No bad words allowed!');
  });
});
