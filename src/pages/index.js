import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const sections = [
  {
    number: '01',
    title: '文章记录',
    description: '技术学习、踩坑过程，以及一些终于想明白的事情。',
    link: '/blog',
    linkText: '阅读文章',
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
        <p className={styles.terminalSuccess}>✓ blog found</p>
        <p className={styles.terminalMuted}>status: occasionally useful</p>
        <div className={styles.progressLine}>
          <span></span>
        </div>
      </div>
    </div>
  );
}

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span className={styles.statusDot}></span>
              SYSTEM ONLINE / 2026
            </div>

            <Heading as="h1">
              505
              <br />
              <span>Not Found</span>{' '}
              <span className={styles.robot}>🤖</span>
            </Heading>

            <p className={styles.subtitle}>
              这里没有找到答案，
              <br className={styles.mobileBreak} />
              但找到了一个博客。
            </p>

            <p className={styles.description}>
              记录技术、学习、项目，以及一些暂时还没解决的问题。
            </p>

            <div className={styles.actions}>
              <Link className={styles.primaryButton} to="/blog">
                阅读文章 <span>→</span>
              </Link>
              <Link className={styles.secondaryButton} to="/docs/intro">
                查看笔记
              </Link>
            </div>
          </div>

          <TerminalPanel />
        </div>
      </div>
    </header>
  );
}

function HomepageContent() {
  return (
    <main>
      <section className={styles.statusStrip}>
        <div className="container">
          <div className={styles.statusStripInner}>
            <span>现在这里有：</span>
            <strong>一些文章</strong>
            <i>/</i>
            <strong>几个项目</strong>
            <i>/</i>
            <strong>若干未完成的想法</strong>
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
            <p>内容正在慢慢增加，网站暂时没有报错。</p>
          </div>

          <div className={styles.sectionsGrid}>
            {sections.map((section) => (
              <Link
                className={styles.infoCard}
                to={section.link}
                key={section.number}
              >
                <span className={styles.cardNumber}>{section.number}</span>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <span className={styles.cardLink}>
                  {section.linkText} <b>→</b>
                </span>
              </Link>
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