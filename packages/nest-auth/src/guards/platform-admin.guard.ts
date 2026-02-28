/**
 * @catto/nest-auth - Platform Admin Guard
 *
 * Restricts access to platform administrators.
 * Uses configurable role name from CATTO_AUTH_CONFIG (default: 'platform_admin').
 * Supports both JWT auth and x-user-id header auth.
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CATTO_AUTH_PRISMA, CATTO_AUTH_CONFIG } from '../constants';
import {
  CattoNestAuthConfig,
  CattoPrismaLike,
} from '../interfaces/config.interfaces';

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  private readonly platformAdminRole: string;

  constructor(
    @Inject(CATTO_AUTH_PRISMA) private readonly prisma: CattoPrismaLike,
    @Inject(CATTO_AUTH_CONFIG) config: CattoNestAuthConfig,
  ) {
    this.platformAdminRole = config.roles?.platformAdmin ?? 'platform_admin';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // If role is already on the user object (JWT auth), check directly
    if (user.role === this.platformAdminRole) {
      return true;
    }

    // For x-user-id auth (OAuth), look up role from database
    const userId = user.userId || user.id || user.sub;
    if (userId) {
      const dbUser = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (dbUser?.role === this.platformAdminRole) {
        return true;
      }
    }

    throw new ForbiddenException('Platform admin access required');
  }
}
