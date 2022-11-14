import { searchPlugin } from '@vuepress/plugin-search'

export default function createSearchPlugin() {
  return searchPlugin({
    locales: {
      '/': {
        placeholder: '搜索',
      },
      '/en/': {
        placeholder: 'Search',
      },
    },
    // 排除首页
    isSearchable: page => page.path !== '/',
  })
}
