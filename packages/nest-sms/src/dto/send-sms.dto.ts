import {
  IsString,
  IsNotEmpty,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum SmsProvider {
  TELNYX = 'telnyx',
}

export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +1234567890)',
  })
  to: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(SmsProvider)
  @IsOptional()
  provider?: SmsProvider = SmsProvider.TELNYX;
}

export class SmsResponseDto {
  success: boolean;
  messageId?: string;
  provider: SmsProvider;
  error?: string;
}
