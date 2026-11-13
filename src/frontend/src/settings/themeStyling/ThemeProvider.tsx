import { createContext, ReactNode, useState } from 'react';
import { ThemeColors, ThemeName, themeStyling } from './themeStyling';

type ThemeContextValue = {
  themeName: ThemeName;
  themeType: ThemeColors;
};

//makes a context for theme management
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  //right now you can change state to make the theme light or dark manually ---needs changed---
  const [themeName] = useState<ThemeName>('light');
  const themeType =
    themeName === 'dark' ? themeStyling.darkTheme : themeStyling.lightTheme;

  return (
    <ThemeContext.Provider value={{ themeName, themeType }}>
      {children}
    </ThemeContext.Provider>
  );
}
