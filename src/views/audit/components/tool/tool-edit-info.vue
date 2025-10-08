<template>
  <div class="audit-tool-info">
    <div class="audit-tool-info-header">工具详情</div>
    <div>
      {{auditToolInfo.name}}
    </div>
    <div>
      {{auditToolInfo.description}}
    </div>
    <el-tabs v-model="activeName" tab-position="top">
      <!--推荐阅读中，划分入门、基础、高深等级-->
      <el-tab-pane label="推荐阅读" name="recommend">
        <tool-edit-info-recommend></tool-edit-info-recommend>
      </el-tab-pane>
      <el-tab-pane label="收藏" name="favorite ">
        <tool-edit-info-favorite></tool-edit-info-favorite>
      </el-tab-pane>
      <!--提问以及文章可以再官方文档中找到信息的，做好关联提示-->
      <el-tab-pane label="提问" name="issues">
        <tool-edit-info-issues></tool-edit-info-issues>
      </el-tab-pane>
      <el-tab-pane label="文章" name="article">
        <tool-edit-info-article></tool-edit-info-article>
      </el-tab-pane>
      <!--官方文档等信息放在基本信息中-->
      <el-tab-pane label="基本信息" name="base-info">
        <tool-edit-info-base-info></tool-edit-info-base-info>
      </el-tab-pane>
      <el-tab-pane label="相关推荐" name="link">
        <tool-edit-info-link></tool-edit-info-link>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {fetchTool} from "@/api/edit";
import ToolEditInfoRecommend from '@/views/audit/components/tool/tool-edit-info-recommend'
import ToolEditInfoArticle from '@/views/audit/components/tool/tool-edit-info-article'
import ToolEditInfoBaseInfo from '@/views/audit/components/tool/tool-edit-info-base-info'
import ToolEditInfoFavorite from '@/views/audit/components/tool/tool-edit-info-favorite'
import ToolEditInfoIssues from '@/views/audit/components/tool/tool-edit-info-issues'
import ToolEditInfoLink from '@/views/audit/components/tool/tool-edit-info-link'


export default {
  name: "tool-edit-info",
  data() {
    return {
      /**
       * 当前正进行审核的工具信息
       */
      auditToolInfo: {},
      activeName: 'recommend',
    }
  },
  components: {
    'tool-edit-info-recommend': ToolEditInfoRecommend,
    'tool-edit-info-article': ToolEditInfoArticle,
    'tool-edit-info-base-info': ToolEditInfoBaseInfo,
    'tool-edit-info-favorite': ToolEditInfoFavorite,
    'tool-edit-info-issues': ToolEditInfoIssues,
    'tool-edit-info-link': ToolEditInfoLink
  },
  props: ['auditToolId'],
  watch: {
    // 当auditToolId变换时，查询新的工具信息
    auditToolId: function () {
      this.fetchTool(this.auditToolId);
    }
  },
  methods: {
    fetchTool(auditToolId) {
      fetchTool(auditToolId).then(res => {
        this.auditToolInfo = res.data.data;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.audit-tool-info {

}

.audit-tool-info-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 40px;
  color: #212121;
  word-break: break-word;
  padding-bottom: 20px;
}

.audit-tool-info-button {
  padding-top: 10px;
}
</style>