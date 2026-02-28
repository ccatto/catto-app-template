// apps/backend/src/auth/auth.service.spec.ts
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '@src/modules/users/users.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
    role: 'user',
  };

  beforeEach(async () => {
    const mockUsersService = {
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      });
      expect(usersService.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should return null when user is not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });

    it('should handle user with null name', async () => {
      const userWithNullName = { ...mockUser, name: null };
      usersService.findOne.mockResolvedValue(userWithNullName as any);

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: null,
        role: 'user',
      });
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginUser = {
        username: 'test@example.com',
        userId: 'user-123',
      };

      const result = await authService.login(loginUser);

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'test@example.com',
        sub: 'user-123',
      });
    });

    it('should include correct payload in JWT', async () => {
      const loginUser = {
        username: 'admin@example.com',
        userId: 'admin-456',
      };

      await authService.login(loginUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'admin@example.com',
        sub: 'admin-456',
      });
    });
  });
});
