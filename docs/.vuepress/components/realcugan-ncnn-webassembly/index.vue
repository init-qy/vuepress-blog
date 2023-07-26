<script setup lang="ts">
import { useDarkmode } from 'vuepress-theme-hope/outlook/composables/index'
import { computed, onBeforeUnmount, onMounted, ref, unref } from 'vue'
import { useStorage } from '@vueuse/core'
import * as wasmFeatureDetect from 'wasm-feature-detect'
import { usePageData } from '@vuepress/client'
import {
  NAlert,
  NButton,
  NConfigProvider,
  NImage,
  NP,
  NProgress,
  NSpace,
  createDiscreteApi,
  darkTheme,
  lightTheme,
} from 'naive-ui'
import { useI18n, useLocale } from '../utils/i18n'
import SideControl from './sideControl.vue'
import ImgCompare from './imgCompare.vue'

enum processStatusType {
  SUCCESS,
  FAIL,
  PROCESSING,
  NONE,
}
const { locale } = useLocale()
const { i18n } = useI18n(locale)
const pageData = usePageData()
const { isDarkmode } = useDarkmode()
let message, dialog, interval

const realcuganParams = useStorage('realcuganParams', {
  scaleRadio: 2,
  denoiseRadio: 0,
  previewRadio: 0,
})
// dom ref
const sideControlRef = ref()
const previewBoxRef = ref<HTMLElement>()
const canvasOutputRef = ref<HTMLCanvasElement>()
const configProviderRef = ref()

// theme
const themeColor = ref('#41b349')

/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = computed(() => ({
  common: {
    primaryColor: unref(themeColor),
  },
}))

// processStatus
let srcInteractedData, dstInteractedData
const wasmModuleLoaded = ref(false)
const processStatus = ref<processStatusType>(processStatusType.NONE)
const progressTip = ref('')
const progressRate = ref(0)
const procRemainingTime = ref(0)

// output
const outputParams = ref({
  fileName: '',
  scaleRadio: 2,
  denoiseRadio: 0,
  previewRadio: 0,
})
const uploadImgSrc = ref('')
const outputImgSrc = ref('')
const previewBoxSize = ref({
  width: 0,
  height: 0,
})

const process = function (uploadImageData, w, h, fileName = '') {
  if (!wasmModuleLoaded.value) {
    message.warning(i18n('wasm.wasmLoading'))
    sideControlRef.value.resetImage()
    return
  }
  const uploadCanvas = sideControlRef.value.canvasUploadRef
  uploadImgSrc.value = uploadCanvas.toDataURL()

  const outputCanvas = canvasOutputRef.value
  if (!outputCanvas)
    return
  const outputCtx = outputCanvas.getContext('2d', { willReadFrequently: true })
  const { scaleRadio, denoiseRadio } = realcuganParams.value
  processStatus.value = processStatusType.PROCESSING
  progressTip.value = i18n('wasm.resourcePreLoading')
  progressRate.value = 0
  // init output params
  outputParams.value = {
    fileName,
    ...unref(realcuganParams),
  }
  outputCanvas.width = w * scaleRadio
  outputCanvas.height = h * scaleRadio
  srcInteractedData = window._malloc(uploadImageData.data.length)
  window.HEAPU8.set(uploadImageData.data, srcInteractedData)
  const imageDataOutput = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height)
  dstInteractedData = window._malloc(imageDataOutput.data.length)
  const retCode = window._process_image(0, srcInteractedData, dstInteractedData, w, h, scaleRadio, denoiseRadio)
  if (retCode !== 0) {
    message.error(i18n('wasm.wasmError'))
    processStatus.value = processStatusType.FAIL
  }
}

const onProcessEnd = function (cost) {
  const canvasOutput = canvasOutputRef.value
  if (!canvasOutput)
    return
  const ctxOutput = canvasOutput.getContext('2d', { willReadFrequently: true })
  const imageDataOutput = ctxOutput.getImageData(0, 0, canvasOutput.width, canvasOutput.height)
  previewBoxSize.value.width = Math.min(previewBoxRef.value.clientWidth, canvasOutput.width)
  previewBoxSize.value.height = previewBoxSize.value.width * canvasOutput.height / canvasOutput.width

  const result = window.HEAPU8.subarray(dstInteractedData, dstInteractedData + imageDataOutput.data.length)
  imageDataOutput.data.set(result)
  ctxOutput.putImageData(imageDataOutput, 0, 0)
  outputImgSrc.value = canvasOutput.toDataURL()
  window._free(srcInteractedData)
  window._free(dstInteractedData)
  srcInteractedData = null
  dstInteractedData = null
  sideControlRef.value.resetImage()

  processStatus.value = processStatusType.SUCCESS
  const costTime = (cost / 1000).toFixed(2)
  const successMsg = i18n('wasm.processSuccessMsg', [costTime])
  progressTip.value = successMsg
  message.success(successMsg)
}

const onProcessProgressChange = function (totalCost, tileCost, progressRatePercent, remainingTime) {
  processStatus.value = processStatusType.PROCESSING
  progressTip.value = i18n('wasm.processingMsg')
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
    message.error(i18n('wasm.wasmError'))
  }
}

const checkWasmSupportAndLoad = async function () {
  const [hasSIMD, hasThreads] = await Promise.all([wasmFeatureDetect.simd(), wasmFeatureDetect.threads()])
  if (!hasSIMD) {
    message.error(i18n('wasm.notSupport', ['simd']), {
      keepAliveOnHover: true,
    })
    return
  }
  if (!hasThreads) {
    message.error(i18n('wasm.notSupport', ['pthreads']), {
      keepAliveOnHover: true,
    })
    return
  }
  fetch('realcugan-ncnn-webassembly-simd-threads.wasm')
    .then((response) => {
      return response.arrayBuffer()
    })
    .then((buffer) => {
      window.Module.wasmBinary = buffer
      const script = document.createElement('script')
      script.src = 'realcugan-ncnn-webassembly-simd-threads.js'
      script.onload = () => {
        // console.log('Emscripten loaded.')
      }
      document.body.appendChild(script)
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
    default: fileName += '.png'
  }
  a.download = fileName
  document.body.appendChild(a) // 添加a标签到body下
  a.click()
  document.body.removeChild(a) //  完成后删除a标签
  message.success(i18n('wasm.saveSuccess'))
}

const handleCancel = function () {
  window.location.reload()
}

// init emscripten
onMounted(() => {
  if (!window.Module) {
    window.Module = {
      print: (text) => {
      // catch callback =_=
        if (text.length > 11 && text.substring(0, 10) === '$CALLBACK$')
          wasmCallback(text.substring(11))
      },
      printErr: (text) => {
        console.error(text)
        if (text.includes('memory access out of bounds')) {
          dialog.error({
            title: i18n('wasm.memoryOut'),
            content: i18n('wasm.memoryOutContent'),
            closable: false,
            positiveText: i18n('wasm.refresh'),
            onPositiveClick: handleCancel,
          })
        }
        else {
          dialog.error({
            title: i18n('wasm.handleErr'),
            content: `i18n('wasm.handleErrContent'): ${text}`,
            closable: false,
            positiveText: i18n('wasm.refresh'),
            onPositiveClick: handleCancel,
          })
        }
      },
      onRuntimeInitialized: () => {
        wasmModuleLoaded.value = window.wasmModuleLoaded = true
      },
    }
  }

  // naive ui
  const api = createDiscreteApi(
    ['message', 'dialog'],
    { configProviderProps: configProviderRef },
  )
  message = api.message
  dialog = api.dialog

  const routeLoad = function () {
    if (window.location.pathname.includes(pageData.value.path)) {
      // wasm load status
      if (window.wasmModuleLoaded === undefined) {
        wasmModuleLoaded.value = window.wasmModuleLoaded = false
      }
      else {
        wasmModuleLoaded.value = window.wasmModuleLoaded
        handleCancel()
      }
      checkWasmSupportAndLoad()
    }
    else {
      setTimeout(() => {
        routeLoad()
      }, 100)
    }
  }
  routeLoad()

  // theme
  interval = setInterval(() => {
    themeColor.value = window.getComputedStyle(document.body).getPropertyValue('--theme-color')
  }, 1000)
})
onBeforeUnmount(() => {
  if (interval)
    clearInterval(interval)
})
</script>

<template>
  <ClientOnly>
    <NConfigProvider ref="configProviderRef" :theme="isDarkmode ? darkTheme : lightTheme" :theme-overrides="themeOverrides">
      <NAlert :title="i18n('wasm.alertTitle')" type="info" closable>
        {{ i18n('wasm.alertTip') }}
      </NAlert>
      <div class="flex mt-10">
        <SideControl ref="sideControlRef" @process="process" />
        <!-- preview -->
        <div ref="previewBoxRef" class="flex-1 ml-16">
          <!--      进度条 -->
          <template v-if="!wasmModuleLoaded">
            <NP>{{ i18n('wasm.resourceLoading') }}</NP>
          </template>
          <template v-if="processStatus === processStatusType.PROCESSING">
            <NSpace justify="space-between" class="mb-2.5">
              <NP>{{ progressTip }} {{ i18n('wasm.remainingTime', [procRemainingTime.toFixed(2)]) }}</NP>
              <NButton round size="small" strong secondary @click="handleCancel">
                {{ i18n('wasm.cancelProcess') }}
              </NButton>
            </NSpace>
            <NProgress
              type="line"
              :color="themeColor"
              :percentage="progressRate"
              indicator-placement="inside"
              processing
            />
          </template>
          <template v-if="processStatus === processStatusType.SUCCESS">
            <NSpace justify="space-between" class="mb-2.5">
              <NP>{{ progressTip }}</NP>
              <NButton :color="themeColor" round size="small" @click="saveOutput">
                {{ i18n('wasm.saveImg') }}
              </NButton>
            </NSpace>
            <ImgCompare v-if="realcuganParams.previewRadio === 0" :width="previewBoxSize.width" :height="previewBoxSize.height" :front-img="outputImgSrc" :back-img="uploadImgSrc" />
            <NSpace v-else :wrap="realcuganParams.previewRadio === 2">
              <NImage :src="uploadImgSrc" alt="uploadImg" />
              <NImage :src="outputImgSrc" alt="outputImg" />
            </NSpace>
          </template>
        </div>
      </div>
    </NConfigProvider>
    <div class="display-none">
      <canvas id="canvas-output" ref="canvasOutputRef" />
    </div>
  </ClientOnly>
</template>

<style lang="scss">
@use '../../styles/config.scss' as *;
</style>
