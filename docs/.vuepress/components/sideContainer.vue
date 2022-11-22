<script setup name="sideContainer" lang="ts">
import SideBarPage from 'vuepress-theme-hope/sidebar/components/Sidebar.js'
import Clock from './clock.vue'
// import Weather from './weather.vue'
</script>

<template>
  <SideBarPage>
    <template #top>
      <Clock />
    </template>
    <template #default>
      <!-- default -->
    </template>
    <template #bottom>
      <!--      <Weather /> -->
    </template>
  </SideBarPage>
</template>

<style lang="scss" scoped>

</style>
