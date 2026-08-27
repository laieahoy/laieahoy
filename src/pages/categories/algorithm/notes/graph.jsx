import React from 'react';
import Layout from '@theme/Layout';
import CategoryBrowser from '@site/src/components/CategoryBrowser';
import {
  findCategory,
  getCategoryPath,
} from '@site/src/data/categoryTree';

export default function AlgorithmNotesGraphPage() {
  const pathSegments = ['algorithm', 'notes', 'graph'];
  const category = findCategory(pathSegments);
  const categoryPath = getCategoryPath(pathSegments);

  return (
    <Layout
      title="图论笔记"
      description="图搜索、最短路和拓扑结构"
    >
      <CategoryBrowser
        pathSegments={pathSegments}
        categoryPath={categoryPath}
        category={category}
      />
    </Layout>
  );
}
