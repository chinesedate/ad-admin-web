<template>
  <div class="audit-tool-wrapper">
    <div class="page-title">荣耀补回传</div>
    <el-form :inline="true" size="small" class="filter-form">
      <el-form-item label="日期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始"
          end-placeholder="结束"
          :clearable="false"/>
      </el-form-item>
      <el-form-item label="渠道">
        <el-select v-model="channelId" clearable filterable placeholder="全部">
          <el-option v-for="item in channelOptions" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户">
        <el-select v-model="customerId" clearable filterable placeholder="全部">
          <el-option v-for="item in customerOptions" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="应用">
        <el-select v-model="appId" clearable filterable placeholder="全部">
          <el-option v-for="item in appOptions" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="pool-tip">只显示未补发点击。每个渠道加应用最多 30 条，每页 10 条，仅保留当天，过零点清理。</div>
    <el-table
      :data="tableData"
      border
      size="small"
      @selection-change="onSelect">
      <el-table-column type="selection" width="48"/>
      <el-table-column prop="click_time" label="点击时间" width="168"/>
      <el-table-column prop="channel_id" label="渠道" min-width="110"/>
      <el-table-column prop="customer_id" label="客户" min-width="110"/>
      <el-table-column prop="app_id" label="应用" min-width="140"/>
      <el-table-column prop="track_id" label="track_id" min-width="220" show-overflow-tooltip/>
      <el-table-column prop="oaid" label="oaid" min-width="220" show-overflow-tooltip/>
    </el-table>
    <div class="pager">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        :total="total"
        @current-change="loadList"/>
    </div>
    <div class="action-bar">
      <div class="event-label">行为</div>
      <el-checkbox-group v-model="pickedEvents" size="small">
        <el-checkbox v-for="item in events" :key="item.value" :label="item.value" border size="small">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <el-button type="primary" size="small" :loading="sending" :disabled="!canSend" @click="send">
        确认补发
      </el-button>
    </div>
    <pre v-if="resultJson" class="result-box">{{ resultJson }}</pre>
  </div>
</template>

<script>
import {pageHonorSupplement, sendHonorSupplement} from '@/api/honor-supplement'

function today() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return d.getFullYear() + '-' + m + '-' + day
}

export default {
  name: 'honor_supplement',
  data() {
    const day = today()
    return {
      dateRange: [day, day],
      channelId: '',
      customerId: '',
      appId: '',
      channelOptions: [],
      customerOptions: [],
      appOptions: [],
      tableData: [],
      selected: [],
      events: [],
      pickedEvents: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      sending: false,
      resultJson: ''
    }
  },
  computed: {
    canSend() {
      return this.selected.length > 0 && this.pickedEvents.length > 0 && !this.sending
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    search() {
      this.pageNum = 1
      this.loadList()
    },
    onSelect(rows) {
      this.selected = rows || []
    },
    loadList() {
      const start = (this.dateRange && this.dateRange[0]) || today()
      const end = (this.dateRange && this.dateRange[1]) || start
      pageHonorSupplement({
        page_num: this.pageNum,
        page_size: this.pageSize,
        start_date: start + 'T00:00:00',
        end_date: end + 'T23:59:59',
        channel_id: this.channelId,
        customer_id: this.customerId,
        app_id: this.appId
      }).then(res => {
        const data = (res.data && res.data.data) || {}
        this.tableData = data.list || []
        this.total = data.total || 0
        this.events = data.events || []
        const pick = data.pick || {}
        this.channelOptions = pick.channel_ids || []
        this.customerOptions = pick.customer_ids || []
        this.appOptions = pick.app_ids || []
      })
    },
    send() {
      this.sending = true
      this.resultJson = ''
      sendHonorSupplement({
        request_ids: this.selected.map(row => row.request_id),
        event_values: this.pickedEvents
      }).then(res => {
        const body = res.data || {}
        this.resultJson = JSON.stringify(body, null, 2)
        if (body.code !== 0) {
          this.$message.error(body.message || '补发失败')
          return
        }
        this.loadList()
      }).finally(() => {
        this.sending = false
      })
    }
  }
}
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}
.filter-form {
  margin-bottom: 8px;
}
.pool-tip {
  color: #909399;
  font-size: 13px;
  margin-bottom: 8px;
}
.pager {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}
.action-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.action-bar ::v-deep .el-checkbox.is-bordered {
  margin-right: 4px;
  margin-left: 0;
}
.action-bar ::v-deep .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
.event-label {
  font-size: 13px;
}
.result-box {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 360px;
  overflow: auto;
}
</style>
