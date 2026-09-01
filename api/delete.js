const {timingSafeEqual} = require('node:crypto');

const GITHUB_API = 'https://api.github.com';

function sendJson(res, statusCode, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  return res.status(statusCode).json(payload);
}

function getBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return {};
}


function isCorrectPassword(input, expected) {
  if (!expected) {
    return false;
  }

  const inputBuffer = Buffer.from(String(input || ''), 'utf8');
  const expectedBuffer = Buffer.from(String(expected), 'utf8');

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

function isValidBlogPath(filePath) {
  const normalized = String(filePath || '').replace(/\\/g, '/').trim();

  if (!normalized || !normalized.startsWith('blog/')) {
    return false;
  }

  if (normalized.includes('//') || normalized.includes('..')) {
    return false;
  }

  const segments = normalized.split('/');

  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    return false;
  }

  const lastSegment = segments[segments.length - 1];

  return /^[^/]+\.(md|mdx)$/i.test(lastSegment);
}

function encodeGithubPath(filePath) {
  return filePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
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
    const error = new Error(
      data.message || `GitHub 返回错误：${response.status}`
    );

    error.status = response.status;
    throw error;
  }

  return data;
}

module.exports = async function deleteHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');

    return sendJson(res, 405, {
      message: '只允许使用 POST 请求。',
    });
  }

  const requiredVariables = [
    'GITHUB_TOKEN',
    'GITHUB_OWNER',
    'GITHUB_REPO',
    'EDITOR_PASSWORD',
  ];

  const missingVariable = requiredVariables.find(
    (name) => !process.env[name]
  );

  if (missingVariable) {
    return sendJson(res, 500, {
      message: `Vercel 缺少环境变量：${missingVariable}`,
    });
  }

  const body = getBody(req);

  const filePath = String(body.filePath || '').trim();
  const password = String(body.password || '');

  if (!isCorrectPassword(password, process.env.EDITOR_PASSWORD)) {
    return sendJson(res, 401, {
      message: '发布密码错误。',
    });
  }

  // 只允许删除 blog 目录中的 Markdown 文件。
if (!isValidBlogPath(filePath)) {
  return sendJson(res, 400, {
    message: '文章路径无效，只能删除 blog 目录中的 .md 或 .mdx 文件。',
  });
}

  const owner = process.env.GITHUB_OWNER.trim();
  const repository = process.env.GITHUB_REPO.trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();

  const githubPath = encodeGithubPath(filePath);

  const endpoint =
    `/repos/${encodeURIComponent(owner)}` +
    `/${encodeURIComponent(repository)}` +
    `/contents/${githubPath}`;

  try {
    // 删除 GitHub 文件前，必须先获取该文件当前版本的 sha。
    const file = await githubRequest(
      `${endpoint}?ref=${encodeURIComponent(branch)}`
    );

    const result = await githubRequest(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `删除文章：${filePath}`,
        sha: file.sha,
        branch,
      }),
    });

    return sendJson(res, 200, {
      message: '文章删除成功，网站将在重新部署后更新。',
      filePath,
      commitUrl: result.commit?.html_url || '',
    });
  } catch (error) {
    console.error('[delete]', error.message);

    return sendJson(res, error.status === 404 ? 404 : 502, {
      message: `从 GitHub 删除失败：${error.message}`,
    });
  }
};