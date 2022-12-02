<script setup name="clock" lang="ts">
import { useDateFormat, useNow, useStorage } from '@vueuse/core'
import { useDarkMode } from '@theme-hope/modules/outlook/composables/index.js'
import { computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

import type { GaugeSeriesOption } from 'echarts/charts'
import type { EChartsType } from 'echarts/core'

import { useLocale } from './utils/i18n'

const { locale } = useLocale()
const { isDarkMode } = useDarkMode()
const isGraphClock = useStorage('is-graph-clock', false)

const now = useNow()
const date = useDateFormat(now, 'YYYY-MM-DD')
const time = useDateFormat(now, 'HH:mm:ss')
const week = computed(() => {
  const weekFormatStr = locale.value === 'zh-cn' ? 'dddd' : 'ddd'
  return useDateFormat(now, weekFormatStr, { locales: locale.value }).value
})

// echarts
type EChartsOption = echarts.ComposeOption<GaugeSeriesOption>
let myChart: EChartsType | undefined

const initEcharts = () => {
  const chartDom = document.getElementById('clockEcharts')
  const chartDomClientWidth = chartDom.clientWidth
  chartDom.style.height = `${chartDomClientWidth}px`
  myChart = echarts.init(chartDom, null, {
    renderer: 'svg',
  })
  const option: EChartsOption = {
    series: [
      {
        name: 'hour',
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 12,
        splitNumber: 12,
        clockwise: true,
        axisLine: {
          lineStyle: {
            width: 3,
            color: [[1, 'rgba(0,0,0,0.7)']],
          },
        },
        splitLine: {
          distance: 5,
          length: 7.5,
          lineStyle: {
            cap: 'round',
          },
        },
        axisTick: {
          distance: 5,
        },
        axisLabel: {
          fontSize: 14,
          distance: 5,
          formatter(value) {
            if (value === 0)
              return ''
            return `${value}`
          },
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 6,
          length: '55%',
          offsetCenter: [0, '8%'],
          itemStyle: {
            color: '#C0911F',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 4,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
          },
        },
        detail: {
          show: false,
        },
        title: {
          offsetCenter: [0, '20%'],
        },
        data: [
          {
            value: 0,
          },
        ],
      },
      {
        name: 'minute',
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 60,
        clockwise: true,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 4,
          length: '70%',
          offsetCenter: [0, '8%'],
          itemStyle: {
            color: '#C0911F',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 4,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
          },
        },
        anchor: {
          show: true,
          size: 10,
          showAbove: false,
          itemStyle: {
            borderWidth: 7,
            borderColor: '#C0911F',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 4,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
          },
        },
        detail: {
          show: false,
        },
        title: {
          offsetCenter: ['0%', '-40%'],
        },
        data: [
          {
            value: 0,
          },
        ],
      },
      {
        name: 'second',
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 60,
        animationEasingUpdate: 'bounceOut',
        clockwise: true,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 2,
          length: '85%',
          offsetCenter: [0, '8%'],
          itemStyle: {
            color: '#C0911F',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 4,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
          },
        },
        anchor: {
          show: true,
          size: 7,
          showAbove: true,
          itemStyle: {
            color: '#C0911F',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 4,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
          },
        },
        detail: {
          show: false,
        },
        title: {
          offsetCenter: ['0%', '-40%'],
        },
        data: [
          {
            value: 0,
          },
        ],
      },
    ],
  } as EChartsOption
  option && myChart.setOption(option)
}
const destroyEcharts = () => {
  myChart.dispose()
  myChart = undefined
}
const setOption = (hour: number, minute: number, second: number, secondAnimation = true) => {
  myChart?.setOption<EChartsOption>({
    series: [
      {
        name: 'hour',
        animation: hour !== 0,
        data: [{ value: hour }],
      },
      {
        name: 'minute',
        animation: minute !== 0,
        data: [{ value: minute }],
      },
      {
        name: 'second',
        animation: secondAnimation,
        data: [{ value: second }],
      },
    ],
  })
}
watch(time, () => {
  if (!myChart)
    return
  const second = now.value.getSeconds()
  const minute = now.value.getMinutes() + second / 60
  const hour = (now.value.getHours() % 12) + minute / 60
  if (second === 0) {
    setOption(hour, minute, 60)
    setTimeout(() => {
      setOption(hour, minute, 0, false)
    }, 900)
  }
  else {
    setOption(hour, minute, second)
  }
})
watch(isGraphClock, (val) => {
  if (val)
    initEcharts()
  else destroyEcharts()
}, { flush: 'post' })
onMounted(() => {
  if (isGraphClock.value)
    initEcharts()
})
</script>

<template>
  <div class="container">
    <div class="date">
      {{ `${date}  ${week}` }}
    </div>
    <div class="switch-clock" @click="isGraphClock = !isGraphClock">
      <div v-if="!isGraphClock" class="time">
        {{ time }}
      </div>
      <div v-else id="clockEcharts" />
    </div>
    <div class="tips">
      时间每过一秒，就少一秒
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
  text-align: center;
}
.switch-clock {
  cursor: pointer;
}
.date {
  font-size: 20px;
  margin-bottom: 0.5rem;
}
.time {
  font-family: 'digital-7_monoitalic',sans-serif;
  font-size: 48px;
}
.tips {
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
  font-size: 12px;
}
#{$dark-selector} .time,
#{$dark-selector} .date {
  color: #EFEFEF;
  animation: neon .8s ease-in-out infinite alternate;
}
// animation

@keyframes neon {
  from {
    text-shadow:
        0 0 6px rgba(202,228,225,0.92),
        0 0 30px rgba(202,228,225,0.34),
        0 0 12px rgba(30,132,242,0.52),
        0 0 21px rgba(30,132,242,0.92),
        0 0 34px rgba(30,132,242,0.78),
        0 0 54px rgba(30,132,242,0.92);
  }
  to {
    text-shadow:
        0 0 6px rgba(202,228,225,0.98),
        0 0 30px rgba(202,228,225,0.42),
        0 0 12px rgba(30,132,242,0.58),
        0 0 22px rgba(30,132,242,0.84),
        0 0 38px rgba(30,132,242,0.88),
        0 0 60px rgba(30,132,242,1);
  }
}
</style>
