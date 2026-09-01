const fs = require('fs');
const path = require('path');
const GITHUB_API = 'https://api.github.com';

function sendJson(res, statusCode, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(statusCode).json(payload);
}

function encodeGithubPath(filePath) {
  return filePath.split('/').map((part) => encodeURIComponent(part)).join('/');
}
function isValidBlogPath(filePath) {
  return (
    /^blog\/[A-Za-z0-9._\-/]+\.(md|mdx)$/i.test(filePath) &&
    !filePath.split('/').includes('..') &&
    !filePath.includes('//')
  );
}
function readFrontMatter(markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) {
    return {};
  }

  const frontMatter = match[1];
  const titleMatch = frontMatter.match(/^title:\s*(.+)$/m);
  const descriptionMatch = frontMatter.match(/^description:\s*(.+)$/m);
  const dateMatch = frontMatter.match(/^date:\s*(.+)$/m);
  const categoryMatch = frontMatter.match(/^category:\s*(.+)$/m);
  const tagsMatch = [...frontMatter.matchAll(/^\s*-\s*(.+)$/gm)].map((entry) => entry[1].trim().replace(/^['"]|['"]$/g, ''));

  return {
    title: titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : '',
    description: descriptionMatch ? descriptionMatch[1].trim().replace(/^['"]|['"]$/g, '') : '',
    date: dateMatch ? dateMatch[1].trim() : '',
    category: categoryMatch ? categoryMatch[1].trim().replace(/^['"]|['"]$/g, '') : '',
    tags: tagsMatch,
    content: markdown.replace(/^---\s*[\s\S]*?\s*---\s*/, '').trim(),
  };
}

async function githubRequest(endpoint, options = {}) {
  const token = String(process.env.GITHUB_TOKEN || '').trim();
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'docusaurus-blog-writer',
      ...(options.headers || {}),
    },
  });

  const rawText = await response.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.message || `GitHub 返回错误：${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function readLocalPost(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error('本地文章不存在');
  }

  const markdown = fs.readFileSync(fullPath, 'utf8');
  const frontMatter = readFrontMatter(markdown);

  return {
    title: frontMatter.title || path.basename(filePath, '.md'),
    description: frontMatter.description || '',
    date: frontMatter.date || '',
    category: frontMatter.category || '',
    tags: frontMatter.tags || [],
    content: frontMatter.content || markdown,
    filePath: String(filePath),
  };
}

module.exports = async function postHandler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { message: '只允许使用 GET 请求。' });
  }

const { filePath } = req.query || {};
const normalizedFilePath = String(filePath || '').trim();

if (!normalizedFilePath) {
  return sendJson(res, 400, {
    message: '缺少文章路径参数。',
  });
}

if (!isValidBlogPath(normalizedFilePath)) {
  return sendJson(res, 400, {
    message: '文章路径无效。',
  });
}

  const hasGitHubConfig =
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO;

  if (!hasGitHubConfig) {
    try {
      const post = readLocalPost(normalizedFilePath);
      return sendJson(res, 200, { post });
    } catch (error) {
      return sendJson(res, 404, { message: `读取文章失败：${error.message}` });
    }
  }

  const owner = process.env.GITHUB_OWNER.trim();
  const repository = process.env.GITHUB_REPO.trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();

  try {
    const content = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodeGithubPath(normalizedFilePath)}?ref=${encodeURIComponent(branch)}`
    );

    const markdown = Buffer.from(content.content || '', 'base64').toString('utf8');
    const frontMatter = readFrontMatter(markdown);

    return sendJson(res, 200, {
      post: {
        title: frontMatter.title || String(filePath).split('/').pop(),
        description: frontMatter.description || '',
        date: frontMatter.date || '',
        category: frontMatter.category || '',
        tags: frontMatter.tags || [],
        content: frontMatter.content || markdown,
        filePath: String(filePath),
      },
    });
  } catch (error) {
    console.error('[post]', error.message);
    return sendJson(res, error.status || 502, { message: `读取文章失败：${error.message}` });
  }
};
