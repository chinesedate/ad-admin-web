<template>
  <div class="ad-data-wrapper" ref="listWrapper">
    <div class="ad-data-list-content">
      <div class="ad-data-list">
        <div class="ad-data-list-header">链接列表</div>
        <el-form :inline="true" class="pick-form-inline">
          <el-form-item class="pick-form-item" label="渠道名称">
            <el-select
              v-model="channel_code_value"
              filterable
              clearable
              @change="handleAdvLinkQuery"
              placeholder="请选择">
              <el-option
                v-for="item in channel_adv_code_list"
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
          row-key="id"
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
              <el-button class="adv-link-operate-button" type="primary" size="mini"
                         @click="modifyLinkDetail(scope.row.id)">详情
              </el-button>
              <el-popconfirm title="确定删除吗？" @confirm="handleAdvLinkRemove(scope.row)">
                <template #reference>
                  <el-button class="adv-link-operate-button" type="danger" size="mini">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div ref="pageWrapper" class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page.sync="pageNum"
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
        <el-form-item label="渠道：" prop="channel_code">
          <el-select
            v-model="link_form.channel_code"
            filterable
            placeholder="请选择">
            <el-option
              v-for="item in channel_adv_code_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统类型：" prop="os_type">
          <el-radio-group v-model="link_form.os_type">
            <el-radio :label="1">安卓</el-radio>
            <el-radio :label="2">IOS</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用名称：" prop="app_name">
          <el-input class="adv-link-item" v-model="link_form.app_name" placeholder="请输入应用名称"/>
        </el-form-item>
        <el-form-item label="链接标识：" prop="link_code">
          <el-input class="adv-link-item" v-model="link_form.link_code" placeholder="请输入链接标识"/>
        </el-form-item>
        <el-form-item label="下载链接：" prop="download_link">
          <el-input v-model="link_form.download_link" maxlength="2000" show-word-limit placeholder="请输入下载链接"/>
        </el-form-item>
        <el-form-item label="点击链接：" prop="click_link">
          <el-input v-model="link_form.click_link" maxlength="4000" show-word-limit placeholder="请输入点击监测链接"/>
        </el-form-item>
        <el-form-item label="曝光链接：" prop="show_link">
          <el-input v-model="link_form.show_link" maxlength="4000" show-word-limit placeholder="请输入曝光监测链接"/>
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
  import {saveAdChannelInfo, pageListAdLink, fetchAdChannelCodeList, addAdvLink, removeAdvLink} from "@/api/ad-data";

  export default {
    name: "AdLink",
    data() {
      return {
        // 保存滚动位置
        savedScrollTop: 0,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        hasNext: false,
        briefIntroduction: '',
        // 广告渠道标识筛选信息列表
        channel_adv_code_list: [],
        // 广告数据列表
        tableData: [],
        app_id_options: [],
        // 选中渠道标识值
        channel_code_value: '',
        // 链接列表搜索关键词
        search_keyword: '',
        searchForm: {},
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
      handlePageChange(page) {
        // 确保 pageNum 被正确设置
        this.pageNum = page
        this.listAdLink()
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
                this.channel_adv_code_list.push({value: channel_code, label: channel_name});
              }
            }
          }
        );
      },
      listAdLink(state = undefined) {
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
              if (state) {
                // 恢复滚动位置
                if (state.scrollTop && this.$refs.listWrapper) {
                  setTimeout(() => {
                    this.$refs.listWrapper.scrollTop = state.scrollTop
                  }, 100)
                }
              }
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
       * 添加广告主链接
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
            this.dialogVisible = false;
            this.closeAdLinkAdd();
            // 刷新广告主链接列表
            this.listAdLink()
          }
        );
      },
      /**
       * 删除链接
       */
      handleAdvLinkRemove(item) {
        const link_id = item.id;
        // 删除广告主链接
        removeAdvLink(link_id).then(() => {
          this.pageNum = 1;
          // 删除成功后，刷新数据列表
          this.listAdLink();
        })
      },
      // 保存当前状态
      saveCurrentState() {
        this.savedState = {
          channel_code_value: this.channel_code_value,
          search_keyword: this.search_keyword,
          pageNum: this.pageNum,
          total: this.total,
          scrollTop: this.$refs.listWrapper?.scrollTop || 0,
          timestamp: Date.now()
        }
        // 保存到 sessionStorage
        sessionStorage.setItem('adLinkState', JSON.stringify(this.savedState))
      },

      // 恢复状态
      restoreState() {
        const savedState = sessionStorage.getItem('adLinkState')
        if (savedState) {
          const state = JSON.parse(savedState)
          this.channel_code_value = state.channel_code_value || ''
          this.search_keyword = state.search_keyword || ''
          this.total = state.total || 0
          // 关键修复：先恢复页码，再请求列表
          this.pageNum = state.pageNum || 1

          // 传入状态，加载列表
          this.listAdLink(state)
        } else {
          this.listAdLink()
        }
      },

      // 清理状态
      clearState() {
        sessionStorage.removeItem('adLinkState')
        this.savedState = null
      },
      // 跳转详情
      modifyLinkDetail(id) {
        // 保存当前状态
        this.saveCurrentState()
        // 跳转到详情页
        this.$router.push({
          path: `/ad_link/${id}`,
          query: {fromList: 'true'}
        })
      }
    },
    computed: {
      canSubmit() {
        return this.briefIntroduction === '';
      }
    },
    created() {
      this.listAdChannelCode();
      // 注意：不在 created 中调用 listAdLink，让 restoreState 决定是否加载
      // // 如果没有保存的状态，才加载初始数据
      // const savedForm = sessionStorage.getItem('adLinkState');
      // if (!savedForm) {
      //   console.log('AdLink 23333332222')
      //   this.listAdLink();
      // } else {
      //   console.log('AdLink 22222')
      //   this.restoreState();
      // }
      console.log('AdLink created')
    },
    // 使用 beforeRouteEnter 和 beforeRouteLeave
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 检查是否从详情页返回
        const fromDetail = from.path.match(/\/ad_link\/\d+$/)
        if (fromDetail) {
          console.log('111111111111')
          vm.restoreState()
        } else {
          // // 检查是否有保存的状态（浏览器刷新）
          // const savedState = sessionStorage.getItem('adLinkState')
          // if (savedState) {
          //   vm.restoreState()
          // } else {
          console.log('222222222222')
          vm.listAdLink()
          // }
        }
      })
    },

    beforeRouteLeave(to, from, next) {
      // 判断是否跳转到详情页
      const isGoingToDetail = to.path.match(/\/ad_link\/\d+$/)

      if (isGoingToDetail) {
        // 跳转到详情页，保存状态
        this.saveCurrentState()
      } else {
        // 不是跳转到详情页，清理状态
        this.clearState()
      }

      next()
    },

    // 组件销毁前清理
    beforeDestroy() {
      // 如果不是跳转到详情页，清理状态
      const isGoingToDetail = this.$router.currentRoute?.path?.match(/\/ad_link\/\d+$/)
      if (!isGoingToDetail) {
        this.clearState()
      }
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

  .adv-link-operate-button {
    margin-right: 10px;
  }
</style>
