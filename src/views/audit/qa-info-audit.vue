<template>
  <div class="audit-qa-info-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="audit-qa-info-list-content">
      <div class="audit-qa-info-list">
        <div class="audit-qa-info-list-header">待审核列表</div>
        <div class="audit-qa-info-select">
          <span>问答类型：</span>
          <el-radio-group v-model="typeRadio" @input="listAuditQaInfo">
            <el-radio :label="1">提问</el-radio>
            <el-radio :label="2">工具</el-radio>
<!--            <el-radio :label="3">阅读</el-radio>-->
          </el-radio-group>
          <div class="audit-qa-info-input">
            <el-input
              class="qa-info-list-search inline-input"
              v-model="qaSearch"
              placeholder="请输入内容"
              :clearable="true"
              @change="listAuditQaInfo">
              <i class="el-icon-search el-input__icon" slot="suffix"></i>
            </el-input>
          </div>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul class="audit-qa-info-title-list" v-infinite-scroll="load">
            <li class="audit-qa-info-title-wrapper" v-for="auditQaInfo in auditQaInfoList" :key="auditQaInfo.id"
                @click="handleAuditQaInfoClick(auditQaInfo)">
              <div class="qa-info-title">{{auditQaInfo.title}}</div>
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
      <div class="audit-qa-info">
        <div class="audit-qa-info-header">待审核问答信息详情</div>
        <div v-if="auditQaInfoList.length > 0">
          <div>
            {{auditQaInfo.title}}
          </div>
          <div>{{auditQaInfo.description}}</div>
          <div class="audit-qa-info-button">
            <el-button @click="handleReject" plain>否决</el-button>
            <el-button @click="handleAdopt" plain>采用</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {auditQa, fetchAuditQaInfo, listAuditQaInfo} from "@/api/qa/qa";

export default {
  name: "qa-info-audit",
  data() {
    return {
      typeRadio: 0,
      pageSize: 10,
      total: 0,
      hasNext: false,
      currentPage: 1,
      auditQaInfoList: [],
      /**
       * 当前正进行审核的问答信息
       */
      auditQaInfo: {},
      qaSearch: '',
      loading: false
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
      this.listAuditQaInfo();
    },
    handleAdopt() {
      auditQa({id: this.auditQaInfo.id, dataStatus: 1}).then(res => {
          if (res != null) {
            console.log(res);
            this.listAuditQaInfo();
          }
        }
      );
    },
    handleReject() {
      auditQa({id: this.auditQaInfo.id, dataStatus: 2}).then(
        res => {
          if (res != null) {
            console.log(res);
            this.listAuditQaInfo();
          }
        }
      );
    },
    fetchAuditQaInfo(auditToolId) {
      fetchAuditQaInfo(auditToolId).then(res => {
        this.auditQaInfo = res.data.data;
      });
    },
    handleAuditQaInfoClick(auditQaInfo) {
      // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
      this.auditQaInfo = auditQaInfo;
      this.fetchAuditQaInfo(auditQaInfo.id);
    },
    listAuditQaInfo() {
      listAuditQaInfo({
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          data: {type: this.typeRadio, keyword: this.qaSearch}
        }
      ).then(res => {
          if (res.data.data != null) {
            this.auditQaInfoList = res.data.data.list;
            this.total = res.data.data.total;
            this.hasNext = res.data.data.hasNext;
            if (this.auditQaInfoList.length > 0) {
              this.fetchAuditQaInfo(this.auditQaInfoList[0].id);
            }
          }
        }
      );
    },
    load () {
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
    this.listAuditQaInfo();
  }
}
</script>

<style lang="scss" scoped>

.audit-qa-info-wrapper {
}

.audit-qa-info-list-content {
  padding-top: 20px;
  display: flex;
}

.audit-qa-info-list {
  width: 600px;
}

.audit-qa-info-list-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 40px;
  color: #212121;
  word-break: break-word;
  padding-bottom: 20px;
}

.audit-qa-info-input {
  margin-top: 20px;

  .qa-info-list-search {
    width: 400px;
  }
}


.audit-qa-info-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 40px;
  color: #212121;
  word-break: break-word;
  padding-bottom: 20px;
}

.audit-qa-info-button {
  padding-top: 10px;
}

.audit-qa-info-title-list {
  padding: 20px 0 5px;
  height: 300px;

  .audit-qa-info-title-wrapper {
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

.audit-qa-info {
  margin-left: 20px;
}
</style>
