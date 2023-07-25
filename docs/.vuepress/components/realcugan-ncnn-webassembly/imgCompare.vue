<script setup lang="ts" name="imgCompare">
import { computed, ref, unref } from 'vue'
import { NIcon } from 'naive-ui'

const props = defineProps({
  width: Number,
  height: Number,
  backImg: String,
  frontImg: String,
})

const sliderRef = ref()

const imgStyle = computed(() => ({ width: `${props.width}px`, height: `${props.height}px` }))

const sliderPos = ref(props.width / 2)

const active = ref(true)
const handleMousedown = function (event: MouseEvent) {
  active.value = true
  const sliderOffsetLeft = unref(sliderRef).offsetLeft
  sliderPos.value = sliderOffsetLeft
  const disX = event.clientX - sliderOffsetLeft
  document.onmousemove = function (event) {
    if (!active.value)
      return

    sliderPos.value = event.clientX - disX
    if (sliderPos.value >= props.width)
      sliderPos.value = props.width
    else if (sliderPos.value <= 0)
      sliderPos.value = 0
  }
  document.onmouseup = function () {
    active.value = false
    document.onmousemove = document.onmouseup = null
    return false
  }
}
</script>

<template>
  <div
    class="PictureComparison"
    :style="imgStyle"
  >
    <div class="before-image" :style="`width:${sliderPos}px`">
      <img :src="frontImg" alt="" :style="imgStyle" class="h-auto !max-w-screen">
    </div>
    <div class="after-image">
      <img :src="backImg" alt="" :style="imgStyle" class="h-auto !max-w-screen">
    </div>
    <div
      ref="sliderRef"
      class="divider-bar"
      :style="`left:${sliderPos}px`"
      @mousedown.prevent="handleMousedown"
    >
      <div class="arrow">
        <NIcon size="19">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M15 17.898c0 1.074-1.265 1.648-2.073.941l-6.31-5.522a1.75 1.75 0 0 1 0-2.634l6.31-5.522c.808-.707 2.073-.133 2.073.941v11.796z" fill="currentColor" /></g></svg>
        </NIcon>
        <NIcon size="19">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M9 17.898c0 1.074 1.265 1.648 2.073.941l6.31-5.522a1.75 1.75 0 0 0 0-2.634l-6.31-5.522C10.265 4.454 9 5.028 9 6.102v11.796z" fill="currentColor" /></g></svg>
        </NIcon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PictureComparison {
  position: relative;
  display: inline-block;
  margin: 0 auto;
  min-height: 273px;
  margin-bottom: 40px;

  .before-image {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 50%;
    overflow: hidden;
  }

  .after-image {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .divider-bar {
    cursor: ew-resize;
    position: absolute;
    width: 2px;
    left: 50%;
    top: 0px;
    background: var(--theme-color);
    height: 100%;
    display: block;
    z-index: 2;

    .arrow {
      border-radius: 100%;
      background: var(--vp-bg);
      width: 38px;
      height: 38px;
      position: absolute;
      margin-left: -20px;
      margin-top: -20px;
      border: 2px solid var(--theme-color);
      top: 50%;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--theme-color);
    }
  }
}
</style>
