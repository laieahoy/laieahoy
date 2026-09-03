import React, {useEffect, useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import styles from '@site/src/pages/write.module.css';
import {getCategoryOptions} from '@site/src/data/categoryTree';

const latexSnippets = [
  {label: '分式', value: '\\frac{a}{b}'},
  {label: '积分', value: '\\int_a^b f(x) \\, dx'},
  {label: '求和', value: '\\sum_{i=1}^{n} i^2'},
  {label: '极限', value: '\\lim_{n \\to \\infty} \\frac{1}{n}'},
  {label: '根号', value: '\\sqrt{x^2 + y^2}'},
  {label: '矩阵', value: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'},
  {
    label: '公式块',
    value: String.raw`\[
\begin{aligned}
(a+b)^2 &= a^2 + 2ab + b^2\\
(a-b)^2 &= a^2 - 2ab + b^2
\end{aligned}
\]`,
  },
];

const initialForm = {
  title: '',
  description: '',
  tags: '算法, 题解, 比赛',
  category: 'algorithm/solutions/competition',
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
  return [...new Set((value || '').split(',').map((tag) => tag.trim()).filter(Boolean))];
}

async function readJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return {};
  }

  if (trimmed.startsWith('<')) {
    throw new Error('当前环境没有可用的文章 API，建议在 Vercel/后台环境中运行后端服务。');
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error('返回内容不是有效 JSON，可能是本地开发环境没有配置后端 API。');
  }
}

export default function WritePage() {
  const [form, setForm] = useState(initialForm);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [doublePane, setDoublePane] = useState(true);
  const [selectedFilePath, setSelectedFilePath] = useState('');
  const [originalDate, setOriginalDate] = useState('');
  const [originalArticle, setOriginalArticle] = useState(null);
  const [posts, setPosts] = useState([]);
  const initialFilePath = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    const params = new URLSearchParams(window.location.search);
    return params.get('filePath') || '';
  }, []);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [status, setStatus] = useState({ type: '', text: '', commitUrl: '' });
  const [deleteStatus, setDeleteStatus] = useState({ type: '', text: '', commitUrl: '' });
  const textareaRef = useRef(null);

  const categoryOptions = useMemo(() => getCategoryOptions(), []);
  const selectedPost = posts.find((post) => post.filePath === selectedFilePath) || null;

  function insertLatexSnippet(snippet) {
    const textarea = textareaRef.current;
    const start = textarea ? textarea.selectionStart : form.content.length;
    const end = textarea ? textarea.selectionEnd : form.content.length;
    const nextContent = `${form.content.slice(0, start)}${snippet}${form.content.slice(end)}`;

    setForm((current) => ({ ...current, content: nextContent }));

    requestAnimationFrame(() => {
      if (!textarea) {
        return;
      }

      textarea.focus();
      const nextCursor = start + snippet.length;
      textarea.selectionStart = nextCursor;
      textarea.selectionEnd = nextCursor;
    });
  }

  async function loadArticleByPath(filePath) {
    if (!filePath) {
      setOriginalDate('');
      setOriginalArticle(null);
      setForm((current) => ({
        ...current,
        title: '',
        description: '',
        tags: '',
        category: 'algorithm/solutions/competition',
        content: '',
        password: '',
      }));
      setSelectedFilePath('');
      return;
    }

    setSelectedFilePath(filePath);
    setDeleteStatus({ type: '', text: '', commitUrl: '' });

    try {
      const response = await fetch(`/api/post?filePath=${encodeURIComponent(filePath)}`);
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.message || '读取文章失败。');
      }

      const article = data.post || {};
      const nextForm = {
        title: article.title || '',
        description: article.description || '',
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
        category: article.category || 'algorithm/solutions/competition',
        content: article.content || '',
        password: '',
      };
      const normalizedArticle = {
        ...article,
        filePath: filePath,
        date: article.date || '',
        tags: Array.isArray(article.tags) ? [...article.tags] : [],
      };

      setOriginalDate(normalizedArticle.date || '');
      setOriginalArticle(normalizedArticle);
      setForm((current) => ({ ...current, ...nextForm }));
      setStatus({
        type: 'success',
        text: `已加载文章：${article.title || filePath}`,
        commitUrl: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.message || '读取文章失败。',
        commitUrl: '',
      });
    }
  }

  async function loadPosts() {
    setLoadingPosts(true);
    setPostsError('');

    try {
      const response = await fetch('/api/posts', { cache: 'no-store' });
      const data = await readJsonResponse(response);

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

  useEffect(() => {
    if (initialFilePath) {
      loadArticleByPath(initialFilePath);
    }
  }, [initialFilePath]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSelectArticle(event) {
    const filePath = event.target.value;
    await loadArticleByPath(filePath);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', text: '', commitUrl: '' });

    const title = form.title.trim();
    const description = form.description.trim();
    const content = form.content.trim();
    const tags = parseTags(form.tags);
    const category = form.category.trim();

    if (!title) {
      setStatus({ type: 'error', text: '请输入文章标题。', commitUrl: '' });
      return;
    }

    if (!content) {
      setStatus({ type: 'error', text: '请输入文章正文。', commitUrl: '' });
      return;
    }

    if (!category) {
      setStatus({ type: 'error', text: '请选择文章分类。', commitUrl: '' });
      return;
    }

    if (!form.password) {
      setStatus({ type: 'error', text: '请输入发布密码。', commitUrl: '' });
      return;
    }

    if (tags.length === 0) {
      setStatus({ type: 'error', text: '至少填写一个标签。', commitUrl: '' });
      return;
    }

    setPublishing(true);

    try {
      const endpoint = selectedFilePath ? '/api/update' : '/api/publish';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: selectedFilePath,
          title,
          description,
          tags,
         category,
content,
date: originalDate,
password: form.password,
        }),
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(data.message || '密码错误。');
        }
        throw new Error(data.message || `保存失败，HTTP 状态码：${response.status}`);
      }

      const savedPath = data.filePath || selectedFilePath;
      const savedDate = originalDate || new Date().toISOString();

      setSelectedFilePath(savedPath);
      setOriginalDate(savedDate);
      setOriginalArticle({
        filePath: savedPath,
        title: title,
        description: description,
        category: category,
        tags: tags,
        content: content,
        date: savedDate,
      });
      setStatus({
        type: 'success',
        text: selectedFilePath ? `文章更新成功：${savedPath}` : `文章已发布：${savedPath}`,
        commitUrl: data.commitUrl || '',
      });

      await loadPosts();
      setForm((current) => ({ ...current, password: '' }));
    } catch (error) {
      setStatus({ type: 'error', text: error.message || '保存失败，请稍后重试。', commitUrl: '' });
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    const filePath = selectedFilePath;

    if (!filePath) {
      setDeleteStatus({ type: 'error', text: '请先选择或加载一篇要删除的文章。', commitUrl: '' });
      return;
    }

    const selectedPost = posts.find((post) => post.filePath === filePath);
    const confirmed = window.confirm(`确定要删除这篇文章吗？\n\n标题：${selectedPost?.title || filePath}\n路径：${filePath}\n\n此操作不可撤销。`);

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setDeleteStatus({ type: '', text: '', commitUrl: '' });

    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          password: form.password,
        }),
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.message || `删除失败，HTTP 状态码：${response.status}`);
      }

      setDeleteStatus({
        type: 'success',
        text: data.message || '文章删除成功。',
        commitUrl: data.commitUrl || '',
      });

      setSelectedFilePath('');
      setOriginalDate('');
      setOriginalArticle(null);
      setForm((current) => ({
        ...initialForm,
        password: '',
      }));
      await loadPosts();
    } catch (error) {
      setDeleteStatus({ type: 'error', text: error.message || '删除失败，请稍后重试。', commitUrl: '' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Layout title="写文章" description="在线编写并发布 Markdown 博客文章">
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>写文章</h1>
          <p>在这里编写 Markdown，并支持直接分类、加载已有文章与密码编辑。</p>
        </header>

        <div className={styles.workspaceHeader}>
          <div className={styles.modeToggle}>
            <button type="button" className={!doublePane ? styles.modeButtonActive : ''} onClick={() => setDoublePane(false)}>
              单页模式
            </button>
            <button type="button" className={doublePane ? styles.modeButtonActive : ''} onClick={() => setDoublePane(true)}>
              双页模式
            </button>
          </div>
        </div>

        <div className={`${styles.editorLayout} ${doublePane ? '' : styles.singlePane}`}>
          <form className={styles.panel} onSubmit={handleSubmit}>
            <h2 className={styles.panelTitle}>{selectedFilePath ? '编辑现有文章' : '新建文章'}</h2>

            <div className={styles.field}>
              <label htmlFor="article-select">已发布文章</label>
              <select id="article-select" value={selectedFilePath} onChange={handleSelectArticle}>
                <option value="">新建文章</option>
                {posts.map((post) => (
                  <option key={post.filePath} value={post.filePath}>
                    {post.title} · {formatPostDate(post.date)}
                  </option>
                ))}
              </select>
            </div>

            {selectedPost && (
              <div className={styles.savedArticleCard}>
                <div>
                  <strong>{selectedPost.title}</strong>
                  <span>{formatPostDate(selectedPost.date)}</span>
                </div>
                <button type="button" className={styles.secondaryButton} onClick={() => loadArticleByPath(selectedPost.filePath)}>
                  重新加载编辑
                </button>
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="title">标题</label>
              <input id="title" name="title" type="text" value={form.title} onChange={handleChange} placeholder="例如：COCI 2023/2024 题解" maxLength={120} />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">文章描述</label>
              <input id="description" name="description" type="text" value={form.description} onChange={handleChange} placeholder="可选，用于文章摘要" maxLength={300} />
            </div>

            <div className={styles.field}>
              <label htmlFor="category">分类</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                <option value="">请选择分类</option>
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {`${'　'.repeat(category.depth)}${category.label}`}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="tags">
                标签
                <span className={styles.labelHint}>用英文逗号分隔</span>
              </label>
              <input id="tags" name="tags" type="text" value={form.tags} onChange={handleChange} placeholder="算法, 题解, 比赛" />
            </div>

            <div className={styles.field}>
              <label htmlFor="content">Markdown 正文</label>
              <div className={styles.latexToolbar}>
                <div className={styles.latexHeaderRow}>
                  <span className={styles.latexTitle}>数学速查</span>
                  <a
                    className={styles.latexLink}
                    href="https://katex.org/docs/support_table"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LATEX 公式写法大全
                  </a>
                </div>
                <div className={styles.latexChips}>
                  {latexSnippets.map((snippet) => (
                    <button
                      key={snippet.label}
                      type="button"
                      className={styles.latexChip}
                      onClick={() => insertLatexSnippet(snippet.value)}
                      title={snippet.label}
                    >
                      {snippet.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                ref={textareaRef}
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
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="输入 Vercel 中设置的作者密码" autoComplete="off" />
            </div>

            <div className={styles.actions}>
              <button className={styles.publishButton} type="submit" disabled={publishing}>
                {publishing ? (selectedFilePath ? '正在保存……' : '正在发布……') : (selectedFilePath ? '保存更新' : '发布到 GitHub')}
              </button>
            </div>

            {selectedFilePath && (
              <div className={styles.deleteActionBar}>
                <span>编辑中：{selectedFilePath}</span>
                <button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={deleting || !form.password}>
                  {deleting ? '正在删除……' : '删除当前文章'}
                </button>
              </div>
            )}

            {postsError && (
              <div className={styles.error}>
                <p>{postsError}</p>
              </div>
            )}

            {status.text && (
              <div className={status.type === 'success' ? styles.success : styles.error}>
                <p>{status.text}</p>
                {status.commitUrl && <a href={status.commitUrl} target="_blank" rel="noreferrer">查看 GitHub 提交</a>}
              </div>
            )}

            {deleteStatus.text && (
              <div className={deleteStatus.type === 'success' ? styles.success : styles.error}>
                <p>{deleteStatus.text}</p>
                {deleteStatus.commitUrl && <a href={deleteStatus.commitUrl} target="_blank" rel="noreferrer">查看 GitHub 提交</a>}
              </div>
            )}
          </form>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>实时预览</h2>

            <div className={styles.preview}>
              {form.content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{form.content}</ReactMarkdown>
              ) : (
                <p className={styles.previewPlaceholder}>在左侧输入 Markdown 后，这里会显示预览。</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}