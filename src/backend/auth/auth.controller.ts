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

//type for verifying a partkeepr user
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

    // Verify the submitted password against the stored PartKeepr hash.
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    // Reject missing or disabled accounts.
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    response.cookie(
      'partkeepr_session',
      this.authService.createSessionToken(user.username),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 2,
        path: '/',
      },
    );

    // Return only safe public user data; never expose the password hash or salt.
    return { username: user.username };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('partkeepr_session', { path: '/' });
    return { success: true };
  }

  @Get('me')
  getCurrentUser(@Req() request: Request) {
    const token = request.headers.cookie
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('partkeepr_session='))
      ?.slice('partkeepr_session='.length);
    const username = token
      ? this.authService.getSessionUsername(decodeURIComponent(token))
      : null;

    if (!username) {
      throw new UnauthorizedException('Authentication required');
    }

    return { username };
  }
}
