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
    const slug = f
      .replace(/^.*blog\//, '')
      .replace(/\\\\/g, '/')
      .replace(/\.mdx?$/, '')
      .replace(/^\//, '');

    const url = `/blog/${slug}/`;

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
