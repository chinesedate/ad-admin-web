<template>
  <div class="audit-qa-answer-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="audit-qa-answer-list-content">
      <div class="audit-qa-answer-list">
        <div class="audit-qa-answer-list-header">待审核列表</div>
        <div class="audit-qa-answer-select">
          <div class="audit-qa-answer-input">
            <el-input
              class="qa-answer-list-search inline-input"
              v-model="qaSearch"
              placeholder="请输入内容"
              :clearable="true"
              @change="listAuditQaAnswer">
              <i class="el-icon-search el-input__icon" slot="suffix"></i>
            </el-input>
          </div>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul class="audit-qa-answer-title-list" v-infinite-scroll="load">
            <li class="audit-qa-answer-title-wrapper" v-for="auditQaAnswer in auditQaAnswerList" :key="auditQaAnswer.id"
                @click="handleAuditQaAnswerClick(auditQaAnswer)">
              <div v-if="auditQaAnswer.description" class="qa-answer-title">{{auditQaAnswer.description}}</div>
              <div v-else class="qa-answer-title"><span>当前回复未添加标题</span></div>
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
      <div class="audit-qa-answer">
        <div class="audit-qa-answer-header">待审核问答回复详情</div>
        <div v-if="auditQaAnswerList.length > 0">
          <div>
            {{auditQaInfo.title}}
          </div>
          <div>{{auditQaInfo.description}}</div>
          <div class="audit-qa-answer-content"></div>
          <qa-answer :qa-answer="auditQaAnswer"></qa-answer>
          <div class="audit-qa-answer-button">
            <el-button @click="handleReject" plain>否决</el-button>
            <el-button @click="handleAdopt" plain>采用</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {auditQaAnswer, fetchAuditQaAnswer, fetchAuditQaInfo, listAuditQaAnswer} from "@/api/qa/qa";
import QaAnswer from '@/views/qa/qa-answer';

export default {
  name: "qa-answer-audit",
  data() {
    return {
      typeRadio: 0,
      pageSize: 10,
      total: 0,
      hasNext: false,
      currentPage: 1,
      auditQaAnswerList: [],
      /**
       * 当前正进行审核的问答信息
       */
      auditQaInfo: {},
      /**
       * 当前正进行审核的问答回复信息
       */
      auditQaAnswer: {},
      qaSearch: '',
      loading: false
    }
  },
  components: {
    'qa-answer': QaAnswer
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
      this.listAuditQaAnswer();
    },
    handleAdopt() {
      // 问答回复信息的状态  0 待审核  1 审核通过  2 审核未通过  3 被举报后下线
      auditQaAnswer({id: this.auditQaAnswer.id, dataStatus: 1}).then(res => {
          if (res != null) {
            console.log(res);
            this.listAuditQaAnswer();
          }
        }
      );
    },
    handleReject() {
      // 问答回复信息的状态  0 待审核  1 审核通过  2 审核未通过  3 被举报后下线
      auditQaAnswer({id: this.auditQaAnswer.id, dataStatus: 2}).then(
        res => {
          if (res != null) {
            console.log(res);
            this.listAuditQaAnswer();
          }
        }
      );
    },
    fetchAuditQaInfo(qaInfoId) {
      fetchAuditQaInfo(qaInfoId).then(res => {
        this.auditQaInfo = res.data.data;
      });
    },
    fetchAuditQaAnswer(auditToolId) {
      fetchAuditQaAnswer(auditToolId).then(res => {
        this.auditQaAnswer = res.data.data;
      });
    },
    handleAuditQaAnswerClick(auditQaAnswer) {
      // 查询问答回复信息对应的问答信息
      this.fetchAuditQaInfo(auditQaAnswer.qaInfoId);
      // 查询问答回复信息详情
      this.fetchAuditQaAnswer(auditQaAnswer.id);
      // // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
      // this.auditQaInfo = auditQaInfo;
      // this.fetchAuditQaAnswer(auditQaInfo.id);
    },
    listAuditQaAnswer() {
      listAuditQaAnswer({
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          data: {keyword: this.qaSearch}
        }
      ).then(res => {
          if (res.data.data != null) {
            this.auditQaAnswerList = res.data.data.list;
            this.total = res.data.data.total;
            this.hasNext = res.data.data.hasNext;
            if (this.auditQaAnswerList.length > 0) {
              this.fetchAuditQaInfo(this.auditQaAnswerList[0].qaInfoId);
              this.fetchAuditQaAnswer(this.auditQaAnswerList[0].id);
            }
          }
        }
      );
    },
    load() {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
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
    this.listAuditQaAnswer();
  }
}
</script>

<style lang="scss" scoped>
  .audit-qa-answer-wrapper {

  }

  .audit-qa-answer-list-content {
    padding-top: 20px;
    display: flex;
  }

  .audit-qa-answer-list {
    width: 600px;
  }

  .audit-qa-answer-list-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .audit-qa-answer-input {
    //margin-top: 20px;

    .qa-answer-list-search {
      width: 400px;
    }
  }


  .audit-qa-answer-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .audit-qa-answer-button {
    padding-top: 10px;
  }

  .audit-qa-answer-title-list {
    padding: 20px 0 5px;
    height: 300px;

    .audit-qa-answer-title-wrapper {
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

  .audit-qa-answer {
    margin-left: 20px;
    max-width: 600px;
  }

  .audit-qa-answer-content {
    margin-top: 20px;
  }
</style>
