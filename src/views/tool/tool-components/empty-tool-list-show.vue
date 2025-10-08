<template>
  <!--工具列表查询结果为空时展示页面-->
  <el-empty>
    <el-button type="primary" @click="$emit('add-tool')">添加工具</el-button>
    <el-button type="primary" @click="$emit('add-tool-category')">添加分类信息</el-button>
  </el-empty>

</template>

<script>
export default {
  name: "empty-tool-list-show"
}
</script>

<style scoped>

</style>