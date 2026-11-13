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
