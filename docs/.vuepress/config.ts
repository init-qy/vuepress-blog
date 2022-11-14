import { defineUserConfig } from 'vuepress'

import createVuePressPlugins from './plugins'
import createVuePressTheme from './theme'

export default defineUserConfig({
  base: '/vuepress-blog/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'init-qy的博客',
      description: '让生活更有趣',
    },
    '/en/': {
      lang: 'en-US',
      title: 'blog by init-qy',
      description: 'have fun with life',
    },
  },
  plugins: createVuePressPlugins(),
  theme: createVuePressTheme(),
  shouldPrefetch: false,
})
