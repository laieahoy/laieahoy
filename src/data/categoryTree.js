let generatedCategoryArticles = [];

try {
  // prefer generated JSON produced by scripts/generateCategories.js
  // during development/build this file will be regenerated automatically
  // and committed by CI or locally via `npm run generate:categories`.
  // eslint-disable-next-line global-require, import/no-dynamic-require
  generatedCategoryArticles = require('@site/src/data/categoryArticles.generated.json');
} catch (e) {
  // fallback to empty list when not present
  generatedCategoryArticles = [];
}

export const categoryArticles = generatedCategoryArticles;

export const topCategories = [
  {
    slug: 'algorithm',
    label: '算法',
    tag: '算法',
    description: '算法题解、竞赛记录和知识沉淀。',
    count: 0,
    children: [
      {
        slug: 'solutions',
        label: '题解',
        tag: '题解',
        description: '各类算法题目和竞赛题解。',
        count: 0,
        children: [
          {
            slug: 'cf',
            label: 'CF',
            tag: 'cf',
            description: 'Codeforces 相关题解与模板。',
            count: 0,
            children: [],
          },
          {
            slug: 'at',
            label: 'AT',
            tag: 'at',
            description: 'AtCoder 相关题解与训练记录。',
            count: 0,
            children: [],
          },
          {
            slug: 'luogu',
            label: '洛谷',
            tag: 'luogu',
            description: '洛谷题解与专题整理。',
            count: 0,
            children: [],
          },
          {
            slug: 'competition',
            label: '比赛',
            tag: 'competition',
            description: 'COCI 与其他竞赛的解题总结。',
            count: 0,
            children: [],
          },
        ],
      },
      {
        slug: 'notes',
        label: '笔记',
        tag: '笔记',
        description: '算法学习、模板和复盘总结。',
        count: 0,
        children: [
          {
            slug: 'dp',
            label: 'DP',
            tag: 'dp',
            description: '动态规划思路与状态转移。',
            count: 0,
            children: [],
          },
          {
            slug: 'graph',
            label: '图论',
            tag: '图论',
            description: '图搜索、最短路和拓扑结构。',
            count: 0,
            children: [],
          },
          {
            slug: 'number-theory',
            label: '数论',
            tag: '数论',
            description: '素数、模运算与同余问题。',
            count: 0,
            children: [],
          },
          {
            slug: 'data-structure',
            label: '数据结构',
            tag: '数据结构',
            description: '栈、队列、树与堆的结构化理解。',
            count: 0,
            children: [],
          },
          {
            slug: 'combinatorics',
            label: '组合计数',
            tag: '组合计数',
            description: '排列组合与计数方法归纳。',
            count: 0,
            children: [],
          },
        ],
      },
    ],
  },
  {
    slug: 'frontend',
    label: '前端',
    tag: '前端',
    description: 'React、Docusaurus、工程化和浏览器相关内容。',
    count: 0,
    children: [],
  },
  {
    slug: 'backend',
    label: '后端',
    tag: '后端',
    description: '服务端、数据库和接口设计。',
    count: 0,
    children: [],
  },
  {
    slug: 'life',
    label: '生活随笔',
    tag: '生活随笔',
    description: '学习记录和个人思考。',
    count: 0,
    children: [],
  },
];

function attachArticleMetadata(list, parentPath = []) {
  list.forEach((category) => {
    const path = [...parentPath, category.slug];
    const directArticles = categoryArticles.filter(
      (article) => article.categoryPath === path.join('/')
    );
    category.articles = directArticles;

    if (category.children?.length) {
      attachArticleMetadata(category.children, path);
    }

    const childTotal = (category.children || []).reduce(
      (sum, child) => sum + (child.count || 0),
      0
    );
    category.count = directArticles.length + childTotal;
  });

  return list;
}

function normalizeCategoryCounts(list) {
  list.forEach((category) => {
    if (category.children?.length) {
      normalizeCategoryCounts(category.children);
    }

    const directArticles = category.articles || [];
    const childTotal = (category.children || []).reduce(
      (sum, child) => sum + (child.count || 0),
      0
    );

    category.count = directArticles.length + childTotal;
  });
}

attachArticleMetadata(topCategories);
normalizeCategoryCounts(topCategories);

export const categoryLookup = new Map();

function registerCategory(category, stack = []) {
  const path = [...stack, category.slug];
  categoryLookup.set(path.join('/'), category);

  (category.children || []).forEach((child) => registerCategory(child, path));
}

topCategories.forEach((category) => registerCategory(category));

export function getCategoryArticles(pathSegments) {
  const category = findCategory(pathSegments);
  if (!category) {
    return [];
  }

  return [...(category.articles || [])];
}

export function findCategory(pathSegments) {
  let currentList = topCategories;
  let current = null;

  for (const segment of pathSegments) {
    current = currentList.find((category) => category.slug === segment);

    if (!current) {
      return null;
    }

    currentList = current.children || [];
  }

  return current;
}

export function getCategoryPath(pathSegments) {
  const path = [];
  let currentList = topCategories;

  for (const segment of pathSegments) {
    const current = currentList.find((category) => category.slug === segment);

    if (!current) {
      break;
    }

    path.push(current);
    currentList = current.children || [];
  }

  return path;
}

export function normalizeCategoryPath(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return String(value)
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getCategoryOptions() {
  const result = [];

  function walk(list, path = []) {
    list.forEach((category) => {
      const nextPath = [...path, category.slug];
      result.push({
        value: nextPath.join('/'),
        label: path.length === 0 ? category.label : `${path.map((item) => item).join(' / ')} / ${category.label}`,
        depth: path.length,
      });

      if (category.children?.length) {
        walk(category.children, nextPath);
      }
    });
  }

  walk(topCategories);
  return result;
}