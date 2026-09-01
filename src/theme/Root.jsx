import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import ThemeProvider, {useSiteTheme} from './ThemeProvider';
import ThemeCharacter from '@site/src/components/ThemeCharacter';
import ThemeSwitcher from '@site/src/components/ThemeSwitcher';

function ThemeStoryRibbon() {
  const {theme} = useSiteTheme();

  if (!theme) {
    return null;
  }

  return (
    <div className="theme-story-ribbon" aria-live="polite">
      <span className="theme-story-ribbon__tag">THEME STORY</span>
      <strong>{theme.name}</strong>
      <span className="theme-story-ribbon__divider">／</span>
      <span>{theme.description}</span>
      <Link className="theme-story-ribbon__action" to="/theme-intro">
        主题介绍
      </Link>
    </div>
  );
}

function TopSpiderWeb({launchKey, launchTarget}) {
  const {theme} = useSiteTheme();
  const [isLaunching, setIsLaunching] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  const launchStyle = React.useMemo(() => {
    if (!launchTarget || typeof window === 'undefined') {
      return {
        '--launch-angle': '10deg',
        '--launch-length': '96px',
      };
    }

    const startX = window.innerWidth / 2;
    const startY = 120;
    const dx = launchTarget.x - startX;
    const dy = launchTarget.y - startY;
    const length = Math.max(140, Math.hypot(dx, dy) * 0.82);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return {
      '--launch-angle': `${angle}deg`,
      '--launch-length': `${length}px`,
    };
  }, [launchTarget]);

  React.useEffect(() => {
    if (launchKey === undefined || !theme || !theme.id?.includes('spider')) {
      return;
    }

    setIsLaunching(true);
    setShowQuote(true);

    const hideLaunch = window.setTimeout(() => {
      setIsLaunching(false);
    }, 900);

    const hideQuote = window.setTimeout(() => {
      setShowQuote(false);
    }, 2200);

    return () => {
      window.clearTimeout(hideLaunch);
      window.clearTimeout(hideQuote);
    };
  }, [launchKey, theme]);

  if (!theme || !theme.id?.includes('spider')) {
    return null;
  }

  return (
    <div
      className={`page-top-spider ${isLaunching ? 'is-launching' : ''}`}
      aria-label="Spider-Man web effect"
      role="img"
      style={launchStyle}
    >
      <div className="page-top-spider__silk" />
      <div className="page-top-spider__web" />
      <div className="page-top-spider__launch" />
      <div
        className="page-top-spider__portrait"
        style={{
          '--spider-image': "url('/img/spider-clock.png')",
        }}
      />
      <div className={`page-top-spider__quote ${showQuote ? 'is-visible' : ''}`}>
        “With great power comes great responsibility.”
      </div>
      <div className="page-top-spider__cast" />
    </div>
  );
}

function RootShell({children}) {
  const {theme} = useSiteTheme();
  const [launchKey, setLaunchKey] = useState(0);
  const [launchTarget, setLaunchTarget] = useState(null);

  React.useEffect(() => {
    if (!theme || !theme.id?.includes('spider')) {
      return undefined;
    }

    const handleLinkClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) {
        return;
      }

      const href = link.getAttribute('href') || '';
      if (!href || href === '#' || link.target === '_blank') {
        return;
      }

      const isExternal = /^[a-z]+:/.test(href) && !href.startsWith(window.location.origin);
      if (isExternal) {
        return;
      }

      event.preventDefault();

      const rect = link.getBoundingClientRect();
      setLaunchTarget({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setLaunchKey((key) => key + 1);

      const destination = href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || href.startsWith('?') || href.startsWith('#')
        ? new URL(href, window.location.href).toString()
        : href;

      window.setTimeout(() => {
        window.location.assign(destination);
      }, 120);
    };

    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [theme]);

  return (
    <>
      <TopSpiderWeb launchKey={launchKey} launchTarget={launchTarget} />
      <ThemeCharacter />
      <ThemeStoryRibbon />
      {children}
      <ThemeSwitcher />
    </>
  );
}

export default function Root({children}) {
  return (
    <ThemeProvider>
      <RootShell>{children}</RootShell>
    </ThemeProvider>
  );
}