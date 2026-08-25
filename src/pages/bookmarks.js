import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BlogCard from '@site/src/components/BlogCard';
import blogPosts from '@site/src/data/blogPosts';
import { getCurrentUser } from '@site/src/utils/auth';
import { getBookmarks } from '@site/src/utils/blog';

export default function BookmarksPage() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      window.location.assign('/login');
      return;
    }

    const bookmarkIds = getBookmarks(user.id);
    setPosts(blogPosts.filter((post) => bookmarkIds.includes(post.id)));
  }, []);

  if (posts === null) {
    return null;
  }

  return (
    <Layout title="我的收藏">
      <main className="container margin-vert--lg">
        <h1>我的收藏</h1>

        {posts.length === 0 ? (
          <p>你还没有收藏文章。</p>
        ) : (
          <div className="row">
            {posts.map((post) => (
              <div key={post.id} className="col col--4 margin-bottom--lg">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}