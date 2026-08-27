import React from 'react';
import Layout from '@theme/Layout';
import CategoryBrowser from '@site/src/components/CategoryBrowser';
import {
  findCategory,
  getCategoryPath,
} from '@site/src/data/categoryTree';

export default function LifeCategoryPage() {
  const pathSegments = ['life'];
  const category = findCategory(pathSegments);
  const categoryPath = getCategoryPath(pathSegments);

  return (
    <Layout
      title="生活随笔"
      description="学习记录和个人思考"
    >
      <CategoryBrowser
        pathSegments={pathSegments}
        categoryPath={categoryPath}
        category={category}
      />
    </Layout>
  );
}
