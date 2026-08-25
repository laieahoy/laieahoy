import React, { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? window.scrollY / scrollable : 0;

      setProgress(Math.min(100, Math.max(0, value * 100)));
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'var(--ifm-color-primary)',
        height: '4px',
        left: 0,
        position: 'fixed',
        top: 0,
        transition: 'width 0.1s ease-out',
        width: `${progress}%`,
        zIndex: 9999,
      }}
    />
  );
}