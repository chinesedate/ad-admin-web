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
          <li class="audit-tool" v-for="auditIssue in auditIssueList" :key="auditIssue.id"
              @click="handleAuditToolClick(auditIssue)">
            <div class="tool-content">{{auditIssue.title}}</div>
            <div class="tool-content"><p>{{auditIssue.desc}}</p></div>
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
      <div class="audit-issue-info">
        <div class="audit-tool-info-header">待审核问题详情</div>
        <div v-if="auditIssueList.length > 0">
          <p>
            问题：{{auditIssueInfo.title}}
          </p>
          <div>问题简介：
            <el-input class="issue-brief-introduction" v-model="briefIntroduction"
                      placeholder="从以下问题详细描述中复制一段话作为问题的简单描述"></el-input>
          </div>
          <viewer ref="issueViewer" :initialValue="auditIssueInfo.desc" height="500px"></viewer>
          <div class="audit-issue-submit">
            <el-button @click="handleSubmit" type="success">提交信息</el-button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css'
import {Viewer} from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import {auditIssue, fetchAuditIssue, listAuditIssue} from "@/api/issue";

export default {
  name: "issue",
  data() {
    return {
      pageNum: 0,
      pageSize: 10,
      total: 0,
      hasNext: false,
      currentPage: 1,
      auditIssueList: [],
      /**
       * 当前正进行审核的工具信息
       */
      auditIssueInfo: {
        desc: ''
      },
      briefIntroduction: ''
    }
  },
  components: {
    'viewer': Viewer
  },
  methods: {
    handlePageChange() {

    },
    handleSubmit() {
      auditIssue({
        id: this.auditIssueInfo.id, status: 1,
        title: this.auditIssueInfo.title,
        briefIntroduction: this.briefIntroduction
      }).then(res => {
            console.log(res);
            this.listAuditIssue();
          }
      );
    },
    fetchAuditIssue(auditIssueId) {
      fetchAuditIssue(auditIssueId).then(res => {
        if (res.data.data != null) {
          this.auditIssueInfo = res.data.data;
          this.$refs.issueViewer.invoke('setMarkdown', this.auditIssueInfo.text);
        }
      });
    },
    handleAuditToolClick(auditTool) {
      // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
      this.auditIssueInfo = auditTool;
      this.fetchAuditTool(auditTool.id);
    },
    listAuditIssue() {
      listAuditIssue({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            data: {questionId: 1111}
          }
      ).then(res => {
            if (res.data.data != null) {
              this.auditIssueList = res.data.data.list;
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
              if (this.auditIssueList.length > 0) {
                this.fetchAuditIssue(this.auditIssueList[0].id);
              }
            }
          }
      );
    }
  },
  computed: {
    canSubmit() {
      return this.briefIntroduction === '';
    }
  },
  created() {
    this.listAuditIssue();
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

.audit-issue-info {
  width: 400px;
}

.issue-brief-introduction {
  width: 60%;
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
