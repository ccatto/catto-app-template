// NestJS class-validator decorator for profanity checking
// Requires class-validator as a peer dependency.
//
// Usage on DTOs:
//   @Field()
//   @IsString()
//   @NoProfanity()
//   name: string;

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isProfane } from './profanity';

export function NoProfanity(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'noProfanity',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} contains inappropriate language`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          if (typeof value !== 'string') return true;
          return !isProfane(value);
        },
      },
    });
  };
}
