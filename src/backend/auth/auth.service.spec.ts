import { AuthService } from './auth.service';
import { burnPasswordCheck, verifyPassword } from './password';

// ---------------------------------------------------------------------
// MOCKING - the most important Jest idea.
//
// A unit test checks ONE class. AuthService normally talks to a real MySQL
// database and does slow password hashing. We don't want either in a unit
// test (slow, needs a server, and a failure could be the DB's fault).
//
// So we swap them for fakes:
//   jest.fn()           a fake function that records how it was called and
//                       returns whatever we tell it to
//   jest.mock('./x')    replaces a whole file's exports with fake functions
//   mockResolvedValue   "when called, return a promise that resolves to this"
//   toHaveBeenCalledWith  checks the fake was called with the right arguments
// ---------------------------------------------------------------------
jest.mock('./password');
const mockedVerifyPassword = jest.mocked(verifyPassword);
const mockedBurnPasswordCheck = jest.mocked(burnPasswordCheck);

const SECRET = 'a-test-secret-that-is-at-least-32-chars-long';

function makeFakeDb() {
  return { query: jest.fn(), run: jest.fn() };
}

describe('AuthService', () => {
  const originalEnv = process.env;
  let db: ReturnType<typeof makeFakeDb>;
  let service: AuthService;

  beforeEach(() => {
    jest.resetAllMocks(); // forget calls/return values from the previous test

    // Give each test its own copy of the environment variables
    process.env = { ...originalEnv, AUTH_SESSION_SECRET: SECRET };
    delete process.env.SESSION_DURATION_SECONDS;

    db = makeFakeDb();
    service = new AuthService(db as any);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  ///////////////////////////////////////////////////////////
  describe('validateUser', () => {
    const userRow = { id: 7, username: 'garrett', passwordHash: 'scrypt$stored' };

    it('returns the public user and records the login when the password is right', async () => {
      db.query.mockResolvedValue([userRow]);
      mockedVerifyPassword.mockResolvedValue(true);

      const user = await service.validateUser('garrett', 'correct horse');

      expect(user).toEqual({ id: 7, username: 'garrett' });
      expect(user).not.toHaveProperty('passwordHash'); // never leak the hash
      expect(mockedVerifyPassword).toHaveBeenCalledWith('correct horse', 'scrypt$stored');
      expect(db.run).toHaveBeenCalledWith(expect.stringContaining('lastLoginAt'), [7]);
    });

    it('looks the user up by username and only among active accounts', async () => {
      db.query.mockResolvedValue([]);

      await service.validateUser('garrett', 'pw');

      // expect.stringContaining lets us check part of the SQL without matching all of it
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('isActive = 1'), [
        'garrett',
      ]);
    });

    it('returns null for the wrong password and does not record a login', async () => {
      db.query.mockResolvedValue([userRow]);
      mockedVerifyPassword.mockResolvedValue(false);

      await expect(service.validateUser('garrett', 'wrong')).resolves.toBeNull();
      expect(db.run).not.toHaveBeenCalled();
    });

    it('returns null for an unknown user but still burns time hashing', async () => {
      db.query.mockResolvedValue([]);

      await expect(service.validateUser('nobody', 'pw')).resolves.toBeNull();

      expect(mockedBurnPasswordCheck).toHaveBeenCalledWith('pw');
      expect(mockedVerifyPassword).not.toHaveBeenCalled();
      expect(db.run).not.toHaveBeenCalled();
    });
  });

  ///////////////////////////////////////////////////////////
  describe('getSessionDurationSeconds', () => {
    it('defaults to 12 hours', () => {
      expect(service.getSessionDurationSeconds()).toBe(43200);
    });

    it('can be set with SESSION_DURATION_SECONDS', () => {
      process.env.SESSION_DURATION_SECONDS = '60';
      expect(service.getSessionDurationSeconds()).toBe(60);
    });
  });

  ///////////////////////////////////////////////////////////
  describe('session tokens', () => {
    const user = { id: 7, username: 'garrett' };

    // Tests that depend on the clock use "fake timers": we control what time
    // it is, so a test about expiry doesn't need to actually wait.
    afterEach(() => {
      jest.useRealTimers();
    });

    it('a token we create can be read back into the same user', () => {
      const token = service.createSessionToken(user);
      expect(service.getSession(token)).toEqual(user);
    });

    it('stops working once it expires', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'));
      process.env.SESSION_DURATION_SECONDS = '60';
      const token = service.createSessionToken(user);

      jest.setSystemTime(new Date('2026-01-01T00:00:59Z'));
      expect(service.getSession(token)).toEqual(user); // 1 second left

      jest.setSystemTime(new Date('2026-01-01T00:01:00Z'));
      expect(service.getSession(token)).toBeNull(); // exactly expired

      jest.setSystemTime(new Date('2026-01-01T00:02:00Z'));
      expect(service.getSession(token)).toBeNull();
    });

    it('rejects a token whose payload was edited (e.g. to become another user)', () => {
      const [, signature] = service.createSessionToken(user).split('.');
      const forgedPayload = Buffer.from(
        JSON.stringify({
          userId: 1,
          username: 'admin',
          expiresAt: Math.floor(Date.now() / 1000) + 99999,
        }),
      ).toString('base64url');

      expect(service.getSession(`${forgedPayload}.${signature}`)).toBeNull();
    });

    it('rejects a token with a tampered signature', () => {
      const [payload] = service.createSessionToken(user).split('.');
      expect(service.getSession(`${payload}.not-the-real-signature`)).toBeNull();
    });

    it('rejects a token signed with a different secret', () => {
      const token = service.createSessionToken(user);
      process.env.AUTH_SESSION_SECRET = 'a-completely-different-secret-of-32-chars!!';

      expect(service.getSession(token)).toBeNull();
    });

    it.each(['', 'garbage', '.', 'only-one-part.'])(
      'rejects the malformed token "%s"',
      (token) => {
        expect(service.getSession(token)).toBeNull();
      },
    );

    it('rejects a correctly signed token whose payload has the wrong shape', () => {
      // service['signSession'] reaches a private method - fine inside a test
      const payload = Buffer.from(JSON.stringify({ userId: -1 })).toString('base64url');
      const token = `${payload}.${service['signSession'](payload)}`;

      expect(service.getSession(token)).toBeNull();
    });

    it('rejects a correctly signed token whose payload is not JSON', () => {
      const payload = Buffer.from('this is not json').toString('base64url');
      const token = `${payload}.${service['signSession'](payload)}`;

      expect(service.getSession(token)).toBeNull();
    });

    it('refuses to create tokens when AUTH_SESSION_SECRET is not configured', () => {
      delete process.env.AUTH_SESSION_SECRET;

      expect(() => service.createSessionToken(user)).toThrow('AUTH_SESSION_SECRET');
    });
  });
});
