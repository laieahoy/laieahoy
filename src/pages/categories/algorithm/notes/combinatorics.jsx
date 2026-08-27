import React from 'react';
import Layout from '@theme/Layout';
import CategoryBrowser from '@site/src/components/CategoryBrowser';
import {
  findCategory,
  getCategoryPath,
} from '@site/src/data/categoryTree';

export default function AlgorithmNotesCombinatoricsPage() {
  const pathSegments = ['algorithm', 'notes', 'combinatorics'];
  const category = findCategory(pathSegments);
  const categoryPath = getCategoryPath(pathSegments);

  return (
    <Layout
      title="组合计数笔记"
      description="排列组合与计数方法归纳"
    >
      <CategoryBrowser
        pathSegments={pathSegments}
        categoryPath={categoryPath}
        category={category}
      />
    </Layout>
  );
}
