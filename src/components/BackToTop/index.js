import React, { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      style={{
        backgroundColor: 'var(--ifm-color-primary)',
        border: 'none',
        borderRadius: '50%',
        bottom: '24px',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '20px',
        height: '46px',
        position: 'fixed',
        right: '24px',
        width: '46px',
        zIndex: 999,
      }}
      aria-label="回到顶部"
      title="回到顶部"
    >
      ↑
    </button>
  );
}