/**
 * @catto/react-auth - Auth API Interface
 *
 * Abstract interface for auth API calls. Apps provide their own
 * implementation (e.g., GraphQL, REST, etc.).
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  playerID?: number;
  organizationId?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface PasskeyAuthenticationOptions {
  options: string;
  sessionId: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresIn: number;
}

export interface VerifyOtpSuccess {
  success: true;
  message: string;
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean;
  userId?: string;
}

export interface VerifyOtpFailure {
  success: false;
  message: string;
}

export type VerifyOtpResponse = VerifyOtpSuccess | VerifyOtpFailure;

/**
 * Auth API service interface.
 * Implement this with your API layer (GraphQL, REST, etc.).
 */
export interface IAuthApiService {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  register(data: RegisterData): Promise<LoginResponse>;
  logout(refreshToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  forgotPassword?(
    email: string,
  ): Promise<{ message: string; resetToken?: string }>;
  resetPassword?(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }>;
  sendPhoneOtp?(phoneNumber: string): Promise<SendOtpResponse>;
  verifyPhoneOtp?(
    phoneNumber: string,
    code: string,
  ): Promise<VerifyOtpResponse>;
  generatePasskeyAuthenticationOptions?(
    email?: string,
  ): Promise<PasskeyAuthenticationOptions>;
  verifyPasskeyAuthentication?(
    sessionId: string,
    response: string,
  ): Promise<LoginResponse>;
}

/**
 * Optional logger interface for auth services.
 * Implement with your logging framework (Pino, Winston, console, etc.).
 */
export interface IAuthLogger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
}
