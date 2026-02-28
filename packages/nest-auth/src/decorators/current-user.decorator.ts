/**
 * @catto/nest-auth - Current User Decorator
 *
 * Extracts the authenticated user from the GraphQL context.
 * Normalizes .id and .userId properties for compatibility across auth strategies.
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;
    const user = request.user;

    if (!user) {
      return null;
    }

    // Normalize property names across auth strategies:
    // - JWT strategy returns { userId, email, role, ... }
    // - GqlAuthGuard OAuth fallback sets { id, sub }
    // Ensure both .id and .userId are available
    if (user.id && !user.userId) {
      user.userId = user.id;
    }
    if (user.userId && !user.id) {
      user.id = user.userId;
    }

    return user;
  },
);
