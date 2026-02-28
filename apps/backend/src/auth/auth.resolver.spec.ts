// apps/backend/src/auth/auth.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver, RegisterInput, LoginInput } from './auth.resolver';
import { AuthServiceNew } from './auth.service.new';
import { WebAuthnService } from './webauthn.service';
import {
  createMockAuthResponse,
  createMockRefreshTokenResponse,
  createMockForgotPasswordResponse,
  createMockResetPasswordResponse,
} from '../test/resolver-test-utils';

// Mock @nestjs/passport to avoid PassportStrategy resolution in guard imports
jest.mock('@nestjs/passport', () => ({
  AuthGuard: () =>
    class MockAuthGuard {
      canActivate() {
        return true;
      }
    },
  PassportStrategy: () => class MockStrategy {},
  PassportModule: { register: () => ({ module: class {} }) },
}));

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: jest.Mocked<AuthServiceNew>;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const mockWebAuthnService = {
      generateRegistrationOpts: jest.fn(),
      verifyRegistration: jest.fn(),
      generateAuthenticationOpts: jest.fn(),
      verifyAuthentication: jest.fn(),
      getPasskeysByUser: jest.fn().mockResolvedValue([]),
      deletePasskey: jest.fn(),
      renamePasskey: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthServiceNew, useValue: mockAuthService },
        { provide: WebAuthnService, useValue: mockWebAuthnService },
        {
          provide: 'CATTO_AUTH_PRISMA',
          useValue: { client: { user: { findUnique: jest.fn() } } },
        },
        { provide: 'CATTO_AUTH_CONFIG', useValue: { jwt: { secret: 'test' } } },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get(AuthServiceNew);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const validInput: RegisterInput = {
      email: 'newuser@example.com',
      password: 'securePassword123',
      name: 'New User',
    };

    it('should call authService.register with correct input and return auth response', async () => {
      const mockResponse = createMockAuthResponse({
        user: {
          id: 'new-user-id',
          email: validInput.email,
          name: validInput.name,
          role: 'user',
        },
      });
      authService.register.mockResolvedValue(mockResponse);

      const result = await resolver.registerUser(validInput);

      expect(authService.register).toHaveBeenCalledWith({
        email: validInput.email,
        password: validInput.password,
        name: validInput.name,
      });
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe(validInput.email);
    });

    it('should propagate error when registration fails', async () => {
      const error = new Error('Email already exists');
      authService.register.mockRejectedValue(error);

      await expect(resolver.registerUser(validInput)).rejects.toThrow(
        'Email already exists',
      );
      expect(authService.register).toHaveBeenCalledTimes(1);
    });
  });

  describe('loginUser', () => {
    const validInput: LoginInput = {
      email: 'user@example.com',
      password: 'correctPassword',
    };

    it('should call authService.login with correct credentials and return auth response', async () => {
      const mockResponse = createMockAuthResponse();
      authService.login.mockResolvedValue(mockResponse);

      const result = await resolver.loginUser(validInput);

      expect(authService.login).toHaveBeenCalledWith({
        email: validInput.email,
        password: validInput.password,
      });
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should propagate error when login fails with invalid credentials', async () => {
      const error = new Error('Invalid email or password');
      authService.login.mockRejectedValue(error);

      await expect(resolver.loginUser(validInput)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should propagate error when user not found', async () => {
      const error = new Error('User not found');
      authService.login.mockRejectedValue(error);

      await expect(resolver.loginUser(validInput)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('refreshToken', () => {
    const validRefreshToken = 'valid-refresh-token-jwt';

    it('should call authService.refreshToken and return new access token', async () => {
      const mockResponse = createMockRefreshTokenResponse();
      authService.refreshToken.mockResolvedValue(mockResponse);

      const result = await resolver.refreshToken(validRefreshToken);

      expect(authService.refreshToken).toHaveBeenCalledWith(validRefreshToken);
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.accessToken).toBeDefined();
    });

    it('should propagate error when refresh token is invalid', async () => {
      const error = new Error('Invalid refresh token');
      authService.refreshToken.mockRejectedValue(error);

      await expect(resolver.refreshToken('invalid-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should propagate error when refresh token is expired', async () => {
      const error = new Error('Refresh token expired');
      authService.refreshToken.mockRejectedValue(error);

      await expect(resolver.refreshToken('expired-token')).rejects.toThrow(
        'Refresh token expired',
      );
    });
  });

  describe('logoutUser', () => {
    const validRefreshToken = 'valid-refresh-token-jwt';

    it('should call authService.logout and return success message', async () => {
      authService.logout.mockResolvedValue(undefined);

      const result = await resolver.logoutUser(validRefreshToken);

      expect(authService.logout).toHaveBeenCalledWith(validRefreshToken);
      expect(authService.logout).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should return success message even if token was already invalidated', async () => {
      // Logout is typically idempotent
      authService.logout.mockResolvedValue(undefined);

      const result = await resolver.logoutUser('already-invalidated-token');

      expect(result.message).toBe('Logged out successfully');
    });

    it('should propagate error if logout fails', async () => {
      const error = new Error('Logout failed');
      authService.logout.mockRejectedValue(error);

      await expect(resolver.logoutUser(validRefreshToken)).rejects.toThrow(
        'Logout failed',
      );
    });
  });

  describe('forgotPassword', () => {
    const validEmail = 'user@example.com';

    it('should call authService.forgotPassword and return response with reset token', async () => {
      const mockResponse = createMockForgotPasswordResponse();
      authService.forgotPassword.mockResolvedValue(mockResponse);

      const result = await resolver.forgotPassword(validEmail);

      expect(authService.forgotPassword).toHaveBeenCalledWith(validEmail);
      expect(authService.forgotPassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.message).toBeDefined();
    });

    it('should return same response structure even if email does not exist (security)', async () => {
      // For security, forgot password should not reveal if email exists
      const mockResponse = createMockForgotPasswordResponse({
        resetToken: undefined, // No token if email doesn't exist
      });
      authService.forgotPassword.mockResolvedValue(mockResponse);

      const result = await resolver.forgotPassword('nonexistent@example.com');

      expect(result.message).toBeDefined();
      // Response structure should be the same to prevent email enumeration
    });

    it('should propagate error if service fails', async () => {
      const error = new Error('Email service unavailable');
      authService.forgotPassword.mockRejectedValue(error);

      await expect(resolver.forgotPassword(validEmail)).rejects.toThrow(
        'Email service unavailable',
      );
    });
  });

  describe('resetPassword', () => {
    const validResetToken = 'valid-reset-token';
    const newPassword = 'newSecurePassword123';

    it('should call authService.resetPassword and return success response', async () => {
      const mockResponse = createMockResetPasswordResponse();
      authService.resetPassword.mockResolvedValue(mockResponse);

      const result = await resolver.resetPassword(validResetToken, newPassword);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        validResetToken,
        newPassword,
      );
      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.message).toBe('Password has been reset successfully');
    });

    it('should propagate error when reset token is invalid', async () => {
      const error = new Error('Invalid or expired reset token');
      authService.resetPassword.mockRejectedValue(error);

      await expect(
        resolver.resetPassword('invalid-token', newPassword),
      ).rejects.toThrow('Invalid or expired reset token');
    });

    it('should propagate error when reset token is expired', async () => {
      const error = new Error('Reset token has expired');
      authService.resetPassword.mockRejectedValue(error);

      await expect(
        resolver.resetPassword('expired-token', newPassword),
      ).rejects.toThrow('Reset token has expired');
    });

    it('should propagate error for weak password', async () => {
      const error = new Error('Password does not meet requirements');
      authService.resetPassword.mockRejectedValue(error);

      await expect(
        resolver.resetPassword(validResetToken, 'weak'),
      ).rejects.toThrow('Password does not meet requirements');
    });
  });
});
