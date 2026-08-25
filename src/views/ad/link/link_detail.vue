<template>
  <div class="audit-tool-wrapper">
    <el-page-header @back="goBackAdvList" content="链接详情">
    </el-page-header>
    <div class="adv-link-wrapper">
      <el-collapse @change="handleCollapseChange">
        <el-collapse-item>
          <template #title>
            <div class="adv-link-info-header">广告主链接信息</div>
            <div class="adv-link-info-header-tip">
              <span v-if="collapseClose">（点击展开完整信息）</span>
              <span v-else>（点击收起完整信息）</span>
            </div>
            <div v-if="collapseClose" class="adv-link-info-header-tip">
              <span class="adv-link-info-header-content"
                    v-if="advLinkInfo.channel_name">渠道：{{advLinkInfo.channel_name}}</span>
              <span class="adv-link-info-header-content"
                    v-if="advLinkInfo.os_type_str">系统类型：{{advLinkInfo.os_type_str}}</span>
              <span class="adv-link-info-header-content"
                    v-if="advLinkInfo.app_name">应用名称：{{advLinkInfo.app_name}}</span>
              <span class="adv-link-info-header-content"
                    v-if="advLinkInfo.pkg_name">应用名称：{{advLinkInfo.pkg_name}}</span>
              <span class="adv-link-info-header-content"
                    v-if="advLinkInfo.link_code">链接标识：{{advLinkInfo.link_code}}</span>
            </div>
          </template>
          <!--显示模式-->
          <el-form v-show="advLinkFormShow" :model="advLinkInfo" label-width="100px">
            <!-- 一行显示4个表单项 -->
            <el-row :gutter="20" class="adv-link-top-item-wrapper">
              <el-col :span="4">
                <el-form-item label="渠道：">
                  <span>{{advLinkInfo.channel_name || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="系统类型：">
                  <span>{{advLinkInfo.os_type_str || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="应用名称：">
                  <span>{{advLinkInfo.app_name || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="应用包名：">
                  <span>{{advLinkInfo.pkg_name || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="链接标识：">
                  <span>{{advLinkInfo.link_code || '-'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="adv-link-form-item" label="下载链接：">
              <span class="ellipsis-link">{{advLinkInfo.download_link || '-'}}</span>
            </el-form-item>
            <el-form-item class="adv-link-form-item" label="点击链接：">
              <span>{{advLinkInfo.click_link || '-'}}</span>
            </el-form-item>
            <el-form-item class="adv-link-form-item" label="曝光链接：">
              <span>{{advLinkInfo.show_link || '-'}}</span>
            </el-form-item>
            <el-form-item class="adv-link-form-item" label="备注信息：">
              <span>{{advLinkInfo.extra_info || '-'}}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAdvLinkFormEditClick">编辑</el-button>
            </el-form-item>
          </el-form>
          <!--编辑模式-->
          <el-form v-show="!advLinkFormShow" ref="formRef" :model="link_form" :rules="rules" label-width="100px">
            <!-- 一行显示4个表单项 -->
            <el-row :gutter="20" class="adv-link-top-item-wrapper">
              <el-col :span="4">
                <el-form-item label="渠道：">
                  <span>{{advLinkInfo.channel_name || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="系统类型：">
                  <span>{{advLinkInfo.os_type_str || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="应用名称：" prop="app_name">
                  <el-input class="adv-link-item" v-model="link_form.app_name" placeholder="请输入应用名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="应用包名：" prop="pkg_name">
                  <el-input class="adv-link-item" v-model="link_form.pkg_name" placeholder="请输入应用包名"/>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="链接标识：" prop="link_code">
                  <el-input class="adv-link-item" v-model="link_form.link_code" placeholder="请输入链接标识"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="下载链接：" prop="download_link">
              <el-input v-model="link_form.download_link" maxlength="2000" show-word-limit
                        placeholder="请输入下载链接"/>
            </el-form-item>
            <el-form-item label="点击链接：" prop="click_link">
              <el-input v-model="link_form.click_link" maxlength="4000" show-word-limit
                        placeholder="请输入点击监测链接"/>
            </el-form-item>
            <el-form-item label="曝光链接：" prop="show_link">
              <el-input v-model="link_form.show_link" maxlength="4000" show-word-limit
                        placeholder="请输入曝光监测链接"/>
            </el-form-item>
            <el-form-item label="备注信息：" prop="extra_info">
              <el-input
                v-model="link_form.extra_info"
                type="textarea"
                :rows="3"
                maxlength="2000"
                show-word-limit
                placeholder="请输入备注信息"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="handleAdvLinkFormEditCancel" plain>取消</el-button>
              <el-button type="primary" @click="handleModifyAdvLink">保存</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="audit-tool-list-content">
      <div class="audit-tool-list">
        <div class="audit-tool-list-header">媒体链接列表</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="渠道名称">
            <el-select
              v-model="filter_media_code_value"
              filterable
              clearable
              @change="handleMediaLinkQuery"
              placeholder="请选择">
              <el-option
                v-for="item in channel_media_code_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pick-form-item" label="搜索">
            <el-input
              class="adv-link-search"
              clearable
              placeholder="请输入内容"
              @input="handleMediaLinkQuery"
              @change="handleMediaLinkQuery"
              prefix-icon="el-icon-search"
              v-model="search_keyword">
            </el-input>
          </el-form-item>
          <el-form-item class="pick-form-item">
            <el-button type="primary" @click="activeMediaLinkAdd">添加链接</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          ref="adDataTable"
          row-key="id"
          :expand-row-keys="expandRowKeys"
          @expand-change="handleExpandChange"
          @cell-click="handleCellClick"
          stripe
          style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <div class="expand-container">
                <!-- 复制全部按钮 -->
                <div class="expand-header">
                  <span class="expand-title">详细信息</span>
                  <el-button
                    type="primary"
                    size="small"
                    @click="copyAllExpandContent(props.row)"
                    :loading="copyAllLoading"
                  >复制信息
                  </el-button>
                </div>
                <el-form label-position="left" class="media-table-expand">
                  <el-form-item label="应用名称：">
                    <span class="selectable-text">{{advLinkInfo.app_name || '-'}}</span>
                  </el-form-item>
                  <el-form-item label="系统类型：">
                    <span class="selectable-text">{{advLinkInfo.os_type_str || '-'}}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.param_values && props.row.param_values.length" label="链接参数：">
                    <div class="param-value-panel">
                      <div
                        v-for="item in props.row.param_values"
                        :key="item.param_name"
                        class="param-value-item">
                        <span class="param-value-name">{{ item.param_name }}</span>
                        <span class="param-value-text">{{ item.param_value || '—' }}</span>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="备注信息：">
                    <span class="selectable-text">{{props.row.extra_info || '-'}}</span>
                  </el-form-item>
                  <el-form-item label="下载链接：">
                    <span class="selectable-text">{{advLinkInfo.download_link || '-'}}</span>
                  </el-form-item>
                  <el-form-item label="点击监测：">
                    <span class="selectable-text">{{props.row.click_link || '-'}}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.show_link" label="曝光监测：">
                    <span class="selectable-text">{{props.row.show_link || '-'}}</span>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="链接id"
            width="180">
          </el-table-column>
          <el-table-column
            prop="channel_name"
            label="渠道名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="channel_id"
            label="渠道ID">
          </el-table-column>
          <el-table-column
            prop="customer_id"
            label="客户ID">
          </el-table-column>
          <el-table-column
            prop="app_id"
            label="应用ID">
          </el-table-column>
          <el-table-column
            prop="conversion_rate_label"
            label="回调信息">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="添加时间">
          </el-table-column>
          <el-table-column
            prop="update_time"
            label="修改时间">
          </el-table-column>
          <el-table-column
            label="操作">
            <template #default="scope">
              <el-button
                class="media-link-operate-button"
                :type="isRowExpanded(scope.row) ? 'info' : 'primary'"
                size="mini"
                @click="toggleExpand(scope.row)">
                {{isRowExpanded(scope.row) ? '收起' : '详情'}}
              </el-button>
              <el-button class="media-link-operate-button" type="primary" size="mini"
                         @click="activeMediaLinkModify(scope.row)">
                编辑
              </el-button>
              <el-popconfirm title="确定删除吗？" class="media-link-operate-button"
                             @confirm="handleMediaLinkRemove(scope.row)">
                <template #reference>
                  <el-button type="danger" size="mini">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page="pageNum"
                         :page-size="pageSize"
                         @current-change="handlePageChange"
                         layout="prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加链接弹框 -->
    <el-dialog
      title="媒体链接"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      @close="closeMediaLinkAdd"
    >
      <el-form
        ref="mediaFormRef"
        :model="media_link_form"
        :rules="media_rules"
        label-width="100px"
      >
        <el-form-item label="渠道：" prop="channel_code">
          <el-select
            v-model="media_link_form.channel_code"
            filterable
            placeholder="请选择"
            @change="handleMediaChannelChange">
            <el-option
              v-for="item in channel_media_code_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="mediaLinkParamHint.length" label="参数字典：">
          <div class="link-param-hint">
            <el-tag
              v-for="item in mediaLinkParamHint"
              :key="item.param_name"
              size="small"
              class="link-param-tag"
              :type="Number(item.param_required) === 0 ? 'danger' : 'info'">
              {{ item.param_name }}{{ Number(item.param_required) === 0 ? '（必填）' : '' }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item
          v-for="item in mediaLinkParamFields"
          :key="'add-' + item.param_name"
          :label="item.param_name + '：'"
          :required="Number(item.param_required) === 0">
          <el-input
            v-model="item.param_value"
            maxlength="500"
            :placeholder="mediaParamInputPlaceholder(item.param_name)"/>
        </el-form-item>
        <el-form-item label="回调率：" prop="conversion_rate">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <el-input-number
              v-model="media_link_form.conversion_rate"
              :min="0"
              :max="100"
              :precision="0"
              style="width: 180px"
            />
            <span style="color: #909399;">%</span>

            <!-- 使用 tag 作为快捷按钮 -->
            <el-tag
              v-for="item in media_conversion_rate_list"
              :key="item"
              size="small"
              type="primary"
              style="cursor: pointer;"
              @click="media_link_form.conversion_rate = item"
            >
              {{item}}%
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="保底回调" prop="rate_min_limit">
          <el-radio-group v-model="media_link_form.rate_min_limit">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 回调数量输入框：当保底回调开启时显示 -->
        <el-form-item
          v-if="media_link_form.rate_min_limit === true"
          label="保底回调数量"
          prop="rate_min_limit_num">
          <el-input-number
            v-model="media_link_form.rate_min_limit_num"
            :min="1"
            :max="10"
            placeholder="请输入保底回调数量"
          />
        </el-form-item>
        <el-form-item label="备注信息：" prop="extra_info">
          <el-input
            v-model="media_link_form.extra_info"
            type="textarea"
            :rows="3"
            maxlength="2000"
            show-word-limit
            placeholder="请输入应用描述"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleMediaLinkAdd">
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- 编辑链接弹框 -->
    <el-dialog
      title="媒体链接"
      :visible.sync="modifyDialogVisible"
      width="800px"
      :close-on-click-modal="false"
      @close="closeMediaLinkModify"
    >
      <el-form
        ref="mediaFormModifyRef"
        :model="media_link_modify_form"
        :rules="media_modify_rules"
        label-width="100px"
      >
        <el-form-item v-if="mediaLinkModifyParamHint.length" label="参数字典：">
          <div class="link-param-hint">
            <el-tag
              v-for="item in mediaLinkModifyParamHint"
              :key="item.param_name"
              size="small"
              class="link-param-tag"
              :type="Number(item.param_required) === 0 ? 'danger' : 'info'">
              {{ item.param_name }}{{ Number(item.param_required) === 0 ? '（必填）' : '' }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item
          v-for="item in mediaLinkModifyParamFields"
          :key="'edit-' + item.param_name"
          :label="item.param_name + '：'"
          :required="Number(item.param_required) === 0">
          <el-input
            v-model="item.param_value"
            maxlength="500"
            :placeholder="mediaParamInputPlaceholder(item.param_name)"/>
        </el-form-item>
        <el-form-item label="回调率：" prop="conversion_rate">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <el-input-number
              v-model="media_link_modify_form.conversion_rate"
              :min="0"
              :max="100"
              :precision="0"
              style="width: 180px"
            />
            <span style="color: #909399;">%</span>

            <!-- 使用 tag 作为快捷按钮 -->
            <el-tag
              v-for="item in media_conversion_rate_list"
              :key="item"
              size="small"
              type="primary"
              style="cursor: pointer;"
              @click="media_link_modify_form.conversion_rate = item"
            >
              {{item}}%
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="保底回调"  prop="rate_min_limit">
          <el-radio-group v-model="media_link_modify_form.rate_min_limit">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 回调数量输入框：当保底回调开启时显示 -->
        <el-form-item
          v-if="media_link_modify_form.rate_min_limit === true"
          label="保底回调数量"
          prop="rate_min_limit_num">
          <el-input-number
            v-model="media_link_modify_form.rate_min_limit_num"
            :min="1"
            :max="10"
            placeholder="请输入保底回调数量"
          />
        </el-form-item>
        <el-form-item label="备注信息：" prop="extra_info">
          <el-input
            v-model="media_link_modify_form.extra_info"
            type="textarea"
            :rows="3"
            maxlength="2000"
            show-word-limit
            placeholder="请输入应用描述"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleMediaLinkModify">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addMediaLink,
    fetchAdChannelCodeList,
    fetchMediaLinkParam,
    getAdvLink,
    updateAdvLink,
    pageListMediaLink,
    removeMediaLink, updateMediaLink
  } from "@/api/ad-data";

  const MEDIA_AUTO_PARAM_NAMES = ['channel_id', 'customer_id', 'app_id', 'rz_ch', 'CH']

  export default {
    name: "LinkDetail",
    props: {
      linkId: Number
    },
    data() {
      // 自定义校验函数
      const validatePkgName = (rule, value, callback) => {
        if (this.advLinkInfo.os_type === 1) {
          // 安卓系统时，包名为必填
          if (!value) {
            callback(new Error('请输入应用包名'))
          } else {
            callback()
          }
        } else {
          // IOS系统时，包名可选
          callback()
        }
      }
      return {
        // 折叠面板展开收起状态
        collapseClose: true,
        advLinkFormShow: true,
        pageNum: 1,
        pageSize: 8,
        total: 0,
        hasNext: false,
        // 媒体链接数据列表
        tableData: [],
        /**
         * 添加链接弹框显示状态
         */
        dialogVisible: false,
        /**
         * 编辑链接弹框显示状态
         */
        modifyDialogVisible: false,
        submitLoading: false,
        // 媒体渠道标识列表
        channel_media_code_list: [],
        // 展开行的keys数组，同时只能展开一行
        expandRowKeys: [],
        /**
         * 广告主链接信息
         */
        advLinkInfo: {
          channel_name: '',
          channel_code: '',
          os_type: 1,
          os_type_str: '',
          app_name: '',
          pkg_name: '',
          link_code: '',
          download_link: '',
          click_link: '',
          show_link: '',
          extra_info: ''
        },
        link_form: {
          app_name: '',
          pkg_name: '',
          link_code: '',
          download_link: '',
          click_link: '',
          show_link: '',
          extra_info: ''
        },
        // 媒体链接列表过滤渠道标识
        filter_media_code_value: '',
        // 媒体链接列表搜索关键词
        search_keyword: '',
        rules: {
          app_name: [
            {required: true, message: '请输入应用名称', trigger: 'blur'}
          ],
          pkg_name: [
            {validator: validatePkgName, trigger: 'blur'}  // 使用自定义校验
          ],
          download_link: [
            {type: 'url', message: '请输入正确的URL地址', trigger: 'blur'},
          ],
          click_link: [
            {type: 'url', message: '请输入正确的URL地址', trigger: 'blur'}
          ],
          show_link: [
            {type: 'url', message: '请输入正确的URL地址', trigger: 'blur'}
          ]
        },
        media_link_form: {
          channel_code: '',
          conversion_rate: 80,
          rate_min_limit: false,
          rate_min_limit_num: 10,
          extra_info: ''
        },
        media_rules: {
          channel_code: [
            {required: true, message: '请输入渠道编码', trigger: 'blur'}
          ],
          conversion_rate: [
            {required: true}
          ]
        },
        media_link_modify_form: {
          id: '',
          conversion_rate: 80,
          rate_min_limit: false,
          rate_min_limit_num: 10,
          extra_info: ''
        },
        media_modify_rules: {
          conversion_rate: [{required: true}],
          rate_min_limit: [{required: true}]
        },
        // // 渠道-应用回调率
        media_conversion_rate_list: [40, 50, 60, 70, 80],
        mediaLinkParamHint: [],
        mediaLinkParamFields: [],
        mediaLinkModifyParamHint: [],
        mediaLinkModifyParamFields: [],
        // 复制按钮loading
        copyAllLoading: false,
      }
    },
    methods: {
      goBackAdvList() {
        // 回到列表页，通过路由参数标记
        this.$router.push({
          path: '/ad_link/list',
          query: {fromDetail: 'true'}
        })
      },
      /**
       * 触发添加媒体链接
       */
      activeMediaLinkAdd() {
        this.mediaLinkParamHint = []
        this.mediaLinkParamFields = []
        this.dialogVisible = true
      },
      closeMediaLinkAdd() {
        this.dialogVisible = false
        this.mediaLinkParamHint = []
        this.mediaLinkParamFields = []
        // 关闭时重置表单
        this.$refs.mediaFormRef.resetFields()
      },
      /**
       * 触发媒体链接编辑弹框
       */
      activeMediaLinkModify(row) {
        this.media_link_modify_form = {
          id: row.id,
          channel_code: row.channel_code,
          conversion_rate: row.conversion_rate,
          rate_min_limit: row.rate_min_limit,
          rate_min_limit_num: row.rate_min_limit_num,
          extra_info: row.extra_info
        }
        this.loadMediaLinkModifyParamFields(row.channel_code, row.param_values || [])
        this.modifyDialogVisible = true;
      },
      closeMediaLinkModify() {
        this.modifyDialogVisible = false;
        this.mediaLinkModifyParamHint = []
        this.mediaLinkModifyParamFields = []
        // 关闭时重置表单
        this.$refs.mediaFormModifyRef.resetFields()
      },
      mediaParamInputPlaceholder(paramName) {
        if (MEDIA_AUTO_PARAM_NAMES.includes(paramName)) {
          return '留空则根据生成的链接自动填充'
        }
        return '请输入参数值'
      },
      buildMediaParamFields(paramList, existingValues) {
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
      loadMediaLinkParamFields(channelCode, existingValues) {
        if (!channelCode) {
          this.mediaLinkParamHint = []
          this.mediaLinkParamFields = []
          return
        }
        fetchMediaLinkParam(channelCode).then(res => {
          const data = res.data.data
          const params = (data && data.params) ? data.params.filter(item => Number(item.is_active) === 0) : []
          this.mediaLinkParamHint = params
          this.mediaLinkParamFields = this.buildMediaParamFields(params, existingValues)
        }).catch(() => {
          this.mediaLinkParamHint = []
          this.mediaLinkParamFields = []
        })
      },
      loadMediaLinkModifyParamFields(channelCode, existingValues) {
        if (!channelCode) {
          this.mediaLinkModifyParamHint = []
          this.mediaLinkModifyParamFields = []
          return
        }
        fetchMediaLinkParam(channelCode).then(res => {
          const data = res.data.data
          const params = (data && data.params) ? data.params.filter(item => Number(item.is_active) === 0) : []
          this.mediaLinkModifyParamHint = params
          this.mediaLinkModifyParamFields = this.buildMediaParamFields(params, existingValues)
        }).catch(() => {
          this.mediaLinkModifyParamHint = []
          this.mediaLinkModifyParamFields = []
        })
      },
      handleMediaChannelChange(channelCode) {
        this.loadMediaLinkParamFields(channelCode, [])
      },
      buildMediaLinkParamValues(paramFields) {
        return (paramFields || [])
          .map(item => ({
            param_name: (item.param_name || '').trim(),
            param_value: (item.param_value || '').trim()
          }))
          .filter(item => item.param_name && item.param_value)
      },
      /**
       * 折叠面板展开或收起触发
       */
      handleCollapseChange() {
        this.collapseClose = !this.collapseClose;
      },
      /**
       * 触发广告主链接进入编辑状态
       */
      handleAdvLinkFormEditClick() {
        // 将展示对象中的数据复制都form表单中
        this.link_form.app_name = this.advLinkInfo.app_name;
        this.link_form.pkg_name = this.advLinkInfo.pkg_name;
        this.link_form.link_code = this.advLinkInfo.link_code;
        this.link_form.download_link = this.advLinkInfo.download_link;
        this.link_form.click_link = this.advLinkInfo.click_link;
        this.link_form.show_link = this.advLinkInfo.show_link;
        this.link_form.extra_info = this.advLinkInfo.extra_info;
        this.advLinkFormShow = false;
      },
      /**
       * 广告主链接取消编辑状态
       */
      handleAdvLinkFormEditCancel() {
        // 关闭时重置表单
        this.$refs.formRef.resetFields();
        this.advLinkFormShow = true;
      },
      /**
       * 查询广告主链接信息
       */
      queryAdvLink() {
        getAdvLink(this.linkId).then(res => {
          if (res.data.data != null) {
            this.advLinkInfo = res.data.data;
            const os_type = this.advLinkInfo.os_type;
            if (os_type === 1) {
              this.advLinkInfo.os_type_str = "安卓"
            } else if (os_type === 2) {
              this.advLinkInfo.os_type_str = "IOS"
            }
            // 查询当前广告主关联的媒体
            this.listAdChannelMediaCode();
          }
        });
      },
      /**
       * 编辑广告主链接信息
       */
      handleModifyAdvLink() {
        // 先触发表单校验
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            // 使用 link_form 中的数据更新
            updateAdvLink({
              id: this.linkId,
              channel_code: this.advLinkInfo.channel_code,
              os_type: this.advLinkInfo.os_type,
              app_name: this.link_form.app_name,
              pkg_name: this.link_form.pkg_name,
              link_code: this.link_form.link_code,
              download_link: this.link_form.download_link,
              click_link: this.link_form.click_link,
              show_link: this.link_form.show_link,
              extra_info: this.link_form.extra_info
            }).then(() => {
              // 可选：显示成功提示
              this.$message.success('更新成功');
              // 将form表单中的数据回写到展示对象中
              this.advLinkInfo.app_name = this.link_form.app_name;
              this.advLinkInfo.pkg_name = this.link_form.pkg_name;
              this.advLinkInfo.link_code = this.link_form.link_code;
              this.advLinkInfo.download_link = this.link_form.download_link;
              this.advLinkInfo.click_link = this.link_form.click_link;
              this.advLinkInfo.show_link = this.link_form.show_link;
              this.advLinkInfo.extra_info = this.link_form.extra_info;
              this.advLinkFormShow = true;
            });
          } else {
            // 校验失败，提示用户
            // this.$message.warning('请填写完整且正确的信息');
            return false;
          }
        });
      },
      /**
       * 添加媒体链接
       */
      handleMediaLinkAdd() {
        this.$refs.mediaFormRef.validate(valid => {
          if (!valid) {
            return false
          }
          const adv_link_info = {
            adv_link_id: this.linkId,
            channel_code: this.media_link_form.channel_code,
            conversion_rate: this.media_link_form.conversion_rate,
            rate_min_limit: this.media_link_form.rate_min_limit,
            rate_min_limit_num: this.media_link_form.rate_min_limit_num,
            extra_info: this.media_link_form.extra_info,
            param_values: this.buildMediaLinkParamValues(this.mediaLinkParamFields)
          }
          this.submitLoading = true
          addMediaLink(adv_link_info).then(() => {
            this.$message.success('添加成功')
            this.closeMediaLinkAdd();
            this.listAdMediaLink();
          }).catch(err => {
            this.$message.error(err.message || '添加失败')
          }).finally(() => {
            this.submitLoading = false
          })
        })
      },
      /**
       * 编辑媒体链接
       */
      handleMediaLinkModify() {
        this.$refs.mediaFormModifyRef.validate(valid => {
          if (!valid) {
            return false
          }
          const media_link_info = {
            id: this.media_link_modify_form.id,
            conversion_rate: this.media_link_modify_form.conversion_rate,
            rate_min_limit: this.media_link_modify_form.rate_min_limit,
            rate_min_limit_num: this.media_link_modify_form.rate_min_limit_num,
            extra_info: this.media_link_modify_form.extra_info,
            param_values: this.buildMediaLinkParamValues(this.mediaLinkModifyParamFields)
          }
          this.submitLoading = true
          updateMediaLink(media_link_info).then(() => {
            this.$message.success('更新成功')
            this.listAdMediaLink();
            this.closeMediaLinkModify();
          }).catch(err => {
            this.$message.error(err.message || '更新失败')
          }).finally(() => {
            this.submitLoading = false
          })
        })
      },
      handlePageChange(page) {
        // 确保 pageNum 被正确设置
        this.pageNum = page
        this.listAdMediaLink();
      },
      /**
       * 查询媒体链接列表
       */
      handleMediaLinkQuery() {
        // 触发查询
        this.pageNum = 1;
        this.listAdMediaLink();
      },
      /**
       * 判断当前行是否展开
       * @param {Object} row 当前行数据
       * @returns {Boolean} 是否展开
       */
      isRowExpanded(row) {
        return this.expandRowKeys.includes(row.id);
      },
      /**
       * 处理单元格点击事件 - 点击非操作列的行首展开按钮区域时触发
       */
      handleCellClick(row, column) {
        // 检查点击的是否是展开按钮所在单元格（第一列）
        const isExpandColumn = column.type === 'expand';
        if (isExpandColumn) {
          this.toggleExpand(row);
        }
      },
      /**
       * 切换行的展开/收起状态
       * @param {Object} row 当前行数据
       */
      toggleExpand(row) {
        const rowKey = row.id;
        const index = this.expandRowKeys.indexOf(rowKey);

        if (index > -1) {
          // 如果已经展开，则收起
          this.expandRowKeys = [];
        } else {
          // 如果未展开，则展开当前行并收起其他行
          this.expandRowKeys = [rowKey];
        }
      },
      /**
       * 处理表格展开/收起事件
       * @param {*} row 当前行数据
       * @param {Array} expandedRows 展开的行数组
       */
      handleExpandChange(row, expandedRows) {
        const rowKey = row.id;

        if (expandedRows.length > 0) {
          // 展开时，只保留当前展开的行
          this.expandRowKeys = [rowKey];
        } else {
          // 收起时，清空展开的行
          this.expandRowKeys = [];
        }
      },
      /**
       * 删除链接
       */
      handleMediaLinkRemove(row) {
        const media_link_id = row.id;
        // 删除广告主链接
        removeMediaLink(media_link_id).then(() => {
          this.pageNum = 1;
          // 删除成功后，刷新数据列表
          this.listAdMediaLink();
        })
      },
      /**
       * 查询媒体链接列表
       */
      listAdMediaLink() {
        let ad_link_query_param = {
          adv_link_id: this.linkId,
          channel_code: this.filter_media_code_value,
          keyword: this.search_keyword
        }
        pageListMediaLink({
            page_num: this.pageNum,
            page_size: this.pageSize,
            query_param: ad_link_query_param
          }
        ).then(res => {
            if (res.data.data != null) {
              this.tableData = res.data.data.list;
              for (const media_link of this.tableData) {
                const conversion_rate = media_link.conversion_rate;
                const rate_min_limit = media_link.rate_min_limit;
                const rate_min_limit_num = media_link.rate_min_limit_num;
                if (rate_min_limit) {
                  media_link.conversion_rate_label = conversion_rate + '% 开启 ' + rate_min_limit_num
                } else {
                  media_link.conversion_rate_label = conversion_rate + '% 关闭 '
                }
              }
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
              // 刷新数据后，清空展开的行（避免数据错位）
              this.expandRowKeys = [];
            }
          }
        );
      },
      /**
       * 查询广告主链接关联的媒体渠道标识
       */
      listAdChannelMediaCode() {
        // 查询广告渠道标识筛选信息
        fetchAdChannelCodeList({
          up_down_type: 0, //  渠道上下游类型 0 （媒体）  1 （广告主）
          channel_adv_code: this.advLinkInfo.channel_code
        }).then(res => {
            if (res.data.data != null) {
              let channel_code_list = res.data.data;
              for (const channel_code_info of channel_code_list) {
                const channel_name = channel_code_info.channel_name;
                const channel_code = channel_code_info.channel_code;
                this.channel_media_code_list.push({value: channel_code, label: channel_name});
              }
            }
          }
        );
      }, /**
       * 复制展开行的全部内容
       * @param {Object} row 当前行数据
       */
      async copyAllExpandContent(row) {
        this.copyAllLoading = true;

        try {
          // 收集所有需要复制的字段
          const copyData = [
            {label: '应用名称', value: this.advLinkInfo.app_name || '-'},
            {label: '系统类型', value: this.advLinkInfo.os_type_str || '-'},
            {label: '备注信息', value: row.extra_info || '-'},
            {label: '下载链接', value: this.advLinkInfo.download_link || '-'},
            {label: '点击监测', value: row.click_link || '-'}
          ];
          if (row.show_link) {
            copyData.push({label: '曝光监测', value: row.show_link || '-'})
          }

          // 格式化为文本
          const formattedText = copyData.map(item => `${item.label}：${item.value}`).join('\n');

          // 复制到剪贴板
          await this.copyToClipboard(formattedText);
          this.$message.success('复制成功');
        } catch (error) {
          console.error('复制失败:', error);
          this.$message.error('复制失败，请重试');
        } finally {
          this.copyAllLoading = false;
        }
      },

      /**
       * 复制文本到剪贴板
       * @param {string} text 要复制的文本
       * @returns {Promise}
       */
      copyToClipboard(text) {
        return new Promise((resolve, reject) => {
          if (!text) {
            reject(new Error('没有可复制的内容'));
            return;
          }

          // 使用现代 Clipboard API
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(resolve).catch(reject);
          } else {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '-9999px';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();

            try {
              const success = document.execCommand('copy');
              if (success) {
                resolve();
              } else {
                reject(new Error('复制失败'));
              }
            } catch (err) {
              reject(err);
            } finally {
              document.body.removeChild(textarea);
            }
          }
        });
      }
    },
    created() {
      this.queryAdvLink();
      this.listAdMediaLink();
    }
  }
</script>

<style lang="scss" scoped>

  .audit-tool-wrapper {
  }

  .adv-link-wrapper {
    padding-top: 40px;

    .adv-link-top-item-wrapper {
      margin-bottom: 20px;
    }

    .el-form-item {
      margin-right: 0;
      margin-bottom: 10px;
      width: 100%;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .ellipsis-link {
    display: inline-block;
    width: 90%;
    word-wrap: break-word; /* 允许长单词换行 */
    word-break: break-all; /* 允许在任意字符间换行 */
    white-space: normal; /* 允许换行（关键：不是 nowrap） */
    line-height: 1.5; /* 行高 */
  }

  .audit-tool-list-content {
    padding-top: 20px;
  }

  //.audit-tool-list {
  //  min-width: 584px;
  //  max-width: 1300px;
  //}

  .adv-link-info-header {
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding: 20px 0;
  }

  .adv-link-info-header-tip {
    margin-left: 10px;
  }

  .adv-link-info-header-content {
    margin-left: 30px;
  }

  .audit-tool-list-header {
    font-weight: 600;
    //font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }


  .pick-form-inline {
    padding: 0 10px;
  }

  .pick-form-item {
    padding-right: 30px;
  }

  .audit-tool-info-button {
    padding-top: 10px;
  }

  .page-wrapper {
    //position: absolute;
    //bottom: 0;
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .media-link-operate-button {
    margin-left: 10px;

    &:first-child {
      margin-left: 0;
    }
  }

  .expand-container {
    padding: 16px;
    background-color: #fafafa;
    border-radius: 4px;
  }

  .expand-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;
    text-align: left; // 确保左对齐
  }

  .expand-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-right: 20px;
  }

  .media-table-expand {
    font-size: 0;

    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;

      &:last-child {
        margin-bottom: 0;
      }
    }

    label {
      width: 90px;
      color: #606266;
      font-weight: normal;
      user-select: text;
    }

    .selectable-text {
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      word-break: break-all;
      line-height: 1.5;
      color: #606266;
      display: inline-block;
    }
  }

  .param-value-panel {
    padding: 4px 0;
  }

  .param-value-item {
    line-height: 28px;
  }

  .param-value-name {
    display: inline-block;
    width: 120px;
    color: #606266;
  }

  .param-value-text {
    color: #303133;
  }

  .link-param-hint {
    line-height: 28px;
  }

  .link-param-tag {
    margin-right: 8px;
    margin-bottom: 4px;
  }
</style>