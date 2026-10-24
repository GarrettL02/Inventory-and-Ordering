import {
  AuthEnvSchema,
  LoginSchema,
  SessionPayloadSchema,
} from './auth.schema';

describe('LoginSchema', () => {
  it('accepts a username and password and trims the username', () => {
    expect(LoginSchema.parse({ username: '  garrett ', password: 'pw' })).toEqual({
      username: 'garrett',
      password: 'pw',
    });
  });

  it('leaves the password exactly as typed (spaces can be part of a password)', () => {
    expect(LoginSchema.parse({ username: 'g', password: ' pw ' }).password).toBe(' pw ');
  });

  it.each([
    ['empty username', { username: '', password: 'pw' }],
    ['blank username', { username: '   ', password: 'pw' }],
    ['empty password', { username: 'g', password: '' }],
    ['missing fields', {}],
    ['username that is too long', { username: 'x'.repeat(256), password: 'pw' }],
    ['password that is too long', { username: 'g', password: 'x'.repeat(1025) }],
  ])('rejects %s', (_label, input) => {
    expect(LoginSchema.safeParse(input).success).toBe(false);
  });
});

describe('SessionPayloadSchema', () => {
  it('accepts a normal payload', () => {
    const payload = { userId: 7, username: 'garrett', expiresAt: 1800000000 };
    expect(SessionPayloadSchema.parse(payload)).toEqual(payload);
  });

  it.each([
    ['a zero user id', { userId: 0, username: 'g', expiresAt: 1 }],
    ['a negative user id', { userId: -1, username: 'g', expiresAt: 1 }],
    ['an empty username', { userId: 1, username: '', expiresAt: 1 }],
    ['a missing expiry', { userId: 1, username: 'g' }],
  ])('rejects %s', (_label, input) => {
    expect(SessionPayloadSchema.safeParse(input).success).toBe(false);
  });
});

describe('AuthEnvSchema', () => {
  const secret = 'x'.repeat(32);

  it('requires a secret of at least 32 characters', () => {
    expect(AuthEnvSchema.safeParse({ AUTH_SESSION_SECRET: 'short' }).success).toBe(false);
    expect(AuthEnvSchema.safeParse({ AUTH_SESSION_SECRET: secret }).success).toBe(true);
  });

  it('defaults the session duration to 12 hours and reads it from text', () => {
    expect(AuthEnvSchema.parse({ AUTH_SESSION_SECRET: secret }).SESSION_DURATION_SECONDS).toBe(
      43200,
    );
    expect(
      AuthEnvSchema.parse({ AUTH_SESSION_SECRET: secret, SESSION_DURATION_SECONDS: '60' })
        .SESSION_DURATION_SECONDS,
    ).toBe(60);
  });
});
