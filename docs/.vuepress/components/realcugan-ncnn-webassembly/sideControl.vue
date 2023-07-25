<script setup lang="ts" name="sideControl">
import { computed, ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { NButton, NForm, NFormItem, NIcon, NImage, NP, NRadioButton, NRadioGroup, NSpace, NUpload, NUploadDragger } from 'naive-ui'
import InfoIcon from './infoIcon.vue'

const emits = defineEmits(['save', 'process'])

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
const denoiseRadioList = computed(() => ([{
  value: -1,
  label: '保守',
  // disabled: model.value.scaleRadio === 3,
}, {
  value: 0,
  label: '无降噪',
  // disabled: model.value.scaleRadio === 3,
}, {
  value: 3,
  label: '降噪3X',
  disabled: false,
}]))
const previewRadioList = [{
  value: 0,
  label: '叠图',
}, {
  value: 1,
  label: '并排',
}, {
  value: 2,
  label: '并列',
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
  const img = new Image()
  img.onload = function () {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const uploadImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    emits('process', uploadImageData, canvas.width, canvas.height, imageName)
  }
  uploadImage.value = imageName
  img.src = imageName
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
      <NFormItem label="超分倍率 :" path="scaleRadio">
        <NRadioGroup v-model:value="model.scaleRadio" name="scaleRadio">
          <NRadioButton
            v-for="item in scaleRadioList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </NRadioGroup>
        <InfoIcon info="会决定输出图片的尺寸。目前3X处理会耗时比较久，推荐2X" />
      </NFormItem>
      <NFormItem label="降噪配置 :" path="denoiseRadio">
        <NRadioGroup v-model:value="model.denoiseRadio" name="denoiseRadio">
          <NRadioButton
            v-for="item in denoiseRadioList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :disabled="item.disabled"
          />
        </NRadioGroup>
        <InfoIcon info="降噪版: 如果原片噪声多，压得烂，推荐使用； 无降噪版：适合原图噪声不多，想提高分辨率/清晰度/做通用性的增强、修复处理； 保守版: 如果你担心丢失纹理，担心画风被改变，担心颜色被增强，总之就是各种担心AI会留下浓重的处理痕迹，推荐使用该版本" />
      </NFormItem>
      <NFormItem label="预览模式 :" path="previewRadio">
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
              点击或者拖动图片到该区域来上传
            </NP>
            <NP class="text-xs">
              只能选取jpg/png/webp/bmp文件
            </NP>
          </NUploadDragger>
        </NUpload>
        <NImage v-if="uploadImage" :src="uploadImage" class="max-w-300px hover:cursor-pointer" />
      </NFormItem>
      <NButton v-if="!uploadImage" strong secondary @click="useTestCase">
        使用示例图片
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
