import { useCallback, useState } from 'react';
import { updateUserSettings as updateUserSettingsRequest } from '../../services/userSettings/userSettingsService';
import { UserSettingsData } from '../../types/userSettings/userSettings';
import { useThemeSettings } from './useTheme';

// Saves any of the user's settings and tracks the request's loading / error state,
// the same way useAddStorageLocation does for storage locations.
//
//   const { updateUserSettings, loading, error } = useUpdateUserSettings();
//   const saved = await updateUserSettings({ theme: 'dark' });  // the saved settings, or null if it failed
//
// Pass only the settings you want to change - the rest are kept as they are. A new
// setting needs no changes here: add it to UserSettingsData (and the schemas) and
// pass it in.
//
// The change shows up on screen right away. If saving fails, the settings go back
// to how they were. It never throws - on failure it returns null and puts the
// message in `error`.
export function useUpdateUserSettings() {
  const { settings, setSettings } = useThemeSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserSettings = useCallback(
    async (
      updates: Partial<UserSettingsData>,
    ): Promise<UserSettingsData | null> => {
      const previous = settings;
      const next = { ...previous, ...updates };

      setLoading(true);
      setError(null); // clear the last failure when trying again
      setSettings(next); // show the change right away
      try {
        //the server saves them and sends back what it stored
        const { data } = await updateUserSettingsRequest(next);
        setSettings(data);
        return data;
      } catch (err: any) {
        setSettings(previous); // the save failed - put everything back
        setError(err.message ?? 'Could not save your settings');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [settings, setSettings],
  );

  // Lets the UI clear a stale error, e.g. when the user tries again
  const clearError = useCallback(() => setError(null), []);

  return { updateUserSettings, loading, error, clearError };
}
