import { readStorage, writeStorage } from './storage';

export function getBookmarks(userId) {
  return readStorage(`site-bookmarks-${userId}`, []);
}

export function toggleBookmark(userId, postId) {
  const key = `site-bookmarks-${userId}`;
  const bookmarks = getBookmarks(userId);

  const nextBookmarks = bookmarks.includes(postId)
    ? bookmarks.filter((id) => id !== postId)
    : [...bookmarks, postId];

  writeStorage(key, nextBookmarks);
  return nextBookmarks;
}

export function getReadingHistory(userId) {
  return readStorage(`site-history-${userId}`, []);
}

export function addReadingHistory(userId, postId) {
  const key = `site-history-${userId}`;
  const history = getReadingHistory(userId);

  const nextHistory = [
    {
      postId,
      visitedAt: new Date().toISOString(),
    },
    ...history.filter((item) => item.postId !== postId),
  ].slice(0, 30);

  writeStorage(key, nextHistory);
  return nextHistory;
}