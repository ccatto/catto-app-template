// apps/backend/src/auth/auth.service.new.ts
import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { ProfileLinkingService } from '@src/modules/players/services/profile-linking.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
  JwtPayload,
  AuthUser,
  ValidatedUser,
} from './interfaces/auth.interfaces';
import { generateRandomPlayerName } from '../common/utils/name-generator.utils';

// Re-export for backward compatibility
export { JwtPayload };

// Default user to auto-follow on registration (creator/platform admin)
const DEFAULT_FOLLOW_EMAIL = 'chriscatto3@gmail.com';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LinkedProfileInfo {
  playerId: number;
  name: string;
  linkedMethod: string;
}

export interface LoginResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    playerID?: number;
    organizationId?: string | null;
  };
  linkedProfileCount?: number;
  linkedProfiles?: LinkedProfileInfo[];
}

@Injectable()
export class AuthServiceNew {
  private readonly logger = new Logger(AuthServiceNew.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private profileLinkingService: ProfileLinkingService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    const { email, password, name, phoneNumber } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse name into first and last name for Player record
    const nameParts = (name || '').trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user and player record in a transaction
    const [user, player] = await this.prisma.client.$transaction(async (tx) => {
      // Create user (with optional phone number)
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role: 'user', // Default role
          phoneNumber: phoneNumber || null,
        },
      });

      // Create player record linked by email
      const newPlayer = await tx.player.create({
        data: {
          player_email: email.toLowerCase(),
          player_first_name: firstName,
          player_last_name: lastName,
          is_active: true,
          organization_id: '', // Default - assigned when player joins an org
          player_phone: phoneNumber || null,
        },
      });

      return [newUser, newPlayer];
    });

    // Auto-follow the default user (Chris Catto) for onboarding
    await this.autoFollowDefaultUser(user.id);

    // Auto-link any existing player profiles that match email, phone, or name
    const linkedProfiles =
      await this.profileLinkingService.autoLinkOnRegistration(
        user.id,
        email,
        phoneNumber,
        name,
      );

    // Generate tokens with playerID
    const userWithPlayer = { ...user, playerID: player.player_id };
    const tokens = await this.generateTokens(userWithPlayer);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        playerID: player.player_id,
        organizationId: null, // New user has no org yet
      },
      linkedProfileCount: linkedProfiles.length,
      linkedProfiles: linkedProfiles.map((p) => ({
        playerId: p.playerId,
        name: p.name,
        linkedMethod: p.linkedMethod,
      })),
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.client.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          take: 1,
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has a password (social login users might not)
    if (!user.password) {
      throw new UnauthorizedException(
        'Please use social login for this account',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Look up player by email to get playerID
    const player = await this.prisma.client.player.findFirst({
      where: { player_email: email.toLowerCase() },
      select: { player_id: true },
    });

    // Generate tokens with playerID
    const userWithPlayer = { ...user, playerID: player?.player_id };
    const tokens = await this.generateTokens(userWithPlayer);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        playerID: player?.player_id,
        organizationId: user.memberships[0]?.organizationId || null,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      // Get user
      const user = await this.prisma.client.user.findUnique({
        where: { id: payload.sub },
        include: {
          memberships: {
            take: 1,
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Look up player by email to get playerID
      const player = await this.prisma.client.player.findFirst({
        where: { player_email: user.email.toLowerCase() },
        select: { player_id: true },
      });

      // Generate new access token with playerID
      const userWithPlayer = { ...user, playerID: player?.player_id };
      const accessToken = await this.generateAccessToken(userWithPlayer);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout (for now just validates token - could add to blacklist later)
   */
  async logout(refreshToken: string): Promise<void> {
    // TODO: Add refresh token to blacklist/database for invalidation
    // For now, just verify it's valid
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });
    } catch {
      // Token is already invalid, that's fine
    }
  }

  /**
   * Find user by ID (used for OAuth users who may not have email in token)
   */
  async findUserById(userId: string) {
    return this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
  }

  /**
   * Validate user by JWT payload (used by JwtStrategy)
   */
  async validateUser(payload: JwtPayload): Promise<ValidatedUser> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Generate both access and refresh tokens
   */
  private async generateTokens(user: AuthUser): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name || null,
      role: user.role,
      playerID: user.playerID || undefined,
      organizationId: user.organizationMembers?.[0]?.organizationId || null,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // Short-lived access token
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: '7d', // Long-lived refresh token
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate only access token (for refresh)
   */
  private async generateAccessToken(user: AuthUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name || null,
      role: user.role,
      playerID: user.playerID || undefined,
      organizationId: user.organizationMembers?.[0]?.organizationId || null,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  /**
   * Request password reset - generates a reset token
   * In production, this would send an email with the token
   * For now, returns the token directly (useful for mobile/testing)
   */
  async forgotPassword(
    email: string,
  ): Promise<{ message: string; resetToken?: string }> {
    const user = await this.prisma.client.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists - security best practice
      // But return a flag so frontend knows to show appropriate message
      throw new NotFoundException(
        'If this email exists, a reset link has been sent',
      );
    }

    // Generate a password reset token (short-lived)
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password-reset' },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h', // Reset token valid for 1 hour
      },
    );

    // TODO: In production, send email with reset link instead of returning token
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Password reset token generated',
      resetToken, // In production, remove this and send via email
    };
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      // Verify the reset token
      const payload = this.jwtService.verify(resetToken, {
        secret: process.env.JWT_SECRET,
      });

      // Ensure it's a password reset token
      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Invalid reset token');
      }

      // Find the user
      const user = await this.prisma.client.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.prisma.client.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  /**
   * Login or register user by verified phone number
   * Called after OTP verification succeeds
   */
  async loginByPhone(
    phoneNumber: string,
  ): Promise<LoginResponse & { isNewUser: boolean }> {
    // Check if user exists with this phone number
    let user = await this.prisma.client.user.findUnique({
      where: { phoneNumber },
      include: {
        memberships: {
          take: 1,
          select: {
            organizationId: true,
          },
        },
      },
    });

    let isNewUser = false;
    let linkedProfiles: LinkedProfileInfo[] = [];

    if (!user) {
      // Create new user with phone number (no email required)
      isNewUser = true;

      // Create user and player in a transaction
      const [newUser, player] = await this.prisma.client.$transaction(
        async (tx) => {
          // Create user with phone number
          const createdUser = await tx.user.create({
            data: {
              email: `${phoneNumber.replace(/\D/g, '')}@phone.app.local`, // Placeholder email
              phoneNumber,
              name: null, // Will be updated later
              role: 'user',
              smsConsentGiven: true,
              smsConsentTimestamp: new Date(),
            },
          });

          // Create placeholder player record with fun random name
          const randomName = generateRandomPlayerName();
          const createdPlayer = await tx.player.create({
            data: {
              player_email: createdUser.email,
              player_phone: phoneNumber,
              player_first_name: randomName.firstName,
              player_last_name: randomName.lastName,
              is_active: true,
              organization_id: '',
              user_id: createdUser.id,
              linked_at: new Date(),
              linked_method: 'auto_phone',
            },
          });

          return [createdUser, createdPlayer];
        },
      );

      user = { ...newUser, memberships: [] };

      // Auto-follow the default user (Chris Catto) for onboarding
      await this.autoFollowDefaultUser(user.id);

      // Auto-link any existing player profiles that match this phone
      linkedProfiles = await this.profileLinkingService.autoLinkOnRegistration(
        user.id,
        null, // no email
        phoneNumber,
        null, // no name yet
      );
    }

    // Look up player by phone to get playerID
    const player = await this.prisma.client.player.findFirst({
      where: {
        OR: [{ player_phone: phoneNumber }, { user_id: user.id }],
      },
      select: { player_id: true },
    });

    // Generate tokens
    const userWithPlayer = { ...user, playerID: player?.player_id };
    const tokens = await this.generateTokens(userWithPlayer);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        playerID: player?.player_id,
        organizationId: user.memberships[0]?.organizationId || null,
      },
      isNewUser,
      linkedProfileCount: linkedProfiles.length,
      linkedProfiles,
    };
  }

  /**
   * Login user by verified passkey (WebAuthn)
   * Called after passkey verification succeeds
   */
  async loginByPasskey(userId: string): Promise<LoginResponse> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          take: 1,
          select: { organizationId: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const player = await this.prisma.client.player.findFirst({
      where: { user_id: userId },
      select: { player_id: true },
    });

    const userWithPlayer = { ...user, playerID: player?.player_id };
    const tokens = await this.generateTokens(userWithPlayer);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        playerID: player?.player_id,
        organizationId: user.memberships[0]?.organizationId || null,
      },
    };
  }

  /**
   * Auto-follow the default user (Chris Catto) for new registrations.
   * Gives new users social content on first login (non-empty feed).
   * Uses upsert for idempotency — safe to call multiple times.
   * Silently fails if the default user doesn't exist (e.g., fresh dev DB).
   */
  private async autoFollowDefaultUser(newUserId: string): Promise<void> {
    try {
      const defaultUser = await this.prisma.client.user.findFirst({
        where: { email: { equals: DEFAULT_FOLLOW_EMAIL, mode: 'insensitive' } },
        select: { id: true },
      });

      if (!defaultUser || defaultUser.id === newUserId) return;

      await this.prisma.client.userFollow.upsert({
        where: {
          followerId_followingId: {
            followerId: newUserId,
            followingId: defaultUser.id,
          },
        },
        update: {},
        create: {
          followerId: newUserId,
          followingId: defaultUser.id,
        },
      });

      this.logger.log(`Auto-followed default user for new registration`, {
        newUserId,
        defaultUserId: defaultUser.id,
      });
    } catch (error) {
      // Non-critical — don't block registration if auto-follow fails
      this.logger.warn(`Failed to auto-follow default user`, {
        newUserId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
