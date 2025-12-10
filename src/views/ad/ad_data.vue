<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">数据列表</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="数据类型">
            <el-select v-model="ad_type_value" @change="handleAdDataPickChange" clearable placeholder="选择数据类型">
              <el-option
                v-for="item in ad_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="请求状态">
            <el-select v-model="ad_status_value"
                       filterable
                       @change="handleAdDataPickChange"
                       multiple
                       collapse-tags
                       placeholder="请选择">
              <el-option-group
                v-for="group in ad_status_options"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="渠道ID">
            <el-select
              v-model="channel_id_value"
              filterable
              @change="handleAdDataPickChange"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in channel_id_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="客户ID">
            <el-select
              v-model="customer_id_value"
              filterable
              @change="handleAdDataPickChange"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in customer_id_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="应用ID">
            <el-select
              v-model="app_id_value"
              filterable
              @change="handleAdDataPickChange"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in app_id_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="日期">
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
          </el-form-item>
          <el-form-item>
            <el-button @click="handleTableColumnVisible" plain>
              <span v-if="hideTableColum">
                显示所有列
              </span>
              <span v-else>
                收起部分列
              </span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleDataExport" plain>数据导出</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          ref="adDataTable"
          row-key="key_id"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column
            prop="ad_day"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ad_type"
            label="数据类型">
          </el-table-column>
          <el-table-column
            prop="ad_status"
            label="请求状态">
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
            prop="app_name"
            label="应用名称">
          </el-table-column>
          <el-table-column
            prop="source_action_type"
            label="原始类型">
          </el-table-column>
          <el-table-column
            prop="action_type"
            label="转化类型">
          </el-table-column>
          <el-table-column
            prop="ad_num"
            label="数量">
          </el-table-column>
          <el-table-column
            v-if="!hideTableColum"
            prop="conversion_rate"
            label="回调有效率">
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
  import {pageListAdData, fetchAdDataPickInfo, exportAdData} from "@/api/ad-data";

  export default {
    name: "ad_data",
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        hasNext: false,
        briefIntroduction: '',
        hideTableColum: true,
        // 日期选择信息
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
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
        // 广告数据筛选信息列表
        ad_data_pick_list: [],
        // 广告数据类型选择信息
        ad_type_options: [{
          value: '0',
          label: '点击'
        }, {
          value: '1',
          label: '回调'
        }],
        // 广告数据类型
        ad_type_value: '',
        ad_status_options: [{
          label: '点击',
          options: [{
            value: 1,
            label: '失败'
          }, {
            value: 2,
            label: '成功'
          }]
        }, {
          label: '回调',
          options: [{
            value: 3,
            label: '有效'
          }, {
            value: 4,
            label: '类型未匹配'
          }, {
            value: 5,
            label: '扣量'
          }]
        }],
        // 广告状态值
        ad_status_value: [],
        // 广告数据列表
        tableData: [],
        channel_id_options: [],
        channel_id_value: [],
        customer_id_options: [],
        customer_id_value: [],
        app_id_options: [],
        app_id_value: [],
      }
    },
    components: {
      // 'viewer': Viewer
    },
    methods: {
      tableRowClassName({row}) {
        // 给部分行添加颜色区别
        let row_class_name = ''
        if (row.data_new === true) {
          return 'warning-row'
        }
        return row_class_name;
      },
      handleTableColumnVisible() {
        // 切换隐藏列
        this.hideTableColum = !this.hideTableColum;
      },
      handlePageChange() {
        this.listAdData()
      },
      handleDatePick() {
        this.pageNum = 1;
        this.channel_id_options = [];
        this.customer_id_options = [];
        this.app_id_options = [];
        this.channel_id_value = [];
        this.customer_id_value = [];
        this.app_id_value = [];
        this.listAdDataPickInfo();
        this.listAdData();
      },
      listAdDataPickInfo() {
        // 查询广告数据筛选信息
        let query_start_date = new Date(this.date_list[0])
        let query_end_date = new Date(this.date_list[1])
        let start_date = this.shanghaiTime(query_start_date)
        let end_date = this.shanghaiTime(query_end_date)
        fetchAdDataPickInfo({
            start_date_time: start_date, end_date_time: end_date
          }
        ).then(res => {
            if (res.data.data != null) {
              this.ad_data_pick_list = res.data.data.list;
              this.initAdDataPickInfo();
            }
          }
        );
      },
      initAdDataPickInfo() {
        // 初始处理广告数据筛选信息
        // if (refresh_data)
        let channel_id_set = new Set();
        let customer_id_set = new Set();
        let app_id_set = new Set();
        for (let ad_data_pick of this.ad_data_pick_list) {
          const {channel_id, customer_id, app_id} = ad_data_pick;
          // if (this.ad_type_value !== '' && ad_type !== this.ad_type_value) {
          //   continue;
          // }
          channel_id_set.add(channel_id)
          customer_id_set.add(customer_id)
          app_id_set.add(app_id)
        }
        for (const channel_id of channel_id_set) {
          let label = channel_id;
          if (channel_id === '') {
            label = '空值';
          }
          this.channel_id_options.push({value: channel_id, label: label});
        }
        for (const customer_id of customer_id_set) {
          let label = customer_id;
          if (customer_id === '') {
            label = '空值';
          }
          this.customer_id_options.push({value: customer_id, label: label});
        }
        for (const app_id of app_id_set) {
          let label = app_id;
          if (app_id === '') {
            label = '空值';
          }
          this.app_id_options.push({value: app_id, label: label});
        }
      },
      handleAdDataPickChange() {
        // 处理广告数据筛选
        // if (refresh_data)

        // 触发查询
        this.pageNum = 1;
        this.listAdData();
      },
      listAdData() {
        console.log(this.date_list[0])
        let query_start_date = new Date(this.date_list[0])
        let query_end_date = new Date(this.date_list[1])
        let start_date = this.shanghaiTime(query_start_date)
        let end_date = this.shanghaiTime(query_end_date)
        let ad_data_query_param = {
          start_date_time: start_date,
          end_date_time: end_date,
          channel_id_list: this.channel_id_value,
          customer_id_list: this.customer_id_value,
          app_id_list: this.app_id_value,
          ad_status_list: this.ad_status_value
        }
        if (this.ad_type_value !== '') {
          ad_data_query_param.ad_type = this.ad_type_value
        }
        pageListAdData({
            page_num: this.pageNum,
            page_size: this.pageSize,
            query_param: ad_data_query_param
          }
        ).then(res => {
            if (res.data.data != null) {
              this.tableData = res.data.data.list;
              let is_new = true;
              let row_key = "";
              for (let rowData of this.tableData) {
                let current_row_key = rowData.ad_type + "_" + rowData.channel_id + "_" + rowData.customer_id + "_" + rowData.app_id + "_" + rowData.action_type;
                if (row_key === current_row_key) {
                  rowData.data_new = is_new;
                } else {
                  is_new = !is_new
                  rowData.data_new = is_new;
                }
                rowData.key_id = rowData.ad_day + "_" + rowData.ad_type + "_" + rowData.ad_status + "_" + rowData.channel_id + "_" + rowData.customer_id + "_" + rowData.app_id + "_" + rowData.source_action_type + "_" + rowData.action_type;

                row_key = current_row_key;
                // console.log(rowData.data_new)
              }
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
              // // 数据切换后立即刷新表格
              // this.$nextTick(() => {
              //   this.$refs.adDataTable.doLayout && this.$refs.adDataTable.doLayout()
              // });
              // this.$nextTick(() => {
              //   this.$forceUpdate()
              // })
            }
          }
        );
      },
      handleDataExport() {
        // 处理数据导出
        // this.$notify({
        //   title: '提示',
        //   message: '功能开发中',
        //   duration: 4500
        // });
        let query_start_date = new Date(this.date_list[0])
        let query_end_date = new Date(this.date_list[1])
        let start_date = this.shanghaiTime(query_start_date)
        let end_date = this.shanghaiTime(query_end_date)
        let ad_data_query_param = {
          start_date_time: start_date,
          end_date_time: end_date,
          channel_id_list: this.channel_id_value,
          customer_id_list: this.customer_id_value,
          app_id_list: this.app_id_value
        }
        if (this.ad_type_value !== '') {
          ad_data_query_param.ad_type = this.ad_type_value
        }
        exportAdData(ad_data_query_param)
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
      this.listAdDataPickInfo();
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
    //position: absolute;
    //bottom: 0;
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .pick-form-inline {
    padding: 0 10px;
  }

  .pick-form-item {
    padding-right: 30px;
  }

  //.ad-data-picker {
  //  float: right;
  //  //width: 200px; /* 建议指定宽度 */
  //}
  //
  //.ad-data-pick {
  //  margin-right: 30px;
  //}


  .ad-data {
    height: 50px;
    padding-bottom: 10px;
    cursor: default;
  }

  .tool-content {
    cursor: pointer;
  }

  ::v-deep .el-table .warning-row td {
    background-color: oldlace !important;
  }
</style>
