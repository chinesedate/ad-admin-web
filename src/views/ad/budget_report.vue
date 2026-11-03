<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">
          <span>上报状态</span>
          <el-button type="primary" size="small" @click="toggleAlert">报警配置</el-button>
        </div>
        <div v-show="alertVisible" class="alert-panel">
          <el-form :inline="true" class="pick-form-inline">
            <el-form-item class="pick-form-item" label="预算">
              <el-select v-model="alertForm.budget_code" clearable filterable placeholder="全部预算" style="width: 180px">
                <el-option label="全部预算" value=""/>
                <el-option
                    v-for="item in budgetOptions"
                    :key="item.channel_code"
                    :label="item.channel_name + ' ' + item.channel_code"
                    :value="item.channel_code"/>
              </el-select>
            </el-form-item>
            <el-form-item class="pick-form-item" label="返回码">
              <el-select v-model="alertForm.code" clearable filterable placeholder="全部失败码" style="width: 180px">
                <el-option label="全部失败码" value=""/>
                <el-option v-for="item in code_options" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
            <el-form-item class="pick-form-item" label="小时次数 ≥">
              <el-input-number v-model="alertForm.min_num" :min="1" :step="1" controls-position="right" style="width: 120px"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="saveAlert">保存</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="alertList" border stripe class="adv-media-table">
            <el-table-column label="预算" min-width="160" show-overflow-tooltip>
              <template #default="scope">{{ budgetLabel(scope.row.budget_code) }}</template>
            </el-table-column>
            <el-table-column label="返回码" min-width="140" show-overflow-tooltip>
              <template #default="scope">{{ scope.row.code || '全部失败码' }}</template>
            </el-table-column>
            <el-table-column prop="min_num" label="小时次数 ≥" min-width="110" align="center"/>
            <el-table-column label="启用" width="90" align="center">
              <template #default="scope">
                <el-switch
                    :value="scope.row.is_enable"
                    :active-value="1"
                    :inactive-value="0"
                    @change="value => toggleAlertEnable(scope.row, value)"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template #default="scope">
                <el-button v-if="scope.row.budget_code || scope.row.code" type="text" @click="removeAlert(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="日期">
            <el-date-picker
                v-model="ad_day"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="handleDateChange"
                style="width: 160px"/>
          </el-form-item>
          <el-form-item class="pick-form-item" label="小时">
            <el-select v-model="ad_hour" multiple collapse-tags clearable filterable placeholder="请选择" style="width: 140px" @change="handleFilterChange">
              <el-option v-for="item in hour_options" :key="item" :label="item + '时'" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="渠道ID">
            <el-select v-model="channel_id" multiple collapse-tags clearable filterable placeholder="请选择" style="width: 180px" @change="handleFilterChange">
              <el-option v-for="item in channel_options" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="客户ID">
            <el-select v-model="customer_id" multiple collapse-tags clearable filterable placeholder="请选择" style="width: 170px" @change="handleFilterChange">
              <el-option v-for="item in customer_options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="应用ID">
            <el-select v-model="app_id" multiple collapse-tags clearable filterable placeholder="请选择" style="width: 200px" @change="handleFilterChange">
              <el-option v-for="item in app_options" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="类型">
            <el-select v-model="ad_type" multiple collapse-tags clearable placeholder="请选择" style="width: 150px" @change="handleFilterChange">
              <el-option label="点击" :value="0"/>
              <el-option label="曝光" :value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="返回码">
            <el-select v-model="code" multiple collapse-tags clearable filterable placeholder="请选择" style="width: 160px" @change="handleFilterChange">
              <el-option v-for="item in code_options" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="结果">
            <el-select v-model="ad_status" multiple collapse-tags clearable placeholder="请选择" style="width: 150px" @change="handleFilterChange">
              <el-option label="成功" :value="0"/>
              <el-option label="失败" :value="-1"/>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
            ref="reportTable"
            :data="tableData"
            row-key="id"
            stripe
            border
            show-summary
            :summary-method="summarizeTable"
            class="adv-media-table">
          <el-table-column prop="ad_day" label="日期" :min-width="colWidth.ad_day" align="center" show-overflow-tooltip/>
          <el-table-column prop="ad_hour" label="小时" :min-width="colWidth.ad_hour" align="center"/>
          <el-table-column prop="channel_id" label="渠道ID" :min-width="colWidth.channel_id" show-overflow-tooltip/>
          <el-table-column prop="customer_id" label="客户ID" :min-width="colWidth.customer_id" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.customer_id || '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="app_id" label="应用ID" :min-width="colWidth.app_id" show-overflow-tooltip/>
          <el-table-column label="类型" :min-width="colWidth.ad_type" align="center">
            <template #default="scope">
              {{ scope.row.ad_type === 2 ? '曝光' : '点击' }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="返回码" :min-width="colWidth.code" align="center" show-overflow-tooltip/>
          <el-table-column label="结果" :min-width="colWidth.ad_status" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.ad_status === 0" type="success" size="mini">成功</el-tag>
              <el-tag v-else type="danger" size="mini">失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ad_num" label="次数" :min-width="colWidth.ad_num" align="center"/>
          <el-table-column label="返回内容" :min-width="colWidth.msg" show-overflow-tooltip>
            <template #default="scope">
              <span class="msg-preview" @click="openMsg(scope.row.msg)">{{ scope.row.msg || '—' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination
              background
              :current-page.sync="pageNum"
              :page-size="pageSize"
              :page-sizes="[10, 20, 50]"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="返回内容" :visible.sync="msgVisible" width="640px">
      <pre class="msg-body">{{ msgText }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import {deleteBudgetReportAlert, fetchBudgetReportOptions, listBudgetReportAlert, pageListBudgetReport, saveBudgetReportAlert} from '@/api/ad-data'

function today() {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export default {
  name: 'budget_report',
  data() {
    return {
      ad_day: today(),
      ad_hour: [],
      channel_id: [],
      customer_id: [],
      app_id: [],
      ad_type: [],
      code: [],
      ad_status: [],
      hour_options: [],
      channel_options: [],
      customer_options: [],
      app_options: [],
      code_options: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
      adNumSum: 0,
      tableData: [],
      msgVisible: false,
      msgText: '',
      alertVisible: false,
      alertList: [],
      budgetOptions: [],
      alertForm: {
        budget_code: '',
        code: '',
        min_num: 1
      }
    }
  },
  computed: {
    colWidth() {
      const rows = this.tableData
      const col = (label, getter, extra, max) => {
        const width = this.textWidth(label, rows.map(getter), extra)
        return max ? Math.min(width, max) : width
      }
      const base = {
        ad_day: col('日期', row => row.ad_day),
        ad_hour: col('小时', row => row.ad_hour),
        channel_id: col('渠道ID', row => row.channel_id),
        customer_id: col('客户ID', row => row.customer_id || '—'),
        app_id: col('应用ID', row => row.app_id),
        ad_type: col('类型', row => row.ad_type === 2 ? '曝光' : '点击'),
        code: col('返回码', row => row.code),
        ad_status: col('结果', row => row.ad_status === 0 ? '成功' : '失败', 28),
        ad_num: Math.max(col('次数', row => row.ad_num), this.textWidth('次数', [this.adNumSum])),
        msg: col('返回内容', row => row.msg || '—', 16, 480)
      }
      return base
    }
  },
  watch: {
    colWidth() {
      this.$nextTick(() => {
        this.$refs.reportTable && this.$refs.reportTable.doLayout()
      })
    }
  },
  mounted() {
    this.loadOptions()
    this.loadList()
  },
  methods: {
    handleFilterChange() {
      this.pageNum = 1
      this.loadList()
    },
    handleDateChange() {
      this.ad_hour = []
      this.channel_id = []
      this.customer_id = []
      this.app_id = []
      this.code = []
      this.pageNum = 1
      this.loadOptions()
      this.loadList()
    },
    keepList(selected, options) {
      const allowed = options.map(item => (item && item.value !== undefined ? item.value : item))
      return (selected || []).filter(value => allowed.indexOf(value) >= 0)
    },
    loadOptions() {
      fetchBudgetReportOptions({ad_day: this.ad_day || undefined}).then(res => {
        const data = res.data.data || {}
        this.hour_options = data.hours || []
        this.channel_options = data.channel_ids || []
        this.customer_options = (data.customer_ids || []).map(item => ({
          value: item || '__EMPTY__',
          label: item || '（空）'
        }))
        this.app_options = data.app_ids || []
        this.code_options = data.codes || []
        this.ad_hour = this.keepList(this.ad_hour, this.hour_options)
        this.channel_id = this.keepList(this.channel_id, this.channel_options)
        this.customer_id = this.keepList(this.customer_id, this.customer_options)
        this.app_id = this.keepList(this.app_id, this.app_options)
        this.code = this.keepList(this.code, this.code_options)
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.pageNum = 1
      this.loadList()
    },
    handlePageChange(page) {
      this.pageNum = page
      this.loadList()
    },
    textWidth(label, values, extra) {
      if (!this._measureCtx) {
        this._measureCtx = document.createElement('canvas').getContext('2d')
      }
      const ctx = this._measureCtx
      ctx.font = '600 14px "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", Arial, sans-serif'
      let max = ctx.measureText(label).width
      ctx.font = '14px "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", Arial, sans-serif'
      values.forEach(value => {
        max = Math.max(max, ctx.measureText(value == null ? '' : String(value)).width)
      })
      return Math.ceil(max) + 24 + (extra || 0)
    },
    summarizeTable({columns}) {
      return columns.map((col, index) => {
        if (index === 0) {
          return '汇总'
        }
        if (col.property === 'ad_num') {
          return this.adNumSum
        }
        return ''
      })
    },
    openMsg(msg) {
      const text = msg || ''
      try {
        this.msgText = JSON.stringify(JSON.parse(text), null, 2)
      } catch (e) {
        this.msgText = text
      }
      this.msgVisible = true
    },
    toggleAlert() {
      this.alertVisible = !this.alertVisible
      if (this.alertVisible) {
        this.loadAlerts()
      }
    },
    loadAlerts() {
      listBudgetReportAlert().then(res => {
        const data = res.data.data || {}
        this.alertList = data.list || []
        this.budgetOptions = data.budgets || []
      })
    },
    budgetLabel(code) {
      if (!code) {
        return '全部预算'
      }
      const item = this.budgetOptions.find(row => row.channel_code === code)
      return item ? item.channel_name + ' ' + code : code
    },
    saveAlert() {
      saveBudgetReportAlert({
        budget_code: (this.alertForm.budget_code || '').trim(),
        code: (this.alertForm.code || '').trim(),
        min_num: this.alertForm.min_num || 1,
        is_enable: 1
      }).then(() => {
        this.alertForm.code = ''
        this.loadAlerts()
      })
    },
    toggleAlertEnable(row, value) {
      saveBudgetReportAlert({
        budget_code: row.budget_code || '',
        code: row.code || '',
        min_num: row.min_num,
        is_enable: value
      }).then(() => {
        row.is_enable = value
      })
    },
    removeAlert(row) {
      this.$confirm('删除这条报警规则？', '提示', {type: 'warning'}).then(() => {
        deleteBudgetReportAlert({id: row.id}).then(() => {
          this.loadAlerts()
        })
      }).catch(() => {})
    },
    loadList() {
      pageListBudgetReport({
        page_num: this.pageNum,
        page_size: this.pageSize,
        query_param: {
          ad_day: this.ad_day || undefined,
          ad_hour: this.ad_hour.length ? this.ad_hour : undefined,
          channel_id: this.channel_id.length ? this.channel_id : undefined,
          customer_id: this.customer_id.length ? this.customer_id.map(item => item === '__EMPTY__' ? '' : item) : undefined,
          app_id: this.app_id.length ? this.app_id : undefined,
          ad_type: this.ad_type.length ? this.ad_type : undefined,
          code: this.code.length ? this.code : undefined,
          ad_status: this.ad_status.length ? this.ad_status : undefined
        }
      }).then(res => {
        const data = res.data.data
        if (data != null) {
          this.tableData = data.list || []
          this.total = data.total || 0
          this.adNumSum = data.ad_num_sum || 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-data-list-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 40px;
  color: #212121;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-panel {
  margin-bottom: 16px;
}

.page-wrapper {
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

.adv-media-table {
  width: 100%;

  ::v-deep .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep th {
    background: #fafafa;
    color: #606266;
    font-weight: 600;
  }
}

.msg-preview {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #409EFF;
  cursor: pointer;
  vertical-align: bottom;
}

.msg-body {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 480px;
  overflow: auto;
}
</style>
