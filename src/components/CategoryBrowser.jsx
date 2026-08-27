import React from 'react';
import Link from '@docusaurus/Link';
import styles from '@site/src/pages/categories.module.css';

function getCategoryUrl(pathSegments, category) {
  const nextSegments = pathSegments.includes(category.slug)
    ? pathSegments
    : [...pathSegments, category.slug];

  return `/categories/${nextSegments.join('/')}`;
}

function Breadcrumbs({pathSegments, categoryPath}) {
  return (
    <nav className={styles.breadcrumbs} aria-label="面包屑导航">
      <Link to="/categories">文章分类</Link>

      {categoryPath.map((category, index) => (
        <React.Fragment key={category.slug}>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link
            to={`/categories/${pathSegments
              .slice(0, index + 1)
              .join('/')}`}
          >
            {category.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}

function CategoryCard({category, pathSegments}) {
  const hasChildren = category.children?.length > 0;

  return (
    <section className={styles.card}>
      <div className={styles.cardMain}>
        <h2>{category.label}</h2>
        <p>{category.description}</p>
      </div>

      <div className={styles.cardBottom}>
        <Link
          className={styles.cardFooter}
          to={getCategoryUrl(pathSegments, category)}
        >
          {hasChildren ? `进入${category.label}` : `查看${category.label}文章`}{' '}
          →
        </Link>

        <span className={styles.cardCount}>
          {category.count} 篇文章
        </span>
      </div>
    </section>
  );
}

function CategoryArticleList({articles}) {
  if (!articles || articles.length === 0) {
    return (
      <div className={styles.empty}>
        当前分类下还没有文章，先去写一篇吧。
      </div>
    );
  }

  return (
    <div className={styles.articleList}>
      {articles.map((article) => (
        <article key={article.title} className={styles.articleItem}>
          <Link className={styles.articleTitle} to={article.url || '#'}>
            {article.title}
          </Link>
          <p className={styles.articleDescription}>{article.description}</p>
        </article>
      ))}
    </div>
  );
}

export default function CategoryBrowser({
  pathSegments,
  categoryPath,
  category,
}) {
  if (!category) {
    return (
      <main className={styles.container}>
        <Breadcrumbs
          pathSegments={pathSegments}
          categoryPath={categoryPath}
        />

        <header className={styles.header}>
          <h1>分类不存在</h1>
          <p>该分类尚未建立，或者已被合并到其他分层中。</p>
        </header>
      </main>
    );
  }

  const hasChildren = category.children?.length > 0;
  const articles = category.articles || [];

  return (
    <main className={styles.container}>
      <Breadcrumbs
        pathSegments={pathSegments}
        categoryPath={categoryPath}
      />

      <header className={styles.header}>
        <h1>{category.label}</h1>
        <p>{category.description}</p>

        {pathSegments.length > 0 && (
          <div className={styles.currentCount}>
            {category.count} 篇文章
          </div>
        )}
      </header>

      {hasChildren ? (
        <>
          <h2 className={styles.sectionTitle}>
            {category.label}的下一级分类
          </h2>

          <div className={styles.grid}>
            {category.children.map((child) => (
              <CategoryCard
                key={child.slug}
                category={child}
                pathSegments={pathSegments}
              />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.articleEntry}>
          <p>
            这是当前分类的最后一级，共有 {articles.length} 篇文章。
          </p>

          <div className={styles.articleEntryActions}>
            <Link
              className={styles.articleLink}
              to={getCategoryUrl(pathSegments, category)}
            >
              查看「{category.label}」的全部文章 →
            </Link>
          </div>

          <div className={styles.articleDivider} />
          <CategoryArticleList articles={articles} />
        </div>
      )}
    </main>
  );
}