import { z } from 'zod';

export const ThemeSchema = z.enum(['light', 'dark']);
export const UserSettingsDataSchema = z.object({
  theme: ThemeSchema,
});

export type UserSettingsData = z.infer<typeof UserSettingsDataSchema>;
