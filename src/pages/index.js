import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const sections = [
  {
    number: '01',
    title: '文章记录',
    description: '技术、问题、想法和那些终于整理清楚的东西。',
    link: '/blog',
    label: '阅读文章',
  },
  {
    number: '02',
    title: '算法分类',
    description: '按题解、笔记、专题把思路分层放好。',
    link: '/categories/algorithm',
    label: '进入分类',
  },
  {
    number: '03',
    title: '写作入口',
    description: '记下灵感、记录内容、整理下一步的实践。',
    link: '/write',
    label: '开始写作',
  },
];

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroShapeA} />
      <div className={styles.heroShapeB} />
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>2026 / personal notes</p>
            <Heading as="h1">
              <span className={styles.h1Chunk}>505</span>
              <span className={styles.h1ChunkAlt}>
                <span className={styles.h1AltPrefix}>not</span>
                <span className={styles.h1AltSuffix}>found</span>
              </span>
            </Heading>
            <p className={styles.lead}>
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} to="/blog">
                阅读文章
              </Link>
              <Link className={styles.secondaryButton} to="/write">
                进入写作页
              </Link>
            </div>
          </div>

          <div className={styles.heroPanel} aria-label="博客摘要面板">
            <div className={styles.panelBar}>
              <span className={styles.dotBlack} />
              <span className={styles.dotMuted} />
              <span className={styles.dotMuted} />
              <span className={styles.panelLabel}>index / studio</span>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.panelTextRow}>
                <span>record</span>
                <span>write</span>
                <span>observe</span>
              </div>
              <div className={styles.panelCard}>
                <p>minimal knowledge archive</p>
                <strong>不追求热闹，只留下一点可用的秩序。</strong>
              </div>
              <div className={styles.barWrap}>
                <span className={styles.barFill} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomepageContent() {
  return (
    <main className={styles.main}>
      <section className={styles.masthead}>
        <div className="container">
          <div className={styles.mastheadInner}>
            <span>latest</span>
            <span>notes</span>
            <span>archive</span>
            <span>journal</span>
          </div>
        </div>
      </section>

      <section className={styles.directory}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionKicker}>directory</p>
              <h2>在这里大概能找到这些东西</h2>
            </div>
            <p>内容不多，但每一页都是有意为之。</p>
          </div>

          <div className={styles.cardGrid}>
            {sections.map((section) => (
              <Link className={styles.infoCard} to={section.link} key={section.number}>
                <span className={styles.cardNumber}>{section.number}</span>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <span className={styles.cardLink}>{section.label}</span>
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