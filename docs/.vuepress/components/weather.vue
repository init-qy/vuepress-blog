<script setup name="weather" lang="ts">
// svg from https://github.com/philanri/weather-icons
// weather data from wttr.in
import { useFetch } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { Skeletor } from 'vue-skeletor'
import { getAddress, getIp } from './utils/getLocation'
import { getWeatherIconFromCode } from './utils/weather'
import { useI18n, useLocale } from './utils/i18n'
import 'vue-skeletor/dist/vue-skeletor.css'

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

const weatherData = ref<WeatherDataType>()

const windTransform = computed(() => {
  return `rotate(${weatherData.value?.current.winddirDegree || 0}deg)`
})

const getWeatherData = async (): Promise<WeatherDataType> => {
  const ip = await getIp()
  const address = await getAddress(ip)
  const url = `https://wttr.in/${address}?format=j1&lang=${locale.value}`
  const { data } = await useFetch(url).json()
  const sourceData = data.value
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
      temperature: `${currentCondition?.temp_C}(${currentCondition?.FeelsLikeC}) °C`, // temp_C(FeelsLikeC) °C
      winddirDegree: Number(currentCondition?.winddirDegree),
      windspeedKmph: `${currentCondition?.windspeedKmph} km/h`, // km/h
      visibility: `${currentCondition?.visibility} km`, // km 能见度
      precipMM: `${currentCondition?.precipMM} mm`, // mm 降水量
    },
  } as WeatherDataType
}
watch(locale, async () => {
  weatherData.value = undefined
  weatherData.value = await getWeatherData()
}, { immediate: true })
</script>

<template>
  <div v-if="weatherData" class="container">
    <div class="title">
      <div>{{ i18n('common.todayWeather') }}</div>
      <div>{{ weatherData.addressName }}</div>
    </div>
    <div class="flex">
      <iframe class="weather-icon" :src="weatherData.current.weatherIconUrl" :name="weatherData.current.weather" />
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
  <div v-else class="container">
    <Skeletor class="mb-10" />
    <div class="flex">
      <Skeletor circle width="80" height="80" />
      <div class="flex-1">
        <Skeletor width="60%" />
        <Skeletor v-for="i in 4" :key="i" :width="`${40 + i * 10}%`" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/config.scss' as *;

.container {
  border-radius: 4px;
  box-shadow: 2px 0 8px var(--card-shadow);
  margin: 1rem 2rem;
  padding: 1rem;
  text-align: right;
  font-size: 12px;
}
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
.flex {
  display: flex;
}
.flex-1 {
  flex: 1 1 0;
}
.justify-end {
  justify-content: end;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
