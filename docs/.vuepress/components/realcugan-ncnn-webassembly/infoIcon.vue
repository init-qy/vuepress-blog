<script setup name="infoIcon" lang="ts">
import NaivePkg from 'naive-ui'

const props = defineProps({
  info: String,
})

const { NIcon, NPopover } = NaivePkg
</script>

<template>
  <NPopover trigger="hover" :duration="500" class="max-w-200px">
    <template #trigger>
      <NIcon size="20" class="ml-2.5 hover:cursor-pointer hover:color-$theme-color">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M17 22v-8h-4v2h2v6h-3v2h8v-2h-3z" fill="currentColor" /><path d="M16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z" fill="currentColor" /><path d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4z" fill="currentColor" /></svg>
      </NIcon>
    </template>
    <span>
      {{ props.info }}
    </span>
  </NPopover>
</template>
