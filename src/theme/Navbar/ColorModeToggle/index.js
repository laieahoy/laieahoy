import React from 'react';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';
import {useSiteTheme} from '@site/src/theme/ThemeProvider';
import styles from './styles.module.css';
export default function NavbarColorModeToggle({className}) {
  const navbarStyle = useThemeConfig().navbar.style;
  const {disableSwitch, respectPrefersColorScheme} = useThemeConfig().colorMode;
  const {colorModeChoice, setColorMode} = useColorMode();
  if (disableSwitch) {
    return null;
  }
  const siteTheme = useSiteTheme().theme;
  const forceDark = siteTheme && (siteTheme.id?.includes('spider') || siteTheme.character === 'bat-signal');
  if (forceDark) {
    return (
      <div className={className} title="该主题仅支持暗色模式">
        <button className={styles.disabledDark} disabled aria-disabled="true">🌙 暗色</button>
      </div>
    );
  }
  return (
    <ColorModeToggle
      className={className}
      buttonClassName={
        navbarStyle === 'dark' ? styles.darkNavbarColorModeToggle : undefined
      }
      respectPrefersColorScheme={respectPrefersColorScheme}
      value={colorModeChoice}
      onChange={setColorMode}
    />
  );
}
