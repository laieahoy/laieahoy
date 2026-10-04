import React, {useEffect, useState} from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 260);

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      style={{
        position: 'fixed',
        right: '22px',
        bottom: '22px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '1px solid rgba(17,17,17,0.22)',
        background: 'rgba(255,255,255,0.7)',
        boxShadow: '0 12px 28px rgba(17,17,17,0.12)',
        color: '#111111',
        cursor: 'pointer',
        fontSize: '20px',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = 'translateY(-2px)';
        event.currentTarget.style.boxShadow = '0 16px 30px rgba(17,17,17,0.18)';
        event.currentTarget.style.background = 'rgba(255,255,255,0.96)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = 'translateY(0)';
        event.currentTarget.style.boxShadow = '0 12px 28px rgba(17,17,17,0.12)';
        event.currentTarget.style.background = 'rgba(255,255,255,0.7)';
      }}
      aria-label="回到顶部"
      title="回到顶部"
    >
      ↑
    </button>
  );
}