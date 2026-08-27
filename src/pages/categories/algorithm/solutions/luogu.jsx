import React from 'react';
import Layout from '@theme/Layout';
import CategoryBrowser from '@site/src/components/CategoryBrowser';
import {
  findCategory,
  getCategoryPath,
} from '@site/src/data/categoryTree';

export default function LuoguCategoryPage() {
  const pathSegments = ['algorithm', 'solutions', 'luogu'];
  const category = findCategory(pathSegments);
  const categoryPath = getCategoryPath(pathSegments);

  return (
    <Layout
      title="洛谷题解"
      description="洛谷题解与专题整理"
    >
      <CategoryBrowser
        pathSegments={pathSegments}
        categoryPath={categoryPath}
        category={category}
      />
    </Layout>
  );
}
