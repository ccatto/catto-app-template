/**
 * @catto/nest-auth - JWT Strategy
 *
 * Passport JWT strategy that validates tokens using the configured secret
 * and verifies users exist in the database via the injected Prisma service.
 */
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CATTO_AUTH_CONFIG, CATTO_AUTH_PRISMA } from '../constants';
import {
  CattoNestAuthConfig,
  CattoPrismaLike,
} from '../interfaces/config.interfaces';
import { JwtPayload, TokenUser } from '../interfaces/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(CATTO_AUTH_CONFIG) config: CattoNestAuthConfig,
    @Inject(CATTO_AUTH_PRISMA) private readonly prisma: CattoPrismaLike,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<TokenUser> {
    // Validate user exists in database
    const user = await this.prisma.client.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Role is fetched from DB (not JWT payload) to ensure role changes
    // take effect immediately rather than waiting for token expiry.
    // Other fields (playerID, organizationId) use payload values
    // since they change less frequently and require token refresh.
    return {
      userId: payload.sub,
      email: payload.email,
      role: user.role || 'user',
      playerID: payload.playerID,
      organizationId: payload.organizationId,
    };
  }
}
