import z from 'zod';

export const ThemeSchema = z.enum(['light', 'dark']);

export const UserSettingsSchema = z.object({
  theme: ThemeSchema,
  // MySQL stores this as 0/1; coerce turns that into true/false
  distributorLookups: z.coerce.boolean(),
  //future settings
});

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'light',
  distributorLookups: true,
};

// Any subset of settings, at least one, no unknown keys
export const UpdateUserSettingsSchema = UserSettingsSchema.partial()
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one setting must be provided',
  });

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type UpdateUserSettingsDto = z.infer<typeof UpdateUserSettingsSchema>;
