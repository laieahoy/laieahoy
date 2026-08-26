import React from 'react';
import Layout from '@theme/Layout';
import CategoryBrowser from '@site/src/components/CategoryBrowser';
import {topCategories} from '@site/src/data/categoryTree';

export default function CategoriesPage() {
  return (
    <Layout
      title="文章分类"
      description="按照主题浏览博客文章"
    >
      <CategoryBrowser
        pathSegments={[]}
        categoryPath={[]}
        category={{
          label: '文章分类',
          description: '按照主题浏览我的博客文章。',
          children: topCategories,
        }}
      />
    </Layout>
  );
}