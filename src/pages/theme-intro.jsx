import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useSiteTheme} from '@site/src/theme/ThemeProvider';

const themeStory = {
  'spider-man': {
    title: '蜘蛛侠：青春、责任与一根蛛丝',
    subtitle: '彼得·帕克的故事不是“会飞”的英雄，而是一个必须学会承担责任的少年。',
    description:
      '在这个主题里，页面被设计成城市夜空中的蛛网世界：顶部倒挂的蛛丝、伸手抓取的动作、与链接图像交互时的发射反馈，都在模拟“英雄借蛛丝穿过城市”的时刻。它代表的是青春、成长和“能力带来责任”的主线。每一次悬停、落点和点击，都在提醒你：真正的力量来自于承担，而不是单纯地拥有。',
    quote: '“With great power comes great responsibility.”',
    accent: '#c63b43',
    panels: [
      '倒挂姿态：顶部始终像一位伫立在高空的英雄，悬挂着一条蛛丝，像电影中的经典片段。',
      '发射互动：当鼠标接近链接区域时，蛛丝会像一条精准命中目标的触线，拉近“行动前的情绪”。',
      '轻微坠落：悬停在目标元素上时，角色会像突然被触发而轻微下坠，视觉上更有戏剧张力。',
    ],
  },
  'dark-knight': {
    title: '蝙蝠侠：黑暗骑士',
    subtitle: '秩序与混乱在城市的裂缝里相撞，正义在黑暗中被逼到极限。',
    description:
      '这个主题的叙事偏向“无尽压迫与绝望”：低饱和度的暗色调、冷硬的光源与压抑的城市轮廓，让页面像一场不断逼近底线的正义对决。这里没有温柔的光，而是一种近乎残酷的清醒，让每个细节都像电影中最紧绷的时刻。',
    quote: '“The night is darkest just before the dawn.”',
    accent: '#d86857',
    panels: [
      '压迫式构图：页面的光影和轮廓更倾向于强烈的对比，像城市在危机中不断收紧。',
      '沉默的冷光：低温金属色与暗红光感让主题更接近哥谭的法则与恐惧。',
      '悬疑叙事：整体氛围偏压迫、克制，强调“守夜人”面对混乱时的决断与代价。',
    ],
  },
  'dark-knight-rises': {
    title: '蝙蝠侠：黑暗骑士崛起',
    subtitle: '在废墟中重建信念，英雄在黑暗里重新迎来希望的升起。',
    description:
      '这个主题的情绪更偏“复苏”：破败、风暴、重建和希望在同一张页面中交织。金黄的光线从阴影中浮起，像所有失去的东西在最后被重新命名为信念，城市在灰烬和废墟中重新站起来。',
    quote: '“A hero can be anyone.”',
    accent: '#d58a4d',
    panels: [
      '重建感：画面的层次和空间感更强调从破败走向新生的过程。',
      '光的回升：金色与暖灰在暗色中串联，像希望从城市底部缓慢升起。',
      '终章情绪：整体更具决意与升华，收束于“守护城市，不只是靠力量，而靠信念”。',
    ],
  },
  'batman-begins': {
    title: '蝙蝠侠：侠影之谜',
    subtitle: '这是恐惧、成长和信念的起点，英雄在黑暗中学会守护城市。',
    description:
      '这个主题的叙事更偏“黑暗中的灯塔”：蝙蝠翅膀、警示灯、风与雾都被用来塑造哥谭的电影氛围。这里的设计强调对比：黑暗中有一丝惊艳的金黄，与压迫感相互照应，像布鲁斯·韦恩在黑暗里逐渐成长成守夜人。',
    quote: '“I am the night.”',
    accent: '#d4a650',
    panels: [
      '蝙蝠翅膀：从夜空中划过的蝙蝠感，让页面具有压迫感却不失电影质感。',
      '警示灯：金色光源是哥谭城里的希望与警示，是黑暗里的信号。',
      '沉重氛围：主题呈现更低调、厚重且压抑，像电影中最经典的黑暗时刻。',
    ],
  },
  'minimal-light': {
    title: '简洁版 · 亮色',
    subtitle: '清爽的阅读体验，专注内容与排版',
    description:
      '简洁亮色主题提供纯粹的阅读环境：白色背景与高对比文本，让文章在白天或明亮环境中更易阅读。适合偏好清晰排版和浅色界面的读者。',
    quote: '“Less is more.”',
    accent: '#43816a',
    panels: [
      '高对比文本：黑色正文配合明亮背景保证阅读清晰性。',
      '无场景干扰：去除装饰性场景元素，减少视觉干扰。',
      '专注排版：更大的行高与合适的字重，提升长文可读性。',
    ],
  },
  'minimal-dark': {
    title: '简洁版 · 暗色',
    subtitle: '低亮度、保护视力且专注的阅读模式',
    description:
      '简洁暗色主题为夜间或低光环境打造：深色背景与柔和对比文字，减少视觉疲劳，适合夜间阅读或喜欢暗色界面的用户。',
    quote: '“Read comfortably at night.”',
    accent: '#79d3ab',
    panels: [
      '柔和的对比：文本不会过分刺眼，同时保持足够的清晰度。',
      '无场景干扰：保留简洁风格，突出内容本身。',
      '适配夜间：为低光环境优化的背景与色温。',
    ],
  },
};

export default function ThemeIntroPage() {
  const {theme} = useSiteTheme();
  const story = themeStory[theme?.id] || themeStory['spider-man'];

  return (
    <Layout title="主题介绍" description={story.title}>
      <main style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '4rem 1.25rem 5rem',
      }}>
        <div style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.12)',
          marginBottom: '2rem',
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: story.accent,
            fontWeight: 700,
          }}>
            Theme Introduction
          </p>
          <h1 style={{
            margin: '0.8rem 0 0.5rem',
            fontSize: 'clamp(2.3rem, 4vw, 4rem)',
            color: '#fff',
          }}>
            {story.title}
          </h1>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.78)',
            fontSize: '1.02rem',
            lineHeight: 1.8,
          }}>
            {story.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '1.5rem',
        }}>
          <section style={{
            padding: '1.6rem',
            borderRadius: 18,
            background: 'rgba(10,12,18,0.42)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <h2 style={{ marginTop: 0, color: '#fff', fontSize: '1.5rem' }}>故事背景</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9 }}>
              {story.description}
            </p>
            <blockquote style={{
              marginTop: '1.5rem',
              padding: '1rem 1.1rem',
              borderLeft: `3px solid ${story.accent}`,
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              fontStyle: 'italic',
            }}>
              {story.quote}
            </blockquote>
          </section>

          <aside style={{
            padding: '1.6rem',
            borderRadius: 18,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>设计亮点</h3>
            <ul style={{
              margin: 0,
              paddingLeft: '1.2rem',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.9,
            }}>
              {story.panels.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '2.8rem',
              padding: '0 1.1rem',
              borderRadius: 999,
              background: story.accent,
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            回到首页
          </Link>
        </div>
      </main>
    </Layout>
  );
}
