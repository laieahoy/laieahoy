import React, { useMemo, useState } from 'react';
import Link from '@docusaurus/Link';

export default function BlogFilters({ posts = [] }) {
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState('all');
  const [keyword, setKeyword] = useState('');

  const categories = useMemo(() => {
    return [
      ...new Set(
        posts.flatMap(post =>
          post.content.metadata.tags
            .map(item => item.label)
            .filter(label => label.startsWith('category-'))
        )
      ),
    ];
  }, [posts]);

  const tags = useMemo(() => {
    return [
      ...new Set(
        posts.flatMap(post =>
          post.content.metadata.tags
            .map(item => item.label)
            .filter(label => !label.startsWith('category-'))
        )
      ),
    ];
  }, [posts]);

  const filteredPosts = posts.filter(post => {
    const postTags = post.content.metadata.tags.map(item => item.label);
    const title = post.content.metadata.title.toLowerCase();
    const text = keyword.toLowerCase();

    const matchesCategory =
      category === 'all' || postTags.includes(category);

    const matchesTag = tag === 'all' || postTags.includes(tag);

    const matchesKeyword =
      !text || title.includes(text);

    return matchesCategory && matchesTag && matchesKeyword;
  });

  return (
    <section>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          placeholder="搜索文章标题"
        />

        <select
          value={category}
          onChange={event => setCategory(event.target.value)}
        >
          <option value="all">全部分类</option>
          {categories.map(item => (
            <option key={item} value={item}>
              {item.replace('category-', '')}
            </option>
          ))}
        </select>

        <select value={tag} onChange={event => setTag(event.target.value)}>
          <option value="all">全部标签</option>
          {tags.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p style={{ marginTop: 24 }}>
        共找到 {filteredPosts.length} 篇文章
      </p>

      <div>
        {filteredPosts.map(post => (
          <article key={post.content.metadata.permalink}>
            <h2>
              <Link to={post.content.metadata.permalink}>
                {post.content.metadata.title}
              </Link>
            </h2>
            <p>{post.content.metadata.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}