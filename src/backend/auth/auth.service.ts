import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { SessionPayloadSchema } from './schema/auth.schema';

//Authentication type
type AuthUser = {
  username: string;
};

type SessionPayload = {
  username: string;
  expiresAt: number;
};

@Injectable()
export class AuthService {
  //Validates user credentials by making a request to PartKeepr API with Basic Auth
  async validateUser(
    username: string,
    plainPassword: string,
  ): Promise<AuthUser | null> {
    const apiUrl = process.env.PARTKEEPR_API_URL;

    try {
      // Create Basic Auth header: base64 encode "username:password"
      const credentials = Buffer.from(`${username}:${plainPassword}`).toString(
        'base64',
      );

      //if the environemnt variable isnt configured then throw error
      if (!apiUrl) {
        throw new Error(
          'PARTKEEPR_API_URL is not configured in environment variables.',
        );
      }

      // Make request to PartKeepr API with Basic Auth
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      // If PartKeepr validates successfully (200 status), return the user
      if (response.ok) {
        return { username };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  //Creating the session token upos successful response
  createSessionToken(username: string): string {
    const durationSeconds = parseInt(
      process.env.SESSION_DURATION_SECONDS || '43200',
      10,
    );
    const payload: SessionPayload = {
      username,
      expiresAt: Math.floor(Date.now() / 1000) + durationSeconds,
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );
    const signature = this.signSession(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  getSessionUsername(token: string): string | null {
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
      ) as SessionPayload;

      //Validate with ZOD schema
      const validatedPayload = SessionPayloadSchema.safeParse(payload);
      if (!validatedPayload.success) {
        return null;
      }

      const validatedData = validatedPayload.data;

      return validatedData.expiresAt > Math.floor(Date.now() / 1000)
        ? validatedData.username
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
