import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from './schema/auth.schema';

export type RequestWithUser = Request & { user?: AuthUser };

// Gives a controller method the logged-in user (set by AuthGuard):
//   someRoute(@CurrentUser() user: AuthUser) { ... }
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined =>
    context.switchToHttp().getRequest<RequestWithUser>().user,
);
