<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">媒体链接</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="广告主">
            <el-select
              v-model="filter_adv_channel_code"
              filterable
              clearable
              placeholder="全部"
              @change="handleFilterChange">
              <el-option
                v-for="item in channel_adv_code_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="媒体">
            <el-select
              v-model="filter_media_channel_code"
              filterable
              clearable
              placeholder="全部"
              @change="handleFilterChange">
              <el-option
                v-for="item in channel_media_code_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="搜索">
            <el-input
              class="adv-link-search"
              clearable
              placeholder="应用 / 渠道ID / 客户ID"
              @input="handleFilterChange"
              prefix-icon="el-icon-search"
              v-model="search_keyword"/>
          </el-form-item>
          <el-form-item class="pick-form-item">
            <el-button type="primary" @click="openAddDialog">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          row-key="id"
          stripe
          class="adv-media-table"
          style="width: 100%">
          <el-table-column type="expand">
            <template #default="scope">
              <div class="param-value-panel" v-if="scope.row.param_values && scope.row.param_values.length">
                <div class="expand-section-title">回调参数</div>
                <div
                  v-for="item in scope.row.param_values"
                  :key="item.param_name"
                  class="param-value-item">
                  <span class="param-value-name">{{ item.param_name }}</span>
                  <span class="param-value-text">{{ item.param_value || '—' }}</span>
                </div>
              </div>
              <div v-else class="param-value-empty">暂无回调参数</div>
              <div class="expand-link-block">
                <div class="expand-link-row"><span class="expand-link-label">点击监测：</span>{{ scope.row.click_link || '—' }}</div>
                <div v-if="scope.row.show_link" class="expand-link-row">
                  <span class="expand-link-label">曝光监测：</span>{{ scope.row.show_link }}
                </div>
                <div v-if="scope.row.extra_info" class="expand-link-row">
                  <span class="expand-link-label">备注：</span>{{ scope.row.extra_info }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" min-width="70" align="center"/>
          <el-table-column prop="adv_channel_name" label="广告主" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="app_name" label="应用" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="channel_name" label="媒体" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="channel_id" label="渠道ID" min-width="110" show-overflow-tooltip/>
          <el-table-column prop="customer_id" label="客户ID" min-width="90" show-overflow-tooltip/>
          <el-table-column prop="app_id" label="应用ID" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="conversion_rate_label" label="回调配置" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="create_time" label="创建时间" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="update_time" label="修改时间" min-width="150" show-overflow-tooltip/>
          <el-table-column label="操作" min-width="280" align="center" class-name="adv-media-op-col">
            <template #default="scope">
              <el-button type="primary" size="mini" class="adv-link-operate-button" @click="openMonitorDialog(scope.row)">监测</el-button>
              <el-button type="primary" size="mini" class="adv-link-operate-button" @click="goAdvLinkDetail(scope.row)">广告主链接</el-button>
              <el-button type="primary" size="mini" class="adv-link-operate-button" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-popconfirm title="确定删除吗？" @confirm="handleRemove(scope.row)">
                <template #reference>
                  <el-button type="danger" size="mini" class="adv-link-operate-button">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination
            class="page-pagination"
            background
            :hide-on-single-page="true"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"/>
        </div>
      </div>
    </div>

    <el-dialog
      :title="isEdit ? '编辑媒体链接' : '添加媒体链接'"
      :visible.sync="dialogVisible"
      width="820px"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item v-if="!isEdit" label="预算链接：" prop="adv_link_id">
          <el-select
            v-model="form.adv_link_id"
            filterable
            placeholder="请选择广告主链接"
            @change="handleAdvLinkChange">
            <el-option
              v-for="item in adv_link_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="媒体渠道：" prop="channel_code">
          <el-select
            v-model="form.channel_code"
            filterable
            placeholder="请选择媒体"
            @change="handleMediaChannelChange">
            <el-option
              v-for="item in add_media_channel_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isEdit" label="媒体：">
          <span>{{ form.channel_name || form.channel_code || '—' }}</span>
        </el-form-item>
        <el-form-item v-if="linkParamHint.length" label="参数字典：">
          <div class="link-param-hint">
            <el-tag
              v-for="item in linkParamHint"
              :key="item.param_name"
              size="small"
              class="link-param-tag"
              :type="Number(item.param_required) === 0 ? 'danger' : 'info'">
              {{ item.param_name }}{{ Number(item.param_required) === 0 ? '（必填）' : '' }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item
          v-for="item in linkParamFields"
          :key="form.id + '-' + item.param_name"
          :label="item.param_name + '：'"
          :required="Number(item.param_required) === 0">
          <el-input
            v-model="item.param_value"
            maxlength="500"
            :placeholder="mediaParamInputPlaceholder(item.param_name)"/>
        </el-form-item>
        <el-form-item label="回调率：" prop="conversion_rate">
          <div class="conversion-rate-row">
            <el-input-number
              v-model="form.conversion_rate"
              :min="0"
              :max="100"
              :precision="0"
              style="width: 180px"/>
            <span class="conversion-rate-suffix">%</span>
            <el-tag
              v-for="item in media_conversion_rate_list"
              :key="item"
              size="small"
              type="primary"
              class="rate-quick-tag"
              @click="form.conversion_rate = item">
              {{ item }}%
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="保底回调" prop="rate_min_limit">
          <el-radio-group v-model="form.rate_min_limit">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.rate_min_limit === true"
          label="保底数量"
          prop="rate_min_limit_num">
          <el-input-number
            v-model="form.rate_min_limit_num"
            :min="1"
            :max="10"
            placeholder="请输入保底回调数量"/>
        </el-form-item>
        <el-form-item label="备注：" prop="extra_info">
          <el-input
            v-model="form.extra_info"
            type="textarea"
            :rows="2"
            maxlength="2000"
            show-word-limit
            placeholder="选填"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="监测链接"
      :visible.sync="monitorDialogVisible"
      width="720px"
      :close-on-click-modal="false"
      @close="closeMonitorDialog">
      <div v-if="monitorRow" class="monitor-dialog-body">
        <div class="monitor-dialog-header">
          <div class="monitor-dialog-title">
            {{ monitorDialogTitle }}
          </div>
          <el-button
            type="primary"
            size="small"
            :loading="copyAllLoading"
            @click="copyAllMonitorContent">
            复制
          </el-button>
        </div>
        <div
          v-for="item in monitorLinkItems"
          :key="item.key"
          class="monitor-link-block">
          <div class="monitor-link-label">{{ item.label }}：</div>
          <div class="monitor-link-text">{{ item.value || '—' }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="monitorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="monitorDialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addMediaLink,
    fetchAdChannelCodeList,
    fetchMediaLinkParam,
    pageListAdLink,
    pageListAdvMedia,
    pageListMediaLink,
    removeMediaLink,
    updateMediaLink
  } from '@/api/ad-data'

  const MEDIA_AUTO_PARAM_NAMES = ['channel_id', 'customer_id', 'app_id', 'rz_ch', 'CH']

  export default {
    name: 'adv_media_link_list',
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        search_keyword: '',
        filter_adv_channel_code: '',
        filter_media_channel_code: '',
        tableData: [],
        channel_adv_code_list: [],
        channel_media_code_list: [],
        adv_link_options: [],
        add_media_channel_list: [],
        selected_adv_channel_code: '',
        linkParamHint: [],
        linkParamFields: [],
        media_conversion_rate_list: [40, 50, 60, 70, 80],
        dialogVisible: false,
        monitorDialogVisible: false,
        monitorRow: null,
        copyAllLoading: false,
        isEdit: false,
        submitLoading: false,
        form: {
          id: null,
          adv_link_id: null,
          channel_code: '',
          channel_name: '',
          conversion_rate: 80,
          rate_min_limit: false,
          rate_min_limit_num: 1,
          extra_info: ''
        },
        rules: {
          adv_link_id: [{required: true, message: '请选择预算链接', trigger: 'change'}],
          channel_code: [{required: true, message: '请选择媒体渠道', trigger: 'change'}],
          conversion_rate: [{required: true, message: '请填写回调率', trigger: 'change'}]
        }
      }
    },
    mounted() {
      this.loadAdvertiserChannels()
      this.loadMediaChannels()
      this.loadAdvLinkOptions()
      this.listMediaLinks()
    },
    computed: {
      monitorDialogTitle() {
        if (!this.monitorRow) {
          return ''
        }
        const parts = [
          this.monitorRow.app_name,
          this.monitorRow.adv_channel_name,
          this.monitorRow.channel_name
        ].filter(Boolean)
        return parts.length ? parts.join(' · ') : `媒体链接 #${this.monitorRow.id}`
      },
      monitorLinkItems() {
        if (!this.monitorRow) {
          return []
        }
        const row = this.monitorRow
        const deliveryLink = (row.download_link || '').trim()
        const deliveryLabel = this.isDeeplink(deliveryLink) ? 'Deeplink 链接' : '投放链接'
        return [
          {key: 'show', label: '展示监测链接', value: (row.show_link || '').trim()},
          {key: 'click', label: '点击监测链接', value: (row.click_link || '').trim()},
          {key: 'delivery', label: deliveryLabel, value: deliveryLink}
        ]
      }
    },
    methods: {
      isDeeplink(url) {
        if (!url) {
          return false
        }
        const lower = url.toLowerCase()
        if (lower.startsWith('http://') || lower.startsWith('https://')) {
          return false
        }
        return url.includes('://')
      },
      mediaParamInputPlaceholder(paramName) {
        if (MEDIA_AUTO_PARAM_NAMES.includes(paramName)) {
          return '留空则根据生成的链接自动填充'
        }
        return '请输入回调参数值'
      },
      buildParamFields(paramList, existingValues) {
        const valueMap = {}
        for (const item of existingValues || []) {
          valueMap[item.param_name] = item.param_value || ''
        }
        return (paramList || []).map(item => ({
          param_name: item.param_name,
          param_required: Number(item.param_required),
          param_value: valueMap[item.param_name] || ''
        }))
      },
      loadLinkParamFields(channelCode, existingValues) {
        if (!channelCode) {
          this.linkParamHint = []
          this.linkParamFields = []
          return
        }
        fetchMediaLinkParam(channelCode).then(res => {
          const data = res.data.data
          const params = (data && data.params) ? data.params.filter(item => Number(item.is_active) === 0) : []
          this.linkParamHint = params
          this.linkParamFields = this.buildParamFields(params, existingValues)
        }).catch(() => {
          this.linkParamHint = []
          this.linkParamFields = []
        })
      },
      buildMediaLinkParamValues() {
        return (this.linkParamFields || [])
          .map(item => ({
            param_name: (item.param_name || '').trim(),
            param_value: (item.param_value || '').trim()
          }))
          .filter(item => item.param_name && item.param_value)
      },
      formatConversionRateLabel(row) {
        const conversionRate = row.conversion_rate
        const rateMinLimit = row.rate_min_limit
        const rateMinLimitNum = row.rate_min_limit_num
        if (rateMinLimit) {
          return `${conversionRate}% 保底 ${rateMinLimitNum}`
        }
        return `${conversionRate}%`
      },
      handleFilterChange() {
        this.pageNum = 1
        this.listMediaLinks()
      },
      handlePageChange(page) {
        this.pageNum = page
        this.listMediaLinks()
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.pageNum = 1
        this.listMediaLinks()
      },
      loadAdvertiserChannels() {
        pageListAdvMedia({
          page_num: 1,
          page_size: 500,
          query_param: {up_down_type: 1}
        }).then(res => {
          const list = (res.data.data && res.data.data.list) || []
          this.channel_adv_code_list = list.map(item => ({
            value: item.channel_code,
            label: item.channel_name
          }))
        })
      },
      loadMediaChannels() {
        pageListAdvMedia({
          page_num: 1,
          page_size: 500,
          query_param: {up_down_type: 0}
        }).then(res => {
          const list = (res.data.data && res.data.data.list) || []
          this.channel_media_code_list = list.map(item => ({
            value: item.channel_code,
            label: item.channel_name
          }))
        })
      },
      loadAdvLinkOptions() {
        pageListAdLink({
          page_num: 1,
          page_size: 500,
          query_param: {}
        }).then(res => {
          const list = (res.data.data && res.data.data.list) || []
          this.adv_link_options = list.map(item => ({
            value: item.id,
            label: `${item.channel_name || item.channel_code} / ${item.app_name || ''} (#${item.id})`,
            channel_code: item.channel_code
          }))
        })
      },
      loadAddMediaChannels(advChannelCode) {
        this.add_media_channel_list = []
        if (!advChannelCode) {
          return
        }
        fetchAdChannelCodeList({
          up_down_type: 0,
          channel_adv_code: advChannelCode
        }).then(res => {
          const list = res.data.data || []
          this.add_media_channel_list = list.map(item => ({
            value: item.channel_code,
            label: item.channel_name
          }))
        })
      },
      listMediaLinks() {
        pageListMediaLink({
          page_num: this.pageNum,
          page_size: this.pageSize,
          query_param: {
            adv_channel_code: this.filter_adv_channel_code || undefined,
            channel_code: this.filter_media_channel_code || undefined,
            keyword: this.search_keyword || undefined
          }
        }).then(res => {
          const data = res.data.data
          if (data != null) {
            this.tableData = (data.list || []).map(row => ({
              ...row,
              conversion_rate_label: this.formatConversionRateLabel(row)
            }))
            this.total = data.total || 0
          }
        })
      },
      resetForm() {
        this.form = {
          id: null,
          adv_link_id: null,
          channel_code: '',
          channel_name: '',
          conversion_rate: 80,
          rate_min_limit: false,
          rate_min_limit_num: 1,
          extra_info: ''
        }
        this.selected_adv_channel_code = ''
        this.add_media_channel_list = []
        this.linkParamHint = []
        this.linkParamFields = []
      },
      openAddDialog() {
        this.isEdit = false
        this.resetForm()
        this.dialogVisible = true
        this.$nextTick(() => {
          if (this.$refs.formRef) {
            this.$refs.formRef.clearValidate()
          }
        })
      },
      openEditDialog(row) {
        this.isEdit = true
        this.form = {
          id: row.id,
          adv_link_id: row.adv_link_id,
          channel_code: row.channel_code,
          channel_name: row.channel_name,
          conversion_rate: row.conversion_rate,
          rate_min_limit: row.rate_min_limit,
          rate_min_limit_num: row.rate_min_limit_num,
          extra_info: row.extra_info || ''
        }
        this.loadLinkParamFields(row.channel_code, row.param_values || [])
        this.dialogVisible = true
        this.$nextTick(() => {
          if (this.$refs.formRef) {
            this.$refs.formRef.clearValidate()
          }
        })
      },
      closeDialog() {
        this.dialogVisible = false
        this.resetForm()
      },
      handleAdvLinkChange(advLinkId) {
        this.form.channel_code = ''
        this.linkParamHint = []
        this.linkParamFields = []
        const selected = this.adv_link_options.find(item => item.value === advLinkId)
        this.selected_adv_channel_code = selected ? selected.channel_code : ''
        this.loadAddMediaChannels(this.selected_adv_channel_code)
      },
      handleMediaChannelChange(channelCode) {
        this.loadLinkParamFields(channelCode, [])
      },
      handleSubmit() {
        this.$refs.formRef.validate(valid => {
          if (!valid) {
            return
          }
          this.submitLoading = true
          const payload = {
            conversion_rate: this.form.conversion_rate,
            rate_min_limit: this.form.rate_min_limit,
            rate_min_limit_num: this.form.rate_min_limit_num,
            extra_info: this.form.extra_info,
            param_values: this.buildMediaLinkParamValues()
          }
          const request = this.isEdit
            ? updateMediaLink({id: this.form.id, ...payload})
            : addMediaLink({
              adv_link_id: this.form.adv_link_id,
              channel_code: this.form.channel_code,
              ...payload
            })
          request.then(() => {
            this.$message.success('保存成功')
            this.closeDialog()
            this.listMediaLinks()
          }).catch(err => {
            this.$message.error(err.message || '保存失败')
          }).finally(() => {
            this.submitLoading = false
          })
        })
      },
      handleRemove(row) {
        removeMediaLink(row.id).then(() => {
          this.$message.success('删除成功')
          this.listMediaLinks()
        })
      },
      goAdvLinkDetail(row) {
        if (row.adv_link_id) {
          this.$router.push(`/ad_link/${row.adv_link_id}`)
        }
      },
      openMonitorDialog(row) {
        this.monitorRow = {...row}
        this.monitorDialogVisible = true
      },
      closeMonitorDialog() {
        this.monitorRow = null
        this.copyAllLoading = false
      },
      buildMonitorCopyText() {
        const lines = [`投放名称：${this.monitorDialogTitle}`]
        for (const item of this.monitorLinkItems) {
          lines.push(`${item.label}：${item.value || '—'}`)
        }
        return lines.join('\n')
      },
      copyAllMonitorContent() {
        const text = this.buildMonitorCopyText()
        this.copyAllLoading = true
        this.copyToClipboard(text).then(() => {
          this.$message.success('复制成功')
        }).catch(() => {
          this.$message.error('复制失败，请重试')
        }).finally(() => {
          this.copyAllLoading = false
        })
      },
      copyToClipboard(text) {
        return new Promise((resolve, reject) => {
          if (!text) {
            reject(new Error('empty'))
            return
          }
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(resolve).catch(reject)
            return
          }
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.top = '-9999px'
          textarea.style.left = '-9999px'
          document.body.appendChild(textarea)
          textarea.select()
          try {
            if (document.execCommand('copy')) {
              resolve()
            } else {
              reject(new Error('copy failed'))
            }
          } catch (err) {
            reject(err)
          } finally {
            document.body.removeChild(textarea)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ad-data-list-header {
    font-weight: 600;
    line-height: 40px;
    color: #212121;
    padding-bottom: 20px;
  }

  .pick-form-inline {
    padding: 0 10px;
  }

  .pick-form-item {
    padding-right: 30px;
  }

  .page-wrapper {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .adv-link-operate-button {
    margin-left: 6px;
  }

  .link-param-hint {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .link-param-tag {
    margin-right: 0;
  }

  .param-value-panel {
    padding: 8px 16px 0;
  }

  .expand-section-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: #303133;
  }

  .param-value-item {
    display: flex;
    gap: 12px;
    margin-bottom: 6px;
    font-size: 13px;
  }

  .param-value-name {
    min-width: 120px;
    color: #606266;
  }

  .param-value-text {
    color: #303133;
    word-break: break-all;
  }

  .param-value-empty {
    padding: 8px 16px;
    color: #909399;
    font-size: 13px;
  }

  .expand-link-block {
    padding: 8px 16px 12px;
    font-size: 13px;
    color: #303133;
  }

  .expand-link-row {
    margin-bottom: 6px;
    word-break: break-all;
  }

  .expand-link-label {
    color: #606266;
  }

  .conversion-rate-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .conversion-rate-suffix {
    color: #909399;
  }

  .rate-quick-tag {
    cursor: pointer;
  }

  .monitor-dialog-body {
    padding: 0 4px;
  }

  .monitor-dialog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .monitor-dialog-title {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    line-height: 1.5;
    word-break: break-all;
  }

  .monitor-link-block {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .monitor-link-label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .monitor-link-text {
    font-size: 13px;
    line-height: 1.6;
    color: #303133;
    word-break: break-all;
    white-space: pre-wrap;
    background: #f5f7fa;
    border-radius: 4px;
    padding: 10px 12px;
    min-height: 40px;
  }
</style>
