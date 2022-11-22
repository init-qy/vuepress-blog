import { useFetch } from '@vueuse/core'

const localeMap = {
  '/': 'zh-cn',
  '/en/': 'en',
}
export const getLocales = (routeLocalePath: string) => {
  return localeMap[routeLocalePath] || 'zh-cn'
}
export const getIp = async () => {
  const { data } = await useFetch('https://api.ipify.org')
  return data.value
}
export const getAddress = async (ip: string) => {
  const { data } = await useFetch(`https://ip.useragentinfo.com/json?ip=${ip}`).json()
  const { country, province, city, area } = data.value
  return area || city || province || country
}
