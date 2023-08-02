<script setup lang="ts" name="sideControl">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { NButton, NForm, NFormItem, NIcon, NImage, NP, NRadioButton, NRadioGroup, NSpace, NUpload, NUploadDragger } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { useI18n, useLocale } from '../utils/i18n'
import { getAssetsUrl } from '../utils/url'
import InfoIcon from './infoIcon.vue'

const emits = defineEmits(['save', 'process'])

const { locale } = useLocale()
const { i18n } = useI18n(locale)

const formRef = ref<FormInst>()
const canvasUploadRef = ref<HTMLCanvasElement>()

const model = useStorage('realcuganParams', {
  scaleRadio: 2,
  denoiseRadio: 0,
  previewRadio: 0,
})
const uploadImage = ref('')
const scaleRadioList = [{
  value: 2,
  label: '2X',
}, {
  value: 3,
  label: '3X',
}]
const denoiseRadioList = [{
  value: -1,
  label: i18n('wasm.denoiseRadio1'),
}, {
  value: 0,
  label: i18n('wasm.denoiseRadio2'),
}, {
  value: 3,
  label: i18n('wasm.denoiseRadio3'),
}]
const previewRadioList = [{
  value: 0,
  label: i18n('wasm.previewMode1'),
}, {
  value: 1,
  label: i18n('wasm.previewMode2'),
}, {
  value: 2,
  label: i18n('wasm.previewMode3'),
}]

const handleChange = function ({ file }) {
  const canvas = canvasUploadRef.value
  if (!canvas)
    return
  const ctx = canvas.getContext('2d')
  const img = new Image()
  const reader = new FileReader()
  reader.onload = function ({ target }) {
    if (typeof target.result === 'string') {
      uploadImage.value = target.result
      img.src = target.result
    }
  }
  reader.onerror = function (e) {
    console.error(e)
  }
  reader.readAsDataURL(file.file)
  img.onload = function () {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const uploadImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    emits('process', uploadImageData, canvas.width, canvas.height, file.name)
  }
  img.onerror = function (e) {
    console.error(e)
  }
}
const useTestCase = function () {
  const canvas = canvasUploadRef.value
  if (!canvas)
    return
  const ctx = canvas.getContext('2d')
  const imageName = 'testImage.jpg'
  const imageUrl = getAssetsUrl(imageName)
  const img = new Image()
  img.onload = function () {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const uploadImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    emits('process', uploadImageData, canvas.width, canvas.height, imageName)
  }
  uploadImage.value = imageUrl
  img.src = imageUrl
}
const resetImage = function () {
  uploadImage.value = ''
}
defineExpose({ resetImage, canvasUploadRef })
</script>

<template>
  <NSpace vertical class="w-400px flex-shrink-0">
    <NForm
      ref="formRef"
      :model="model"
      label-placement="left"
      label-align="left"
      label-width="120"
      require-mark-placement="right-hanging"
    >
      <NFormItem :label="`${i18n('wasm.scaleRadio')} :`" path="scaleRadio">
        <NRadioGroup v-model:value="model.scaleRadio" name="scaleRadio">
          <NRadioButton
            v-for="item in scaleRadioList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </NRadioGroup>
        <InfoIcon :info="i18n('wasm.scaleInfo')" />
      </NFormItem>
      <NFormItem :label="`${i18n('wasm.denoiseRadio')} :`" path="denoiseRadio">
        <NRadioGroup v-model:value="model.denoiseRadio" name="denoiseRadio">
          <NRadioButton
            v-for="item in denoiseRadioList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </NRadioGroup>
        <InfoIcon :info="i18n('wasm.denoiseInfo')" />
      </NFormItem>
      <NFormItem :label="`${i18n('wasm.previewMode')} :`" path="previewRadio">
        <NRadioGroup v-model:value="model.previewRadio" name="previewRadio">
          <NRadioButton
            v-for="item in previewRadioList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </NRadioGroup>
      </NFormItem>
      <NFormItem>
        <NUpload
          v-if="!uploadImage"
          accept="image/png,image/jpeg,image/webp,image/bmp"
          :default-upload="true"
          :show-file-list="false"
          list-type="image"
          @change="handleChange"
        >
          <NUploadDragger>
            <div class="mb-2.5">
              <NIcon size="48" :depth="3">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor"
                  class="el-icon-upload" viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                  />
                  <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                </svg>
              </NIcon>
            </div>
            <NP class="text-sm">
              {{ i18n('wasm.uploadText1') }}
            </NP>
            <NP class="text-xs">
              {{ i18n('wasm.uploadText2') }}
            </NP>
          </NUploadDragger>
        </NUpload>
        <NImage v-if="uploadImage" :src="uploadImage" class="max-w-300px hover:cursor-pointer" />
      </NFormItem>
      <NButton v-if="!uploadImage" strong secondary @click="useTestCase">
        {{ i18n('wasm.useExample') }}
      </NButton>
    </NForm>
  </NSpace>
  <div class="display-none">
    <canvas id="canvas-upload" ref="canvasUploadRef" />
  </div>
</template>

<style lang="scss">
@use '../../styles/config.scss' as *;
</style>
