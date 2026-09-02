const palettes = {
  green: {
    accent: '#43816a',
    accentStrong: '#23483b',
    surface: '#f3f6f1',
    surfaceDark: '#171d1a',
  },

  spider: {
    accent: '#c63b43',
    accentStrong: '#8f202a',
    surface: '#f4f6fa',
    surfaceDark: '#14171f',
  },

  gold: {
    accent: '#a77d28',
    accentStrong: '#715116',
    surface: '#f5f2e8',
    surfaceDark: '#181815',
  },

  red: {
    accent: '#b33c42',
    accentStrong: '#791f25',
    surface: '#f6f3f3',
    surfaceDark: '#15171c',
  },

  orange: {
    accent: '#b66e3d',
    accentStrong: '#82451f',
    surface: '#f4f1ef',
    surfaceDark: '#1d1b1a',
  },

  forest: {
    accent: '#5a9156',
    accentStrong: '#376836',
    surface: '#f3f8ef',
    surfaceDark: '#182018',
  },

  brown: {
    accent: '#b26b2d',
    accentStrong: '#784216',
    surface: '#fbf4e8',
    surfaceDark: '#202018',
  },

  snow: {
    accent: '#4d88a1',
    accentStrong: '#286177',
    surface: '#f2f8fa',
    surfaceDark: '#152027',
  },

  purple: {
    accent: '#825fb5',
    accentStrong: '#51367d',
    surface: '#f5f2fa',
    surfaceDark: '#1c1825',
  },

  blue: {
    accent: '#317e9d',
    accentStrong: '#1d526b',
    surface: '#eef7fa',
    surfaceDark: '#141e27',
  },

  teal: {
    accent: '#3b8a8c',
    accentStrong: '#215d60',
    surface: '#eef8f7',
    surfaceDark: '#142123',
  },

  starRail: {
    accent: '#6077be',
    accentStrong: '#3e4c83',
    surface: '#f1f3fb',
    surfaceDark: '#171a29',
  },

  tactical: {
    accent: '#bd633d',
    accentStrong: '#853d23',
    surface: '#fbf4f0',
    surfaceDark: '#211b19',
  },

  courtGold: {
    accent: '#7b4e24',
    accentStrong: '#4f3015',
    surface: '#faf5ef',
    surfaceDark: '#201b16',
  },

  courtBlue: {
    accent: '#2b689c',
    accentStrong: '#19476e',
    surface: '#eef6fb',
    surfaceDark: '#151d25',
  },

  courtPurple: {
    accent: '#76519b',
    accentStrong: '#4a2d69',
    surface: '#f6f1fa',
    surfaceDark: '#1d1822',
  },

  stage: {
    accent: '#6c6574',
    accentStrong: '#39343d',
    surface: '#f7f6f8',
    surfaceDark: '#18171a',
  },

  rose: {
    accent: '#9c495c',
    accentStrong: '#682837',
    surface: '#fbf1f4',
    surfaceDark: '#23171b',
  },

  soul: {
    accent: '#9b6136',
    accentStrong: '#68401f',
    surface: '#fbf5ef',
    surfaceDark: '#211914',
  },

  nightRed: {
    accent: '#bd3e43',
    accentStrong: '#7f2228',
    surface: '#faf1f1',
    surfaceDark: '#1e1518',
  },

  piano: {
    accent: '#586c76',
    accentStrong: '#35434a',
    surface: '#f4f7f7',
    surfaceDark: '#171b1c',
  },

  butterfly: {
    accent: '#a25166',
    accentStrong: '#6b2d3d',
    surface: '#faf2f5',
    surfaceDark: '#23171b',
  },

  moon: {
    accent: '#54798c',
    accentStrong: '#315467',
    surface: '#eff6f8',
    surfaceDark: '#151d21',
  },

  rain: {
    accent: '#3c7792',
    accentStrong: '#255267',
    surface: '#f0f6f8',
    surfaceDark: '#121b20',
  },

  sunrise: {
    accent: '#b75b35',
    accentStrong: '#7b351f',
    surface: '#fff6ed',
    surfaceDark: '#241b16',
  },

  sea: {
    accent: '#287d92',
    accentStrong: '#175667',
    surface: '#edf8fa',
    surfaceDark: '#132126',
  },

  field: {
    accent: '#638449',
    accentStrong: '#405d2d',
    surface: '#f3f8ee',
    surfaceDark: '#182017',
  },

  minimalLight: {
    accent: '#43816a',
    accentStrong: '#23483b',
    surface: '#f7faf7',
    surfaceDark: '#f7faf7',
  },

  minimalDark: {
    accent: '#79d3ab',
    accentStrong: '#b9f0d2',
    surface: '#151b18',
    surfaceDark: '#151b18',
  },
};

function makeTheme(config) {
  const {palette: paletteName, ...rest} = config;
  const palette = palettes[paletteName] || palettes.green;

  return {
    ...palette,
    ...rest,
  };
}

export const themes = [
  makeTheme({
    id: 'spider-man',
    name: '蜘蛛侠（电影）',
    group: '电影',
    description: '蜘蛛侠主题基于《蜘蛛侠》系列电影改编，讲述少年彼得·帕克在责任与成长之间挣扎，学生时代的青春、城市街区与蛛网传奇交织成一段充满热血与幽默的英雄故事。',
    character: 'spider',
    palette: 'spider',
  }),

  makeTheme({
    id: 'batman-begins',
    name: '蝙蝠侠：侠影之谜',
    group: '电影',
    description: '这是关于成长、恐惧与信念的起点，布鲁斯·韦恩在黑暗中学会如何成为守夜人，哥谭的风、雾和神秘信号被浓缩成一个英雄的誕生故事。',
    character: 'bat-signal',
    palette: 'gold',
  }),

  makeTheme({
    id: 'dark-knight',
    name: '蝙蝠侠：黑暗骑士',
    group: '电影',
    description: '黑暗骑士的版本更偏沉重与残酷，秩序与混乱之间的碰撞，让城市在光与影之间不断被推向极限。',
    character: 'bat-signal',
    palette: 'red',
  }),

  makeTheme({
    id: 'dark-knight-rises',
    name: '蝙蝠侠：黑暗骑士崛起',
    group: '电影',
    description: '城市在废墟中重建，信念、牺牲和希望成为最核心的情绪，像一座在黑暗中重新升起的希望之塔。',
    character: 'bat-signal',
    palette: 'orange',
  }),

  makeTheme({
    id: 'boonie-bears-new-year',
    name: '熊出没：过年',
    group: '熊出没',
    description: '一家人围炉热闹、灯火闪烁，春节的温暖和童趣和森林里的冒险感相互交织。',
    character: 'forest',
    palette: 'red',
    nightMode: '暗色版',
    lightMode: '亮色版',
  }),

  makeTheme({
    id: 'boonie-bears-treasure',
    name: '熊出没：夺宝熊兵',
    group: '熊出没',
    description: '森林探索、藏宝图与暖色灯光。',
    character: 'forest',
    palette: 'brown',
  }),

  makeTheme({
    id: 'boonie-bears-snow',
    name: '熊出没：雪岭熊风',
    group: '熊出没',
    description: '雪岭、松树与安静的风。',
    character: 'snow',
    palette: 'snow',
  }),

  makeTheme({
    id: 'boonie-bears-return',
    name: '熊出没之熊心归来',
    group: '熊出没',
    description: '林间道路与返程时的暖光。',
    character: 'forest',
    palette: 'forest',
  }),

  makeTheme({
    id: 'boonie-bears-fantasy',
    name: '熊出没·奇幻空间',
    group: '熊出没',
    description: '森林、奇幻晶体与远处星光。',
    character: 'crystal',
    palette: 'purple',
  }),

  makeTheme({
    id: 'boonie-bears-earth',
    name: '熊出没·重返地球',
    group: '熊出没',
    description: '轨道、信号与蓝色地平线。',
    character: 'orbit',
    palette: 'blue',
  }),

  makeTheme({
    id: 'boonie-bears-core',
    name: '熊出没·伴我“熊芯”',
    group: '熊出没',
    description: '机械核心、森林与柔和信号。',
    character: 'core',
    palette: 'red',
  }),

  makeTheme({
    id: 'genshin',
    name: '原神',
    group: '游戏',
    description: '元素轨迹、群山与远方星光。',
    character: 'star',
    palette: 'teal',
  }),

  makeTheme({
    id: 'star-rail',
    name: '崩坏：星穹铁道',
    group: '游戏',
    description: '列车轨道、星图与宇宙信号。',
    character: 'rail',
    palette: 'starRail',
  }),

  makeTheme({
    id: 'arknights',
    name: '明日方舟',
    group: '游戏',
    description: '战术网格、通讯信号与警戒线。',
    character: 'grid',
    palette: 'tactical',
  }),

  makeTheme({
    id: 'lebron-james',
    name: 'LeBron James',
    group: '人物',
    description: '球馆灯光、记分牌与球场轨迹。',
    character: 'court',
    palette: 'courtGold',
  }),

  makeTheme({
    id: 'stephen-curry',
    name: 'Stephen Curry',
    group: '人物',
    description: '三分弧线、球馆灯光与冷色节奏。',
    character: 'court',
    palette: 'courtBlue',
  }),

  makeTheme({
    id: 'kobe-bryant',
    name: 'Kobe Bryant',
    group: '人物',
    description: '紫金灯光、球场边线与专注感。',
    character: 'court',
    palette: 'courtPurple',
  }),

  makeTheme({
    id: 'michael-jackson',
    name: 'Michael Jackson',
    group: '人物',
    description: '舞台灯、节拍线与黑白光影。',
    character: 'stage',
    palette: 'stage',
  }),

  makeTheme({
    id: 'janet-jackson',
    name: 'Janet Jackson',
    group: '人物',
    description: '舞台灯光、唱片与律动轨迹。',
    character: 'stage',
    palette: 'rose',
  }),

  makeTheme({
    id: 'dangelo',
    name: "D'Angelo",
    group: '人物',
    description: '暖色唱片、低频律动与木质舞台。',
    character: 'record',
    palette: 'soul',
  }),

  makeTheme({
    id: 'the-weeknd',
    name: 'The Weeknd',
    group: '人物',
    description: '城市夜行、红色信号与合成器节拍。',
    character: 'city',
    palette: 'nightRed',
  }),

  makeTheme({
    id: 'ryuichi-sakamoto',
    name: '坂本龙一',
    group: '音乐',
    description: '琴键、留白与克制的声音。',
    character: 'piano',
    palette: 'piano',
  }),

  makeTheme({
    id: 'butterfly-lovers',
    name: '梁祝',
    group: '音乐',
    description: '琴弦、飞舞线条与东方旋律。',
    character: 'strings',
    palette: 'butterfly',
  }),

  makeTheme({
    id: 'erquan-yingyue',
    name: '二泉映月',
    group: '音乐',
    description: '月色、水纹与低回的二胡声。',
    character: 'moon',
    palette: 'moon',
  }),

  makeTheme({
    id: 'rainy-night',
    name: '雨夜',
    group: '风景',
    description: '雨线、街灯与湿润的夜色。',
    character: 'rain',
    palette: 'rain',
  }),

  makeTheme({
    id: 'sunrise',
    name: '日出',
    group: '风景',
    description: '日光、山脊与安静的清晨。',
    character: 'sun',
    palette: 'sunrise',
  }),

  makeTheme({
    id: 'seaside',
    name: '海边',
    group: '风景',
    description: '潮汐线、海风与浅蓝色地平线。',
    character: 'wave',
    palette: 'sea',
  }),

  makeTheme({
    id: 'wilderness',
    name: '旷野',
    group: '风景',
    description: '草地、远山与风经过的方向。',
    character: 'field',
    palette: 'field',
  }),

  makeTheme({
    id: 'minimal-light',
    name: '简洁版 · 亮色',
    group: '简洁版',
    description: '无场景装饰的明亮阅读模式。',
    character: 'none',
    palette: 'minimalLight',
  }),

  makeTheme({
    id: 'minimal-dark',
    name: '简洁版 · 暗色',
    group: '简洁版',
    description: '无场景装饰的暗色阅读模式。',
    character: 'none',
    palette: 'minimalDark',
  }),
];

export const defaultThemeId = 'minimal-light';

export function getTheme(themeId) {
  return (
    themes.find((theme) => theme.id === themeId) ||
    themes.find((theme) => theme.id === defaultThemeId)
  );
}