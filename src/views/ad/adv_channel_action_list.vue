<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">转化配置</div>
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
              placeholder="渠道标识 / 转化类型 / 名称"
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
          ref="advChannelActionTable"
          row-key="id"
          stripe
          class="adv-media-table"
          style="width: 100%">
          <el-table-column prop="id" label="ID" min-width="80" align="center" show-overflow-tooltip/>
          <el-table-column prop="channel_code" label="渠道标识" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="up_down_type" label="类型" min-width="100" align="center">
            <template #default="scope">
              <el-tag
                v-if="Number(scope.row.up_down_type) === 0"
                type="success"
                size="small"
                effect="light">媒体</el-tag>
              <el-tag
                v-else-if="Number(scope.row.up_down_type) === 1"
                type="warning"
                size="small"
                effect="light">广告主</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="action_type" label="转化类型" min-width="160" show-overflow-tooltip/>
          <el-table-column prop="action_name" label="转化名称" min-width="140" show-overflow-tooltip/>
          <el-table-column prop="create_time" label="添加时间" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="update_time" label="修改时间" min-width="150" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.update_time || scope.row.create_time || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="140" align="center" class-name="adv-media-op-col">
            <template #default="scope">
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
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      :title="isEdit ? '编辑转化配置' : '添加转化配置'"
      :visible.sync="dialogVisible"
      width="560px"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型：" prop="up_down_type">
          <el-radio-group v-model="form.up_down_type" @change="handleFormUpDownTypeChange">
            <el-radio :label="0">媒体</el-radio>
            <el-radio :label="1">广告主</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="渠道标识：" prop="channel_code">
          <el-select
            v-model="form.channel_code"
            filterable
            clearable
            placeholder="请选择渠道标识"
            style="width: 100%">
            <el-option
              v-for="item in channel_code_options"
              :key="item.channel_code"
              :label="formatChannelOption(item)"
              :value="item.channel_code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="转化类型：" prop="action_type">
          <el-input v-model="form.action_type" maxlength="64" placeholder="如 APP_ACTIVE"/>
        </el-form-item>
        <el-form-item label="转化名称：" prop="action_name">
          <el-input v-model="form.action_name" maxlength="100" placeholder="请输入转化名称"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addAdvChannelAction,
    fetchAdChannelCodeList,
    pageListAdvChannelAction,
    removeAdvChannelAction,
    updateAdvChannelAction
  } from '@/api/ad-data'

  export default {
    name: 'adv_channel_action_list',
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        search_keyword: '',
        filter_up_down_type: null,
        tableData: [],
        channel_code_options: [],
        dialogVisible: false,
        isEdit: false,
        submitLoading: false,
        form: {
          id: null,
          channel_code: '',
          up_down_type: 0,
          action_type: '',
          action_name: ''
        },
        rules: {
          channel_code: [{required: true, message: '请选择渠道标识', trigger: 'change'}],
          up_down_type: [{required: true, message: '请选择类型', trigger: 'change'}],
          action_type: [{required: true, message: '请输入转化类型', trigger: 'blur'}],
          action_name: [{required: true, message: '请输入转化名称', trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this.listAdvChannelAction()
    },
    methods: {
      formatChannelOption(item) {
        if (item.channel_name && item.channel_name !== item.channel_code) {
          return `${item.channel_name} (${item.channel_code})`
        }
        return item.channel_code
      },
      loadChannelCodeOptions(upDownType, keepSelected = false) {
        const type = Number(upDownType)
        return fetchAdChannelCodeList({
          up_down_type: type
        }).then(res => {
          this.channel_code_options = (res.data && res.data.data) ? res.data.data : []
          if (!keepSelected) {
            this.form.channel_code = ''
          }
        })
      },
      ensureSelectedChannelOption(channelCode) {
        const code = (channelCode || '').trim()
        if (!code) {
          return
        }
        const exists = this.channel_code_options.some(item => item.channel_code === code)
        if (!exists) {
          this.channel_code_options.unshift({
            channel_code: code,
            channel_name: code
          })
        }
        this.form.channel_code = code
      },
      handleFormUpDownTypeChange() {
        this.form.up_down_type = Number(this.form.up_down_type)
        this.loadChannelCodeOptions(this.form.up_down_type, false)
      },
      trimForm() {
        return {
          channel_code: (this.form.channel_code || '').trim(),
          up_down_type: Number(this.form.up_down_type),
          action_type: (this.form.action_type || '').trim(),
          action_name: (this.form.action_name || '').trim()
        }
      },
      handleFilterChange() {
        this.pageNum = 1
        this.listAdvChannelAction()
      },
      handlePageChange(page) {
        this.pageNum = page
        this.listAdvChannelAction()
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.pageNum = 1
        this.listAdvChannelAction()
      },
      buildQueryParam() {
        const query_param = {keyword: this.search_keyword}
        if (this.filter_up_down_type === 0 || this.filter_up_down_type === 1) {
          query_param.up_down_type = this.filter_up_down_type
        }
        return query_param
      },
      listAdvChannelAction() {
        pageListAdvChannelAction({
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
          channel_code: '',
          up_down_type: 0,
          action_type: '',
          action_name: ''
        }
      },
      openAddDialog() {
        this.isEdit = false
        this.resetForm()
        this.dialogVisible = true
        this.loadChannelCodeOptions(this.form.up_down_type, false)
        this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
      },
      openEditDialog(row) {
        this.isEdit = true
        const upDownType = Number(row.up_down_type)
        const channelCode = (row.channel_code || '').trim()
        this.form = {
          id: row.id,
          channel_code: channelCode,
          up_down_type: upDownType,
          action_type: row.action_type,
          action_name: row.action_name
        }
        this.dialogVisible = true
        this.loadChannelCodeOptions(upDownType, true).then(() => {
          this.ensureSelectedChannelOption(channelCode)
        })
        this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
      },
      closeDialog() {
        this.dialogVisible = false
        this.isEdit = false
        this.submitLoading = false
        this.channel_code_options = []
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
          const payload = this.trimForm()
          if (this.isEdit) {
            updateAdvChannelAction({id: this.form.id, ...payload}).then(() => {
              this.$message.success('保存成功')
              this.closeDialog()
              this.listAdvChannelAction()
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            addAdvChannelAction(payload).then(() => {
              this.$message.success('添加成功')
              this.closeDialog()
              this.pageNum = 1
              this.listAdvChannelAction()
            }).finally(() => {
              this.submitLoading = false
            })
          }
        })
      },
      handleRemove(row) {
        removeAdvChannelAction(row.id).then(() => {
          this.$message.success('删除成功')
          this.pageNum = 1
          this.listAdvChannelAction()
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
</style>
