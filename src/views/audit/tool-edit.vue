<template>
  <div class="audit-tool-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="audit-tool-list-content">
      <div class="audit-tool-list">
        <div class="audit-tool-list-header">工具列表</div>
        <el-input
          class="tool-list-search inline-input"
          v-model="toolSearch.value"
          placeholder="请输入内容"
          :clearable="true"
          @change="handleToolSelect">
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
        <ul>
          <li class="audit-tool" v-for="auditTool in auditToolList" :key="auditTool.id"
              @click="handleEditToolClick(auditTool.id)">
            <div class="tool-content">{{auditTool.name}}</div>
          </li>
        </ul>
        <div class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page="currentPage"
                         :page-size="pageSize"
                         @current-change="handlePageChange"
                         @prev-click="handlePageChange"
                         @next-click="handlePageChange"
                         layout="prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
      <tool-edit-info :auditToolId="auditToolId"></tool-edit-info>
    </div>
  </div>
</template>

<script>
import {listTool, querySearchSuggestion} from "@/api/edit";

import ToolEditInfo from '@/views/audit/components/tool/tool-edit-info'

export default {
  name: "tool-edit",
  data() {
    return {
      pageNum: 0,
      pageSize: 10,
      total: 0,
      hasNext: false,
      currentPage: 1,
      auditToolList: [],
      /**
       *  工具搜索建议
       */
      toolSearch: {
        value: '',
        options: []
      },
      auditToolId: ''
    }
  },
  components: {
    'tool-edit-info': ToolEditInfo
  },
  methods: {
    handlePageChange() {

    },
    // handleAdopt() {
    //   auditTool({id: this.auditToolInfo.id, status: 1}).then(res => {
    //       console.log(res);
    //       this.listTool();
    //     }
    //   );
    // },
    // handleReject() {
    //   auditTool({id: this.auditToolInfo.id, status: 2}).then(
    //     res => {
    //       console.log(res);
    //       this.listTool();
    //     }
    //   );
    // },
    // fetchTool(auditToolId) {
    //   fetchTool(auditToolId).then(res => {
    //     this.auditToolInfo = res.data.data;
    //   });
    // },
    handleEditToolClick(auditToolId) {
      // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
      // this.auditToolInfo = auditTool;
      // this.fetchTool(auditTool.id);
      this.auditToolId = auditToolId;
    },
    listTool(keyword) {
      listTool({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          data: {keyword}
        }
      ).then(res => {
          if (res.data.data != null) {
            console.log(res.data)
            this.auditToolList = res.data.data.list;
            this.total = res.data.data.total;
            this.hasNext = res.data.data.hasNext;
            if (this.auditToolList.length > 0) {
              this.auditToolId = this.auditToolList[0].id;
            }
          }
        }
      );
    },
    /**
     * 工具搜索建议查询
     */
    querySearchSuggestion(queryString, callback) {
      // :fetch-suggestions="querySearchSuggestion"
      // :trigger-on-focus="false"
      // @select="handleToolSelect"
      querySearchSuggestion(queryString).then(res => {
          if (res.data.data != null) {
            let resultData = res.data.data;
            callback(resultData);
          }
        }
      )
    },
    /**
     * 工具搜索
     */
    handleToolSelect(value) {
      this.listTool(value);
    }
  },
  created() {
    this.listTool();
  }
}
</script>

<style lang="scss" scoped>

.audit-tool-wrapper {
}

.audit-tool-list-content {
  padding-top: 20px;
  display: flex;
}

.tool-list-search {
  width: 200px;
}

.audit-tool-list {
  min-width: 300px;
  max-width: 1300px;
}

.audit-tool-list-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 40px;
  color: #212121;
  word-break: break-word;
  padding-bottom: 20px;
}


.page-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.audit-tool {
  height: 50px;
  padding-bottom: 10px;
  cursor: default;
  display: flex;
  align-items: center;
}

.tool-content {
  cursor: pointer;
}
</style>
