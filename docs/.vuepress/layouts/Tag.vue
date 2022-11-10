<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogCategory } from 'vuepress-plugin-blog2/client'

import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import ArticleList from '../components/ArticleList.vue'

const tagMap = useBlogCategory('tag')
const router = useRouter()
onMounted(() => {
  const keys = Object.keys(tagMap.value.map)
  if (keys.length)
    router.push(tagMap.value.map[keys[0]]?.path)
})
</script>

<template>
  <ParentLayout>
    <template #page>
      <main class="page">
        <div class="tag-wrapper">
          <RouterLink
            v-for="({ items, path }, name) in tagMap.map"
            :key="name"
            :to="path"
            class="tag"
          >
            {{ name }}
            <span class="tag-num">
              {{ items.length }}
            </span>
          </RouterLink>
        </div>
        <ArticleList :items="tagMap.currentItems" />
      </main>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
@use "@vuepress/theme-default/styles/mixins";

.tag-wrapper {
  @include mixins.content_wrapper;

  padding-top: 1rem !important;
  padding-bottom: 0 !important;

  font-size: 14px;

  a {
    color: inherit;
  }

  .tag {
    display: inline-block;
    vertical-align: middle;

    overflow: hidden;

    margin: 0.3rem 0.6rem 0.8rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0.25rem;

    cursor: pointer;

    transition: background 0.3s, color 0.3s;

    @media (max-width: 419px) {
      font-size: 0.9rem;
    }

    .tag-num {
      display: inline-block;

      min-width: 1rem;
      height: 1.2rem;
      margin-left: 0.2em;
      padding: 0 0.1rem;
      border-radius: 0.6rem;

      font-size: 0.7rem;
      line-height: 1.2rem;
      text-align: center;
    }

    &.router-link-active {
      background: var(--c-brand);

      .tag-num {
        color: var(--c-bg);
      }
    }
  }
}
</style>
