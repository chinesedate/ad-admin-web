<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">渠道上下游信息</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="链接生成">
            <el-radio-group v-model="filter_support_link_generation" @change="handleFilterChange">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">支持</el-radio>
              <el-radio :label="1">不支持</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="pick-form-item" label="搜索">
            <el-input
              class="adv-link-search"
              clearable
              placeholder="渠道ID / 上下游标识"
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
          ref="advChannelUpDownTable"
          row-key="id"
          stripe
          class="adv-media-table"
          style="width: 100%">
          <el-table-column prop="id" label="ID" min-width="80" align="center" show-overflow-tooltip/>
          <el-table-column prop="channel_id" label="渠道ID" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="support_link_generation" label="链接生成" min-width="100" align="center">
            <template #default="scope">
              <el-tag
                v-if="Number(scope.row.support_link_generation) === 0"
                type="success"
                size="small"
                effect="light">支持</el-tag>
              <el-tag
                v-else
                type="info"
                size="small"
                effect="light">不支持</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="up_channel_code" label="上游标识" min-width="110" show-overflow-tooltip/>
          <el-table-column prop="down_channel_code" label="下游标识" min-width="110" show-overflow-tooltip/>
          <el-table-column prop="up_channel" label="上游渠道" min-width="110" show-overflow-tooltip/>
          <el-table-column prop="down_channel" label="下游渠道" min-width="110" show-overflow-tooltip/>
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
      :title="isEdit ? '编辑上下游' : '添加上下游'"
      :visible.sync="dialogVisible"
      width="640px"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="渠道ID：" prop="channel_id">
          <el-input v-model="form.channel_id" maxlength="32" placeholder="请输入渠道ID"/>
        </el-form-item>
        <el-form-item label="链接生成：" prop="support_link_generation">
          <el-radio-group v-model="form.support_link_generation">
            <el-radio :label="0">支持</el-radio>
            <el-radio :label="1">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上游标识：" prop="up_channel_code">
          <el-input v-model="form.up_channel_code" maxlength="100" placeholder="媒体渠道标识"/>
        </el-form-item>
        <el-form-item label="下游标识：" prop="down_channel_code">
          <el-input v-model="form.down_channel_code" maxlength="100" placeholder="广告主渠道标识"/>
        </el-form-item>
        <el-form-item label="上游渠道：" prop="up_channel">
          <el-input v-model="form.up_channel" maxlength="100" placeholder="上游渠道转化类型字段"/>
        </el-form-item>
        <el-form-item label="下游渠道：" prop="down_channel">
          <el-input v-model="form.down_channel" maxlength="100" placeholder="下游渠道转化类型字段"/>
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
    addAdvChannelUpDown,
    pageListAdvChannelUpDown,
    removeAdvChannelUpDown,
    updateAdvChannelUpDown
  } from '@/api/ad-data'

  const CODE_PATTERN = /^[A-Za-z0-9_]+$/

  export default {
    name: 'adv_channel_up_down_list',
    data() {
      const validateCodeField = (fieldLabel) => (rule, value, callback) => {
        const text = (value || '').trim()
        if (!text) {
          callback(new Error(`请输入${fieldLabel}`))
          return
        }
        if (!CODE_PATTERN.test(text)) {
          callback(new Error(`${fieldLabel}仅允许字母、数字和下划线`))
          return
        }
        callback()
      }

      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        search_keyword: '',
        filter_support_link_generation: null,
        tableData: [],
        dialogVisible: false,
        isEdit: false,
        submitLoading: false,
        form: {
          id: null,
          channel_id: '',
          support_link_generation: 0,
          up_channel_code: '',
          down_channel_code: '',
          up_channel: '',
          down_channel: ''
        },
        rules: {
          channel_id: [{required: true, message: '请输入渠道ID', trigger: 'blur'}],
          support_link_generation: [{required: true, message: '请选择链接生成配置', trigger: 'change'}],
          up_channel_code: [{validator: validateCodeField('上游标识'), trigger: 'blur'}],
          down_channel_code: [{validator: validateCodeField('下游标识'), trigger: 'blur'}],
          up_channel: [{validator: validateCodeField('上游渠道'), trigger: 'blur'}],
          down_channel: [{validator: validateCodeField('下游渠道'), trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this.listAdvChannelUpDown()
    },
    methods: {
      trimForm() {
        return {
          channel_id: (this.form.channel_id || '').trim(),
          support_link_generation: this.form.support_link_generation,
          up_channel_code: (this.form.up_channel_code || '').trim(),
          down_channel_code: (this.form.down_channel_code || '').trim(),
          up_channel: (this.form.up_channel || '').trim(),
          down_channel: (this.form.down_channel || '').trim()
        }
      },
      handleFilterChange() {
        this.pageNum = 1
        this.listAdvChannelUpDown()
      },
      handlePageChange(page) {
        this.pageNum = page
        this.listAdvChannelUpDown()
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.pageNum = 1
        this.listAdvChannelUpDown()
      },
      buildQueryParam() {
        const query_param = {keyword: this.search_keyword}
        if (this.filter_support_link_generation === 0 || this.filter_support_link_generation === 1) {
          query_param.support_link_generation = this.filter_support_link_generation
        }
        return query_param
      },
      listAdvChannelUpDown() {
        pageListAdvChannelUpDown({
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
          channel_id: '',
          support_link_generation: 0,
          up_channel_code: '',
          down_channel_code: '',
          up_channel: '',
          down_channel: ''
        }
      },
      openAddDialog() {
        this.isEdit = false
        this.resetForm()
        this.dialogVisible = true
        this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
      },
      openEditDialog(row) {
        this.isEdit = true
        this.form = {
          id: row.id,
          channel_id: row.channel_id,
          support_link_generation: row.support_link_generation,
          up_channel_code: row.up_channel_code,
          down_channel_code: row.down_channel_code,
          up_channel: row.up_channel,
          down_channel: row.down_channel
        }
        this.dialogVisible = true
        this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
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
          const payload = this.trimForm()
          if (this.isEdit) {
            updateAdvChannelUpDown({id: this.form.id, ...payload}).then(() => {
              this.$message.success('保存成功')
              this.closeDialog()
              this.listAdvChannelUpDown()
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            addAdvChannelUpDown(payload).then(() => {
              this.$message.success('添加成功')
              this.closeDialog()
              this.pageNum = 1
              this.listAdvChannelUpDown()
            }).finally(() => {
              this.submitLoading = false
            })
          }
        })
      },
      handleRemove(row) {
        removeAdvChannelUpDown(row.id).then(() => {
          this.$message.success('删除成功')
          this.pageNum = 1
          this.listAdvChannelUpDown()
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
