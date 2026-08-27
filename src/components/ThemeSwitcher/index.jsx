import React, {useMemo, useState} from 'react';
import {themes, getTheme} from '@site/src/data/themes';
import {useSiteTheme} from '@site/src/theme/ThemeProvider';
import styles from './index.module.css';

function groupThemes(themeList) {
  return themeList.reduce((groups, theme) => {
    const key = theme.group || '其他';
    const current = groups[key] || [];
    current.push(theme);
    groups[key] = current;
    return groups;
  }, {});
}

export default function ThemeSwitcher() {
  const {themeId, setThemeId} = useSiteTheme();
  const [open, setOpen] = useState(false);

  const selectedTheme = getTheme(themeId);
  const groupedThemes = useMemo(() => groupThemes(themes), []);
  const sceneKey = selectedTheme.character || 'default';

  return (
    <div className={styles.root} data-scene={sceneKey}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="切换网站主题"
      >
        <span className={styles.triggerMark} />
        <span>{selectedTheme.name}</span>
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>THEME LIBRARY</p>
              <h2>切换主题</h2>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              aria-label="关闭主题面板"
            >
              ×
            </button>
          </div>

          <div className={styles.current}>
            <span className={styles.currentMark} />
            <div>
              <strong>{selectedTheme.name}</strong>
              <p>{selectedTheme.description}</p>
            </div>
          </div>

          <div className={styles.list}>
            {Object.entries(groupedThemes).map(([group, groupThemes]) => (
              <div key={group} className={styles.group}>
                <h3>{group}</h3>
                <div className={styles.themeGrid}>
                  {groupThemes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      className={`${styles.themeButton} ${
                        theme.id === themeId ? styles.active : ''
                      }`}
                      onClick={() => {
                        setThemeId(theme.id);
                        setOpen(false);
                      }}
                    >
                      <span className={styles.swatch} />
                      <span>
                        {theme.name}
                        {theme.lightMode && theme.nightMode ? (
                          <small className={styles.modeBadge}>
                            {theme.lightMode}/{theme.nightMode}
                          </small>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}