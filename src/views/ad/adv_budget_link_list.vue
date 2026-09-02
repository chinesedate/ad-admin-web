<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">预算链接</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="广告主">
            <el-select
              v-model="filter_channel_code"
              filterable
              clearable
              placeholder="请选择广告主"
              @change="handleFilterChange">
              <el-option
                v-for="item in channel_adv_code_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="搜索">
            <el-input
              class="adv-link-search"
              clearable
              placeholder="应用名称 / 链接标识"
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
                <div
                  v-for="item in scope.row.param_values"
                  :key="item.param_name"
                  class="param-value-item">
                  <span class="param-value-name">{{ item.param_name }}</span>
                  <span class="param-value-text">{{ item.param_value || '—' }}</span>
                </div>
              </div>
              <div v-else class="param-value-empty">暂无解析参数，请配置点击链接并保存</div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" min-width="80" align="center" show-overflow-tooltip/>
          <el-table-column prop="channel_name" label="广告主" min-width="110" show-overflow-tooltip/>
          <el-table-column prop="os_type" label="系统" min-width="80" align="center">
            <template #default="scope">
              {{ formatOsType(scope.row.os_type) }}
            </template>
          </el-table-column>
          <el-table-column prop="app_name" label="应用名称" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="pkg_name" label="包名" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="link_code" label="链接标识" min-width="110" show-overflow-tooltip/>
          <el-table-column prop="create_time" label="添加时间" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="update_time" label="修改时间" min-width="150" show-overflow-tooltip/>
          <el-table-column label="操作" min-width="160" align="center" class-name="adv-media-op-col">
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
            :total="total"/>
        </div>
      </div>
    </div>

    <el-dialog
      :title="isEdit ? '编辑预算链接' : '添加预算链接'"
      :visible.sync="dialogVisible"
      width="820px"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="广告主：" prop="channel_code">
          <el-select
            v-model="form.channel_code"
            filterable
            :disabled="isEdit"
            placeholder="请选择广告主"
            @change="handleChannelChange">
            <el-option
              v-for="item in channel_adv_code_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="系统类型：" prop="os_type">
          <el-radio-group v-model="form.os_type" :disabled="isEdit">
            <el-radio :label="1">安卓</el-radio>
            <el-radio :label="2">IOS</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用名称：" prop="app_name">
          <el-input v-model="form.app_name" maxlength="100" placeholder="请输入应用名称"/>
        </el-form-item>
        <el-form-item label="应用包名：" :required="form.os_type === 1" prop="pkg_name">
          <el-input v-model="form.pkg_name" maxlength="100" placeholder="请输入应用包名"/>
        </el-form-item>
        <el-form-item label="链接标识：" prop="link_code">
          <el-input v-model="form.link_code" maxlength="500" placeholder="选填"/>
        </el-form-item>
        <el-form-item label="下载链接：" prop="download_link">
          <el-input v-model="form.download_link" maxlength="2000" placeholder="选填"/>
        </el-form-item>
        <el-form-item label="点击链接：" prop="click_link">
          <el-input
            v-model="form.click_link"
            maxlength="4000"
            type="textarea"
            :rows="2"
            placeholder="保存后将按预算媒体中配置的链接参数校验并解析"/>
        </el-form-item>
        <el-form-item label="曝光链接：" prop="show_link">
          <el-input v-model="form.show_link" maxlength="4000" type="textarea" :rows="2" placeholder="选填"/>
        </el-form-item>
        <el-form-item label="备注：" prop="extra_info">
          <el-input v-model="form.extra_info" type="textarea" :rows="2" maxlength="2000" placeholder="选填"/>
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
        <el-form-item v-if="form.param_values.length" label="已解析：">
          <div class="parsed-param-list">
            <div v-for="item in form.param_values" :key="item.param_name" class="parsed-param-item">
              {{ item.param_name }} = {{ item.param_value }}
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addAdvLink,
    fetchAdvLinkParam,
    getAdvLink,
    pageListAdvMedia,
    pageListAdLink,
    removeAdvLink,
    updateAdvLink
  } from '@/api/ad-data'

  export default {
    name: 'adv_budget_link_list',
    data() {
      const validatePkgName = (rule, value, callback) => {
        if (this.form.os_type === 1 && !(value || '').trim()) {
          callback(new Error('请输入应用包名'))
          return
        }
        callback()
      }
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        search_keyword: '',
        filter_channel_code: '',
        tableData: [],
        channel_adv_code_list: [],
        linkParamHint: [],
        dialogVisible: false,
        isEdit: false,
        submitLoading: false,
        form: {
          id: null,
          channel_code: '',
          os_type: 1,
          app_name: '',
          pkg_name: '',
          link_code: '',
          download_link: '',
          click_link: '',
          show_link: '',
          extra_info: '',
          param_values: []
        },
        rules: {
          channel_code: [{required: true, message: '请选择广告主', trigger: 'change'}],
          os_type: [{required: true, message: '请选择系统类型', trigger: 'change'}],
          app_name: [{required: true, message: '请输入应用名称', trigger: 'blur'}],
          pkg_name: [{validator: validatePkgName, trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this.loadAdvertiserChannels()
      this.listBudgetLinks()
    },
    watch: {
      'form.os_type'() {
        this.$nextTick(() => {
          if (this.$refs.formRef) {
            this.$refs.formRef.clearValidate('pkg_name')
          }
        })
      }
    },
    methods: {
      formatOsType(value) {
        if (Number(value) === 1) {
          return '安卓'
        }
        if (Number(value) === 2) {
          return 'IOS'
        }
        return value
      },
      handleFilterChange() {
        this.pageNum = 1
        this.listBudgetLinks()
      },
      handlePageChange(page) {
        this.pageNum = page
        this.listBudgetLinks()
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.pageNum = 1
        this.listBudgetLinks()
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
      listBudgetLinks() {
        pageListAdLink({
          page_num: this.pageNum,
          page_size: this.pageSize,
          query_param: {
            channel_code: this.filter_channel_code,
            keyword: this.search_keyword
          }
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
          os_type: 1,
          app_name: '',
          pkg_name: '',
          link_code: '',
          download_link: '',
          click_link: '',
          show_link: '',
          extra_info: '',
          param_values: []
        }
        this.linkParamHint = []
      },
      loadLinkParamHint(channelCode) {
        if (!channelCode) {
          this.linkParamHint = []
          return
        }
        fetchAdvLinkParam(channelCode).then(res => {
          const data = res.data.data
          this.linkParamHint = (data && data.params) ? data.params.filter(item => Number(item.is_active) === 0) : []
        }).catch(() => {
          this.linkParamHint = []
        })
      },
      handleChannelChange(channelCode) {
        this.loadLinkParamHint(channelCode)
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
        getAdvLink(row.id).then(res => {
          const data = res.data.data || {}
          this.form = {
            id: data.id,
            channel_code: data.channel_code,
            os_type: Number(data.os_type),
            app_name: data.app_name || '',
            pkg_name: data.pkg_name || '',
            link_code: data.link_code || '',
            download_link: data.download_link || '',
            click_link: data.click_link || '',
            show_link: data.show_link || '',
            extra_info: data.extra_info || '',
            param_values: data.param_values || []
          }
          this.loadLinkParamHint(data.channel_code)
          this.dialogVisible = true
          this.$nextTick(() => {
            if (this.$refs.formRef) {
              this.$refs.formRef.clearValidate()
            }
          })
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
      buildSubmitPayload() {
        return {
          id: this.form.id,
          channel_code: this.form.channel_code,
          os_type: this.form.os_type,
          app_name: this.form.app_name.trim(),
          pkg_name: this.form.pkg_name.trim(),
          link_code: this.form.link_code.trim(),
          download_link: this.form.download_link.trim(),
          click_link: this.form.click_link.trim(),
          show_link: this.form.show_link.trim(),
          extra_info: this.form.extra_info.trim()
        }
      },
      handleSubmit() {
        this.$refs.formRef.validate(valid => {
          if (!valid) {
            return false
          }
          this.submitLoading = true
          const payload = this.buildSubmitPayload()
          const request = this.isEdit ? updateAdvLink(payload) : addAdvLink(payload)
          request.then(() => {
            this.$message.success('保存成功')
            this.closeDialog()
            if (!this.isEdit) {
              this.pageNum = 1
            }
            this.listBudgetLinks()
          }).finally(() => {
            this.submitLoading = false
          })
        })
      },
      handleRemove(row) {
        removeAdvLink(row.id).then(() => {
          this.$message.success('删除成功')
          this.pageNum = 1
          this.listBudgetLinks()
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

  .adv-link-search {
    width: 280px;
  }

  .adv-link-operate-button {
    margin-right: 6px;
  }

  .adv-media-table {
    ::v-deep .adv-media-op-col .cell {
      white-space: normal;
      overflow: visible;
    }
  }

  .param-value-panel {
    padding: 8px 16px;
  }

  .param-value-item {
    line-height: 28px;
  }

  .param-value-name {
    display: inline-block;
    width: 120px;
    color: #606266;
  }

  .param-value-empty {
    padding: 8px 16px;
    color: #909399;
  }

  .link-param-hint {
    line-height: 28px;
  }

  .link-param-tag {
    margin-right: 8px;
    margin-bottom: 4px;
  }

  .parsed-param-list {
    line-height: 24px;
    color: #606266;
  }
</style>
