<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as wasmFeatureDetect from 'wasm-feature-detect'
import { usePageData } from '@vuepress/client'
import sideControl from './sideControl.vue'

const pageData = usePageData()
let Module: any = null
const wasmModuleLoaded = ref(false)

const checkWasmSupportAndLoad = async function () {
  const [hasSIMD, hasThreads] = await Promise.all([wasmFeatureDetect.simd(), wasmFeatureDetect.threads()])
  console.log(hasSIMD, hasThreads)
  if (!hasSIMD) {
    // alert('浏览器不支持simd (不支持iOS，Android请单独用Chrome/Firefox等浏览器打开，桌面端请使用最新版本的Chrome或Firefox)')
    return
  }
  if (!hasThreads) {
    // alert('浏览器不支持pthreads (不支持iOS，Android请单独用Chrome/Firefox等浏览器打开，桌面端请使用最新版本的Chrome或Firefox)')
    // return
  }
  fetch('realcugan-ncnn-webassembly-simd-threads.wasm')
    .then((response) => {
      response.arrayBuffer()
    })
    .then((buffer) => {
      Module.wasmBinary = buffer
      const script = document.createElement('script')
      script.src = 'realcugan-ncnn-webassembly-simd-threads.js'
      script.onload = () => {
        console.log('Emscripten loaded.')
      }
      document.body.appendChild(script)

      Module.onRuntimeInitialized = () => {
        console.log('wasm module loaded')
        wasmModuleLoaded.value = true
      }
    })
}
// init emscripten
onMounted(async () => {
  Module = {
    print: (text) => {
      console.log(text)
      // catch callback =_=
      if (text.length > 11 && text.substring(0, 10) === '$CALLBACK$')
        this.wasmCallback(text.substring(11, text.length))
    },
    printErr: (text) => {
      console.error(text)
      if ((`${text}`).includes('memory access out of bounds')) {
        // this.handleOOM()
      }
      else {
        // this.$alert(`错误信息: ${text}`, '处理错误', {
        //   confirmButtonText: '刷新重试',
        //   callback: (action) => {
        //     window.location.reload()
        //   },
        // })
      }
    },
  }

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
  <div class="flex">
    <sideControl />
    <!-- preview -->
    <div class="flex-1">
      preview
    </div>
  </div>
</template>

<style lang="scss">
@use '../../styles/config.scss' as *;
</style>
