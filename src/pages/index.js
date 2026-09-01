import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useState} from 'react';
import {useSiteTheme} from '@site/src/theme/ThemeProvider';
import {themes} from '@site/src/data/themes';
import styles from './index.module.css';

function getThemeBackdrop(theme) {
  const id = theme?.id || '';

  if (id.includes('spider')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(17,26,39,0.32), rgba(17,26,39,0.12)), url(/img/spider-man-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('dark-knight-rises')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(7,9,14,0.42), rgba(30,36,44,0.1)), url(/img/batmanjueqi2.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('dark-knight')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(7,9,14,0.42), rgba(30,36,44,0.1)), url(/img/batmanheian.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('batman')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(7,9,14,0.42), rgba(30,36,44,0.1)), url(/img/batmanxiaying.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('boonie') || id.includes('forest') || id.includes('snow')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(33,36,19,0.24), rgba(78,89,44,0.12)), url(/img/boonie-bears-forest-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('genshin')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(13,25,24,0.35), rgba(34,91,82,0.12)), url(/img/genshin-mountain-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('star-rail')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(10,15,29,0.4), rgba(58,73,128,0.18)), url(/img/star-rail-train-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('arknights')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(15,18,26,0.38), rgba(124,95,57,0.1)), url(/img/arknights-grid-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('lebron') || id.includes('stephen') || id.includes('kobe')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(33,24,18,0.32), rgba(128,96,36,0.1)), url(/img/lebron-court-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('michael') || id.includes('janet') || id.includes('dangelo') || id.includes('weeknd')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(28,19,16,0.38), rgba(181,46,58,0.12)), url(/img/michael-stage-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('sakamoto') || id.includes('butterfly') || id.includes('erquan')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(24,20,22,0.24), rgba(139,92,85,0.12)), url(/img/moonlit-music-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (id.includes('rain') || id.includes('sunrise') || id.includes('seaside') || id.includes('wilderness')) {
    return {
      backgroundImage: 'linear-gradient(135deg, rgba(18,30,42,0.2), rgba(44,97,112,0.12)), url(/img/sunrise-sky.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  return {
    backgroundImage: 'linear-gradient(135deg, rgba(17,24,22,0.2), rgba(70,110,92,0.1))',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

function getThemeCardStyle(theme) {
  const id = theme?.id || '';

  if (id.includes('spider')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(196,58,67,0.08), rgba(17,24,39,0.02)), url(/img/spider-man-web-pattern.webp)' };
  }

  if (id.includes('dark-knight-rises')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(12,18,24,0.08), rgba(196,163,80,0.04)), url(/img/batmanjueqi2.webp)' };
  }

  if (id.includes('dark-knight')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(12,18,24,0.08), rgba(196,163,80,0.04)), url(/img/batmanheian.webp)' };
  }

  if (id.includes('batman')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(12,18,24,0.08), rgba(196,163,80,0.04)), url(/img/batmanxiaying.webp)' };
  }

  if (id.includes('boonie') || id.includes('forest') || id.includes('snow')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(101,128,70,0.08), rgba(42,57,37,0.04)), url(/img/boonie-bears-forest-bg.webp)' };
  }

  if (id.includes('genshin')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(46,108,103,0.06), rgba(9,17,19,0.02)), url(/img/genshin-mountain-bg.webp)' };
  }

  if (id.includes('star-rail')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(88,106,170,0.08), rgba(11,18,40,0.03)), url(/img/star-rail-train-bg.webp)' };
  }

  if (id.includes('arknights')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(180,120,82,0.08), rgba(25,33,40,0.02)), url(/img/arknights-grid-bg.webp)' };
  }

  if (id.includes('lebron') || id.includes('stephen') || id.includes('kobe')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(183,122,52,0.08), rgba(35,27,19,0.03)), url(/img/lebron-court-bg.webp)' };
  }

  if (id.includes('michael') || id.includes('janet') || id.includes('dangelo') || id.includes('weeknd')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(166,51,61,0.08), rgba(38,20,18,0.02)), url(/img/michael-stage-bg.webp)' };
  }

  if (id.includes('sakamoto') || id.includes('butterfly') || id.includes('erquan')) {
    return { backgroundImage: 'linear-gradient(135deg, rgba(117,86,96,0.08), rgba(20,17,18,0.02)), url(/img/moonlit-music-bg.webp)' };
  }

  return { backgroundImage: 'linear-gradient(135deg, rgba(95,160,130,0.06), rgba(17,25,23,0.02))' };
}

const sections = [
  {
    number: '01',
    title: '文章记录',
    description: '技术学习、踩坑过程，以及一些终于想明白的事情。',
    link: '/blog',
    linkText: '阅读文章',
  },
  {
    number: '02',
    title: '算法分类',
    description: '题解和笔记分层级整理，DP、图论、数论、数据结构、组合计数都能直接查到。',
    link: '/categories/algorithm',
    linkText: '进入分类',
  },
  {
    number: '03',
    title: '日常随笔',
    description: '放一些代码之外的想法，防止大脑只剩下报错信息。',
    link: '/blog/tags',
    linkText: '随便逛逛',
  },
];

function TerminalPanel() {
  return (
    <div className={styles.terminal} aria-label="网站状态">
      <div className={styles.terminalBar}>
        <span className={styles.terminalDot}></span>
        <span className={styles.terminalDot}></span>
        <span className={styles.terminalDot}></span>
        <span className={styles.terminalLabel}>personal-site.sh</span>
      </div>

      <div className={styles.terminalBody}>
        <p><span className={styles.prompt}>$</span> locate --page home</p>
        <p className={styles.terminalMuted}>searching the internet...</p>
        <p><span className={styles.prompt}>!</span> page not found</p>
        <p className={styles.terminalSuccess}>✓ multi-theme blog found</p>
        <p className={styles.terminalMuted}>status: rich, playful and searchable</p>
        <div className={styles.progressLine}>
          <span></span>
        </div>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {theme} = useSiteTheme();
  const backdrop = getThemeBackdrop(theme);
  const themeId = theme?.id || '';
  const isBatmanTheme = themeId.includes('batman') || themeId.includes('dark-knight');

  return (
    <header className={styles.hero}>
      <div className={styles.heroBackdrop} style={backdrop} />
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span className={styles.statusDot}></span>
              THEME STORIES / 2026
            </div>

            <Heading as="h1">
              505
              <br />
              <span>Not Found</span>
              <span className={styles.robot} aria-hidden="true">
                {isBatmanTheme ? (
                  <img src="/img/batmansign.webp" alt="" className={styles.batmanBadge} />
                ) : (
                  '🕷️'
                )}
              </span>
            </Heading>

            <p className={styles.subtitle}>
              这里没有找到答案，
              <br className={styles.mobileBreak} />
              但找到了一个充满主题的博客世界。
            </p>

            <p className={styles.description}>
              记录技术、学习、项目，以及一些想继续做成更酷梦境的作品。
            </p>

            <div className={styles.actions}>
              <Link className={styles.primaryButton} to="/blog">
                阅读文章 <span>→</span>
              </Link>
              <Link className={styles.secondaryButton} to="/write">
                进入写作页
              </Link>
            </div>
          </div>

          <TerminalPanel />
        </div>
      </div>
    </header>
  );
}

function getThemeSceneGroup(themeId) {
  const id = themeId || '';

  if (id.includes('spider')) return 'spider-man';
  if (id.includes('batman') || id.includes('dark-knight')) return 'batman';
  if (id.includes('boonie') || id.includes('forest') || id.includes('snow')) return 'forest';
  if (id.includes('genshin') || id.includes('star-rail') || id.includes('arknights')) return 'cosmic';
  if (id.includes('lebron') || id.includes('stephen') || id.includes('kobe')) return 'court';
  if (
    id.includes('michael') ||
    id.includes('janet') ||
    id.includes('dangelo') ||
    id.includes('weeknd') ||
    id.includes('sakamoto') ||
    id.includes('butterfly') ||
    id.includes('erquan')
  ) {
    return 'music';
  }
  if (id.includes('rain') || id.includes('sunrise') || id.includes('seaside') || id.includes('wilderness')) {
    return 'landscape';
  }
  return 'default';
}

function ThemeHoverCard({ to, className, children, style, ...props }) {
  const {themeId} = useSiteTheme();
  const [pointer, setPointer] = useState({ x: 50, y: 18, angle: 12, length: 120 });
  const [isShooting, setIsShooting] = useState(false);
  const [isTargeting, setIsTargeting] = useState(false);
  const sceneGroup = getThemeSceneGroup(themeId);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const startX = rect.width * 0.52;
    const startY = rect.height * 0.12;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - startX;
    const dy = y - startY;
    const length = Math.max(30, Math.hypot(dx, dy) * 1.15);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    setPointer({ x, y, angle, length });
  };

  const handleClick = () => {
    if (sceneGroup !== 'spider-man') {
      return;
    }

    setIsTargeting(true);
    setIsShooting(true);
    window.setTimeout(() => {
      setIsShooting(false);
      setIsTargeting(false);
    }, 700);
  };

  return (
    <Link
      {...props}
      to={to}
      className={`${className} themeHoverCard ${isShooting ? 'is-shooting' : ''} ${isTargeting ? 'is-targeting' : ''}`}
      data-scene={sceneGroup}
      onMouseMove={handlePointerMove}
      onMouseEnter={() => sceneGroup === 'spider-man' && setIsTargeting(true)}
      onMouseLeave={() => sceneGroup === 'spider-man' && setIsTargeting(false)}
      onClick={handleClick}
      style={{
        ...style,
        '--pointer-x': `${pointer.x}px`,
        '--pointer-y': `${pointer.y}px`,
        '--web-angle': `${pointer.angle}deg`,
        '--web-length': `${pointer.length}px`,
      }}
    >
      <span className="themeHoverCard__silk" />
      <span className="themeHoverCard__webshot" />
      <span className="themeHoverCard__spider" />
      <span className="themeHoverCard__bat themeHoverCard__bat--left" />
      <span className="themeHoverCard__bat themeHoverCard__bat--right" />
      <span className="themeHoverCard__forest" />
      <span className="themeHoverCard__star" />
      <span className="themeHoverCard__court" />
      <span className="themeHoverCard__note" />
      <span className="themeHoverCard__sun" />
      {children}
    </Link>
  );
}

function HomepageContent() {
  return (
    <main>
      <section className={styles.statusStrip}>
        <div className="container">
          <div className={styles.statusStripInner}>
            <span>当前主题库：</span>
            <strong>{themes.length} 个</strong>
            <i>/</i>
            <strong>亮暗切换、动画角色、分类导航</strong>
            <span className={styles.statusCheck}>●</span>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.sectionKicker}>DIRECTORY</p>
              <h2>这里大概有这些东西</h2>
            </div>
            <p>内容正在慢慢增加，网站以及专门为主题世界优化过。</p>
          </div>

          <div className={styles.sectionsGrid}>
            {sections.map((section) => (
              <ThemeHoverCard
                className={styles.infoCard}
                to={section.link}
                key={section.number}
                style={section.number === '02' ? { backgroundImage: 'none' } : undefined}
              >
                <span className={styles.cardNumber}>{section.number}</span>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <span className={styles.cardLink}>
                  {section.linkText} <b>→</b>
                </span>
              </ThemeHoverCard>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.themeSection}>
        <div className="container">
          <div className={styles.themeHeader}>
            <div>
              <p className={styles.sectionKicker}>THEME SHELF</p>
              <h2>世界观主题精选</h2>
            </div>
            <p>每一种主题都带着自己的气氛，也能在右下角切换到全新场景。</p>
          </div>

          <div className={styles.themeGrid}>
            {themes.slice(0, 6).map((theme) => (
              <div
                key={theme.id}
                className={styles.themeCard}
                style={getThemeCardStyle(theme)}
              >
                <span className={styles.themeTone}>{theme.lightMode || '亮色'} / {theme.nightMode || '暗色'}</span>
                <h3>{theme.name}</h3>
                <p>{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Layout
      title="505 Not Found"
      description="一个记录技术、学习与生活的个人博客"
    >
      <HomepageHeader />
      <HomepageContent />
    </Layout>
  );
}