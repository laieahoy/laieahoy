import React, {useState} from 'react';
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
  const [status, setStatus] = useState({
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
            description: form.description.trim(),
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
                '找不到 /api/publish。请使用 Vercel 地址测试，不能直接用 npm start 测试发布。'
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
        </div>
      </main>
    </Layout>
  );
}