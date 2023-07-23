<script setup name="weather" lang="ts">
// svg from https://github.com/philanri/weather-icons
// weather data from wttr.in
import { StorageSerializers, useFetch, useSessionStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useDarkmode } from 'vuepress-theme-hope/outlook/composables/index.js'
import { getAddress } from './utils/getLocation'
import { getWeatherIconFromCode } from './utils/weather'
import { useI18n, useLocale } from './utils/i18n'

interface WeatherDataType {
  addressName: string
  current: {
    weather: string
    weatherIconUrl: string
    temperature: string // temp_C(FeelsLikeC) °C
    winddirDegree: number
    windspeedKmph: string // km/h
    visibility: string // km 能见度
    precipMM: string // mm 降水量
  }
}

const { locale } = useLocale()
const { i18n } = useI18n(locale)
const { isDarkmode } = useDarkmode()

const weatherIcon = ref<HTMLIFrameElement>()
const weatherData = ref<WeatherDataType>()

const windTransform = computed(() => {
  return `rotate(${weatherData.value?.current.winddirDegree || 0}deg)`
})

async function getWeatherData(): Promise<WeatherDataType> {
  const address = await getAddress()
  const url = `https://wttr.in/${address}?format=j1&lang=${locale.value}`
  const now = new Date().getTime()
  const fetchData = useSessionStorage(`weatherData-${locale.value}`, { data: null, t: 0 }, { serializer: StorageSerializers.object })
  if (now - fetchData.value.t > 60 * 60 * 1000) {
    if (!fetchData.value.data)
      weatherData.value = undefined
    const { data } = await useFetch(url).json()
    fetchData.value = { data: data.value, t: now }
  }
  const sourceData = fetchData.value.data
  const nearestArea = sourceData?.nearest_area[0]
  const currentCondition = sourceData?.current_condition[0]
  const getAddressFromWeatherData = () => {
    return nearestArea?.areaName[0]?.value || nearestArea?.region[0]?.value || nearestArea?.country[0]?.value || address
  }
  return {
    addressName: locale.value === 'zh-cn' ? address : getAddressFromWeatherData(),
    current: {
      weather: i18n(`weatherCode.${currentCondition?.weatherCode}`),
      weatherIconUrl: getWeatherIconFromCode(currentCondition?.weatherCode, Number(currentCondition?.windspeedKmph)),
      temperature: `${currentCondition?.temp_C ?? ''}(${currentCondition?.FeelsLikeC ?? ''}) °C`, // temp_C(FeelsLikeC) °C
      winddirDegree: Number(currentCondition?.winddirDegree) ?? 0,
      windspeedKmph: `${currentCondition?.windspeedKmph ?? ''} km/h`, // km/h
      visibility: `${currentCondition?.visibility ?? ''} km`, // km 能见度
      precipMM: `${currentCondition?.precipMM ?? ''} mm`, // mm 降水量
    },
  } as WeatherDataType
}
watch(locale, async () => {
  weatherData.value = await getWeatherData()
}, { immediate: true })
watch([isDarkmode, weatherIcon], () => {
  const setBackground = (value: string) => {
    const svgs = weatherIcon.value!.contentDocument?.getElementsByTagName('svg')
    if (svgs && svgs.length) {
      svgs[0].style.backgroundColor = value
    }
    else {
      setTimeout(() => {
        setBackground(value)
      }, 160)
    }
  }
  if (isDarkmode.value && weatherIcon.value)
    setBackground('#0d1117')
  else if (!isDarkmode.value && weatherIcon.value)
    setBackground('')
}, { immediate: true })
</script>

<template>
  <div v-if="weatherData" class="side-container !text-right">
    <div class="title">
      <div>{{ i18n('common.todayWeather') }}</div>
      <div>{{ weatherData.addressName }}</div>
    </div>
    <div class="flex">
      <iframe ref="weatherIcon" class="weather-icon" :src="weatherData.current.weatherIconUrl" :name="weatherData.current.weather" />
      <div class="flex-1">
        <div>{{ weatherData.current.weather }}</div>
        <div>{{ weatherData.current.temperature }}</div>
        <div class="flex justify-end">
          <div :style="{ transform: windTransform }" class="wind-icon">
            ↓
          </div>
          <div>
            {{ weatherData.current.windspeedKmph }}
          </div>
        </div>
        <div>{{ i18n('common.visibility') }} {{ weatherData.current.visibility }}</div>
        <div>{{ i18n('common.precipitation') }} {{ weatherData.current.precipMM }}</div>
      </div>
    </div>
  </div>
  <div v-else class="side-container">
    <n-skeleton round size="small" height="14" class="mb-2.5" />
    <div class="flex">
      <n-skeleton circle size="large" :width="80" :height="80" />
      <n-space vertical class="flex-1">
        <n-skeleton round size="small" width="60%" height="14" class="ml-auto" />
        <n-skeleton v-for="i in 4" :key="i" :width="`${40 + i * 10}%`" round size="small" height="14" class="ml-auto" />
      </n-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/config.scss' as *;

.title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.weather-icon {
  width: 80px;
  height: 80px;
  border: none;
}
.wind-icon {
  width: 20px;
  text-align: center;
  font-size: 14px;
}
</style>
