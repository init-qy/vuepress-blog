import { searchProPlugin } from 'vuepress-plugin-search-pro'

export default function createSearchPlugin() {
  return searchProPlugin({
    indexContent: true,
    hotReload: true,
    customFields: [
      {
        getter: page => page.frontmatter.category as string[],
        formatter: {
          '/': '分类：$content',
          '/en/': 'Category: $content',
          '/es/': 'Categoría: $content',
        },
      },
      {
        getter: page => page.frontmatter.tag as string[],
        formatter: {
          '/': '标签：$content',
          '/en/': 'Tag: $content',
          '/es/': 'Etiqueta: $content',
        },
      },
    ],
  })
}
