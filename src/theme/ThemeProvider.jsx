import React, {createContext, useContext, useLayoutEffect, useMemo, useState} from 'react';
import OriginalThemeProvider from '@theme-original/ThemeProvider';

const ThemeContext = createContext(null);
const DEFAULT_THEME_ID = 'minimal-light';

export default function ThemeProvider({children}) {
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', 'light');
    root.dataset.siteTheme = 'minimal-light';
    root.style.colorScheme = 'light';
    root.style.setProperty('--theme-accent', '#111111');
    root.style.setProperty('--theme-accent-strong', '#2d2d2d');
    root.style.setProperty('--theme-surface', '#f5f3ef');
    root.style.setProperty('--theme-surface-dark', '#121212');

    if (body) {
      body.setAttribute('data-theme', 'light');
      body.dataset.siteTheme = 'minimal-light';
      body.style.colorScheme = 'light';
    }
  }, [themeId]);

  const value = useMemo(
    () => ({
      themeId,
      theme: {id: themeId, name: '简洁版', description: '纯净阅读模式'},
      setThemeId,
    }),
    [themeId]
  );

  return (
    <OriginalThemeProvider>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </OriginalThemeProvider>
  );
}

export function useSiteTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useSiteTheme 必须在 ThemeProvider 内使用。');
  }

  return context;
}