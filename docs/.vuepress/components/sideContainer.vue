<script setup name="sideContainer" lang="ts">
import SideBarPage from 'vuepress-theme-hope/sidebar/components/Sidebar.js'
import { ClientOnly } from '@vuepress/client'
import Clock from './clock.vue'
import Weather from './weather.vue'
</script>

<template>
  <SideBarPage>
    <template #top />
    <template #default>
      <ClientOnly>
        <Clock />
        <Weather />
      </ClientOnly>
    </template>
    <template #bottom />
  </SideBarPage>
</template>

<style lang="scss" scoped>

</style>
