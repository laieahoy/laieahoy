export const topCategories = [
  {
    slug: 'algorithm',
    label: '算法',
    tag: '算法',
    description: '算法题解、竞赛记录和数据结构学习。',
    count: 2,
    children: [
      {
        slug: 'solutions',
        label: '题解',
        tag: '题解',
        description: '各类算法题目和竞赛题解。',
        count: 2,
        children: [
          {
            slug: 'coci',
            label: 'COCI',
            tag: 'coci',
            description: 'COCI 相关竞赛题解。',
            count: 2,
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

export function findCategory(pathSegments) {
  let currentList = topCategories;
  let current = null;

  for (const segment of pathSegments) {
    current = currentList.find(
      (category) => category.slug === segment
    );

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
    const current = currentList.find(
      (category) => category.slug === segment
    );

    if (!current) {
      break;
    }

    path.push(current);
    currentList = current.children || [];
  }

  return path;
}