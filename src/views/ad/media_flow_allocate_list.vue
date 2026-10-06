<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">流量分配</div>
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
            ref="mediaFlowAllocateTable"
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
          <el-table-column prop="ration_numerator" label="点击转曝光" min-width="120" align="center">
            <template #default="scope">
              {{ scope.row.ration_numerator }}/{{ scope.row.ration_denominator }}
            </template>
          </el-table-column>
          <el-table-column prop="flow_allocate_num" label="流量分配数量" min-width="110" align="center"
                           show-overflow-tooltip/>
          <el-table-column prop="today_click_count" label="今日点击数" min-width="110" align="center">
            <template #default="scope">
              {{ Number(scope.row.today_click_count) || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="flow_allocate_order" label="流量分配顺序" min-width="110" align="center"
                           show-overflow-tooltip/>
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
        :title="isEdit ? '编辑流量分配' : '添加流量分配'"
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
        <el-form-item label="点击转曝光：" class="ration-form-item">
          <div class="ration-row">
            <el-form-item prop="ration_numerator" class="ration-sub-item">
              <el-input-number
                  v-model="form.ration_numerator"
                  :min="1"
                  :precision="0"
                  style="width: 140px"
                  @change="handleRationChange"/>
            </el-form-item>
            <span class="ration-separator">/</span>
            <el-form-item prop="ration_denominator" class="ration-sub-item">
              <el-input-number
                  v-model="form.ration_denominator"
                  :min="1"
                  :precision="0"
                  style="width: 140px"
                  @change="handleRationChange"/>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="流量分配数量：" prop="flow_allocate_num">
          <el-input-number v-model="form.flow_allocate_num" :min="0" :precision="0" style="width: 180px"/>
        </el-form-item>
        <el-form-item label="流量分配顺序：" prop="flow_allocate_order">
          <el-input-number v-model="form.flow_allocate_order" :precision="0" style="width: 180px"/>
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
  addMediaFlowAllocate,
  pageListMediaFlowAllocate,
  removeMediaFlowAllocate,
  updateMediaFlowAllocate
} from '@/api/ad-data'

export default {
  name: 'media_flow_allocate_list',
  data() {
    // 点击转曝光：分子分母均不能为 0，且分子不能大于分母
    // 按字段生成校验器，保证提示落在对应输入框上
    const buildRationValidator = field => (rule, value, callback) => {
      const numerator = Number(this.form.ration_numerator)
      const denominator = Number(this.form.ration_denominator)
      if (field === 'numerator' && !numerator) {
        return callback(new Error('分子不能为0'))
      }
      if (field === 'denominator' && !denominator) {
        return callback(new Error('分母不能为0'))
      }
      if (numerator && denominator && numerator > denominator) {
        return callback(new Error('分子必须小于或等于分母'))
      }
      callback()
    }
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
        ration_numerator: 1,
        ration_denominator: 1,
        flow_allocate_num: 0,
        flow_allocate_order: 0,
        is_active: 0,
        date_range: [],
        note_info: ''
      },
      rules: {
        channel_code: [{required: true, message: '请输入渠道标识', trigger: 'blur'}],
        channel_id: [{required: true, message: '请输入渠道ID', trigger: 'blur'}],
        customer_id: [{required: true, message: '请输入客户ID', trigger: 'blur'}],
        app_id: [{required: true, message: '请输入应用ID', trigger: 'blur'}],
        ration_numerator: [
          {required: true, message: '请输入点击转曝光分子', trigger: 'blur'},
          {validator: buildRationValidator('numerator'), trigger: ['blur', 'change']}
        ],
        ration_denominator: [
          {required: true, message: '请输入点击转曝光分母', trigger: 'blur'},
          {validator: buildRationValidator('denominator'), trigger: ['blur', 'change']}
        ],
        is_active: [{required: true, message: '请选择状态', trigger: 'change'}],
        // daterange 绑定的是数组，必须声明 type: 'array'，否则空数组会被 required 判为已填
        date_range: [{required: true, type: 'array', message: '请选择生效日期', trigger: ['blur', 'change']}]
      }
    }
  },
  mounted() {
    this.listMediaFlowAllocate()
  },
  methods: {
    // 分子/分母任一变化时联动校验，避免一侧已改好另一侧仍留旧提示
    handleRationChange() {
      if (!this.$refs.formRef) {
        return
      }
      this.$refs.formRef.validateField('ration_numerator')
      this.$refs.formRef.validateField('ration_denominator')
    },
    handleFilterChange() {
      this.pageNum = 1
      this.listMediaFlowAllocate()
    },
    handlePageChange(page) {
      this.pageNum = page
      this.listMediaFlowAllocate()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.pageNum = 1
      this.listMediaFlowAllocate()
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
    listMediaFlowAllocate() {
      pageListMediaFlowAllocate({
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
        ration_numerator: 1,
        ration_denominator: 1,
        flow_allocate_num: 0,
        flow_allocate_order: 0,
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
        ration_numerator: Number(row.ration_numerator) || 0,
        ration_denominator: Number(row.ration_denominator) || 1,
        flow_allocate_num: Number(row.flow_allocate_num) || 0,
        flow_allocate_order: Number(row.flow_allocate_order) || 0,
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
        ration_numerator: Number(form.ration_numerator) || 0,
        ration_denominator: Number(form.ration_denominator) || 1,
        flow_allocate_num: Number(form.flow_allocate_num) || 0,
        flow_allocate_order: Number(form.flow_allocate_order) || 0,
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
          updateMediaFlowAllocate({id: this.form.id, ...payload}).then(() => {
            this.$message.success('保存成功')
            this.closeDialog()
            this.listMediaFlowAllocate()
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          addMediaFlowAllocate(payload).then(() => {
            this.$message.success('添加成功')
            this.closeDialog()
            this.pageNum = 1
            this.listMediaFlowAllocate()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    handleRemove(row) {
      removeMediaFlowAllocate(row.id).then(() => {
        this.$message.success('删除成功')
        this.pageNum = 1
        this.listMediaFlowAllocate()
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

.ration-row {
  display: flex;
  align-items: flex-start;
}

.ration-sub-item {
  margin-bottom: 0;
}

.ration-separator {
  padding: 0 8px;
  line-height: 40px;
  color: #909399;
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
