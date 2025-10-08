<template>
  <div>
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
          <li class="audit-tool" v-for="modifyData in modifyDataList" :key="modifyData.id"
              @click="handleAuditToolClick(modifyData)">
            <!--            <div class="tool-content">{{auditTool.name}}</div>-->
            <div class="tool-content"><p>{{modifyData.modifyContent}}</p></div>
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
        <div class="audit-tool-info-header">待审核编辑数据详情</div>
        <div v-if="modifyDataList.length > 0">
          <div>
            {{modifyData.modifyContent}}
          </div>
          <div v-if="modifyData.recordType === 2">
            <img v-if="modifyData.avatarUrl" :src="modifyData.avatarUrl" class="avatar">
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
  import {fetchModifyData, auditModifyData, listAuditModifyData} from "@/api/audit";

  export default {
    name: "modify-data-audit",
    data() {
      return {
        pageNum: 0,
        pageSize: 10,
        total: 0,
        hasNext: false,
        currentPage: 1,
        modifyDataList: [],
        /**
         * 当前正进行审核的工具信息
         */
        modifyData: {},
        /**
         * 审核拒绝时添加的记录信息
         */
        comment: ''
      }
    },
    methods: {
      handlePageChange() {

      },
      handleAdopt() {
        // 审核类型  1 审核通过  2 审核未通过
        auditModifyData({modifyDataRecordId: this.modifyData.id, auditType: 1}).then(res => {
            if (res != null) {
              console.log(res);
              this.pageListAuditModifyData();
            }
          }
        );
      },
      handleReject() {
        // 审核类型  1 审核通过  2 审核未通过
        auditModifyData({modifyDataRecordId: this.modifyData.id, auditType: 2, comment: this.comment}).then(
          res => {
            if (res != null) {
              console.log(res);
              this.pageListAuditModifyData();
            }
          }
        );
      },
      queryAuditModifyData(auditToolId) {
        fetchModifyData(auditToolId).then(res => {
          this.modifyData = res.data.data;
        });
      },
      handleAuditToolClick(auditTool) {
        // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
        this.modifyData = auditTool;
        this.queryAuditModifyData(auditTool.id);
      },
      pageListAuditModifyData() {
        listAuditModifyData({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            data: {}
          }
        ).then(res => {
            if (res.data.data != null) {
              this.modifyDataList = res.data.data.list;
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
              if (this.modifyDataList.length > 0) {
                this.queryAuditModifyData(this.modifyDataList[0].id);
              }
            }
          }
        );
      }
    },
    created() {
      this.pageListAuditModifyData();
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

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    padding: 10px 0;
  }
</style>