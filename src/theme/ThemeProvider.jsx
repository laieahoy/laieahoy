import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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

function readStoredThemeId() {
  if (typeof window === 'undefined') {
    return defaultThemeId;
  }

  const savedThemeId = window.localStorage.getItem(STORAGE_KEY);
  return savedThemeId && themes.some((theme) => theme.id === savedThemeId)
    ? savedThemeId
    : defaultThemeId;
}

export default function ThemeProvider({children}) {
  const [themeId, setThemeId] = useState(() => readStoredThemeId());

  useLayoutEffect(() => {
    const selectedTheme = getTheme(themeId) || getTheme(defaultThemeId);
    if (!selectedTheme) {
      return;
    }

    const root = document.documentElement;
    const forceDark =
      (selectedTheme.id && selectedTheme.id.includes('spider')) ||
      selectedTheme.character === 'bat-signal';

    if (forceDark) {
      root.setAttribute('data-theme', 'dark');
    }

    root.dataset.siteTheme = selectedTheme.id;

    root.style.setProperty('--theme-accent', selectedTheme.accent);
    root.style.setProperty('--theme-accent-strong', selectedTheme.accentStrong);
    root.style.setProperty('--theme-surface', selectedTheme.surface);
    root.style.setProperty('--theme-surface-dark', selectedTheme.surfaceDark);

    window.localStorage.setItem(STORAGE_KEY, selectedTheme.id);

    let observer;
    if (forceDark) {
      observer = new MutationObserver(() => {
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      });

      observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }

    return () => {
      if (observer) observer.disconnect();
    };
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