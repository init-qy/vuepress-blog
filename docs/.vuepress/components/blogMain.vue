<script setup name="sideContainer" lang="ts">
import { usePageFrontmatter } from '@vuepress/client'
import { computed, h, onMounted, ref } from 'vue'
// import analyze from 'rgbaster'
// import Color from 'color'
import { IconBase } from 'vuepress-shared/client'

// import DropTransition from 'vuepress-theme-hope/components/transitions/DropTransition.js'

import type { FunctionalComponent } from 'vue'
import type { ThemeBlogHomePageFrontmatter } from 'vuepress-theme-hope/shared/index.js'

const hero = ref<HTMLElement>()
const frontmatter = usePageFrontmatter<ThemeBlogHomePageFrontmatter>()

const bgImage = computed(() =>
  frontmatter.value.bgImage,
)

const bgImageStyle = computed(() => {
  const defaultStyle = {
    height: '350px',
    textAlign: 'center',
    overflow: 'hidden',
  }

  return {
    ...defaultStyle,
    ...frontmatter.value.bgImageStyle,
  }
})

const SlideDownIcon: FunctionalComponent = () =>
  h(IconBase, { name: 'slide-down' }, () =>
    h('path', {
      d: 'M108.775 312.23c13.553 0 27.106 3.734 39.153 11.806l375.205 250.338 363.641-252.808c32.587-21.624 76.499-12.83 98.123 19.757 21.685 32.467 12.95 76.56-19.576 98.184l-402.854 278.89c-23.733 15.901-54.694 15.962-78.547.12L69.501 442.097c-32.647-21.685-41.441-65.777-19.817-98.304 13.734-20.54 36.201-31.563 59.09-31.563Z',
    }),
  )

SlideDownIcon.displayName = 'SlideDownIcon'

const onButtonClick = () => {
  window.scrollTo({
    top: hero.value!.clientHeight,
    behavior: 'smooth',
  })
}

// onMounted(async () => {
//   // 通过图片链接判断图片颜色深浅，以便设置文字颜色
//   const result = await analyze('http://bing.getlove.cn/bingImage', {
//     ignore: ['rgb(129,135,141)', 'rgb(0,0,0)'],
//     scale: 0.6,
//   })
//   result.splice(10)
//   let color
//   let count = 0
//   result.forEach((e) => {
//     if (color) {
//       color = color.mix(Color(e.color), e.count / count)
//       count += e.count
//     }
//     else {
//       color = Color(e.color)
//       count = e.count
//     }
//   })
//   // console.log(color)
//   const RgbValue = result[0].color.replace('rgb(', '').replace(')', '')
//   const RgbValueArray = RgbValue.split(',')
//   const grayLevel = RgbValueArray[0] * 0.299 + RgbValueArray[1] * 0.587 + RgbValueArray[2] * 0.114
//
//   if (grayLevel >= 1.92)
//     console.info('浅色')
//
//   else
//     console.info('深色')
// })
</script>

<template>
  <div ref="hero" class="blog-hero fullscreen" :style="bgImageStyle">
    <div class="mask" :style="{ background: `url(${bgImage}) center/cover no-repeat` }" />
    <button
      class="slide-down-button" @click="onButtonClick"
    >
      <SlideDownIcon />
      <SlideDownIcon />
    </button>
  </div>
</template>

<style lang="scss" scoped>
button {
  border-width: 0;
  background: transparent;
  cursor: pointer;
}
.blog-hero {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 450px;
  margin-bottom: 1rem;

  color: #eee;

  font-family: var(--font-family-fancy);

  @media (max-width: hope-config.$tablet) {
    height: 350px;
    margin: 0 -1.5rem 1rem;
  }

  @media (max-width: hope-config.$mobile) {
    margin: 0 0 1rem;
  }

  .mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    &::after {
      content: " ";

      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;

      display: block;

      background: var(--light-grey);

      opacity: 0.2;
    }
  }

  > :not(.mask) {
    position: relative;
    z-index: 2;
  }

  h1 {
    margin: 0.5rem auto;
    font-size: 2rem;

    @media (max-width: hope-config.$pad) {
      font-size: 1.875rem;
    }

    @media (max-width: hope-config.$tablet) {
      font-size: 2rem;
    }

    @media (max-width: hope-config.$mobile) {
      font-size: 1.875rem;
    }
  }

  .hero-image + h1 {
    margin: 0 auto;
  }

  .description {
    margin: 1.2rem auto 0;
    font-size: 20px;

    @media (max-width: hope-config.$pad) {
      font-size: 18px;
    }

    @media (max-width: hope-config.$tablet) {
      font-size: 20px;
    }

    @media (max-width: hope-config.$mobile) {
      font-size: 18px;
    }
  }

  .slide-down-button {
    position: absolute;
    bottom: 0;
    left: calc(50vw - 30px);

    display: none;

    width: 60px;
    height: 60px;
    padding: 10px;

    .icon {
      width: 30px;
      margin: -15px 0;

      animation-name: bounce-down;
      animation-duration: 1.5s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-direction: alternate;

      &:first-child {
        color: rgb(255 255 255 / 15%);
      }

      &:nth-child(2) {
        color: rgb(255 255 255 / 50%);
      }
    }
  }

  &.fullscreen {
    height: calc(100vh - var(--navbar-height)) !important;

    .mask {
      background-position-y: top !important;
    }

    .slide-down-button {
      display: block;
    }
  }
}

@keyframes bounce-down {
  from {
    transform: translateY(-5px);
  }

  to {
    transform: translateY(5px);
  }
}
</style>

