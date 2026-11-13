import z from 'zod';

export const ThemeSchema = z.enum(['light', 'dark']);

export const UserSettingsSchema = z.object({
  theme: ThemeSchema,
});

export const UpdateUserSettingsSchema = z.object({
  theme: ThemeSchema,
});

export type UpdateUserSettingsDto = z.infer<typeof UpdateUserSettingsSchema>;
