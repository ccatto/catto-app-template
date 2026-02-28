/**
 * @catto/nest-auth - WebAuthn DTOs
 *
 * Data transfer objects for WebAuthn/Passkey operations.
 */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// --- Registration ---

@ObjectType()
export class PasskeyRegistrationOptionsResponse {
  @Field()
  options: string; // JSON-stringified PublicKeyCredentialCreationOptionsJSON
}

@InputType()
export class VerifyPasskeyRegistrationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  response: string; // JSON-stringified RegistrationResponseJSON

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  friendlyName?: string;
}

@ObjectType()
export class PasskeyRegistrationResult {
  @Field()
  success: boolean;

  @Field()
  id: string;

  @Field({ nullable: true })
  friendlyName?: string;
}

// --- Authentication ---

@ObjectType()
export class PasskeyAuthenticationOptionsResponse {
  @Field()
  options: string; // JSON-stringified PublicKeyCredentialRequestOptionsJSON

  @Field()
  sessionId: string;
}

@InputType()
export class VerifyPasskeyAuthenticationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  response: string; // JSON-stringified AuthenticationResponseJSON
}

// --- Management ---

@ObjectType()
export class PasskeyInfo {
  @Field()
  id: string;

  @Field({ nullable: true })
  friendlyName?: string;

  @Field()
  deviceType: string;

  @Field()
  backedUp: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  lastUsedAt?: Date;
}

@ObjectType()
export class PasskeyOperationResult {
  @Field()
  success: boolean;
}
