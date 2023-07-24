<script setup lang="ts" name="imgCompare">
import { ref } from 'vue'

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
        <span>a</span>
        <span>a</span>
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
    background: white;
    height: 100%;
    display: block;
    z-index: 2;

    .arrow {
      border-radius: 100%;
      background: #fff;
      width: 34px;
      height: 34px;
      position: absolute;
      left: 50%;
      margin-left: -17px;
      margin-top: -17px;
      border: 2px solid;
      top: 50%;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
