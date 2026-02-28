/**
 * @catto/nest-auth - Dev Auth Guard
 *
 * Bypasses authentication in development. Extends GqlAuthGuard
 * but always returns true.
 */
import { Injectable } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class DevAuthGuard extends GqlAuthGuard {
  canActivate(): Promise<boolean> {
    return Promise.resolve(true); // Allow all requests in development
  }
}
