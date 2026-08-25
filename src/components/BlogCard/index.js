import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function BlogCard({ post }) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <span>{post.category}</span>
        <span>{post.readingTime} 分钟阅读</span>
      </div>

      <h2 className={styles.title}>
        <Link to={post.slug}>{post.title}</Link>
      </h2>

      <p>{post.description}</p>

      <div className={styles.tags}>
        {post.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <small>
        {post.author} · {post.date}
      </small>
    </article>
  );
}