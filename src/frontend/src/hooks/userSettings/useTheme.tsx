import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ThemeColors,
  ThemeName,
  themeStyling,
} from '../../settings/themeStyling/themeStyling';
import { useAuth } from '../auth/useAuth';
import { getUserSettings } from '../../services/userSettings/userSettingsService';
import { UserSettingsData } from '../../types/userSettings/userSettings';

type ThemeContextValue = {
  themeName: ThemeName;
  themeType: ThemeColors;
  //every saved user setting - useUpdateUserSettings reads and writes these
  settings: UserSettingsData;
  setSettings: (settings: UserSettingsData) => void;
  loading: boolean;
  error: Error | null;
};

//used before the saved settings load, and when logged out
const DEFAULT_USER_SETTINGS: UserSettingsData = { theme: 'light' };

//makes a context for theme management
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export function useThemeSettings() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeSettings must be used inside ThemeProvider');
  }
  return context;
}

export function useTheme() {
  return useThemeSettings().themeType;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<UserSettingsData>(
    DEFAULT_USER_SETTINGS,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setSettings(DEFAULT_USER_SETTINGS);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getUserSettings()
      .then(({ data }) => {
        if (!cancelled) setSettings(data);
      })
      .catch((settingsError: unknown) => {
        if (!cancelled) {
          setError(
            settingsError instanceof Error
              ? settingsError
              : new Error('Could not load user theme settings'),
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const themeName = settings.theme;
  const themeType =
    themeName === 'dark' ? themeStyling.darkTheme : themeStyling.lightTheme;

  return (
    <ThemeContext.Provider
      value={{ themeName, themeType, settings, setSettings, loading, error }}
    >
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: themeType.backgroundColor,
          color: themeType.textPrimaryColor,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
