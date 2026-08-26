import React from 'react';
import Link from '@docusaurus/Link';
import styles from '@site/src/pages/categories.module.css';

function getTagUrl(tag) {
  return `/blog/tags/${encodeURIComponent(tag)}`;
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
  const nextPath = [...pathSegments, category.slug];
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
          to={
            hasChildren
              ? `/categories/${nextPath.join('/')}`
              : getTagUrl(category.tag)
          }
        >
          {hasChildren
            ? `进入${category.label}`
            : `查看${category.label}文章`}{' '}
          →
        </Link>

        <span className={styles.cardCount}>
          {category.count} 篇文章
        </span>
      </div>
    </section>
  );
}

export default function CategoryBrowser({
  pathSegments,
  categoryPath,
  category,
}) {
  const hasChildren = category.children?.length > 0;

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
            这是当前分类的最后一级，共有 {category.count} 篇文章。
          </p>

          <Link
            className={styles.articleLink}
            to={getTagUrl(category.tag)}
          >
            查看「{category.label}」的全部文章 →
          </Link>
        </div>
      )}
    </main>
  );
}