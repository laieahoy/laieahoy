const GITHUB_API = 'https://api.github.com';

function sendJson(res, statusCode, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  return res.status(statusCode).json(payload);
}

function encodeGithubPath(filePath) {
  return filePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

async function githubRequest(endpoint) {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'docusaurus-blog-writer',
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

function readFrontMatter(markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);

  if (!match) {
    return {};
  }

  const frontMatter = match[1];
  const titleMatch = frontMatter.match(/^title:\s*(.+)$/m);
  const dateMatch = frontMatter.match(/^date:\s*(.+)$/m);

  return {
    title: titleMatch
      ? titleMatch[1].trim().replace(/^["']|["']$/g, '')
      : '',
    date: dateMatch ? dateMatch[1].trim() : '',
  };
}

module.exports = async function postsHandler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');

    return sendJson(res, 405, {
      message: '只允许使用 GET 请求。',
    });
  }

  const requiredVariables = [
    'GITHUB_TOKEN',
    'GITHUB_OWNER',
    'GITHUB_REPO',
  ];

  const missingVariable = requiredVariables.find(
    (name) => !process.env[name]
  );

  if (missingVariable) {
    return sendJson(res, 500, {
      message: `Vercel 缺少环境变量：${missingVariable}`,
    });
  }

  const owner = process.env.GITHUB_OWNER.trim();
  const repository = process.env.GITHUB_REPO.trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();

  const endpoint =
    `/repos/${encodeURIComponent(owner)}` +
    `/${encodeURIComponent(repository)}` +
    `/git/trees/${encodeURIComponent(branch)}?recursive=1`;

  try {
    const tree = await githubRequest(endpoint);

    const files = (tree.tree || []).filter(
      (item) =>
        item.type === 'blob' &&
        item.path.startsWith('blog/') &&
        item.path.endsWith('.md')
    );

    const posts = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await githubRequest(
            `/repos/${encodeURIComponent(owner)}` +
              `/${encodeURIComponent(repository)}` +
              `/contents/${encodeGithubPath(file.path)}?ref=${encodeURIComponent(branch)}`
          );

          const markdown = Buffer.from(
            content.content || '',
            'base64'
          ).toString('utf8');

          const frontMatter = readFrontMatter(markdown);

          return {
            title: frontMatter.title || file.path.split('/').pop(),
            date: frontMatter.date || '',
            filePath: file.path,
          };
        } catch {
          return {
            title: file.path.split('/').pop(),
            date: '',
            filePath: file.path,
          };
        }
      })
    );

    posts.sort((a, b) => {
      const first = new Date(b.date || 0).getTime();
      const second = new Date(a.date || 0).getTime();

      return first - second;
    });

    return sendJson(res, 200, { posts });
  } catch (error) {
    console.error('[posts]', error.message);

    return sendJson(res, error.status || 502, {
      message: `读取文章列表失败：${error.message}`,
    });
  }
};