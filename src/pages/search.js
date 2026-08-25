import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import blogPosts from '@site/src/data/blogPosts';
import { searchPosts } from '@site/src/utils/search';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const results = useMemo(
    () => searchPosts(blogPosts, keyword),
    [keyword],
  );

  return (
    <Layout title="搜索">
      <main className="container margin-vert--lg">
        <h1>搜索文章</h1>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索标题、标签、分类或作者"
          autoFocus
        />

        <p>找到 {results.length} 篇文章</p>

        {results.map((post) => (
          <article key={post.id} className="margin-vert--md">
            <h2><a href={post.slug}>{post.title}</a></h2>
            <p>{post.description}</p>
            <small>{post.category} · {post.tags.join('、')}</small>
          </article>
        ))}

        {!results.length && <p>没有找到相关文章。</p>}
      </main>
    </Layout>
  );
}