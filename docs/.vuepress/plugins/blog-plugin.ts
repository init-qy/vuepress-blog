import { blogPlugin } from 'vuepress-plugin-blog2'

export default function createBlogPlugin() {
  return blogPlugin({
    // only files under posts are articles
    filter: ({ filePathRelative }) =>
      filePathRelative ? filePathRelative.startsWith('posts/') : false,

    // getting article info
    getInfo: ({ frontmatter, title }) => ({
      title,
      author: 'init-qy',
      date: frontmatter.date || null,
      category: frontmatter.categories || [],
      tag: frontmatter.tags || [],
    }),

    category: [
      {
        key: 'category',
        getter: page => <string[]>page.frontmatter.categories || [],
        layout: 'Category',
        itemLayout: 'Category',
        frontmatter: () => ({ title: 'Categories', sidebar: false }),
        itemFrontmatter: name => ({
          title: `Category ${name}`,
          sidebar: false,
        }),
      },
      {
        key: 'tag',
        getter: page => <string[]>page.frontmatter.tags || [],
        layout: 'Tag',
        itemLayout: 'Tag',
        frontmatter: () => ({ title: 'Tags', sidebar: false }),
        itemFrontmatter: name => ({
          title: `Tag ${name}`,
          sidebar: false,
        }),
      },
    ],

    type: [
      {
        key: 'article',
        // remove archive articles
        filter: page => !page.frontmatter.archive,
        path: '/article/',
        layout: 'Article',
        frontmatter: () => ({ title: 'Articles', sidebar: false }),
        // sort pages with time and sticky
        sorter: (pageA, pageB) => {
          if (pageA.frontmatter.sticky && pageB.frontmatter.sticky) {
            return (
              (pageB.frontmatter.sticky as number)
                - (pageA.frontmatter.sticky as number)
            )
          }

          if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
            return -1

          if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky)
            return 1

          if (!pageB.frontmatter.date)
            return 1
          if (!pageA.frontmatter.date)
            return -1

          return (
            new Date(pageB.frontmatter.date).getTime()
              - new Date(pageA.frontmatter.date).getTime()
          )
        },
      },
      {
        key: 'timeline',
        // only article with date should be added to timeline
        filter: page => page.frontmatter.date instanceof Date,
        // sort pages with time
        sorter: (pageA, pageB) =>
          new Date(pageB.frontmatter.date as Date).getTime()
            - new Date(pageA.frontmatter.date as Date).getTime(),
        path: '/timeline/',
        layout: 'Timeline',
        frontmatter: () => ({ title: 'Timeline', sidebar: false }),
      },
    ],
    hotReload: true,
  })
}
