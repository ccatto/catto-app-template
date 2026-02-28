/**
 * @catto/nest-auth - GraphQL Auth Guard (Dual Auth)
 *
 * Supports two authentication methods:
 * 1. JWT token in Authorization header (mobile/email login)
 * 2. x-user-id header (OAuth login - user ID validated by frontend session)
 *
 * Uses injected Prisma service via CATTO_AUTH_PRISMA token to validate users.
 */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { CATTO_AUTH_PRISMA, CATTO_AUTH_CONFIG } from '../constants';
import {
  CattoNestAuthConfig,
  CattoPrismaLike,
} from '../interfaces/config.interfaces';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(CATTO_AUTH_PRISMA) private readonly prisma: CattoPrismaLike,
    @Inject(CATTO_AUTH_CONFIG) private readonly config: CattoNestAuthConfig,
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);

    // First, try JWT authentication (standard path)
    try {
      const result = await super.canActivate(context);
      if (result) {
        return true;
      }
    } catch {
      // JWT auth failed, try x-user-id header
    }

    // Check if header auth is disabled
    if (this.config.disableHeaderAuth) {
      throw new UnauthorizedException('JWT authentication required');
    }

    // Check for x-user-id header (OAuth users)
    const userId = request.headers['x-user-id'];
    if (userId && typeof userId === 'string' && userId.length > 0) {
      // Validate user exists in DB and fetch their actual role
      const dbUser = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      });

      if (!dbUser) {
        throw new UnauthorizedException('User not found');
      }

      // Attach verified user info to request for resolvers to use
      // Include both 'id' and 'userId' for compatibility with different resolver patterns
      request.user = {
        id: dbUser.id,
        userId: dbUser.id,
        sub: dbUser.id,
        role: dbUser.role || 'user',
      };
      return true;
    }

    throw new UnauthorizedException('No valid authentication provided');
  }
}
