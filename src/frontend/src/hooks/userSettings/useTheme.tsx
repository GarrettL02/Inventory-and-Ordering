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

type ThemeContextValue = {
  themeName: ThemeName;
  themeType: ThemeColors;
  loading: boolean;
  error: Error | null;
};

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
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setThemeName('light');
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getUserSettings()
      .then(({ data }) => {
        if (!cancelled) setThemeName(data.theme);
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

  const themeType =
    themeName === 'dark' ? themeStyling.darkTheme : themeStyling.lightTheme;

  return (
    <ThemeContext.Provider value={{ themeName, themeType, loading, error }}>
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
