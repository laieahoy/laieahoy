import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import OriginalThemeProvider from '@theme-original/ThemeProvider';
import {
  defaultThemeId,
  getTheme,
  themes,
} from '@site/src/data/themes';

const STORAGE_KEY = '505-site-theme';
const ThemeContext = createContext(null);

export default function ThemeProvider({children}) {
  const [themeId, setThemeId] = useState(defaultThemeId);

  useEffect(() => {
    const savedThemeId = window.localStorage.getItem(STORAGE_KEY);

    if (savedThemeId && themes.some((theme) => theme.id === savedThemeId)) {
      setThemeId(savedThemeId);
    }
  }, []);

  useEffect(() => {
    const selectedTheme = getTheme(themeId);
    const root = document.documentElement;

    root.dataset.siteTheme = selectedTheme.id;

    root.style.setProperty('--theme-accent', selectedTheme.accent);
    root.style.setProperty('--theme-accent-strong', selectedTheme.accentStrong);
    root.style.setProperty('--theme-surface', selectedTheme.surface);
    root.style.setProperty('--theme-surface-dark', selectedTheme.surfaceDark);

    window.localStorage.setItem(STORAGE_KEY, selectedTheme.id);
  }, [themeId]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.12;
      document.documentElement.style.setProperty('--scroll-shift', `${offset}px`);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const value = useMemo(
    () => ({
      themeId,
      theme: getTheme(themeId),
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