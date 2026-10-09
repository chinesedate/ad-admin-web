<template>
  <div class="audit-tool-wrapper media-debug-page">
    <el-page-header @back="goBack" content="联调"/>
    <div v-loading="loading" class="media-debug-body">
      <div class="media-debug-card media-debug-head">
        <div>
          <div class="media-debug-title">{{ link.channel_name || '联调' }}</div>
          <div class="media-debug-meta">
            <span>渠道 {{ link.channel_id || '—' }}</span>
            <span>预算 {{ budgetText }}</span>
            <span>应用ID {{ link.app_id || '—' }}</span>
            <span>客户ID {{ link.customer_id || '—' }}</span>
          </div>
        </div>
        <div class="media-debug-status">
          <span><h3>投放状态切换</h3></span>
          <el-button size="mini" :type="link.is_debug === 1 ? 'warning' : 'default'" @click="switchDebug(1)">联调</el-button>
          <el-button size="mini" :type="link.is_debug === 0 ? 'success' : 'default'" @click="switchDebug(0)">正式</el-button>
        </div>
      </div>

      <el-alert
        v-if="link.is_debug !== 1"
        class="media-debug-alert"
        title="当前是正式投放"
        type="info"
        :closable="false"
        show-icon
        description="新的点击和回传走原来的日志。自动回传已停止。要再联调，把投放状态改回联调。"/>

      <section class="media-debug-card">
        <header class="media-debug-card-head">
          <div class="media-debug-section-title">点击日志</div>
          <div class="media-debug-tip">只记录联调点击。选中一行后，「回传当前点击」发给这一次。</div>
        </header>
        <el-table
          :data="clicks"
          border
          size="small"
          empty-text="还没有联调点击"
          :row-class-name="clickRowClass"
          @row-click="selectClick">
          <el-table-column width="48" align="center" label="">
            <template #default="scope">
              <el-radio v-model="selectedClickId" class="media-debug-radio" :label="scope.row.id"></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="时间" width="168"/>
          <el-table-column prop="request_id" label="request_id" width="280"/>
          <el-table-column label="点击日志" min-width="240">
            <template #default="scope">
              <div class="media-debug-url">{{ scope.row.request_url }}</div>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <section class="media-debug-card">
        <header class="media-debug-card-head">
          <div class="media-debug-section-title">回传行为</div>
        </header>
        <div class="media-debug-card-body">
          <el-checkbox-group v-model="picked" :disabled="link.is_debug !== 1" class="media-debug-events">
            <el-checkbox v-for="item in events" :key="item.value" :label="item.value" border>{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          <div class="media-debug-actions">
            <el-checkbox v-model="autoOn" :disabled="link.is_debug !== 1">收到点击后自动回传</el-checkbox>
            <el-button size="small" :disabled="!canSaveAuto" :loading="saving" @click="saveAuto">
              {{ dirty ? '保存自动回传' : '已保存' }}
            </el-button>
            <el-button type="primary" size="small" :disabled="!canSend" :loading="sending" @click="sendCurrent">
              回传当前点击
            </el-button>
          </div>
          <el-alert
            v-if="savedEvents.length"
            :title="'自动回传已保存：' + savedEventNames"
            type="success"
            :closable="false"
            show-icon
            description="之后每条联调点击都会自动发这些行为。改勾选后要点保存才会生效。"/>
          <el-alert
            v-if="!autoOn && !savedEvents.length"
            title="自动回传未保存"
            type="info"
            :closable="false"
            show-icon
            description="现在只有点「回传当前点击」才会发。"/>
          <div v-if="dirty && autoOn" class="media-debug-tip">当前勾选还没保存。</div>
        </div>
      </section>

      <section class="media-debug-card">
        <header class="media-debug-card-head">
          <div class="media-debug-section-title">联调记录</div>
          <div class="media-debug-tip">同一次点击的多条回传记在一起。这一轮都成功后，才能切换正式投放。</div>
        </header>
        <el-table :data="logs" border size="small" empty-text="还没有联调记录">
          <el-table-column prop="create_time" label="时间" width="170"/>
          <el-table-column prop="behavior" label="行为" width="120"/>
          <el-table-column label="结果" width="90">
            <template #default="scope">
              <el-tag size="mini" :type="logResultType(scope.row)">{{ logResult(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="返回" min-width="280">
            <template #default="scope">
              <div class="media-debug-summary">{{ scope.row.response_summary }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="link.is_debug === 1" class="media-debug-card-foot">
          <el-button
            type="primary"
            :disabled="!canPromote"
            @click="switchDebug(0)">
            {{ canPromote ? '回传已成功，切换正式投放' : '回传成功后才能切换正式' }}
          </el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import {getMediaDebugLog, submitMediaDebugAction, updateMediaLink} from '@/api/ad-data'

  export default {
    name: 'AdvMediaLinkDebug',
    props: {
      id: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        loading: false,
        saving: false,
        sending: false,
        link: {
          id: null,
          channel_code: '',
          channel_name: '',
          channel_id: '',
          customer_id: '',
          app_id: '',
          app_name: '',
          adv_channel_name: '',
          is_debug: 1,
          debug_events: '',
          conversion_rate: 80,
          rate_min_limit: false,
          rate_min_limit_num: 1,
          extra_info: ''
        },
        events: [],
        logs: [],
        canPromote: false,
        picked: [],
        autoOn: false,
        selectedClickId: null,
        refreshTimer: null,
        loadSeq: 0
      }
    },
    computed: {
      mediaLinkId() {
        return this.id || this.$route.params.id
      },
      budgetText() {
        const parts = [this.link.adv_channel_name, this.link.app_name].filter(Boolean)
        return parts.length ? parts.join(' · ') : '—'
      },
      clicks() {
        return this.logs.filter(row => row.behavior === '点击')
      },
      savedEvents() {
        return (this.link.debug_events || '').split(',').map(item => item.trim()).filter(Boolean)
      },
      savedEventNames() {
        return this.savedEvents.map(value => {
          const found = this.events.find(item => item.value === value)
          return found ? found.name : value
        }).join('、')
      },
      draftEvents() {
        if (!this.autoOn) {
          return []
        }
        return this.events.map(item => item.value).filter(value => this.picked.indexOf(value) >= 0)
      },
      dirty() {
        return this.draftEvents.join(',') !== this.savedEvents.join(',')
      },
      canSaveAuto() {
        return this.link.is_debug === 1 && this.dirty && !(this.autoOn && this.draftEvents.length === 0)
      },
      canSend() {
        return this.link.is_debug === 1 && this.picked.length > 0 && !!this.selectedClickId
      }
    },
    mounted() {
      this.loadPage()
      this.refreshTimer = setInterval(() => {
        this.loadPage(true)
      }, 3000)
    },
    beforeDestroy() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
    },
    methods: {
      goBack() {
        this.$router.push('/adv_media_link_list')
      },
      loadPage(silent) {
        const seq = ++this.loadSeq
        if (!silent) {
          this.loading = true
        }
        getMediaDebugLog(this.mediaLinkId).then(res => {
          if (seq !== this.loadSeq) {
            return
          }
          const data = res.data.data || {}
          this.link = Object.assign({}, this.link, data.link || {})
          this.events = data.events || []
          this.logs = data.logs || []
          this.canPromote = !!data.can_promote
          if (!silent) {
            this.picked = this.savedEvents.slice()
            this.autoOn = this.savedEvents.length > 0
          }
          const stillThere = this.clicks.some(row => row.id === this.selectedClickId)
          if (!stillThere) {
            this.selectedClickId = this.clicks.length ? this.clicks[0].id : null
          }
        }).finally(() => {
          if (!silent && seq === this.loadSeq) {
            this.loading = false
          }
        })
      },
      selectClick(row) {
        this.selectedClickId = row.id
      },
      clickRowClass({row}) {
        return row.id === this.selectedClickId ? 'is-current-click' : ''
      },
      logResultType(row) {
        if (row.behavior === '点击') {
          return 'info'
        }
        if (row.behavior === '状态变更') {
          return 'warning'
        }
        return row.status === 0 ? 'success' : 'danger'
      },
      logResult(row) {
        if (row.behavior === '点击') {
          return '已记录'
        }
        if (row.behavior === '状态变更') {
          return row.remark || '已确认'
        }
        if (row.status === 0) {
          return '成功'
        }
        return '失败'
      },
      linkPayload(extra) {
        return Object.assign({
          id: this.link.id,
          conversion_rate: this.link.conversion_rate,
          rate_min_limit: this.link.rate_min_limit,
          rate_min_limit_num: this.link.rate_min_limit_num,
          extra_info: this.link.extra_info || '',
          is_debug: this.link.is_debug,
          debug_events: this.link.debug_events || ''
        }, extra || {})
      },
      saveLink(extra, forceDebugOff) {
        const payload = this.linkPayload(extra)
        if (forceDebugOff) {
          payload.force_debug_off = true
        }
        this.saving = true
        return updateMediaLink(payload).then(() => {
          this.$message.success('保存成功')
          this.loadPage()
        }).catch(err => {
          if (err.code === 10020) {
            this.$confirm('尚未有成功的联调回传，仍要改成正式投放吗？', '切换正式投放', {
              confirmButtonText: '确认切换',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.saveLink(extra, true)
            }).catch(() => {})
            return
          }
          this.$message.error(err.message || '保存失败')
        }).finally(() => {
          this.saving = false
        })
      },
      saveAuto() {
        this.saveLink({
          debug_events: this.draftEvents.join(','),
          is_debug: this.link.is_debug
        })
      },
      switchDebug(nextDebug) {
        if (nextDebug === this.link.is_debug) {
          return
        }
        this.saveLink({is_debug: nextDebug, debug_events: this.link.debug_events || ''})
      },
      sendCurrent() {
        this.sending = true
        submitMediaDebugAction({
          media_link_id: this.link.id,
          click_row_id: this.selectedClickId,
          event_values: this.picked.slice()
        }).then(() => {
          this.$message.success('已提交回传')
          this.loadPage()
        }).catch(err => {
          this.$message.error(err.message || '回传失败')
        }).finally(() => {
          this.sending = false
        })
      }
    }
  }
</script>

<style scoped>
  .media-debug-page {
    padding: 16px 20px 32px;
    background: #f5f7fa;
    min-height: calc(100vh - 84px);
  }

  .media-debug-body {
    margin-top: 16px;
  }

  .media-debug-card {
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
  }

  .media-debug-card + .media-debug-card,
  .media-debug-alert {
    margin-top: 16px;
  }

  .media-debug-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
  }

  .media-debug-card-head {
    padding: 14px 16px 12px;
    border-bottom: 1px solid #ebeef5;
    background: #fafafa;
  }

  .media-debug-card-body,
  .media-debug-card-foot {
    padding: 16px;
  }

  .media-debug-card-foot {
    border-top: 1px solid #ebeef5;
    background: #fafafa;
  }

  .media-debug-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }

  .media-debug-sub,
  .media-debug-tip {
    margin-top: 4px;
    color: #909399;
    font-size: 13px;
    line-height: 1.5;
  }

  .media-debug-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    margin-top: 8px;
    color: #606266;
    font-size: 13px;
  }

  .media-debug-status {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #606266;
  }

  .media-debug-section-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .media-debug-events {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .media-debug-events ::v-deep .el-checkbox {
    margin-right: 0;
  }

  .media-debug-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin: 16px 0;
  }

  .media-debug-url {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .media-debug-summary {
    white-space: normal;
    word-break: break-all;
    line-height: 1.5;
    color: #606266;
  }

  .media-debug-radio {
    margin-right: 0;
  }

  .media-debug-radio ::v-deep .el-radio__label {
    display: none;
  }

  .media-debug-card ::v-deep .el-table {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
  }

  .media-debug-card ::v-deep .el-table::before,
  .media-debug-card ::v-deep .el-table--border::after {
    display: none;
  }

  .media-debug-card ::v-deep .is-current-click > td {
    background: #ecf5ff !important;
  }
</style>
