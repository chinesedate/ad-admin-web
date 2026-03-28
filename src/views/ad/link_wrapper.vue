<template>
  <router-view v-slot="{ Component }">
    <!-- 移除 keep-alive，让子组件自然切换 -->
    <component :is="Component" :key="$route.path" />
  </router-view>
</template>

<script>
  export default {
    name: 'LinkWrapper',
    // 不再使用 keep-alive
  }
</script>