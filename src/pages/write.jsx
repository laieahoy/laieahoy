import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import styles from '@site/src/pages/write.module.css';

const initialForm = {
  title: '',
  description: '',
  tags: '算法, 题解, coci',
  content: '',
  password: '',
};

function formatPostDate(date) {
  if (!date) {
    return '日期未知';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('zh-CN');
}

function parseTags(value) {
  return [
    ...new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    ),
  ];
}

export default function WritePage() {
  const [form, setForm] = useState(initialForm);
  const [publishing, setPublishing] = useState(false);
  const [posts, setPosts] = useState([]);
const [loadingPosts, setLoadingPosts] = useState(true);
const [postsError, setPostsError] = useState('');

async function loadPosts() {
  setLoadingPosts(true);
  setPostsError('');

  try {
    const response = await fetch('/api/posts', {
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '读取文章列表失败。');
    }

    setPosts(data.posts || []);
  } catch (error) {
    setPostsError(error.message || '读取文章列表失败。');
  } finally {
    setLoadingPosts(false);
  }
}

useEffect(() => {
  loadPosts();
}, []);

  const [status, setStatus] = useState({
    type: '',
    text: '',
    commitUrl: '',
  });

  const [deleteForm, setDeleteForm] = useState({
    filePath: '',
    password: '',
  });

  const [deleting, setDeleting] = useState(false);

  const [deleteStatus, setDeleteStatus] = useState({
    type: '',
    text: '',
    commitUrl: '',
  });

  function handleChange(event) {
    const {name, value} = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus({
      type: '',
      text: '',
      commitUrl: '',
    });

    const title = form.title.trim();
    const description = form.description.trim();
    const content = form.content.trim();
    const tags = parseTags(form.tags);

    if (!title) {
      setStatus({
        type: 'error',
        text: '请输入文章标题。',
        commitUrl: '',
      });
      return;
    }

    if (!content) {
      setStatus({
        type: 'error',
        text: '请输入文章正文。',
        commitUrl: '',
      });
      return;
    }

    if (!form.password) {
      setStatus({
        type: 'error',
        text: '请输入发布密码。',
        commitUrl: '',
      });
      return;
    }

    if (tags.length === 0) {
      setStatus({
        type: 'error',
        text: '至少填写一个标签。',
        commitUrl: '',
      });
      return;
    }

    setPublishing(true);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          tags,
          content,
          password: form.password,
        }),
      });

      const rawText = await response.text();

      let data = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(data.message || '发布密码错误。');
        }

        if (response.status === 404) {
          throw new Error(
            data.message ||
              '找不到 /api/publish。请使用 Vercel 地址测试发布。'
          );
        }

        throw new Error(
          data.message || `发布失败，HTTP 状态码：${response.status}`
        );
      }

      setStatus({
        type: 'success',
        text: `文章已经提交到 GitHub：${data.filePath}`,
        commitUrl: data.commitUrl || '',
      });

      // 发布成功后，自动把文章路径填入删除区域。
    setDeleteForm({
    filePath: data.filePath || '',
    password: '',
    });

    await loadPosts();

      setForm((current) => ({
        ...current,
        password: '',
      }));
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.message || '发布失败，请稍后重试。',
        commitUrl: '',
      });
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();

    setDeleteStatus({
      type: '',
      text: '',
      commitUrl: '',
    });

    const filePath = deleteForm.filePath.trim();

    if (!filePath) {
      setDeleteStatus({
        type: 'error',
        text: '请输入要删除的文章路径。',
        commitUrl: '',
      });
      return;
    }

    if (!deleteForm.password) {
      setDeleteStatus({
        type: 'error',
        text: '请输入发布密码。',
        commitUrl: '',
      });
      return;
    }

    const selectedPost = posts.find((post) => post.filePath === filePath);
    const postTitle = selectedPost?.title || filePath;

    const confirmed = window.confirm(
    `确定要删除这篇文章吗？\n\n标题：${postTitle}\n路径：${filePath}\n\n此操作不可撤销。`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath,
          password: deleteForm.password,
        }),
      });

      const rawText = await response.text();

      let data = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || `删除失败，HTTP 状态码：${response.status}`
        );
      }

      setDeleteStatus({
        type: 'success',
        text: data.message || '文章删除成功。',
        commitUrl: data.commitUrl || '',
      });

    setDeleteForm({
    filePath: '',
    password: '',
    });

    await loadPosts();
    } catch (error) {
      setDeleteStatus({
        type: 'error',
        text: error.message || '删除失败，请稍后重试。',
        commitUrl: '',
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Layout
      title="写文章"
      description="在线编写并发布 Markdown 博客文章"
    >
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>写文章</h1>
          <p>
            在这里编写 Markdown，发布后文章会自动保存到 GitHub。
          </p>
        </header>

        <div className={styles.editorLayout}>
          <form
            className={styles.panel}
            onSubmit={handleSubmit}
          >
            <h2 className={styles.panelTitle}>文章信息</h2>

            <div className={styles.field}>
              <label htmlFor="title">标题</label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="例如：COCI 2023/2024 题解"
                maxLength={120}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">文章描述</label>
              <input
                id="description"
                name="description"
                type="text"
                value={form.description}
                onChange={handleChange}
                placeholder="可选，用于文章摘要"
                maxLength={300}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="tags">
                标签
                <span className={styles.labelHint}>
                  用英文逗号分隔
                </span>
              </label>

              <input
                id="tags"
                name="tags"
                type="text"
                value={form.tags}
                onChange={handleChange}
                placeholder="算法, 题解, coci"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="content">Markdown 正文</label>
              <textarea
                id="content"
                name="content"
                className={styles.contentInput}
                value={form.content}
                onChange={handleChange}
                placeholder={'# 文章标题\n\n开始写文章……'}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">发布密码</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="输入 Vercel 中设置的作者密码"
                autoComplete="off"
              />
            </div>

            <div className={styles.actions}>
              <button
                className={styles.publishButton}
                type="submit"
                disabled={publishing}
              >
                {publishing ? '正在发布……' : '发布到 GitHub'}
              </button>
            </div>

            {status.text && (
              <div
                className={
                  status.type === 'success'
                    ? styles.success
                    : styles.error
                }
              >
                <p>{status.text}</p>

                {status.commitUrl && (
                  <a
                    href={status.commitUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看 GitHub 提交
                  </a>
                )}
              </div>
            )}
          </form>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>实时预览</h2>

            <div className={styles.preview}>
              {form.content.trim() ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {form.content}
                </ReactMarkdown>
              ) : (
                <p className={styles.previewPlaceholder}>
                  在左侧输入 Markdown 后，这里会显示预览。
                </p>
              )}
            </div>
          </section>

          <section className={`${styles.panel} ${styles.deletePanel}`}>
            <h2 className={styles.panelTitle}>删除文章</h2>

            <form onSubmit={handleDelete}>
              <div className={styles.field}>
                <label htmlFor="delete-file-path">
                  文章文件路径
                </label>

                <input
                  id="delete-file-path"
                  type="text"
                  value={deleteForm.filePath}
                  onChange={(event) =>
                    setDeleteForm((current) => ({
                      ...current,
                      filePath: event.target.value,
                    }))
                  }
                  placeholder="例如：blog/2026-08-26-my-post.md"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="delete-password">发布密码</label>

                <input
                  id="delete-password"
                  type="password"
                  value={deleteForm.password}
                  onChange={(event) =>
                    setDeleteForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="输入 Vercel 中设置的作者密码"
                  autoComplete="off"
                />
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.deleteButton}
                  type="submit"
                  disabled={deleting}
                >
                  {deleting ? '正在删除……' : '删除文章'}
                </button>
              </div>

              {deleteStatus.text && (
                <div
                  className={
                    deleteStatus.type === 'success'
                      ? styles.success
                      : styles.error
                  }
                >
                  <p>{deleteStatus.text}</p>

                  {deleteStatus.commitUrl && (
                    <a
                      href={deleteStatus.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      查看 GitHub 提交
                    </a>
                  )}
                </div>
              )}
            </form>
          </section>
          <section className={`${styles.panel} ${styles.deletePanel}`}>
  <h2 className={styles.panelTitle}>删除文章</h2>

  <form onSubmit={handleDelete}>
    <div className={styles.field}>
      <label htmlFor="delete-file-path">选择要删除的文章</label>

      {loadingPosts ? (
        <p>正在读取文章列表……</p>
      ) : postsError ? (
        <div className={styles.error}>
          <p>{postsError}</p>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={loadPosts}
          >
            重新读取
          </button>
        </div>
      ) : posts.length === 0 ? (
        <p className={styles.previewPlaceholder}>
          暂时没有找到文章。
        </p>
      ) : (
        <select
                id="delete-file-path"
                value={deleteForm.filePath}
                onChange={(event) =>
                    setDeleteForm((current) => ({
                    ...current,
                    filePath: event.target.value,
                    }))
                }
                >
                <option value="">请选择一篇文章</option>

                {posts.map((post) => (
                    <option key={post.filePath} value={post.filePath}>
                    {post.title} · {formatPostDate(post.date)}
                    </option>
                ))}
                </select>
            )}
            </div>

            {deleteForm.filePath && (
            <p className={styles.selectedPost}>
                将删除：
                <strong>
                {posts.find(
                    (post) => post.filePath === deleteForm.filePath
                )?.title || deleteForm.filePath}
                </strong>
                <br />
                <span>{deleteForm.filePath}</span>
            </p>
            )}

            <div className={styles.field}>
            <label htmlFor="delete-password">发布密码</label>

            <input
                id="delete-password"
                type="password"
                value={deleteForm.password}
                onChange={(event) =>
                setDeleteForm((current) => ({
                    ...current,
                    password: event.target.value,
                }))
                }
                placeholder="输入 Vercel 中设置的作者密码"
                autoComplete="off"
            />
            </div>

            <div className={styles.actions}>
            <button
                className={styles.deleteButton}
                type="submit"
                disabled={deleting || posts.length === 0}
            >
                {deleting ? '正在删除……' : '删除选中的文章'}
            </button>
            </div>

            {deleteStatus.text && (
            <div
                className={
                deleteStatus.type === 'success'
                    ? styles.success
                    : styles.error
                }
            >
                <p>{deleteStatus.text}</p>

                {deleteStatus.commitUrl && (
                <a
                    href={deleteStatus.commitUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    查看 GitHub 提交
                </a>
                )}
            </div>
            )}
        </form>
        </section>
        </div>
      </main>
    </Layout>
  );
}