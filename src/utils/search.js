export function searchPosts(posts, keyword) {
  const value = keyword.trim().toLowerCase();
  if (!value) return posts;

  return posts.filter((post) => {
    const text = [
      post.title,
      post.description,
      post.category,
      post.author,
      ...(post.tags || []),
    ].join(' ').toLowerCase();

    return text.includes(value);
  });
}