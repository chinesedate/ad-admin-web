<template>
  <div class="audit-qa-tool-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="audit-qa-tool-list-content">
      <div class="audit-qa-tool-list">
        <div class="audit-qa-tool-list-header">待审核列表</div>
        <div class="audit-qa-tool-select">
          <div class="audit-qa-tool-input">
            <el-input
                class="qa-tool-list-search inline-input"
                v-model="qaToolSearch"
                placeholder="请输入内容"
                :clearable="true"
                @change="listAuditQaTool">
              <i class="el-icon-search el-input__icon" slot="suffix"></i>
            </el-input>
          </div>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul class="audit-qa-tool-title-list" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
            <li class="audit-qa-tool-title-wrapper" v-for="auditQaTool in auditQaToolList" :key="auditQaTool.id"
                @click="handleAuditQaToolClick(auditQaTool)">
              <div v-if="auditQaTool.toolName" class="qa-tool-title">{{auditQaTool.toolName}}</div>
              <div v-else class="qa-tool-title"><span>当前回复未添加标题</span></div>
            </li>
          </ul>
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">没有更多了</p>
        </div>
        <!--        <div class="page-wrapper">-->
        <!--          <el-pagination class="page-pagination"-->
        <!--                         background-->
        <!--                         :hide-on-single-page="true"-->
        <!--                         :current-page="currentPage"-->
        <!--                         :page-size="pageSize"-->
        <!--                         @current-change="handlePageChange"-->
        <!--                         @prev-click="handlePageChange"-->
        <!--                         @next-click="handlePageChange"-->
        <!--                         layout="prev, pager, next"-->
        <!--                         :total="total">-->
        <!--          </el-pagination>-->
        <!--        </div>-->
      </div>
      <div class="audit-qa-tool">
        <div class="audit-qa-tool-header">待审核问答工具详情</div>
        <div v-if="auditQaToolList.length > 0">
          <div>
            {{auditQaTool.toolName}}
          </div>
          <div>{{auditQaTool.toolDescription}}</div>
          <div class="audit-qa-tool-content"></div>
          <div class="audit-qa-tool-button">
            <el-button @click="handleReject" plain>否决</el-button>
            <el-button @click="handleAdopt" plain>采用</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {auditQaTool, fetchAuditQaTool, listAuditQaTool} from "@/api/qa/qa";

  export default {
    name: "qa-tool-audit",
    data() {
      return {
        pageSize: 10,
        total: 0,
        hasNext: false,
        currentPage: 1,
        auditQaToolList: [],
        /**
         * 当前正进行审核的问答工具信息
         */
        auditQaTool: {},
        qaToolSearch: '',
        loading: false
      }
    },
    components: {
    },
    methods: {
      handlePageChange(page) {
        this.currentPage = page;
        this.listAuditQaTool();
      },
      handleAdopt() {
        // 问答回复信息的状态  0 待审核  1 审核通过  2 审核未通过  3 被举报后下线
        auditQaTool({id: this.auditQaTool.id, dataStatus: 1}).then(res => {
            if (res != null) {
              console.log(res);
              this.listAuditQaTool();
            }
          }
        );
      },
      handleReject() {
        // 问答回复信息的状态  0 待审核  1 审核通过  2 审核未通过  3 被举报后下线
        auditQaTool({id: this.auditQaTool.id, dataStatus: 2}).then(
          res => {
            if (res != null) {
              console.log(res);
              this.listAuditQaTool();
            }
          }
        );
      },
      fetchAuditQaTool(qaInfoId) {
        fetchAuditQaTool(qaInfoId).then(res => {
          this.auditQaTool = res.data.data;
        });
      },
      handleAuditQaToolClick(auditQaTool) {
        // 查询问答工具信息
        this.fetchAuditQaTool(auditQaTool.id);
      },
      listAuditQaTool() {
        listAuditQaTool({
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            data: {keyword: this.qaToolSearch}
          }
        ).then(res => {
            if (res.data.data != null) {
              this.auditQaToolList = res.data.data.list;
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
              if (this.auditQaToolList.length > 0) {
                this.fetchAuditQaTool(this.auditQaToolList[0].id);
              }
            }
          }
        );
      },
      load() {
        // this.loading = true
        // setTimeout(() => {
        //   this.count += 2
        //   this.loading = false
        // }, 2000)
      }
    },
    computed: {
      noMore() {
        return this.count >= 20
      },
      disabled() {
        return this.loading || this.noMore
      }
    },
    created() {
      this.listAuditQaTool();
    }
  }
</script>

<style lang="scss" scoped>
  .audit-qa-tool-wrapper {

  }

  .audit-qa-tool-list-content {
    padding-top: 20px;
    display: flex;
  }

  .audit-qa-tool-list {
    width: 600px;
  }

  .audit-qa-tool-list-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .audit-qa-tool-input {
    //margin-top: 20px;

    .qa-tool-list-search {
      width: 400px;
    }
  }


  .audit-qa-tool-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .audit-qa-tool-button {
    padding-top: 10px;
  }

  .audit-qa-tool-title-list {
    padding: 20px 0 5px;
    height: 300px;

    .audit-qa-tool-title-wrapper {
      margin-bottom: 15px;
      cursor: pointer;
    }
  }

  .page-wrapper {
    //position: absolute;
    //bottom: 0;
    //width: 100%;
    //display: flex;
    //justify-content: center;
  }

  .audit-qa {
    height: 50px;
    padding-bottom: 10px;
    cursor: default;
  }

  .qa-content {
    cursor: pointer;
  }

  .audit-qa-tool {
    margin-left: 20px;
    max-width: 600px;
  }

  .audit-qa-tool-content {
    margin-top: 20px;
  }
</style>
