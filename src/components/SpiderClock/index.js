import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

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

export default function SpiderClock() {
  const { colorMode } = useColorMode();
  const [angles, setAngles] = useState(getClockAngles);
  const [handSide, setHandSide] = useState(null);
  const [handAngles, setHandAngles] = useState({
    left: 0,
    right: 0,
  });
  const [web, setWeb] = useState(null);

  const spiderRef = useRef(null);
  const timers = useRef([]);

  const isDark = colorMode === 'dark';

  /* 时钟走针 */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setAngles(getClockAngles());
    }, 50);

    return () => window.clearInterval(timer);
  }, []);

  /* 根据整个页面的鼠标位置控制伸手方向 */
  useEffect(() => {
    const handlePointerMove = (event) => {
      const spider = spiderRef.current;
      if (!spider) return;

      const rect = spider.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.58;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      /* 鼠标位于蜘蛛侠正上方或正下方时，根据横向距离决定伸哪只手 */
      const side = dx < 0 ? 'left' : 'right';
      const absoluteAngle = Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI;
      const limitedAngle = clamp(absoluteAngle, -65, 65);

      setHandSide(side);

      if (side === 'left') {
      setHandAngles((previous) => ({
        ...previous,
        left: -limitedAngle,
      }));
    } else {
      setHandAngles((previous) => ({
        ...previous,
        right: limitedAngle,
      }));
    }
    };

    document.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  /* 处理页面链接的蛛丝动画 */
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('a[href]')).filter(
      (link) => !link.closest('[data-spider-clock]'),
    );

    const onClick = (event) => {
      const link = event.currentTarget;

      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (!link.href || link.href.startsWith('javascript:')) {
        return;
      }

      event.preventDefault();

      const point = getLinkPoint(link);
      const preview =
        link.dataset.spiderPreview || link.querySelector('img')?.src || null;
      const spiderRect = spiderRef.current?.getBoundingClientRect();

      const originX = spiderRect
        ? spiderRect.left + spiderRect.width / 2
        : window.innerWidth / 2;

      const originY = spiderRect
        ? spiderRect.top + spiderRect.height * 0.42
        : 130;

      setWeb({
        x: point.x,
        y: point.y,
        originX,
        originY,
        preview,
      });

      timers.current.push(
        window.setTimeout(() => {
          /* 当前标签页打开，不再使用 window.open */
          window.location.assign(link.href);
        }, 240),
      );

      timers.current.push(
        window.setTimeout(() => {
          setWeb(null);
        }, 450),
      );
    };

    links.forEach((link) => {
      link.addEventListener('click', onClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', onClick);
      });

      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

  const webOverlay =
    web && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={`${styles.webAnimation} ${
              isDark ? styles.webDark : styles.webLight
            }`}
            aria-hidden="true"
          >
            <svg className={styles.webLayer}>
              <line
                className={styles.shootingWeb}
                x1={web.originX}
                y1={web.originY}
                x2={web.x}
                y2={web.y}
              />
            </svg>

            {web.preview && (
              <img
                className={styles.liftedPreview}
                style={{
                  left: `${web.x}px`,
                  top: `${web.y}px`,
                }}
                src={web.preview}
                alt=""
              />
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className={`${styles.wrapper} ${
          isDark ? styles.dark : styles.light
        }`}
        data-spider-clock
      >
        <div className={styles.hangingSpider}>
          <div className={styles.fixedWeb} />

          <div className={styles.pictureFrame}>
            <img
              ref={spiderRef}
              className={styles.spiderImage}
              src="/img/spider-clock.png"
              alt=""
            />

            <svg
              className={styles.clockOverlay}
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <line
                  key={index}
                  className={styles.tick}
                  x1="60"
                  y1="5"
                  x2="60"
                  y2="11"
                  transform={`rotate(${index * 30} 60 60)`}
                />
              ))}

              <line
                className={styles.hourHand}
                x1="60"
                y1="60"
                x2="60"
                y2="35"
                style={{ transform: `rotate(${angles.hour}deg)` }}
              />

              <line
                className={styles.minuteHand}
                x1="60"
                y1="60"
                x2="60"
                y2="23"
                style={{ transform: `rotate(${angles.minute}deg)` }}
              />

              <line
                className={styles.secondHand}
                x1="60"
                y1="60"
                x2="60"
                y2="16"
                style={{ transform: `rotate(${angles.second}deg)` }}
              />

              <circle className={styles.pin} cx="60" cy="60" r="3" />
            </svg>
          </div>

          <div
            className={`${styles.leftHand} ${
              handSide === 'left' ? styles.handVisible : ''
            }`}
            style={{ '--hand-angle': `${handAngles.left}deg` }}
          />

          <div
            className={`${styles.rightHand} ${
              handSide === 'right' ? styles.handVisible : ''
            }`}
            style={{ '--hand-angle': `${handAngles.right}deg` }}
          />
        </div>
      </div>

      {webOverlay}
    </>
  );
}