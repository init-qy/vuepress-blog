import { navbar } from 'vuepress-theme-hope'

export const esNavbar = navbar([
  '/es/',
  { text: 'article', icon: 'blog', link: '/es/article/' },
  { text: 'tools', icon: 'tool', prefix: '/es/tools', children: [{ text: 'Super-resolution processing', link: '/realcugan-ncnn-webassembly' }] },
])
