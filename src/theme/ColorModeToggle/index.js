import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

export default function ColorModeToggle() {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <button
      type="button"
      className={`${styles.lampButton} ${isDark ? styles.dark : styles.light}`}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      <svg
        className={styles.chandelier}
        viewBox="0 0 80 112"
        aria-hidden="true"
      >
        {/* 固定在顶部的吊线 */}
        <path className={styles.metal} d="M40 3v27" />
        <path className={styles.metalFine} d="M42 3v27" />
        <path className={styles.metal} d="M36.5 3h7" />

        {/* 悬停时只拉长这一段，顶部不会移动 */}
        <path className={styles.extendStem} d="M40 29v16" />

        {/* 灯罩、灯座和灯泡整体下坠 */}
        <g className={styles.lampBody}>
          <path className={styles.metal} d="M34 29c1.8-2 4-3 6-3s4.2 1 6 3" />
          <path className={styles.metal} d="M34 29h12" />
          <path className={styles.metal} d="M36 29v6h8v-6" />

          {/* 简约锥形灯罩 */}
          <path
            className={styles.shade}
            d="M35 35c-1.5 7-6 15-15 24-4 2-8 3.5-12 4.5 8 3.5 19 5 32 5s24-1.5 32-5c-4-1-8-2.5-12-4.5-9-9-13.5-17-15-24"
          />
          <path className={styles.shadeEdge} d="M8 63.5c9 3.5 20 5 32 5s23-1.5 32-5" />
          <path className={styles.shadeDetail} d="M17 59c7 2 15 3 23 3s16-1 23-3" />
          <path className={styles.shadeDetail} d="M25 50c5 1.2 10 1.8 15 1.8s10-.6 15-1.8" />
          <path className={styles.shadeDetail} d="M31 40c3 .8 6 1.2 9 1.2s6-.4 9-1.2" />

          {/* 暖色灯泡 */}
          <path
            className={styles.bulb}
            d="M35.5 72c0-4 2-6.5 4.5-6.5s4.5 2.5 4.5 6.5c0 2.5-1.1 4.3-2.4 5.8h-4.2c-1.3-1.5-2.4-3.3-2.4-5.8Z"
          />
          <path className={styles.metal} d="M37.5 79h5M38 82h4" />

          {/* 小巧的底部装饰 */}
          <path className={styles.metalFine} d="M40 85v7" />
          <path className={styles.metalFine} d="M36.5 92h7" />
        </g>
      </svg>
    </button>
  );
}
