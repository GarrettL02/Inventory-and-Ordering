import { randomBytes, scrypt, ScryptOptions, timingSafeEqual } from 'crypto';

// Password hashing with scrypt from Node's built-in crypto (no extra packages).
// Stored format: scrypt$N$r$p$saltBase64$hashBase64
// scripts/createUser.js writes the same format.
const KEY_LENGTH = 64;
const COST = 16384; // N
const BLOCK_SIZE = 8; // r
const PARALLELIZATION = 1; // p

function deriveKey(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(plainPassword, salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
  });

  return [
    'scrypt',
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString('base64'),
    key.toString('base64'),
  ].join('$');
}

export async function verifyPassword(
  plainPassword: string,
  storedHash: string,
): Promise<boolean> {
  try {
    const [scheme, n, r, p, saltBase64, hashBase64] = storedHash.split('$');
    if (scheme !== 'scrypt' || !saltBase64 || !hashBase64) return false;

    const expected = Buffer.from(hashBase64, 'base64');
    const derived = await deriveKey(
      plainPassword,
      Buffer.from(saltBase64, 'base64'),
      expected.length,
      { N: Number(n), r: Number(r), p: Number(p) },
    );

    return (
      derived.length === expected.length && timingSafeEqual(derived, expected)
    );
  } catch {
    return false;
  }
}

// Used when the username doesn't exist, so a login attempt takes about as long
// either way and doesn't reveal which usernames are real.
let dummyHash: Promise<string> | null = null;

export async function burnPasswordCheck(plainPassword: string): Promise<void> {
  dummyHash ??= hashPassword('not-a-real-password');
  await verifyPassword(plainPassword, await dummyHash);
}
