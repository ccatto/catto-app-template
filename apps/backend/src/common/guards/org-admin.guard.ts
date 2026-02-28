// src/common/guards/org-admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * OrgAdminGuard - Ensures user is an admin of the organization specified in the request.
 *
 * Checks:
 * 1. User is authenticated (requires GqlAuthGuard to run first)
 * 2. Platform admins bypass all org checks
 * 3. User is a member of the specified organization
 * 4. User has admin or owner role in that organization
 *
 * Extracts organizationId from multiple locations:
 * - args.organizationId
 * - args.createVenueInput.organization_id
 * - args.input.organization_id
 *
 * Usage:
 * @UseGuards(GqlAuthGuard, OrgAdminGuard)
 * @Mutation(() => Venue)
 * createVenue(@Args('createVenueInput') input: CreateVenueInput) { ... }
 */
@Injectable()
export class OrgAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const args = ctx.getArgs();

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Platform admins bypass all organization checks
    const userRole = user.role;
    if (userRole === 'platform_admin') {
      return true;
    }

    // For NextAuth users without role on JWT, check database
    const userId = user.userId || user.id || user.sub;
    if (!userRole && userId) {
      const dbUser = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (dbUser?.role === 'platform_admin') {
        user.role = 'platform_admin';
        return true;
      }
    }

    // Extract organizationId from various possible locations in args
    const organizationId = this.extractOrganizationId(args);

    if (!organizationId) {
      throw new BadRequestException(
        'Organization ID is required for this operation',
      );
    }

    // Check user's membership and role in this organization
    const membership = await this.prisma.client.organizationMember.findUnique({
      where: {
        userId_organizationId_unique: {
          userId: userId,
          organizationId: organizationId,
        },
      },
      include: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    // Check if user has admin or owner role
    const roleName = membership.role?.name?.toLowerCase();
    const isAdmin = roleName === 'admin' || roleName === 'owner';

    if (!isAdmin) {
      throw new ForbiddenException(
        'Only organization admins can perform this action',
      );
    }

    return true;
  }

  /**
   * Extract organization ID from GraphQL args
   * Checks multiple common locations where org ID might be passed
   */
  private extractOrganizationId(args: Record<string, unknown>): string | null {
    // Direct argument
    if (typeof args.organizationId === 'string') {
      return args.organizationId;
    }

    // Inside createVenueInput
    const createVenueInput = args.createVenueInput as Record<string, unknown>;
    if (createVenueInput?.organization_id) {
      return createVenueInput.organization_id as string;
    }

    // Inside generic input object
    const input = args.input as Record<string, unknown>;
    if (input?.organization_id) {
      return input.organization_id as string;
    }

    // Inside updateVenueInput
    const updateVenueInput = args.updateVenueInput as Record<string, unknown>;
    if (updateVenueInput?.organization_id) {
      return updateVenueInput.organization_id as string;
    }

    return null;
  }
}
