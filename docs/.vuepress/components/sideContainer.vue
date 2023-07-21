<script setup name="sideContainer" lang="ts">
import SideBarPage from 'vuepress-theme-hope/sidebar/components/Sidebar.js'
</script>

<template>
  <SideBarPage>
    <template #top />
    <template #default>
      <Clock />
      <Weather />
    </template>
    <template #bottom />
  </SideBarPage>
</template>

<style lang="scss" scoped>

</style>
