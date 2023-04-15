import { StorageSerializers, useFetch, useSessionStorage } from '@vueuse/core'

export async function getIp() {
  const ip = useSessionStorage('ip', '', { serializer: StorageSerializers.string })
  if (!ip.value) {
    const { data } = await useFetch('https://api.ipify.org')
    ip.value = data.value
  }
  return ip.value
}
export async function getAddress() {
  const address = useSessionStorage('address', '', { serializer: StorageSerializers.string })
  if (!address.value) {
    const { data } = await useFetch('https://ip.useragentinfo.com/json').json()
    const { country, province, city } = data.value || {}
    address.value = city || province || country || ''
  }
  return address.value
}
