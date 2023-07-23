<script setup lang="ts">
import { useDarkmode } from 'vuepress-theme-hope/outlook/composables/index'
import { computed, onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import * as wasmFeatureDetect from 'wasm-feature-detect'
import { usePageData } from '@vuepress/client'
import {
  createDiscreteApi,
  darkTheme,
  lightTheme,
} from 'naive-ui'
import type { ConfigProviderProps } from 'naive-ui'
import SideControl from './sideControl.vue'

enum processStatusType {
  SUCCESS,
  FAIL,
  PROCESSING,
  NONE,
}
const { isDarkmode } = useDarkmode()
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: isDarkmode.value ? darkTheme : lightTheme,
}) as ConfigProviderProps)
let message, dialog

const pageData = usePageData()
let srcInteractedData = null
let dstInteractedData = null
const canvasOutputRef = ref<HTMLCanvasElement>()
const wasmModuleLoaded = ref(false)
const realcuganParams = useStorage('realcuganParams', {
  scaleRadio: 2,
  denoiseRadio: 0,
  previewRadio: 0,
})

const processStatus = ref<processStatusType>(processStatusType.NONE)
const progressTip = ref('')
const progressRate = ref(0)
const procRemainingTime = ref(0)

const outputParams = ref({
  fileName: '',
  scaleRadio: 2,
  denoiseRadio: 0,
})
const outputImgSrc = ref('')

const process = function (uploadImageData, w, h, fileName = '') {
  const outputCanvas = canvasOutputRef.value
  if (!outputCanvas)
    return
  const outputCtx = outputCanvas.getContext('2d')
  const { scaleRadio, denoiseRadio } = realcuganParams.value
  processStatus.value = processStatusType.PROCESSING
  progressTip.value = '启动中，预计10秒内完成耗时估算...'
  progressRate.value = 0
  // init output params
  outputParams.value = {
    fileName,
    ...unref(realcuganParams),
  }
  outputCanvas.width = w * scaleRadio
  outputCanvas.height = h * scaleRadio

  srcInteractedData = _malloc(uploadImageData.data.length)
  HEAPU8.set(uploadImageData.data, srcInteractedData)
  const imageDataOutput = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height)
  dstInteractedData = _malloc(imageDataOutput.data.length)
  const retCode = _process_image(0, srcInteractedData, dstInteractedData, w, h, scaleRadio, denoiseRadio)
  if (retCode !== 0) {
    message.warning('请稍后再试')
    processStatus.value = processStatusType.FAIL
  }
}

const onProcessEnd = function (cost) {
  const canvasOutput = canvasOutputRef.value
  if (!canvasOutput)
    return
  const ctxOutput = canvasOutput.getContext('2d')
  const imageDataOutput = ctxOutput.getImageData(0, 0, canvasOutput.width, canvasOutput.height)

  const result = HEAPU8.subarray(dstInteractedData, dstInteractedData + imageDataOutput.data.length)
  imageDataOutput.data.set(result)
  ctxOutput.putImageData(imageDataOutput, 0, 0)
  console.log('output size: ', result.length)
  outputImgSrc.value = canvasOutput.toDataURL()
  _free(srcInteractedData)
  _free(dstInteractedData)
  srcInteractedData = null
  dstInteractedData = null

  processStatus.value = processStatusType.SUCCESS
  const costTime = (cost / 1000).toFixed(2)
  progressTip.value = `处理完成！耗时: ${costTime}秒`
  message.success(`处理完成！耗时: ${costTime}秒`)
}

const onProcessProgressChange = function (totalCost, tileCost, progressRatePercent, remainingTime) {
  processStatus.value = processStatusType.PROCESSING
  progressTip.value = '本地CPU努力处理中......'
  progressRate.value = Math.floor(progressRatePercent * 10000) / 100
  procRemainingTime.value = Math.round(remainingTime / 10) / 100
}

const wasmCallback = function (rawData) {
  try {
    const data = JSON.parse(rawData)
    switch (data.eventType) {
      case 'PROC_END':
        onProcessEnd(data.cost)
        break
      case 'PROC_PROGRESS':
        onProcessProgressChange(data.total_cost, data.tile_cost, data.progress_rate, data.remaining_time)
    }
  }
  catch (e) {
    processStatus.value = processStatusType.FAIL
    console.error('wasmCallback parse error:', e)
  }
}

const checkWasmSupportAndLoad = async function () {
  const [hasSIMD, hasThreads] = await Promise.all([wasmFeatureDetect.simd(), wasmFeatureDetect.threads()])
  if (!hasSIMD) {
    message.error('浏览器不支持simd (不支持iOS，Android请单独用Chrome/Firefox等浏览器打开，桌面端请使用最新版本的Chrome或Firefox)', {
      keepAliveOnHover: true,
    })
    return
  }
  if (!hasThreads) {
    message.error('浏览器不支持pthreads (不支持iOS，Android请单独用Chrome/Firefox等浏览器打开，桌面端请使用最新版本的Chrome或Firefox)', {
      keepAliveOnHover: true,
    })
    return
  }
  fetch('realcugan-ncnn-webassembly-simd-threads.wasm')
    .then((response) => {
      response.arrayBuffer()
    })
    .then((buffer) => {
      window.Module.wasmBinary = buffer
      const script = document.createElement('script')
      script.src = 'realcugan-ncnn-webassembly-simd-threads.js'
      script.onload = () => {
        // console.log('Emscripten loaded.')
      }
      document.body.appendChild(script)

      window.Module.onRuntimeInitialized = () => {
        // console.log('wasm module loaded')
        wasmModuleLoaded.value = true
      }
    })
}

const saveOutput = function () {
  const canvasOutput = canvasOutputRef.value
  if (!canvasOutput)
    return
  const dataURL = canvasOutput.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  const a = document.createElement('a')
  a.href = dataURL
  let { fileName, scaleRadio, denoiseRadio } = unref(outputParams)
  if (fileName)
    fileName = fileName.replace(/\.[^/.]+$/, '')
  else fileName = 'realcugan-output'
  fileName += `-up${scaleRadio}x`
  switch (denoiseRadio) {
    case -1:
      fileName += '-conservative.png'
      break
    case 0:
      fileName += '-denoise.png'
      break
    case 3:
      fileName += '-denoise3x.png'
      break
  }
  a.download = fileName
  document.body.appendChild(a) // 添加a标签到body下
  a.click()
  document.body.removeChild(a) //  完成后删除a标签
  message.success('保存成功')
}

const handleCancel = function () {
  window.location.reload()
}

// init emscripten
onMounted(() => {
  window.Module = {
    print: (text) => {
      console.log(text)
      // catch callback =_=
      if (text.length > 11 && text.substring(0, 10) === '$CALLBACK$')
        wasmCallback(text.substring(11))
    },
    printErr: (text) => {
      console.error(text)
      if ((`${text}`).includes('memory access out of bounds')) {
        dialog.error({
          title: '标签页内存受限',
          content: '本页面多次处理图片后，触发了浏览器内存限制，请点击刷新按钮重试',
          closable: false,
          positiveText: '刷新',
          onPositiveClick: handleCancel,
        })
      }
      else {
        dialog.error({
          title: '处理错误',
          content: `错误信息: ${text}`,
          closable: false,
          positiveText: '刷新重试',
          onPositiveClick: handleCancel,
        })
      }
    },
  }
  const api = createDiscreteApi(
    ['message', 'dialog'],
    { configProviderProps: configProviderPropsRef },
  )
  message = api.message
  dialog = api.dialog

  const routeLoad = function () {
    if (window.location.pathname.includes(pageData.value.path)) {
      checkWasmSupportAndLoad()
    }
    else {
      setTimeout(() => {
        routeLoad()
      }, 100)
    }
  }
  routeLoad()
})
</script>

<template>
  <n-config-provider :theme="isDarkmode ? darkTheme : lightTheme">
    <n-alert title="本项目基于Web Assembly技术，在浏览器端使用CPU完成图像处理，不会上传任何图片到云端。" type="info" closable>
      注意：本页面处理图片时占用内存约900M，且CPU占用较高。如果使用有问题，请在PC端使用最新版的Chrome或Firefox打开本页面。如输出有问题或长时间无响应，请刷新重试。
    </n-alert>
    <div class="flex mt-10">
      <SideControl @process="process" />
      <!-- preview -->
      <div class="flex-1">
        <!--      进度条 -->
        <template v-if="!wasmModuleLoaded">
          <b>资源努力加载中(约12MB)......</b>
        </template>
        <template v-if="processStatus === processStatusType.PROCESSING">
          <n-text>{{ progressTip }}</n-text>
          <n-text>剩余时长: {{ procRemainingTime.toFixed(2) }}秒</n-text>
          <n-button round @click="handleCancel">
            取消处理
          </n-button>
          <n-progress
            type="line"
            :percentage="progressRate"
            indicator-placement="inside"
            processing
          />
        </template>
        <template v-if="processStatus === processStatusType.SUCCESS">
          <n-text>{{ progressTip }}</n-text>
          <n-button type="primary" round @click="saveOutput">
            保存图片
          </n-button>
          <n-image :src="outputImgSrc" />
        </template>
      </div>
    </div>
  </n-config-provider>

  <div class="display-none">
    <canvas id="canvas-upload" />
    <canvas id="canvas-output" ref="canvasOutputRef" />
  </div>
</template>

<style lang="scss">
@use '../../styles/config.scss' as *;
</style>
