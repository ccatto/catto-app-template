/**
 * @catto/nest-auth - Public Decorator
 *
 * Marks a route or resolver as publicly accessible (no auth required).
 * Use with a guard that checks for IS_PUBLIC_KEY metadata.
 */
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
