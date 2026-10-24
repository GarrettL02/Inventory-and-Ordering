import { UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';

function makeResponse() {
  return { cookie: jest.fn(), clearCookie: jest.fn() };
}

function makeRequest(cookie?: string) {
  return { headers: { cookie } } as unknown as Request;
}

describe('AuthController', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const authService = {
    validateUser: jest.fn(),
    createSessionToken: jest.fn(),
    getSessionDurationSeconds: jest.fn(),
    getSession: jest.fn(),
  };
  let controller: AuthController;
  let response: ReturnType<typeof makeResponse>;

  beforeEach(() => {
    jest.resetAllMocks();
    authService.getSessionDurationSeconds.mockReturnValue(43200);
    controller = new AuthController(authService as any);
    response = makeResponse();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('login', () => {
    const login = (body: unknown) =>
      controller.login(body, response as unknown as Response);

    it('sets an httpOnly session cookie and returns only the username', async () => {
      authService.validateUser.mockResolvedValue({ id: 7, username: 'garrett' });
      authService.createSessionToken.mockReturnValue('token-123');

      const result = await login({ username: 'garrett', password: 'pw' });

      expect(result).toEqual({ username: 'garrett' });
      expect(response.cookie).toHaveBeenCalledWith(
        'session',
        'token-123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 43200 * 1000,
        }),
      );
    });

    it('trims the username before checking it', async () => {
      authService.validateUser.mockResolvedValue({ id: 7, username: 'garrett' });
      authService.createSessionToken.mockReturnValue('token-123');

      await login({ username: '  garrett  ', password: 'pw' });

      expect(authService.validateUser).toHaveBeenCalledWith('garrett', 'pw');
    });

    it('only marks the cookie "secure" in production (HTTPS)', async () => {
      authService.validateUser.mockResolvedValue({ id: 7, username: 'garrett' });
      authService.createSessionToken.mockReturnValue('token-123');

      process.env.NODE_ENV = 'production';
      await login({ username: 'garrett', password: 'pw' });

      expect(response.cookie).toHaveBeenCalledWith(
        'session',
        'token-123',
        expect.objectContaining({ secure: true }),
      );
    });

    it('rejects wrong credentials without setting a cookie', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(login({ username: 'garrett', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(response.cookie).not.toHaveBeenCalled();
    });

    it.each([
      ['no body', undefined],
      ['an empty body', {}],
      ['a missing password', { username: 'garrett' }],
      ['an empty username', { username: '   ', password: 'pw' }],
    ])('rejects %s with the same error as a wrong password', async (_label, body) => {
      await expect(login(body)).rejects.toThrow('Invalid username or password');
      expect(authService.validateUser).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('clears the session cookie', () => {
      const result = controller.logout(response as unknown as Response);

      expect(result).toEqual({ success: true });
      expect(response.clearCookie).toHaveBeenCalledWith('session', { path: '/' });
    });
  });

  describe('getCurrentUser (GET /auth/me)', () => {
    it('returns the username for a valid session', () => {
      authService.getSession.mockReturnValue({ id: 7, username: 'garrett' });

      expect(controller.getCurrentUser(makeRequest('session=tok'))).toEqual({
        username: 'garrett',
      });
    });

    it('throws Unauthorized when there is no cookie', () => {
      expect(() => controller.getCurrentUser(makeRequest(undefined))).toThrow(
        UnauthorizedException,
      );
    });

    it('throws Unauthorized when the session is invalid', () => {
      authService.getSession.mockReturnValue(null);

      expect(() => controller.getCurrentUser(makeRequest('session=tok'))).toThrow(
        UnauthorizedException,
      );
    });
  });
});
