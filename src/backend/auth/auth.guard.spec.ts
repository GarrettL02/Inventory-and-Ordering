import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

// A guard decides "may this request through?". We fake the request and the
// AuthService, then check the guard's decision for each situation.
function makeContext(cookie?: string) {
  const request: any = { headers: { cookie } };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;

  return { context, request };
}

describe('AuthGuard', () => {
  const authService = { getSession: jest.fn() };
  let guard: AuthGuard;

  beforeEach(() => {
    jest.resetAllMocks();
    guard = new AuthGuard(authService as any);
  });

  it('lets a request with a valid session through and attaches the user', () => {
    authService.getSession.mockReturnValue({ id: 7, username: 'garrett' });
    const { context, request } = makeContext('session=good-token');

    expect(guard.canActivate(context)).toBe(true);
    expect(authService.getSession).toHaveBeenCalledWith('good-token');
    expect(request.user).toEqual({ id: 7, username: 'garrett' });
  });

  it('blocks a request with no cookie at all', () => {
    const { context } = makeContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(authService.getSession).not.toHaveBeenCalled();
  });

  it('blocks a request whose session token is invalid or expired', () => {
    authService.getSession.mockReturnValue(null);
    const { context, request } = makeContext('session=bad-token');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(request.user).toBeUndefined();
  });
});
