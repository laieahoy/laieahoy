import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

export default function ColorModeToggle() {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Replace the decorative lamp toggle with a simple, unobtrusive button
  // — the user requested removal of the lamp-style toggle behavior.
  return (
    <button
      type="button"
      className={styles.simpleToggle}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
