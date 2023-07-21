<script setup lang="ts">
import { useDarkmode } from 'vuepress-theme-hope/outlook/composables/index'
import { computed, ref, watch } from 'vue'
import { darkTheme } from 'naive-ui'
import type { FormInst } from 'naive-ui'

const { isDarkmode } = useDarkmode()

const formRef = ref<FormInst | null>(null)
const model = ref({
  scaleRadio: 2,
  denoiseRadio: 0,
  previewRadio: 0,
})
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
  disabled: model.value.scaleRadio === 3,
}, {
  value: 0,
  label: '无降噪',
  disabled: model.value.scaleRadio === 3,
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

watch(() => model.value.scaleRadio, (val) => {
  if (val === 3)
    model.value.denoiseRadio = 3
})
</script>

<template>
  <n-config-provider :theme="isDarkmode ? darkTheme : null">
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="model"
        label-placement="left"
        label-align="left"
        label-width="120"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="超分倍率 :" path="scaleRadio">
          <n-radio-group v-model:value="model.scaleRadio" name="scaleRadio">
            <n-radio-button
              v-for="item in scaleRadioList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </n-radio-group>
        </n-form-item>
        <n-form-item label="降噪配置 :" path="denoiseRadio">
          <n-radio-group v-model:value="model.denoiseRadio" name="denoiseRadio">
            <n-radio-button
              v-for="item in denoiseRadioList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            />
          </n-radio-group>
        </n-form-item>
        <n-form-item label="预览模式 :" path="previewRadio">
          <n-radio-group v-model:value="model.previewRadio" name="previewRadio">
            <n-radio-button
              v-for="item in previewRadioList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </n-radio-group>
        </n-form-item>
        <n-form-item>
          <n-upload
            directory-dnd
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
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
                </n-icon>
              </div>
              <n-text class="text-sm">
                点击或者拖动图片到该区域来上传
              </n-text>
              <n-p class="text-xs">
                只能选取jpg/png/webp/bmp文件
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
      </n-form>
    </n-space>
    <n-space>
      <n-button type="primary" round @click="handleSave">
        保存图片
      </n-button>
      <n-button round @click="handleCancel">
        取消处理
      </n-button>
    </n-space>
  </n-config-provider>
</template>

<style lang="scss">
@use '../../styles/config.scss' as *;
</style>
