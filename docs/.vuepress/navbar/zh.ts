import { navbar } from 'vuepress-theme-hope'

export const zhNavbar = navbar([
  '/',
  { text: '归档', icon: 'blog', link: '/article/' },
  { text: '工具', icon: 'tool', prefix: '/tools', children: [{ text: '动漫图片超分', link: '/realcugan-ncnn-webassembly' }] },
])
