import { useNow } from '@vueuse/core'
import weatherIcon from '../constants/weatherIcon.json'

import type weatherCode from '../constants/i18n_weatherCode.json'

export const getWeatherIconFromCode = (code: keyof typeof weatherCode['en'], windspeed: number) => {
  const now = useNow()
  const isNight = now.value.getHours() >= 18 || now.value.getHours() < 6

  let windLevel = 0
  if (windspeed >= 15)
    windLevel = 1
  if (windspeed >= 25)
    windLevel = 2

  let svgName = weatherIcon[code]
  if (windLevel === 1 && ['113', '116', '119', '122'].includes(code))
    svgName = 'windy'
  else if (windLevel === 2 && ['113', '116', '119', '122'].includes(code))
    svgName = 'very_windy'
  else if (isNight && ['113', '116'].includes(code))
    svgName = 'night'
  else if (isNight && ['119', '122'].includes(code))
    svgName = 'cloudy_night'
  return new URL(`../assets/${svgName}.svg`, import.meta.url).href
}
