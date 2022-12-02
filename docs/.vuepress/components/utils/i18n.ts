import { get, isNil } from 'lodash-es'
import { computed } from 'vue'
import { useRouteLocale } from '@vuepress/client'

import type { Ref } from 'vue'

export function useLocale() {
  const routeLocalePath = useRouteLocale()
  const localeMap = {
    '/': 'zh-cn',
    '/en/': 'en',
  }
  const getLocale = (routeLocalePath: string): ValueOf<typeof localeMap> => {
    return localeMap[routeLocalePath] || 'zh-cn'
  }
  const locale = computed(() => {
    return getLocale(routeLocalePath.value)
  })
  return {
    localeMap,
    getLocale,
    locale,
  }
}

export function useI18n(locale: Ref<string>) {
  const getI18nModule = () => {
    const modules = import.meta.glob('../constants/i18n*.json', { import: 'default', eager: true })
    const jsonMap = {}
    Object.keys(modules).forEach((key: string) => {
      const moduleName = key.match(/(?<=i18n_).*?(?=.json)/)[0]
      jsonMap[moduleName] = modules[key]
    })
    return jsonMap
  }
  const i18nJsonMap = getI18nModule()
  const i18n = (key: string, rollback = (_: string) => ''): string => {
    const keys = key.split('.')
    keys.splice(1, 0, locale.value)
    let result = get(i18nJsonMap, keys.join('.'))
    if (isNil(result)) {
      // console.error(`key ${key} is not exist!`)
      result = rollback(key)
    }
    return result
  }
  return {
    i18n,
    i18nJsonMap,
  }
}
