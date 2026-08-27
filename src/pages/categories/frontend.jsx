import React from 'react';
import Layout from '@theme/Layout';
import CategoryBrowser from '@site/src/components/CategoryBrowser';
import {
  findCategory,
  getCategoryPath,
} from '@site/src/data/categoryTree';

export default function FrontendCategoryPage() {
  const pathSegments = ['frontend'];
  const category = findCategory(pathSegments);
  const categoryPath = getCategoryPath(pathSegments);

  return (
    <Layout
      title="前端分类"
      description="React、Docusaurus、工程化和浏览器相关内容"
    >
      <CategoryBrowser
        pathSegments={pathSegments}
        categoryPath={categoryPath}
        category={category}
      />
    </Layout>
  );
}
