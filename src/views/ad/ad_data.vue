<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">数据列表</div>
        <div class="ad-data-picker">
          <el-date-picker
            v-model="date_list"
            @change="handleDatePick"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false">
          </el-date-picker>
        </div>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="ad_day"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="channel_id"
            label="渠道ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="customer_id"
            label="客户ID">
          </el-table-column>
          <el-table-column
            prop="app_id"
            label="应用ID">
          </el-table-column>
          <el-table-column
            prop="ad_type"
            label="数据类型">
          </el-table-column>
          <el-table-column
            prop="action_type"
            label="转化类型">
          </el-table-column>
          <el-table-column
            prop="ad_num"
            label="数量">
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page.sync="pageNum"
                         :page-size="pageSize"
                         @current-change="handlePageChange"
                         @prev-click="handlePageChange"
                         @next-click="handlePageChange"
                         layout="prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {pageListAdData} from "@/api/ad-data";

  export default {
    name: "ad_data",
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        hasNext: false,
        auditIssueList: [],
        /**
         * 当前正进行审核的工具信息
         */
        auditIssueInfo: {
          desc: ''
        },
        briefIntroduction: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        date_list: [new Date(), new Date()],
        tableData: []
      }
    },
    components: {
      // 'viewer': Viewer
    },
    methods: {
      handlePageChange() {
        this.listAdData()
      },
      handleDatePick() {
        this.pageNum = 1
        this.listAdData()
      },
      handleAuditToolClick(auditTool) {
        // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
        this.auditIssueInfo = auditTool;
        this.fetchAuditTool(auditTool.id);
      },
      listAdData() {
        let start_date = this.shanghaiTime(this.date_list[0])
        let end_date = this.shanghaiTime(this.date_list[1])
        pageListAdData({
            page_num: this.pageNum,
            page_size: this.pageSize,
            query_param: {start_date_time: start_date, end_date_time: end_date}
          }
        ).then(res => {
            if (res.data.data != null) {
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
              // if (this.auditIssueList.length > 0) {
              //   this.fetchAuditIssue(this.auditIssueList[0].id);
              // }
            }
          }
        );
      },
      shanghaiTime(date) {
        // 上海时间 = UTC时间 + 8小时
        date.setHours(date.getHours() + 8)

        // 格式化为本地时间字符串
        return date
      }
    },
    computed: {
      canSubmit() {
        return this.briefIntroduction === '';
      }
    },
    created() {
      this.listAdData();
    }
  }
</script>

<style lang="scss" scoped>

  .ad-data-wrapper {
  }

  .ad-data-list-content {
    //padding-top: 20px;
    display: flex;
  }

  .ad-data-list {
    //min-width: 584px;
    width: 100%;
  }

  .ad-data-list-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .issue-brief-introduction {
    width: 60%;
  }

  .ad-data-info-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .ad-data-info-button {
    padding-top: 10px;
  }

  .page-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .ad-data-picker {
    float: right;
    //width: 200px; /* 建议指定宽度 */
  }


  .ad-data {
    height: 50px;
    padding-bottom: 10px;
    cursor: default;
  }

  .tool-content {
    cursor: pointer;
  }
</style>
