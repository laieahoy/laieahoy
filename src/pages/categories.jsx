import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useGlobalData from '@docusaurus/useGlobalData';
import styles from './categories.module.css';

const categoryMap = {
  algorithm: {
    name: '算法',
    description: '算法题解、竞赛记录和数据结构学习。',
  },
  frontend: {
    name: '前端',
    description: 'React、Docusaurus、工程化和浏览器相关内容。',
  },
  backend: {
    name: '后端',
    description: '服务端、数据库和接口设计。',
  },
  life: {
    name: '生活随笔',
    description: '学习记录和个人思考。',
  },
};

function getBlogPosts(globalData) {
  const blogData = globalData['docusaurus-plugin-content-blog'];
  const blogInstances = Object.values(blogData || {});

  const defaultBlog = blogInstances.find(
    instance => instance.path === 'blog'
  );

  return defaultBlog?.blogPosts || [];
}

export default function CategoriesPage() {
  const globalData = useGlobalData();
  const posts = getBlogPosts(globalData);

  const categoryList = Object.entries(categoryMap).map(
    ([key, category]) => {
      const tagName = `category-${key}`;
      const categoryPosts = posts.filter(post =>
        post.content.metadata.tags.some(tag => tag.label === tagName)
      );

      return {
        key,
        ...category,
        count: categoryPosts.length,
      };
    }
  );

  return (
    <Layout title="文章分类" description="按分类浏览博客文章">
      <main className={styles.container}>
        <header className={styles.header}>
          <h1>文章分类</h1>
          <p>按照主题浏览我的博客文章</p>
        </header>

        <div className={styles.grid}>
          {categoryList.map(category => (
            <Link
              key={category.key}
              className={styles.card}
              to={`/blog/tags/category-${category.key}`}
            >
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <span>{category.count} 篇文章 →</span>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}