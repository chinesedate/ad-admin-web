<template>
  <div class="ad-data-wrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">渠道信息列表</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="渠道名称">
            <el-select
              v-model="channel_code_value"
              filterable
              clearable
              @change="handleAdvLinkQuery"
              placeholder="请选择">
              <el-option
                v-for="item in ad_channel_code_list"
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
              @change="handleAdvLinkQuery"
              prefix-icon="el-icon-search"
              v-model="search_keyword">
            </el-input>
          </el-form-item>
          <el-form-item class="pick-form-item">
            <el-button type="primary" @click="activeAdLinkAdd">添加链接</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          ref="adDataTable"
          row-key="key_id"
          @cell-click="handleCellClick"
          stripe
          style="width: 100%">
          <el-table-column
            prop="channel_name"
            label="渠道名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="os_type"
            label="系统类型">
          </el-table-column>
          <el-table-column
            prop="app_name"
            label="应用名称">
          </el-table-column>
          <el-table-column
            prop="link_code"
            label="链接标识">
          </el-table-column>
          <el-table-column
            label="操作">
            <template #default="scope">
              <el-button
                v-if="!scope.row.editing"
                type="primary"
                size="mini"
                @click="startEdit(scope.row)"
              >编辑
              </el-button>
              <el-button
                v-else
                type="success"
                size="mini"
                @click="saveEdit(scope.row)"
              >保存
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page.sync="pageNum"
                         :page-size="pageSize"
                         @current-change="handlePageChange"
                         @prev-click="handlePageChange"
                         @next-click="handlePageChange"
                         layout="prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加链接弹框 -->
    <el-dialog
      title="广告主链接"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      @close="closeAdLinkAdd"
    >
      <el-form
        ref="formRef"
        :model="link_form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="渠道" prop="channel_code">
          <el-select
            v-model="link_form.channel_code"
            filterable
            placeholder="请选择">
            <el-option
              v-for="item in ad_channel_code_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统类型" prop="os_type">
          <el-radio-group v-model="link_form.os_type">
            <el-radio :label="1">安卓</el-radio>
            <el-radio :label="2">IOS</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用名称" prop="app_name">
          <el-input class="adv-link-item" v-model="link_form.app_name" placeholder="请输入应用名称"/>
        </el-form-item>
        <el-form-item label="链接标识" prop="link_code">
          <el-input class="adv-link-item" v-model="link_form.link_code" placeholder="请输入链接标识"/>
        </el-form-item>
        <el-form-item label="下载链接" prop="download_link">
          <el-input v-model="link_form.download_link" maxlength="2000" show-word-limit placeholder="请输入下载链接"/>
        </el-form-item>
        <el-form-item label="点击链接" prop="click_link">
          <el-input v-model="link_form.click_link" maxlength="4000" show-word-limit placeholder="请输入点击监测链接"/>
        </el-form-item>
        <el-form-item label="曝光链接" prop="show_link">
          <el-input v-model="link_form.show_link" maxlength="4000" show-word-limit placeholder="请输入曝光监测链接"/>
        </el-form-item>
        <el-form-item label="额外信息" prop="extra_info">
          <el-input
            v-model="link_form.extra_info"
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
        <el-button type="primary" :loading="submitLoading" @click="handleAdvLinkAdd">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {saveAdChannelInfo, pageListAdLink, fetchAdChannelCodeList, addAdvLink} from "@/api/ad-data";

  export default {
    name: "ad_data",
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        hasNext: false,
        briefIntroduction: '',
        // 广告渠道标识筛选信息列表
        ad_channel_code_list: [],
        // 广告数据列表
        tableData: [],
        channel_id_options: [],
        customer_id_options: [],
        app_id_options: [],
        // 选中渠道标识值
        channel_code_value: '',
        // 链接列表搜索关键词
        search_keyword: '',

        dialogVisible: false,
        submitLoading: false,
        link_form: {
          channel_code: '',
          os_type: 1,
          app_name: '',
          link_code: '',
          download_link: '',
          click_link: '',
          show_link: '',
          extra_info: ''
        },
        rules: {
          channel_code: [
            {required: true, message: '请输入渠道编码', trigger: 'blur'}
          ],
          os_type: [
            {required: true}
          ],
          app_name: [
            {required: true, message: '请输入应用名称', trigger: 'blur'}
          ],
          download_link: [
            {type: 'url', message: '请输入正确的URL地址', trigger: 'blur'}
          ],
          click_link: [
            {type: 'url', message: '请输入正确的URL地址', trigger: 'blur'}
          ],
          show_link: [
            {type: 'url', message: '请输入正确的URL地址', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      // 'viewer': Viewer
    },
    methods: {
      startEdit(row) {
        // 重置所有行的编辑状态
        this.tableData.forEach(item => {
          item.editing = false
        })
        const index = this.tableData.findIndex(item => item.key_id === row.key_id)
        if (index !== -1) {
          const newRow = JSON.parse(JSON.stringify(this.tableData[index]))
          newRow.editing = true
          this.$set(this.tableData, index, newRow)
        }
        // this.currentEditField = ''
        console.log(this.tableData)
      },
      handleCellClick(row, column) {
        if (row.editing) {
          this.currentEditField = column.property
        }
      },
      saveEdit(row) {
        row.editing = false
        // this.currentEditField = ''
        // 这里可以添加数据保存逻辑
        saveAdChannelInfo({
            channel_id: row.channel_id, customer_id: row.customer_id, app_id: row.app_id, app_name: row.app_name
          }
        ).then(res => {
            console.log('广告渠道信息更新完成:', res)
          }
        );
      },
      handlePageChange() {
        this.listAdData()
      },
      /**
       * 触发广告主链接列表查询
       */
      handleAdvLinkQuery() {
        // 触发查询
        this.pageNum = 1;
        this.listAdLink();
      },
      listAdChannelCode() {
        // 查询广告渠道标识筛选信息
        fetchAdChannelCodeList({
          up_down_type: 1 //  渠道上下游类型 0 （媒体）  1 （广告主）
        }).then(res => {
            if (res.data.data != null) {
              let channel_code_list = res.data.data;
              for (const channel_code_info of channel_code_list) {
                const channel_name = channel_code_info.channel_name;
                const channel_code = channel_code_info.channel_code;
                this.ad_channel_code_list.push({value: channel_code, label: channel_name});
              }
            }
          }
        );
      },
      listAdLink() {
        let ad_link_query_param = {
          channel_code: this.channel_code_value,
          keyword: this.search_keyword
        }
        pageListAdLink({
            page_num: this.pageNum,
            page_size: this.pageSize,
            query_param: ad_link_query_param
          }
        ).then(res => {
            if (res.data.data != null) {
              this.tableData = res.data.data.list;
              for (const adv_link of this.tableData) {
                const os_type = adv_link.os_type;
                if (os_type === 1) {
                  adv_link.os_type = "安卓"
                } else if (os_type === 2) {
                  adv_link.os_type = "IOS"
                }
              }
              this.total = res.data.data.total;
              this.hasNext = res.data.data.hasNext;
            }
          }
        );
      },
      /**
       * 触发添加链接
       */
      activeAdLinkAdd() {
        this.dialogVisible = true
      },
      closeAdLinkAdd() {
        // 关闭时重置表单
        this.$refs.formRef.resetFields()
      },
      /**
       * 添加链接
       */
      handleAdvLinkAdd() {
        const adv_link_info = {
          channel_code: this.link_form.channel_code,
          os_type: this.link_form.os_type,
          app_name: this.link_form.app_name,
          link_code: this.link_form.link_code,
          download_link: this.link_form.download_link,
          click_link: this.link_form.click_link,
          show_link: this.link_form.show_link,
          extra_info: this.link_form.extra_info
        }
        addAdvLink(adv_link_info).then(res => {
            console.log('广告主链接添加完成:', res)
            this.closeAdLinkAdd();
          }
        );
      }
    },
    computed: {
      canSubmit() {
        return this.briefIntroduction === '';
      }
    },
    created() {
      this.listAdChannelCode();
      this.listAdLink();
    }
  }
</script>

<style lang="scss" scoped>

  .ad-data-wrapper {
  }

  .ad-data-list-content {
    //padding-top: 20px;
    display: flex;
  }

  .ad-data-list {
    //min-width: 584px;
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

  .issue-brief-introduction {
    width: 60%;
  }

  .ad-data-info-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .ad-data-info-button {
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

  .pick-form-inline {
    padding: 0 10px;
  }

  .pick-form-item {
    padding-right: 30px;
  }


  .ad-data {
    height: 50px;
    padding-bottom: 10px;
    cursor: default;
  }

  .tool-content {
    cursor: pointer;
  }

  .app-name-input {
    max-width: 200px;
  }

  .adv-link-search {
    width: 300px;
  }

  .adv-link-item {
    width: 300px;
  }
</style>
