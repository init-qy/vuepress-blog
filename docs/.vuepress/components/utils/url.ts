import { usePageData } from '@vuepress/client'
import { baseUrl } from '../constants/constants'

export function getAssetsUrl(assetsName: string) {
  const pageData = usePageData()
  return baseUrl.substring(0, baseUrl.length - 1) + pageData.value.path.replace('/en/', '/').replace(/\/[^\/]*$/, '/') + assetsName
}
