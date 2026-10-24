import { burnPasswordCheck, hashPassword, verifyPassword } from './password';

// Security code deserves tests more than most code: a silent mistake here
// means anyone can log in (or nobody can). These use the REAL scrypt hashing
// - it takes a few dozen milliseconds per hash, which is fine.
describe('password hashing', () => {
  it('produces the documented scrypt$N$r$p$salt$hash format', async () => {
    const hash = await hashPassword('hunter2');
    const parts = hash.split('$');

    expect(parts).toHaveLength(6);
    expect(parts.slice(0, 4)).toEqual(['scrypt', '16384', '8', '1']);
  });

  it('never contains the plain password', async () => {
    const hash = await hashPassword('hunter2');
    expect(hash).not.toContain('hunter2');
  });

  it('uses a fresh random salt, so the same password hashes differently each time', async () => {
    const first = await hashPassword('hunter2');
    const second = await hashPassword('hunter2');

    expect(first).not.toBe(second);
  });
});

describe('verifyPassword', () => {
  it('accepts the right password', async () => {
    const hash = await hashPassword('hunter2');
    await expect(verifyPassword('hunter2', hash)).resolves.toBe(true);
  });

  it('rejects the wrong password', async () => {
    const hash = await hashPassword('hunter2');
    await expect(verifyPassword('hunter3', hash)).resolves.toBe(false);
    await expect(verifyPassword('', hash)).resolves.toBe(false);
  });

  // A bad stored hash must mean "no", never a crash and never "yes"
  it.each([
    ['an empty string', ''],
    ['text that is not a hash', 'not-a-hash'],
    ['a different scheme', 'bcrypt$16384$8$1$c2FsdA==$aGFzaA=='],
    ['a hash missing its last part', 'scrypt$16384$8$1$c2FsdA=='],
    ['non-numeric cost settings', 'scrypt$x$y$z$c2FsdA==$aGFzaA=='],
  ])('returns false for %s', async (_label, storedHash) => {
    await expect(verifyPassword('hunter2', storedHash)).resolves.toBe(false);
  });
});

describe('burnPasswordCheck', () => {
  it('finishes without error (it exists only to waste time like a real check)', async () => {
    await expect(burnPasswordCheck('anything')).resolves.toBeUndefined();
  });
});
