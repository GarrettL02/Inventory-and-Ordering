import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { readSessionCookie } from './auth.constants';
import type { RequestWithUser } from './currentUser.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = readSessionCookie(request.headers.cookie);
    const user = token ? this.authService.getSession(token) : null;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Make the logged in user available to controllers via @CurrentUser()
    request.user = user;

    return true;
  }
}
