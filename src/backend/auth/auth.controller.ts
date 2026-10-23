import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { SESSION_COOKIE_NAME, readSessionCookie } from './auth.constants';

//type for the login request body
type LoginRequest = {
  username?: string;
  password?: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //POST for the login
  @Post('login')
  async login(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    //if there is no username or password in the body of the request throw error
    if (!body.username || !body.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Verify the submitted password against the stored password hash.
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    // Reject missing or disabled accounts.
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    response.cookie(SESSION_COOKIE_NAME, this.authService.createSessionToken(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.authService.getSessionDurationSeconds() * 1000,
      path: '/',
    });

    // Return only safe public user data; never expose the password hash.
    return { username: user.username };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    return { success: true };
  }

  @Get('me')
  getCurrentUser(@Req() request: Request) {
    const token = readSessionCookie(request.headers.cookie);
    const user = token ? this.authService.getSession(token) : null;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    return { username: user.username };
  }
}
