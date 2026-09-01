import React, {useCallback, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

function normalizePostFilePath(source) {
  if (!source) {
    return '';
  }

  const cleaned = String(source)
    .replace(/^@site\//, '')
    .replace(/^\.\//, '')
    .replace(/\\/g, '/');

  return cleaned.startsWith('/') ? cleaned.slice(1) : cleaned;
}

export default function BlogPostItemHeaderTitle({className}) {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {permalink, title, source} = metadata;
  const [busy, setBusy] = useState(false);

  const filePath = useMemo(() => normalizePostFilePath(source), [source]);

  const handleDelete = useCallback(async () => {
    if (!filePath) {
      return;
    }

    const confirmed = window.confirm(`确定要删除这篇文章吗？\n\n标题：${title}\n路径：${filePath}`);
    if (!confirmed) {
      return;
    }

    const password = window.prompt('请输入发布密码：', '');
    if (!password) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({filePath, password}),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || '删除失败。');
      }

      window.alert(data.message || '文章删除成功。');
      window.location.href = '/blog';
    } catch (error) {
      window.alert(error.message || '删除失败。');
    } finally {
      setBusy(false);
    }
  }, [filePath, title]);

  const titleNode = isBlogPostPage ? (
    <h1 className={className}>{title}</h1>
  ) : (
    <h2 className={className}>
      <Link to={permalink}>{title}</Link>
    </h2>
  );

  if (!isBlogPostPage || !filePath) {
    return titleNode;
  }

  return (
    <div className={styles.titleRow}>
      {titleNode}
      <div className={styles.actions}>
        <Link className={styles.actionButton} to={`/write?filePath=${encodeURIComponent(filePath)}`}>
          修改
        </Link>
        <button
          type="button"
          className={styles.actionButtonDanger}
          onClick={handleDelete}
          disabled={busy}
        >
          {busy ? '删除中…' : '删除'}
        </button>
      </div>
    </div>
  );
}
