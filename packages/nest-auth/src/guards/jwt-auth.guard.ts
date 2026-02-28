/**
 * @catto/nest-auth - JWT Auth Guard
 *
 * Handles both HTTP and GraphQL contexts for JWT authentication.
 * 100% generic — no app-specific dependencies.
 */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // Handle both HTTP and GraphQL contexts
    const type = context.getType<string>();
    if (type === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }
    return context.switchToHttp().getRequest();
  }
}
