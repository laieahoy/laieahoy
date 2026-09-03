const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files.push(...walkDir(full));
    } else if (/\.mdx?$/.test(ent.name)) {
      files.push(full);
    }
  }

  return files;
}

function getDocusaurusBlogUrl(filePath, blogDir) {
  const relativePath = path.relative(blogDir, filePath).split(path.sep).join('/');
  const withoutExtension = relativePath.replace(/\.mdx?$/i, '');
  const segments = withoutExtension.split('/');
  const fileName = segments.pop();
  const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})(?:[-_](.+))?$/);

  if (!dateMatch) {
    return `/blog/${withoutExtension.replace(/^\//, '')}/`;
  }

  const [, year, month, day, remainder] = dateMatch;
  const routeParts = [year, month, day];

  if (remainder) {
    routeParts.push(remainder);
  }

  if (segments.length > 0) {
    routeParts.push(...segments);
  }

  return `/blog/${routeParts.join('/')}/`;
}

function build() {
  const blogDir = path.join(__dirname, '..', 'blog');
  const outDir = path.join(__dirname, '..', 'src', 'data');
  const outFile = path.join(outDir, 'categoryArticles.generated.json');

  const files = walkDir(blogDir);
  const articles = [];

  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    const { data } = matter(raw);

    if (!data || !data.title) continue;

    const date = data.date ? String(data.date).slice(0,10) : '1970-01-01';
    const url = getDocusaurusBlogUrl(f, blogDir);

    articles.push({
      title: data.title,
      description: data.description || '',
      categoryPath: data.category || '',
      url,
      date,
    });
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(articles, null, 2), 'utf8');
  console.log('Wrote', outFile, '(', articles.length, 'articles )');
}

if (require.main === module) build();

module.exports = { build };
