// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('@docusaurus/types').Config} */

const config = {
  // 网站基本信息
  title: '505 Not Found',
  tagline: '这里没有找到答案，但找到了一个博客。',
  favicon: 'img/favicon.ico',

  // 网站语言设置
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
      },
    },
  },

  // 正式部署地址
  // 本地开发时可以暂时保留当前配置
  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  // GitHub Pages 配置
  organizationName: 'your-github-name',
  projectName: 'your-repository-name',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          sidebarPath: './sidebars.js',
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },

blog: {
  showReadingTime: true,
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
},

        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // 网站分享卡片
      image: 'img/docusaurus-social-card.jpg',

      // 搜索引擎描述
      metadata: [
        {
          name: 'keywords',
          content: '技术博客, 学习笔记, 中文教程, 编程, 开发',
        },
        {
          name: 'description',
          content: '一个记录技术、学习、项目与思考的个人博客。',
        },
      ],

      // 深色 / 浅色模式
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
        disableSwitch: false,
      },

      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },

      // 顶部导航栏
      navbar: {
        title: '505 Not Found',
        logo: {
          alt: '505 Not Found Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/blog',
            label: '博客',
            position: 'left',
          },
          {
            to: '/categories',
            label: '分类',
            position: 'left',
          },
          {
            to: '/blog/tags',
            label: '标签',
            position: 'left',
          },
          {
            to: '/blog/archive',
            label: '归档',
            position: 'left',
          },
          {
            to: '/write',
            label: '写文章',
            position: 'right',
          },
        ],
      },

      // 页脚
      // 使用 light 可以让页脚跟随 CSS 深浅色变量变化
      footer: {
        style: 'light',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '教程首页',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '学习资源',
            items: [
              {
                label: '博客文章',
                to: '/blog',
              },
              {
                label: '开始使用',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '相关链接',
            items: [
              {
                label: 'GitHub 项目',
                href: 'https://github.com/你的用户名/你的仓库名',
              },
            ],
          },
        ],
        copyright: `版权所有 © ${new Date().getFullYear()} 505 Not Found。使用 Docusaurus 构建。`,
      },

      // 代码高亮主题
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          'bash',
          'java',
          'python',
          'json',
          'yaml',
        ],
      },
    }),

  // 数学公式所需的 KaTeX 样式
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
      type: 'text/css',
    },
  ],
  
themes: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      hashed: true,
      language: ["en", "zh"],
      indexDocs: false,
      indexBlog: true,
      indexPages: false,
      docsRouteBasePath: [
        "/docs",
        "/math",
        "/algorithm-beginner",
        "/algorithm-intermediate",
        "/algorithm-advanced",
        "/problem-solution",
      ],
      docsDir: [
        "docs",
        "math",
        "algorithm/beginner",
        "algorithm/intermediate",
        "algorithm/advanced",
        "algorithm/problemsolution",
      ],
      blogRouteBasePath: "/blog",
      blogDir: "blog",
      highlightSearchTermsOnTargetPage: true,
      searchResultLimits: 10,
    },
  ],
],
};

export default config;
