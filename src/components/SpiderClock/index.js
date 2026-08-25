import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

const spiderLines = [
  'SpiderMan!',
  'With great power comes great responsibility.',
  'Friendly neighborhood Spider-Man.',
  'I am watching the links.',
  'Web-slinging activated!',
  'Your friendly neighborhood clock is here.',
  'Stay alert. Stay amazing.',
  'Time to swing into action!',
  'The web is connected.',
  'Catch you on the next page!',
];

const WEB_ANIMATION_DELAY = 240;
const WEB_ANIMATION_DURATION = 450;
const AUTO_HIDE_DELAY = 15000;
const MAX_TRAIL_POINTS = 18;

function getClockAngles() {
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  return {
    hour: hours * 30,
    minute: minutes * 6,
    second: seconds * 6,
  };
}

function getLinkPoint(link) {
  const rect = link.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getTimeTheme() {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

export default function SpiderClock() {
  const [angles, setAngles] = useState(getClockAngles);
  const [handSide, setHandSide] = useState(null);
  const [handAngles, setHandAngles] = useState({ left: 0, right: 0 });
  const [dialogText, setDialogText] = useState(null);
  const [web, setWeb] = useState(null);
  const [trail, setTrail] = useState([]);
  const [isHidden, setIsHidden] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mood, setMood] = useState('normal');
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'classic';
    return window.localStorage.getItem('spider-clock-theme') || 'classic';
  });
  const [timeTheme, setTimeTheme] = useState(getTimeTheme);

  const spiderRef = useRef(null);
  const dialogTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const timers = useRef([]);
  const linkHandlersRef = useRef(new Map());
  const trailTimerRef = useRef(null);
  const lastTrailPointRef = useRef(null);
const [isDark, setIsDark] = useState(() => {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.documentElement.getAttribute('data-theme') === 'dark';
});

  const wakeSpider = useCallback(() => {
    setIsHidden(false);

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setIsHidden(true);
      setSettingsOpen(false);
      setMood('sleeping');
    }, AUTO_HIDE_DELAY);
  }, []);

  const showMood = useCallback((nextMood, duration = 1800) => {
    setMood(nextMood);
    window.setTimeout(() => {
      setMood((current) => (current === nextMood ? 'normal' : current));
    }, duration);
  }, []);

  const handleSpiderClick = useCallback(() => {
    wakeSpider();
    showMood('happy');

    const nextLine = spiderLines[Math.floor(Math.random() * spiderLines.length)];
    setDialogText(nextLine);

    if (dialogTimerRef.current) {
      window.clearTimeout(dialogTimerRef.current);
    }

    dialogTimerRef.current = window.setTimeout(() => {
      setDialogText(null);
      dialogTimerRef.current = null;
    }, 3200);
  }, [showMood, wakeSpider]);

  const addTrailPoint = useCallback((clientX, clientY) => {
    wakeSpider();

    const previous = lastTrailPointRef.current;
    if (previous) {
      const distance = Math.hypot(clientX - previous.x, clientY - previous.y);
      if (distance < 10) return;
    }

    const point = {
      x: clientX,
      y: clientY,
      id: `${Date.now()}-${Math.random()}`,
    };
    lastTrailPointRef.current = point;
    setTrail((previousTrail) => [...previousTrail.slice(-(MAX_TRAIL_POINTS - 1)), point]);

    if (trailTimerRef.current) {
      window.clearTimeout(trailTimerRef.current);
    }

    trailTimerRef.current = window.setTimeout(() => {
      setTrail([]);
    }, 700);
  }, [wakeSpider]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAngles(getClockAngles());
      setTimeTheme(getTimeTheme());
    }, 50);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
  const root = document.documentElement;

  function updateColorMode() {
    setIsDark(root.getAttribute('data-theme') === 'dark');
  }

  updateColorMode();

  const observer = new MutationObserver(updateColorMode);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return () => observer.disconnect();
}, []);

  useEffect(() => {
    wakeSpider();
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (dialogTimerRef.current) window.clearTimeout(dialogTimerRef.current);
      if (trailTimerRef.current) window.clearTimeout(trailTimerRef.current);
    };
  }, [wakeSpider]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      wakeSpider();
      addTrailPoint(event.clientX, event.clientY);

      const spider = spiderRef.current;
      if (!spider) return;

      const rect = spider.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.58;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const side = dx < 0 ? 'left' : 'right';
      const absoluteAngle = Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI;
      const limitedAngle = clamp(absoluteAngle, -65, 65);

      setHandSide(side);
      setMood('alert');

      if (side === 'left') {
        setHandAngles((previous) => ({ ...previous, left: -limitedAngle }));
      } else {
        setHandAngles((previous) => ({ ...previous, right: limitedAngle }));
      }
    };

    const handleTouchStart = (event) => {
      wakeSpider();
      const touch = event.touches[0];
      if (touch) addTrailPoint(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch) addTrailPoint(touch.clientX, touch.clientY);
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [addTrailPoint, wakeSpider]);

  useEffect(() => {
    const closeSettings = (event) => {
      if (!event.target.closest(`[data-spider-settings]`)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeSettings);
    return () => document.removeEventListener('pointerdown', closeSettings);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('spider-clock-theme', theme);
  }, [theme]);

  useEffect(() => {
    const isSkippableLink = (link) => {
      const href = link.getAttribute('href');
      return (
        !href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        link.hasAttribute('download') ||
        link.target === '_blank' ||
        link.closest('[data-spider-clock]')
      );
    };

    const onClick = (event) => {
      const link = event.currentTarget;
      if (
        event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        isSkippableLink(link)
      ) return;

      event.preventDefault();
      wakeSpider();
      showMood('slinging');

      const point = getLinkPoint(link);
      const preview = link.dataset.spiderPreview || link.querySelector('img')?.src || null;
      const spiderRect = spiderRef.current?.getBoundingClientRect();
      const originX = spiderRect ? spiderRect.left + spiderRect.width / 2 : window.innerWidth / 2;
      const originY = spiderRect ? spiderRect.top + spiderRect.height * 0.42 : 130;

      setWeb({ x: point.x, y: point.y, originX, originY, preview });

      timers.current.push(window.setTimeout(() => window.location.assign(link.href), WEB_ANIMATION_DELAY));
      timers.current.push(window.setTimeout(() => setWeb(null), WEB_ANIMATION_DURATION));
    };

    const bindLinks = () => {
      document.querySelectorAll('a[href]').forEach((link) => {
        if (!linkHandlersRef.current.has(link) && !isSkippableLink(link)) {
          link.addEventListener('click', onClick);
          linkHandlersRef.current.set(link, onClick);
        }
      });
    };

    const unbindLinks = () => {
      linkHandlersRef.current.forEach((handler, link) => link.removeEventListener('click', handler));
      linkHandlersRef.current.clear();
    };

    bindLinks();
    const observer = new MutationObserver(bindLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      unbindLinks();
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [showMood, wakeSpider]);

  const trailLines = useMemo(() => trail.slice(1).map((point, index) => {
    const previous = trail[index];
    return <line key={point.id} x1={previous.x} y1={previous.y} x2={point.x} y2={point.y} />;
  }), [trail]);

  const themeClass = {
    classic: styles.themeClassic,
    stealth: styles.themeStealth,
    neon: styles.themeNeon,
  }[theme];

  const webOverlay = web && typeof document !== 'undefined'
    ? createPortal(
        <div className={`${styles.webAnimation} ${isDark ? styles.webDark : styles.webLight}`} aria-hidden="true">
          <svg className={styles.webLayer}>
            <line className={styles.shootingWeb} x1={web.originX} y1={web.originY} x2={web.x} y2={web.y} />
          </svg>
          {web.preview && <img className={styles.liftedPreview} style={{ left: `${web.x}px`, top: `${web.y}px` }} src={web.preview} alt="" />}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {trail.length > 1 && (
        <svg className={`${styles.mouseTrail} ${isDark ? styles.trailDark : styles.trailLight}`} aria-hidden="true">
          {trailLines}
        </svg>
      )}

      <div
        className={`${styles.wrapper} ${isDark ? styles.dark : styles.light} ${styles[timeTheme]} ${themeClass} ${isHidden ? styles.hidden : ''}`}
        data-spider-clock
        onMouseEnter={wakeSpider}
        onTouchStart={wakeSpider}
      >
        <div className={styles.hangingSpider}>
          <div className={styles.fixedWeb} />
          <button
            type="button"
            className={styles.settingsButton}
            data-spider-settings
            aria-label="Spider clock settings"
            aria-expanded={settingsOpen}
            onClick={() => { wakeSpider(); setSettingsOpen((value) => !value); }}
          >⚙</button>

          {settingsOpen && (
            <div className={styles.settingsMenu} data-spider-settings>
              <strong>Spider settings</strong>
              <label>
                Theme
                <select value={theme} onChange={(event) => setTheme(event.target.value)}>
                  <option value="classic">Classic</option>
                  <option value="stealth">Stealth</option>
                  <option value="neon">Neon</option>
                </select>
              </label>
              <button type="button" onClick={() => { setIsHidden(false); showMood('happy'); }}>Wake spider</button>
            </div>
          )}

          <div className={`${styles.pictureFrame} ${styles[`mood${mood[0].toUpperCase()}${mood.slice(1)}`]}`}>
            <img
              ref={spiderRef}
              className={styles.spiderImage}
              src="/img/spider-clock.png"
              alt="Spider-Man clock"
              onClick={handleSpiderClick}
              onTouchStart={wakeSpider}
              onMouseDown={(event) => event.preventDefault()}
            />
            <span className={styles.statusFace} aria-hidden="true">
              {mood === 'happy' ? '★' : mood === 'alert' ? '!' : mood === 'slinging' ? '✦' : mood === 'sleeping' ? 'Z' : ''}
            </span>

            <svg className={styles.clockOverlay} viewBox="0 0 120 120" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <line key={index} className={styles.tick} x1="60" y1="5" x2="60" y2="11" transform={`rotate(${index * 30} 60 60)`} />
              ))}
              <line className={styles.hourHand} x1="60" y1="60" x2="60" y2="35" style={{ transform: `rotate(${angles.hour}deg)` }} />
              <line className={styles.minuteHand} x1="60" y1="60" x2="60" y2="23" style={{ transform: `rotate(${angles.minute}deg)` }} />
              <line className={styles.secondHand} x1="60" y1="60" x2="60" y2="16" style={{ transform: `rotate(${angles.second}deg)` }} />
              <circle className={styles.pin} cx="60" cy="60" r="3" />
            </svg>

            {dialogText && <div className={styles.spiderDialog} role="status" aria-live="polite">{dialogText}</div>}
          </div>

          <div className={`${styles.leftHand} ${handSide === 'left' ? styles.handVisible : ''}`} style={{ '--hand-angle': `${handAngles.left}deg` }} />
          <div className={`${styles.rightHand} ${handSide === 'right' ? styles.handVisible : ''}`} style={{ '--hand-angle': `${handAngles.right}deg` }} />
        </div>
      </div>
      {webOverlay}
    </>
  );
}