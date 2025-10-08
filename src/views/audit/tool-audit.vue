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
        <div class="audit-tool-list-header">待审核列表</div>
        <ul>
          <li class="audit-tool" v-for="auditTool in auditToolList" :key="auditTool.id"
              @click="handleAuditToolClick(auditTool)">
            <div class="tool-content">{{auditTool.name}}</div>
            <div class="tool-content"><p>{{auditTool.description}}</p></div>
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
      <div class="audit-tool-info">
        <div class="audit-tool-info-header">待审核工具详情</div>
        <div v-if="auditToolList.length > 0">
          <div>
            {{auditToolInfo.name}}
          </div>
          <div class="audit-tool-info-button">
            <el-button @click="handleReject" plain>否决</el-button>
            <el-button @click="handleAdopt" plain>采用</el-button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {auditTool, fetchAuditTool, listAuditTool} from "@/api/audit";

export default {
  name: "tool-audit",
  data() {
    return {
      pageNum: 0,
      pageSize: 10,
      total: 0,
      hasNext: false,
      currentPage: 1,
      auditToolList: [],
      /**
       * 当前正进行审核的工具信息
       */
      auditToolInfo: {}
    }
  },
  methods: {
    handlePageChange() {

    },
    handleAdopt() {
      auditTool({id: this.auditToolInfo.id, status: 1}).then(res => {
            if (res != null) {
              console.log(res);
              this.listAuditTool();
            }
          }
      );
    },
    handleReject() {
      auditTool({id: this.auditToolInfo.id, status: 2}).then(
          res => {
            if (res != null) {
              console.log(res);
              this.listAuditTool();
            }
          }
      );
    },
    fetchAuditTool(auditToolId) {
      fetchAuditTool(auditToolId).then(res => {
        this.auditToolInfo = res.data.data;
      });
    },
    handleAuditToolClick(auditTool) {
      // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
      this.auditToolInfo = auditTool;
      this.fetchAuditTool(auditTool.id);
    },
    listAuditTool() {
      listAuditTool({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            data: {questionId: 1111}
          }
      ).then(res => {
            if (res.data.data != null) {
              this.auditToolList = res.data.data.list;
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
              if (this.auditToolList.length > 0) {
                this.fetchAuditTool(this.auditToolList[0].id);
              }
            }
          }
      );
    }
  },
  created() {
    this.listAuditTool();
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

.audit-tool-list {
  min-width: 584px;
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
}

.tool-content {
  cursor: pointer;
}
</style>
