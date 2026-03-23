<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        :is="Component"
        v-if="$route.meta.keepAlive"
        :key="$route.fullPath"
      />
    </keep-alive>
    <component
      :is="Component"
      v-if="!$route.meta.keepAlive"
      :key="$route.fullPath"
    />
  </router-view>
</template>
<script setup>

</script>
<style scoped>

</style>