import { navbar } from 'vuepress-theme-hope'

export const enNavbar = navbar([
  '/en/',
  { text: 'article', icon: 'blog', link: '/en/article/' },
  { text: 'tools', icon: 'tool', prefix: '/en/tools', children: [{ text: 'Super-resolution processing', link: '/realcugan-ncnn-webassembly' }] },
])
