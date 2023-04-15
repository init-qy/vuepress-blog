import { path } from '@vuepress/utils'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import createVuePressPlugins from './plugins'
import createVuePressTheme from './theme/index'

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
  alias: {
    // 你可以在这里将别名定向到自己的组件
    // 比如这里我们将主题的主页组件改为用户 .vuepress/components 下的 HomePage.vue
    '@theme-hope/modules/sidebar/components/Sidebar': path.resolve(
      __dirname,
      './components/sideContainer.vue',
    ),
    '@theme-hope/modules/blog/components/BlogHero': path.resolve(
      __dirname,
      './components/blogMain.vue',
    ),
  },
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
})
