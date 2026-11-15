import { UserSettingsData } from '../../types/userSettings/userSettings';
import { UserSettingsDataSchema } from '../../schemas/userSettings/userSettings.schema';

const BASE_URL = '/api/usersettings';

export const getUserSettings = async (): Promise<{
  data: UserSettingsData;
}> => {
  const res = await fetch(BASE_URL, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  const validatedData = UserSettingsDataSchema.parse(data.data);
  return { data: validatedData };
};

export const updateUserSettings = async (input: Partial<UserSettingsData>) => {
  const res = await fetch(BASE_URL, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP error ${res.status}`);
  }

  const data = await res.json();
  return { data: UserSettingsDataSchema.parse(data.data) };
};
