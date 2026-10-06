<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">曝光补充</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="搜索">
            <el-input
                class="adv-link-search"
                clearable
                placeholder="渠道标识 / 渠道ID / 客户ID / 应用ID"
                @input="handleFilterChange"
                prefix-icon="el-icon-search"
                v-model="search_keyword">
            </el-input>
          </el-form-item>
          <el-form-item class="pick-form-item" label="状态">
            <el-radio-group v-model="filter_is_active" @change="handleFilterChange">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">开启</el-radio>
              <el-radio :label="1">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="pick-form-item" label="生效日期">
            <el-date-picker
                v-model="filter_effective_date"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                clearable
                placeholder="选择日期"
                @change="handleFilterChange"
                style="width: 160px"/>
          </el-form-item>
          <el-form-item class="pick-form-item">
            <el-button type="primary" @click="openAddDialog">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            ref="appShowDataSupplyTable"
            row-key="id"
            stripe
            class="adv-media-table"
            style="width: 100%">
          <el-table-column prop="id" label="ID" min-width="70" align="center" show-overflow-tooltip/>
          <el-table-column prop="channel_code" label="渠道标识" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="customer_id" label="客户ID" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.customer_id || '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="channel_id" label="渠道ID" min-width="140" show-overflow-tooltip/>
          <el-table-column prop="app_id" label="应用ID" min-width="160" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.app_id || '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="per_num" label="每次补充数量" min-width="110" align="center" show-overflow-tooltip/>
          <el-table-column prop="today_show_count" label="今日曝光数" min-width="110" align="center">
            <template #default="scope">
              {{ Number(scope.row.today_show_count) || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="is_active" label="状态" min-width="90" align="center">
            <template #default="scope">
              <el-tag
                  v-if="Number(scope.row.is_active) === 0"
                  type="success"
                  size="small"
                  effect="light">开启
              </el-tag>
              <el-tag
                  v-else
                  type="info"
                  size="small"
                  effect="light">关闭
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="生效日期" min-width="200" align="center">
            <template #default="scope">
              <el-tag
                  :type="isInEffect(scope.row) ? 'success' : 'info'"
                  size="small"
                  effect="plain">{{ scope.row.start_date || '—' }} 至 {{ scope.row.end_date || '—' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="note_info" label="备注" min-width="140" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.note_info || '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="添加时间" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="update_time" label="修改时间" min-width="150" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.update_time || scope.row.create_time || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right" align="center" class-name="adv-media-op-col">
            <template #default="scope">
              <el-button type="primary" size="mini" class="adv-link-operate-button" @click="openEditDialog(scope.row)">
                编辑
              </el-button>
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
        :title="isEdit ? '编辑曝光补充' : '添加曝光补充'"
        :visible.sync="dialogVisible"
        width="560px"
        :close-on-click-modal="false"
        @close="closeDialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="渠道标识：" prop="channel_code">
          <el-input v-model="form.channel_code" maxlength="32" placeholder="如 kuaishou"/>
        </el-form-item>
        <el-form-item label="客户ID：" prop="customer_id">
          <el-input v-model="form.customer_id" maxlength="100" placeholder="请输入客户ID"/>
        </el-form-item>
        <el-form-item label="渠道ID：" prop="channel_id">
          <el-input v-model="form.channel_id" maxlength="32" placeholder="请输入渠道ID"/>
        </el-form-item>
        <el-form-item label="应用ID：" prop="app_id">
          <el-input v-model="form.app_id" maxlength="100" placeholder="请输入应用ID"/>
        </el-form-item>
        <el-form-item label="每次补充数量：" prop="per_num">
          <el-input-number v-model="form.per_num" :min="0" :precision="0" style="width: 180px"/>
        </el-form-item>
        <el-form-item label="状态：" prop="is_active">
          <el-radio-group v-model="form.is_active">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生效日期：" prop="date_range">
          <el-date-picker
              v-model="form.date_range"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="生效起始日期"
              end-placeholder="生效结束日期"
              style="width: 100%"/>
        </el-form-item>
        <el-form-item label="备注：" prop="note_info">
          <el-input
              type="textarea"
              :rows="2"
              maxlength="200"
              show-word-limit
              v-model="form.note_info"
              placeholder="选填"/>
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
  addAppShowDataSupply,
  pageListAppShowDataSupply,
  removeAppShowDataSupply,
  updateAppShowDataSupply
} from '@/api/ad-data'

export default {
  name: 'app_show_data_supply_list',
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      search_keyword: '',
      filter_is_active: null,
      filter_effective_date: '',
      tableData: [],
      dialogVisible: false,
      isEdit: false,
      submitLoading: false,
      form: {
        id: null,
        channel_code: '',
        channel_id: '',
        customer_id: '',
        app_id: '',
        per_num: 0,
        is_active: 0,
        date_range: [],
        note_info: ''
      },
      rules: {
        channel_code: [{required: true, message: '请输入渠道标识', trigger: 'blur'}],
        channel_id: [{required: true, message: '请输入渠道ID', trigger: 'blur'}],
        customer_id: [{required: true, message: '请输入客户ID', trigger: 'blur'}],
        app_id: [{required: true, message: '请输入应用ID', trigger: 'blur'}],
        per_num: [{required: true, message: '请输入每次补充数量', trigger: 'blur'}],
        is_active: [{required: true, message: '请选择状态', trigger: 'change'}],
        // daterange 绑定的是数组，必须声明 type: 'array'，否则空数组会被 required 判为已填
        date_range: [{required: true, type: 'array', message: '请选择生效日期', trigger: ['blur', 'change']}]
      }
    }
  },
  mounted() {
    this.listAppShowDataSupply()
  },
  methods: {
    handleFilterChange() {
      this.pageNum = 1
      this.listAppShowDataSupply()
    },
    handlePageChange(page) {
      this.pageNum = page
      this.listAppShowDataSupply()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.pageNum = 1
      this.listAppShowDataSupply()
    },
    buildQueryParam() {
      const query_param = {
        keyword: (this.search_keyword || '').trim() || undefined
      }
      if (this.filter_is_active === 0 || this.filter_is_active === 1) {
        query_param.is_active = this.filter_is_active
      }
      // 生效日期为空表示不过滤该字段
      if (this.filter_effective_date) {
        query_param.effective_date = this.filter_effective_date
      }
      return query_param
    },
    // 当天是否落在生效区间内（闭区间），仅用于表格状态展示
    isInEffect(row) {
      if (!row.start_date || !row.end_date) {
        return false
      }
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
      return row.start_date <= today && today <= row.end_date
    },
    listAppShowDataSupply() {
      pageListAppShowDataSupply({
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
        channel_id: '',
        customer_id: '',
        app_id: '',
        per_num: 0,
        is_active: 0,
        date_range: [],
        note_info: ''
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
        channel_code: row.channel_code,
        channel_id: row.channel_id,
        customer_id: row.customer_id || '',
        app_id: row.app_id || '',
        per_num: Number(row.per_num) || 0,
        is_active: row.is_active == null ? 0 : Number(row.is_active),
        date_range: (row.start_date && row.end_date) ? [row.start_date, row.end_date] : [],
        note_info: row.note_info || ''
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
    // trim 字符串字段并回写到 form，返回请求 payload
    // 回写是为了让必填校验也基于 trim 后的值，避免纯空格绕过校验
    trimForm() {
      const form = this.form
      form.channel_code = (form.channel_code || '').trim()
      form.channel_id = (form.channel_id || '').trim()
      form.customer_id = (form.customer_id || '').trim()
      form.app_id = (form.app_id || '').trim()
      form.note_info = (form.note_info || '').trim()
      const dateRange = form.date_range || []
      return {
        channel_code: form.channel_code,
        channel_id: form.channel_id,
        customer_id: form.customer_id,
        app_id: form.app_id,
        per_num: Number(form.per_num) || 0,
        is_active: Number(form.is_active),
        start_date: dateRange[0] || undefined,
        end_date: dateRange[1] || undefined,
        note_info: form.note_info
      }
    },
    handleSubmit() {
      const payload = this.trimForm()
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return false
        }
        this.submitLoading = true
        if (this.isEdit) {
          updateAppShowDataSupply({id: this.form.id, ...payload}).then(() => {
            this.$message.success('保存成功')
            this.closeDialog()
            this.listAppShowDataSupply()
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          addAppShowDataSupply(payload).then(() => {
            this.$message.success('添加成功')
            this.closeDialog()
            this.pageNum = 1
            this.listAppShowDataSupply()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    handleRemove(row) {
      removeAppShowDataSupply(row.id).then(() => {
        this.$message.success('删除成功')
        this.pageNum = 1
        this.listAppShowDataSupply()
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

.adv-link-search {
  width: 320px;
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
    white-space: nowrap;
    overflow: visible;
  }

  // 固定列覆盖在主表格之上，需要不透明背景，否则会透出被挤压的原始单元格
  ::v-deep .el-table__fixed-right {
    background-color: #fff;
  }

  ::v-deep .el-table__fixed-right .cell {
    white-space: nowrap;
  }
}
</style>
