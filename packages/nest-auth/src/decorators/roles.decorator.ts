/**
 * @catto/nest-auth - Roles Decorator
 *
 * Sets required roles metadata on handlers for use with RolesGuard / GqlRolesGuard.
 */
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
