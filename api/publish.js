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

function normalizeTags(value) {
  const rawTags = Array.isArray(value)
    ? value
    : String(value || '').split(',');

  return [
    ...new Set(
      rawTags
        .map((tag) =>
          String(tag)
            .replace(/[\r\n]/g, ' ')
            .trim()
        )
        .filter(Boolean)
    ),
  ].slice(0, 20);
}

function makeSlug(title) {
  const slug = String(title)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

  return slug || `post-${Date.now()}`;
}

function encodeGithubPath(filePath) {
  return filePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function yamlString(value) {
  return JSON.stringify(String(value || ''));
}
function buildMarkdown({
  title,
  description,
  tags,
  category,
  content,
  date,
}) {
  return [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `date: ${date}`,
    `category: ${yamlString(category)}`,
    'tags:',
    ...tags.map((tag) => `  - ${yamlString(tag)}`),
    '---',
    '',
    '<!-- truncate -->',
    '',
    content.trim(),
    '',
  ].join('\n');
}

async function githubRequest(endpoint, options = {}) {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
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

module.exports = async function publishHandler(req, res) {
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

const title = String(body.title || '').trim();
const description = String(body.description || '').trim();
const content = String(body.content || '').trim();
const tags = normalizeTags(body.tags);
const category = String(body.category || '').trim();
const password = String(body.password || '');

  if (!isCorrectPassword(password, process.env.EDITOR_PASSWORD)) {
    return sendJson(res, 401, {
      message: '发布密码错误。',
    });
  }

  if (!title) {
    return sendJson(res, 400, {
      message: '文章标题不能为空。',
    });
  }

  if (!content) {
    return sendJson(res, 400, {
      message: '文章正文不能为空。',
    });
  }

  if (description.length > 300) {
    return sendJson(res, 400, {
      message: '文章描述不能超过 300 个字符。',
    });
  }

  if (content.length > 1000000) {
    return sendJson(res, 400, {
      message: '文章正文不能超过 1 MB。',
    });
  }

if (tags.length === 0) {
  return sendJson(res, 400, {
    message: '至少需要一个标签。',
  });
}

if (!category) {
  return sendJson(res, 400, {
    message: '文章分类不能为空。',
  });
}

  const owner = process.env.GITHUB_OWNER.trim();
  const repository = process.env.GITHUB_REPO.trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const slug = makeSlug(title);
  const filePath = `blog/${date}-${slug}.md`;

const markdown = buildMarkdown({
  title,
  description,
  tags,
  category,
  content,
  date: now.toISOString(),
});

  const githubPath = encodeGithubPath(filePath);
  const endpoint =
    `/repos/${encodeURIComponent(owner)}` +
    `/${encodeURIComponent(repository)}` +
    `/contents/${githubPath}`;

  try {
    const result = await githubRequest(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `发布文章：${title}`,
        content: Buffer.from(markdown, 'utf8').toString('base64'),
        branch,
      }),
    });

    return sendJson(res, 200, {
      message: '文章发布成功。',
      filePath,
      commitUrl: result.commit?.html_url || '',
      contentUrl: result.content?.html_url || '',
    });
  } catch (error) {
    console.error('[publish]', error.message);

    const statusCode = error.status === 422 ? 409 : 502;

    return sendJson(res, statusCode, {
      message: `保存到 GitHub 失败：${error.message}`,
    });
  }
};