<template>
  <div class="project-content">
    <el-tabs class="content-tab" v-model="activeName" tab-position="left" @tab-click="handleTabClick">
      <el-tab-pane label="接口列表" name="list">
        <api-list></api-list>
      </el-tab-pane>
      <el-tab-pane label="项目信息" name="data">
        <project-data></project-data>
      </el-tab-pane>
      <el-tab-pane label="接口来源" name="source">
        <api-source></api-source>
      </el-tab-pane>
      <el-tab-pane label="成员" name="member">
        <project-member></project-member>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ProjectData from '@/views/project/project-components/project-data';
  import ApiList from '@/views/project/project-components/project-api-list';
  import ApiSource from '@/views/project/project-components/project-api-source';
  import ProjectMember from '@/views/project/project-components/project-member';

  export default {
    name: "project",
    props: {
      projectId: String,
      tab: String
    },
    data() {
      return {
        activeName: this.tab
      }
    },

    components: {
      'project-data': ProjectData,
      'project-member': ProjectMember,
      'api-list': ApiList,
      'api-source': ApiSource
    },
    methods: {
      handleTabClick() {
        this.$router.push({path: '/project/' + this.projectId + '/' + this.activeName});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-tab /deep/ .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }
</style>
