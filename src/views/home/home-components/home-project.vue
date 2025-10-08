<template>
  <div>
    <div v-if="projectList.length > 0" class="api-project-wrapper">
      <ul v-for="project in projectList" :key="project.id">
        <li class="project-row">
          <div class="project-details">
            <router-link :to="'/project/' + project.id + '/list'">
              <span>{{project.projectName}}</span>
            </router-link>
          </div>
        </li>
      </ul>
      <el-pagination
          background
          @size-change="sizeChange"
          @prev-click="prevClick"
          @next-click="nextClick"
          :page-size="pageSize"
          :hide-on-single-page=true
          layout="prev, pager, next"
          :total="pageTotal">
      </el-pagination>
    </div>
    <el-empty v-else description="描述文字"></el-empty>
  </div>
</template>

<script>
  export default {
    name: "home-project",
    props: {
      projectList: Array
    },
    data() {
      return {
        pageNum: 1,
        keyword: '',
        pageSize: 10,
        pageTotal: 0,
      }
    },
    methods: {
      sizeChange(e) {
        this.$emit('size-change', e);
      },
      prevClick(e) {
        this.$emit('prev-click', e);
      },
      nextClick(e) {
        this.$emit('next-click', e);
      }
    },
    created() {
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>

</style>
