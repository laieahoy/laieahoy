import React, { useEffect, useState } from 'react';
import BackToTop from '@site/src/components/BackToTop';

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
    <>
      <div style={{ width: `${progress}%` }} />
      <BackToTop />
    </>
  );
}