import { z } from 'zod';

////////////////////////////////////////////////////////
//
// Login Schema
//
////////////////////////////////////////////////////////
export const LoginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(255),
  password: z.string().min(1, 'Password is required').max(1024),
});

export type LoginDto = z.infer<typeof LoginSchema>;

////////////////////////////////////////////////////////
//
// Session Payload Schema
//
////////////////////////////////////////////////////////
export const SessionPayloadSchema = z.object({
  username: z.string().min(1),
  expiresAt: z.number().int().positive(),
});

export type SessionPayload = z.infer<typeof SessionPayloadSchema>;

////////////////////////////////////////////////////////
//
// Auth Environment Schema
//
////////////////////////////////////////////////////////
export const AuthEnvSchema = z.object({
  PARTKEEPR_API_URL: z.string().url(),
  AUTH_SESSION_SECRET: z.string().min(32, 'Secret should be at least 32 chars'),
  SESSION_DURATION_SECONDS: z.coerce.number().int().positive().default(43200),
});

export type AuthEnv = z.infer<typeof AuthEnvSchema>;
