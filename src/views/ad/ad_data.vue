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
          <el-form-item class="pick-form-item" label="转化查询">
            <el-select
              v-model="self_action_value"
              filterable
              multiple
              collapse-tags
              @change="handleAdDataPickChange"
              placeholder="请选择">
              <el-option
                v-for="item in self_action_options"
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
          <el-form-item class="pick-form-item" label="时间">
            <el-select
              v-model="time_type"
              filterable
              @change="handleAdDataPickChange"
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in time_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="showColumnSelector = !showColumnSelector" plain>
              <span v-if="showColumnSelector">
                收起列选择
              </span>
              <span v-else>
                展开列选择
              </span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleDataExport" plain>数据导出</el-button>
          </el-form-item>
        </el-form>
        <div class="column-selector-wrapper">
          <div v-show="showColumnSelector" class="column-selector-panel">
            <div class="column-selector-presets">
              <el-button size="mini" plain @click="handleCheckAllChange">
                全选
              </el-button>
              <el-button size="mini" plain @click="handleMonitorPreset">上报</el-button>
              <el-button size="mini" plain @click="handleCallbackPreset">回调</el-button>
            </div>
            <el-divider style="margin: 8px 0;"></el-divider>
            <el-checkbox-group
              v-model="visibleColumnProps"
              @change="handleCheckedColumnsChange">
              <el-checkbox
                v-for="col in columnList"
                :key="col.prop"
                :label="col.prop"
                style="display: inline-flex; margin-right: 16px; padding: 4px 0;">
                {{col.label}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <el-table
          :data="tableData"
          ref="adDataTable"
          row-key="key_id"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column
            v-for="col in visibleColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :min-width="col.minWidth || 100">
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page.sync="pageNum"
                         :page-size="pageSize"
                         @current-change="handlePageChange"
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

  const STORAGE_KEY = 'ad_data_table_columns_v3';
  const CALLBACK_PRESET = [
    'ad_day', 'ad_hour', 'link_name', 'budget_party', 'product_name', 'delivery_platform',
    'channel_id', 'customer_id', 'app_id',
    'click_success', 'click_fail',
    'activate_success', 'activate_deduct', 'activate_fail',
    'register_success', 'register_deduct', 'register_fail',
    'pay_success', 'pay_deduct', 'pay_fail'
  ];
  const MONITOR_PRESET = [
    'ad_day', 'ad_hour', 'link_name', 'budget_party', 'product_name', 'delivery_platform',
    'channel_id', 'customer_id', 'app_id', 'click_success', 'click_fail'
  ];
  const ALL_COLUMNS = [
    {prop: 'ad_day', label: '日期', minWidth: 110},
    {prop: 'ad_hour', label: '时间', minWidth: 80},
    {prop: 'link_name', label: '链接名称', minWidth: 120},
    {prop: 'budget_party', label: '预算方', minWidth: 100},
    {prop: 'product_name', label: '产品名称', minWidth: 120},
    {prop: 'delivery_platform', label: '投放平台', minWidth: 100},
    {prop: 'channel_id', label: '渠道ID', minWidth: 120},
    {prop: 'customer_id', label: '客户ID', minWidth: 100},
    {prop: 'app_id', label: '应用ID', minWidth: 100},
    {prop: 'click_success', label: '点击成功', minWidth: 90},
    {prop: 'click_fail', label: '点击失败', minWidth: 90},
    {prop: 'activate_success', label: '激活成功', minWidth: 90},
    {prop: 'activate_deduct', label: '激活扣量', minWidth: 90},
    {prop: 'activate_fail', label: '激活失败', minWidth: 90},
    {prop: 'register_success', label: '注册成功', minWidth: 90},
    {prop: 'register_deduct', label: '注册扣量', minWidth: 90},
    {prop: 'register_fail', label: '注册失败', minWidth: 90},
    {prop: 'pay_success', label: '付费成功', minWidth: 90},
    {prop: 'pay_deduct', label: '付费扣量', minWidth: 90},
    {prop: 'pay_fail', label: '付费失败', minWidth: 90},
    {prop: 'order_success', label: '下单成功', minWidth: 90},
    {prop: 'order_deduct', label: '下单扣量', minWidth: 90},
    {prop: 'order_fail', label: '下单失败', minWidth: 90},
    {prop: 'retain_success', label: '次留成功', minWidth: 90},
    {prop: 'retain_deduct', label: '次留扣量', minWidth: 90},
    {prop: 'retain_fail', label: '次留失败', minWidth: 90},
    {prop: 'key_action_success', label: '关键行为成功', minWidth: 110},
    {prop: 'key_action_deduct', label: '关键行为扣量', minWidth: 110},
    {prop: 'key_action_fail', label: '关键行为失败', minWidth: 110},
    {prop: 'recall_success', label: '拉活成功', minWidth: 90},
    {prop: 'recall_deduct', label: '拉活扣量', minWidth: 90},
    {prop: 'recall_fail', label: '拉活失败', minWidth: 90},
    {prop: 'unknown_success', label: '未知成功', minWidth: 90},
    {prop: 'unknown_deduct', label: '未知扣量', minWidth: 90},
    {prop: 'unknown_fail', label: '未知失败', minWidth: 90},
    {prop: 'conversion_rate', label: '回调率', minWidth: 100},
  ];

  export default {
    name: "ad_data",
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        hasNext: false,
        briefIntroduction: '',
        visibleColumnProps: [],
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
          label: '上报'
        }, {
          value: '1',
          label: '回调'
        }],
        // 广告数据类型
        ad_type_value: '',
        ad_status_options: [{
          label: '上报',
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
        self_action_value: [],
        self_action_options: [
          {value: 1, label: '激活'},
          {value: 2, label: '注册'},
          {value: 3, label: '付费'},
          {value: 4, label: '下单'},
          {value: 5, label: '次留'},
          {value: 8, label: '关键行为'},
          {value: 9, label: '拉活'},
          {value: 0, label: '未知'}
        ],
        time_type: -2,
        time_options: [{value: -2, label: '全天'}, {value: -1, label: '分小时'}],
        showColumnSelector: false,
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
      loadColumnVisibility() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const validProps = new Set(ALL_COLUMNS.map(col => col.prop));
              const filtered = parsed.filter(prop => validProps.has(prop));
              if (filtered.length > 0) {
                this.visibleColumnProps = filtered;
                return;
              }
            }
          } catch (e) {/* ignore */
          }
        }
        this.visibleColumnProps = [...CALLBACK_PRESET];
      },
      saveColumnVisibility() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.visibleColumnProps));
      },
      handleCheckAllChange() {
        const allProps = ALL_COLUMNS.map(col => col.prop);
        const isAllSelected = this.visibleColumnProps.length === allProps.length;
        this.visibleColumnProps = isAllSelected ? [ALL_COLUMNS[0].prop] : [...allProps];
        this.isIndeterminate = false;
        this.saveColumnVisibility();
        this.$nextTick(() => {
          this.$refs.adDataTable && this.$refs.adDataTable.doLayout();
        });
      },
      handleCallbackPreset() {
        this.visibleColumnProps = [...CALLBACK_PRESET];
        this.checkAll = false;
        this.isIndeterminate = true;
        this.saveColumnVisibility();
        this.$nextTick(() => {
          this.$refs.adDataTable && this.$refs.adDataTable.doLayout();
        });
      },
      handleMonitorPreset() {
        this.visibleColumnProps = [...MONITOR_PRESET];
        this.saveColumnVisibility();
        this.$nextTick(() => {
          this.$refs.adDataTable && this.$refs.adDataTable.doLayout();
        });
      },
      handleCheckedColumnsChange(value) {
        if (value.length === 0) {
          this.$message.warning('至少保留一列');
          this.loadColumnVisibility();
          return;
        }
        const checkedCount = value.length;
        this.checkAll = checkedCount === ALL_COLUMNS.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < ALL_COLUMNS.length;
        this.saveColumnVisibility();
        this.$nextTick(() => {
          this.$refs.adDataTable && this.$refs.adDataTable.doLayout();
        });
      },
      handlePageChange() {
        console.log('1121')
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
        // 排序
        channel_id_set = new Set(Array.from(channel_id_set).sort());
        customer_id_set = new Set(Array.from(customer_id_set).sort());
        app_id_set = new Set(Array.from(app_id_set).sort());
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
          ad_status_list: this.ad_status_value,
          self_action_list: this.self_action_value,
          time_type: this.time_type
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
                let current_row_key = rowData.ad_day + "_" + rowData.ad_hour + "_" + rowData.channel_id + "_" + rowData.customer_id + "_" + rowData.app_id;
                if (row_key === current_row_key) {
                  rowData.data_new = is_new;
                } else {
                  is_new = !is_new
                  rowData.data_new = is_new;
                }
                rowData.key_id = current_row_key;
                row_key = current_row_key;
              }
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
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
          app_id_list: this.app_id_value,
          self_action_list: this.self_action_value,
          time_type: this.time_type
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
      },
      columnList() {
        return ALL_COLUMNS;
      },
      visibleColumns() {
        const selected = new Set(this.visibleColumnProps);
        return ALL_COLUMNS.filter(col => selected.has(col.prop));
      }
    },
    created() {
      this.loadColumnVisibility();
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

  .column-selector-wrapper {
    padding: 0 10px;
    margin-bottom: 10px;
  }

  .column-selector-presets {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .column-selector-panel {
    margin-top: 8px;
    padding: 12px 16px;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }
</style>
