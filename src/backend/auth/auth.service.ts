import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import { SessionPayloadSchema } from './schema/auth.schema';
import { burnPasswordCheck, verifyPassword } from './password';

//Authentication type
export type AuthUser = {
  id: number;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly db: InventoryDatabaseService) {}

  ///////////////////////////////////////////////////////////
  //
  //  validateUser()
  //  Check a username and password against the users table
  //
  ///////////////////////////////////////////////////////////
  async validateUser(
    username: string,
    plainPassword: string,
  ): Promise<AuthUser | null> {
    const rows = await this.db.query(
      `SELECT id, username, passwordHash
       FROM users
       WHERE username = ? AND isActive = 1
       LIMIT 1`,
      [username],
    );
    const user = rows[0];

    // Unknown or disabled account - still do the hashing work so timing doesn't give it away
    if (!user) {
      await burnPasswordCheck(plainPassword);
      return null;
    }

    const passwordMatches = await verifyPassword(
      plainPassword,
      user.passwordHash,
    );
    if (!passwordMatches) {
      return null;
    }

    await this.db.run('UPDATE users SET lastLoginAt = NOW() WHERE id = ?', [
      user.id,
    ]);

    return { id: user.id, username: user.username };
  }

  getSessionDurationSeconds(): number {
    return parseInt(process.env.SESSION_DURATION_SECONDS || '43200', 10);
  }

  //Creating the session token upon successful login
  createSessionToken(user: AuthUser): string {
    const payload = {
      userId: user.id,
      username: user.username,
      expiresAt: Math.floor(Date.now() / 1000) + this.getSessionDurationSeconds(),
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );
    const signature = this.signSession(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  //Returns the logged in user for a valid, unexpired session token - otherwise null
  getSession(token: string): AuthUser | null {
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = this.signSession(encodedPayload);
    const actualBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (
      actualBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      );

      //Validate with ZOD schema
      const validatedPayload = SessionPayloadSchema.safeParse(payload);
      if (!validatedPayload.success) {
        return null;
      }

      const validatedData = validatedPayload.data;

      return validatedData.expiresAt > Math.floor(Date.now() / 1000)
        ? { id: validatedData.userId, username: validatedData.username }
        : null;
    } catch {
      return null;
    }
  }

  private signSession(encodedPayload: string): string {
    const secret = process.env.AUTH_SESSION_SECRET;

    if (!secret) {
      throw new Error('AUTH_SESSION_SECRET is not configured');
    }

    return createHmac('sha256', secret)
      .update(encodedPayload)
      .digest('base64url');
  }
}
