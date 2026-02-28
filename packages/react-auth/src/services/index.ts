/**
 * @catto/react-auth - Services
 *
 * Platform-agnostic auth services with pluggable API and storage layers.
 */

export { JwtAuthService } from './jwt-auth.service';
export type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  LoginResponse,
} from './jwt-auth.service';

export type {
  IAuthApiService,
  IAuthLogger,
  PasskeyAuthenticationOptions,
  SendOtpResponse,
  VerifyOtpResponse,
  VerifyOtpSuccess,
  VerifyOtpFailure,
} from './auth-api.interface';
