import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.getSessionCookie(request.headers.cookie);

    if (!token || !this.authService.getSessionUsername(token)) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }

  private getSessionCookie(cookieHeader?: string): string | null {
    const sessionCookie = cookieHeader
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('partkeepr_session='));

    return sessionCookie
      ? decodeURIComponent(sessionCookie.slice('partkeepr_session='.length))
      : null;
  }
}
