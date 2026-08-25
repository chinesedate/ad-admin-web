<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">预算媒体管理</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="类型">
            <el-radio-group v-model="filter_up_down_type" @change="handleFilterChange">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">媒体</el-radio>
              <el-radio :label="1">广告主</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="pick-form-item" label="搜索">
            <el-input
              class="adv-link-search"
              clearable
              placeholder="请输入名称或标识"
              @input="handleFilterChange"
              prefix-icon="el-icon-search"
              v-model="search_keyword">
            </el-input>
          </el-form-item>
          <el-form-item class="pick-form-item">
            <el-button type="primary" @click="openAddDialog">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          ref="advMediaTable"
          row-key="id"
          stripe
          class="adv-media-table"
          style="width: 100%">
          <el-table-column prop="id" label="ID" min-width="120" align="center" show-overflow-tooltip/>
          <el-table-column prop="up_down_type" label="类型" min-width="120" align="center">
            <template #default="scope">
              <el-tag
                v-if="Number(scope.row.up_down_type) === 0"
                type="success"
                size="small"
                effect="light">
                媒体
              </el-tag>
              <el-tag
                v-else-if="Number(scope.row.up_down_type) === 1"
                type="warning"
                size="small"
                effect="light">
                广告主
              </el-tag>
              <span v-else>{{ formatUpDownType(scope.row.up_down_type) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="channel_name" label="名称" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="channel_code" label="标识" min-width="120" show-overflow-tooltip/>
          <el-table-column
            prop="channel_url_prefix"
            label="链接前缀"
            min-width="120"
            show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.channel_url_prefix || '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="添加时间" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="update_time" label="修改时间" min-width="120" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.update_time || scope.row.create_time || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="center" class-name="adv-media-op-col">
            <template #default="scope">
              <el-button
                v-if="Number(scope.row.up_down_type) === 1"
                class="adv-link-operate-button"
                type="success"
                size="mini"
                @click="openLinkParamDialog(scope.row)">链接参数
              </el-button>
              <el-button
                v-if="Number(scope.row.up_down_type) === 0"
                class="adv-link-operate-button"
                type="success"
                size="mini"
                @click="openMediaLinkParamDialog(scope.row)">字段参数
              </el-button>
              <el-button
                class="adv-link-operate-button"
                type="primary"
                size="mini"
                @click="openEditDialog(scope.row)">编辑
              </el-button>
              <el-popconfirm title="确定删除吗？" @confirm="handleRemove(scope.row)">
                <template #reference>
                  <el-button class="adv-link-operate-button" type="danger" size="mini">删除</el-button>
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
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      :title="isEdit ? '编辑渠道' : '添加渠道'"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型：" prop="up_down_type">
          <el-radio-group v-model="form.up_down_type" :disabled="isEdit">
            <el-radio :label="0">媒体</el-radio>
            <el-radio :label="1">广告主</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称：" prop="channel_name">
          <el-input v-model="form.channel_name" maxlength="100" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="标识：" prop="channel_code">
          <el-input v-model="form.channel_code" maxlength="100" :disabled="isEdit" placeholder="请输入标识"/>
        </el-form-item>
        <el-form-item label="链接前缀：" prop="channel_url_prefix">
          <el-input
            v-model="form.channel_url_prefix"
            maxlength="300"
            placeholder="选填，须以 http:// 或 https:// 开头"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="linkParamDialogTitle"
      :visible.sync="linkParamDialogVisible"
      width="760px"
      :close-on-click-modal="false"
      @close="closeLinkParamDialog">
      <div class="link-param-channel-info">
        <span>渠道标识：{{ linkParamChannelCode }}</span>
      </div>
      <el-table :data="linkParamRows" stripe style="width: 100%">
        <el-table-column label="参数名称" min-width="180">
          <template #default="scope">
            <el-input
              v-model="scope.row.param_name"
              maxlength="100"
              placeholder="如 adId、channelId"/>
          </template>
        </el-table-column>
        <el-table-column label="是否必须" min-width="140" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.param_required" placeholder="请选择">
              <el-option :value="0" label="必须"/>
              <el-option :value="1" label="非必须"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否生效" min-width="140" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.is_active" placeholder="请选择">
              <el-option :value="0" label="生效"/>
              <el-option :value="1" label="不生效"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center">
          <template #default="scope">
            <el-button type="text" @click="removeLinkParamRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="link-param-toolbar">
        <el-button type="primary" plain icon="el-icon-plus" @click="addLinkParamRow">增加一行</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeLinkParamDialog">取消</el-button>
        <el-button type="primary" :loading="linkParamSubmitLoading" @click="handleLinkParamSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addAdvMedia,
    fetchAdvLinkParam,
    fetchMediaLinkParam,
    pageListAdvMedia,
    removeAdvMedia,
    saveAdvLinkParam,
    saveMediaLinkParam,
    updateAdvMedia
  } from '@/api/ad-data'

  const CODE_PATTERN = /^[A-Za-z0-9_]+$/
  const PARAM_NAME_PATTERN = /^[A-Za-z0-9_]+$/

  export default {
    name: 'adv_media_list',
    data() {
      const validateChannelCode = (rule, value, callback) => {
        if (this.isEdit) {
          callback()
          return
        }
        const code = (value || '').trim()
        if (!code) {
          callback(new Error('请输入标识'))
          return
        }
        if (!CODE_PATTERN.test(code)) {
          callback(new Error('标识仅允许字母、数字和下划线'))
          return
        }
        callback()
      }
      const validateUrlPrefix = (rule, value, callback) => {
        const prefix = (value || '').trim()
        if (!prefix) {
          callback()
          return
        }
        if (!(prefix.startsWith('http://') || prefix.startsWith('https://'))) {
          callback(new Error('链接前缀须以 http:// 或 https:// 开头'))
          return
        }
        callback()
      }

      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        search_keyword: '',
        filter_up_down_type: null,
        tableData: [],
        dialogVisible: false,
        isEdit: false,
        submitLoading: false,
        linkParamDialogVisible: false,
        linkParamSubmitLoading: false,
        linkParamType: 'adv',
        linkParamChannelCode: '',
        linkParamChannelName: '',
        linkParamRows: [],
        form: {
          id: null,
          up_down_type: 0,
          channel_name: '',
          channel_code: '',
          channel_url_prefix: ''
        },
        rules: {
          up_down_type: [{required: true, message: '请选择类型', trigger: 'change'}],
          channel_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          channel_code: [{validator: validateChannelCode, trigger: 'blur'}],
          channel_url_prefix: [{validator: validateUrlPrefix, trigger: 'blur'}]
        }
      }
    },
    computed: {
      linkParamDialogTitle() {
        const prefix = this.linkParamType === 'media' ? '字段参数配置' : '链接参数配置'
        if (this.linkParamChannelName) {
          return `${prefix} - ${this.linkParamChannelName}`
        }
        return prefix
      }
    },
    mounted() {
      this.listAdvMedia()
    },
    methods: {
      formatUpDownType(value) {
        if (value === 0) {
          return '媒体'
        }
        if (value === 1) {
          return '广告主'
        }
        return value
      },
      handleFilterChange() {
        this.pageNum = 1
        this.listAdvMedia()
      },
      handlePageChange(page) {
        this.pageNum = page
        this.listAdvMedia()
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.pageNum = 1
        this.listAdvMedia()
      },
      buildQueryParam() {
        const query_param = {
          keyword: this.search_keyword
        }
        if (this.filter_up_down_type === 0 || this.filter_up_down_type === 1) {
          query_param.up_down_type = this.filter_up_down_type
        }
        return query_param
      },
      listAdvMedia() {
        pageListAdvMedia({
          page_num: this.pageNum,
          page_size: this.pageSize,
          query_param: this.buildQueryParam()
        }).then(res => {
          const data = res.data.data
          if (data != null) {
            this.tableData = data.list || []
            this.total = data.total || 0
          }
        })
      },
      resetForm() {
        this.form = {
          id: null,
          up_down_type: 0,
          channel_name: '',
          channel_code: '',
          channel_url_prefix: ''
        }
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
          up_down_type: row.up_down_type,
          channel_name: row.channel_name,
          channel_code: row.channel_code,
          channel_url_prefix: row.channel_url_prefix || ''
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          if (this.$refs.formRef) {
            this.$refs.formRef.clearValidate()
          }
        })
      },
      closeDialog() {
        this.dialogVisible = false
        this.isEdit = false
        this.submitLoading = false
        this.resetForm()
        if (this.$refs.formRef) {
          this.$refs.formRef.resetFields()
        }
      },
      handleSubmit() {
        this.$refs.formRef.validate(valid => {
          if (!valid) {
            return false
          }
          this.submitLoading = true
          if (this.isEdit) {
            updateAdvMedia({
              id: this.form.id,
              channel_name: this.form.channel_name.trim(),
              channel_url_prefix: (this.form.channel_url_prefix || '').trim()
            }).then(() => {
              this.$message.success('保存成功')
              this.closeDialog()
              this.listAdvMedia()
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            addAdvMedia({
              up_down_type: this.form.up_down_type,
              channel_name: this.form.channel_name.trim(),
              channel_code: this.form.channel_code.trim(),
              channel_url_prefix: (this.form.channel_url_prefix || '').trim()
            }).then(() => {
              this.$message.success('添加成功')
              this.closeDialog()
              this.pageNum = 1
              this.listAdvMedia()
            }).finally(() => {
              this.submitLoading = false
            })
          }
        })
      },
      handleRemove(row) {
        removeAdvMedia(row.id).then(() => {
          this.$message.success('删除成功')
          this.pageNum = 1
          this.listAdvMedia()
        })
      },
      createEmptyLinkParamRow() {
        return {
          id: null,
          param_name: '',
          param_required: 0,
          is_active: 0
        }
      },
      loadLinkParamRows(channelCode, fetchFn) {
        this.linkParamRows = []
        fetchFn(channelCode).then(res => {
          const data = res.data.data
          if (data && Array.isArray(data.params) && data.params.length > 0) {
            this.linkParamRows = data.params.map(item => ({
              id: item.id || null,
              param_name: (item.param_name || '').trim(),
              param_required: Number(item.param_required),
              is_active: Number(item.is_active)
            }))
          } else {
            this.linkParamRows = [this.createEmptyLinkParamRow()]
          }
        }).catch(() => {
          this.linkParamRows = [this.createEmptyLinkParamRow()]
        })
      },
      openLinkParamDialog(row) {
        if (Number(row.up_down_type) !== 1) {
          return
        }
        this.linkParamType = 'adv'
        this.linkParamChannelCode = row.channel_code
        this.linkParamChannelName = row.channel_name
        this.linkParamDialogVisible = true
        this.loadLinkParamRows(row.channel_code, fetchAdvLinkParam)
      },
      openMediaLinkParamDialog(row) {
        if (Number(row.up_down_type) !== 0) {
          return
        }
        this.linkParamType = 'media'
        this.linkParamChannelCode = row.channel_code
        this.linkParamChannelName = row.channel_name
        this.linkParamDialogVisible = true
        this.loadLinkParamRows(row.channel_code, fetchMediaLinkParam)
      },
      closeLinkParamDialog() {
        this.linkParamDialogVisible = false
        this.linkParamSubmitLoading = false
        this.linkParamType = 'adv'
        this.linkParamChannelCode = ''
        this.linkParamChannelName = ''
        this.linkParamRows = []
      },
      addLinkParamRow() {
        this.linkParamRows.push(this.createEmptyLinkParamRow())
      },
      removeLinkParamRow(index) {
        this.linkParamRows.splice(index, 1)
      },
      validateLinkParamRows() {
        const seenNames = new Set()
        for (let i = 0; i < this.linkParamRows.length; i++) {
          const row = this.linkParamRows[i]
          const paramName = (row.param_name || '').trim()
          if (!paramName) {
            this.$message.error(`第${i + 1}行：参数名称不能为空`)
            return false
          }
          if (!PARAM_NAME_PATTERN.test(paramName)) {
            this.$message.error(`第${i + 1}行：参数名称仅允许字母、数字和下划线`)
            return false
          }
          if (seenNames.has(paramName)) {
            this.$message.error(`参数名称 ${paramName} 重复`)
            return false
          }
          seenNames.add(paramName)
        }
        return true
      },
      handleLinkParamSubmit() {
        if (!this.validateLinkParamRows()) {
          return
        }
        this.linkParamSubmitLoading = true
        const savePayload = {
          channel_code: this.linkParamChannelCode,
          params: this.linkParamRows.map(row => ({
            id: row.id || null,
            param_name: row.param_name.trim(),
            param_required: Number(row.param_required),
            is_active: Number(row.is_active)
          }))
        }
        const saveFn = this.linkParamType === 'media' ? saveMediaLinkParam : saveAdvLinkParam
        saveFn(savePayload).then(() => {
          this.$message.success('保存成功')
          this.closeLinkParamDialog()
        }).finally(() => {
          this.linkParamSubmitLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ad-data-list-content {
    display: flex;
  }

  .ad-data-list {
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

  .adv-link-operate-button {
    margin-right: 6px;
  }

  .adv-media-table {
    ::v-deep .el-table__header-wrapper table,
    ::v-deep .el-table__body-wrapper table {
      table-layout: fixed;
      width: 100%;
    }

    ::v-deep .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::v-deep .adv-media-op-col .cell {
      white-space: normal;
      overflow: visible;
    }
  }

  .link-param-channel-info {
    margin-bottom: 12px;
    color: #606266;
  }

  .link-param-toolbar {
    margin-top: 12px;
  }
</style>
