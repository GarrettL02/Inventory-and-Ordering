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
  userId: z.number().int().positive(),
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
  AUTH_SESSION_SECRET: z.string().min(32, 'Secret should be at least 32 chars'),
  SESSION_DURATION_SECONDS: z.coerce.number().int().positive().default(43200),
});

export type AuthEnv = z.infer<typeof AuthEnvSchema>;

////////////////////////////////////////////////////////
//
// User Login Row Schema
// (the row validateUser() reads from the users table)
//
////////////////////////////////////////////////////////
export const UserLoginRowSchema = z.object({
  id: z.number(),
  username: z.string(),
  passwordHash: z.string(),
});

export const UserLoginRowArraySchema = z.array(UserLoginRowSchema);

////////////////////////////////////////////////////////
//
// Auth User Schema
// (the logged in user: safe public fields only, never the password hash)
//
////////////////////////////////////////////////////////
export const AuthUserSchema = UserLoginRowSchema.pick({
  id: true,
  username: true,
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
