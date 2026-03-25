<template>
  <div class="audit-tool-wrapper">
    <el-page-header @back="goBackAdvList" content="链接详情">
    </el-page-header>
    <div class="adv-link-wrapper">
      <el-collapse v-model="collapseName">
        <el-collapse-item name="first">
          <template #title>
            <div class="adv-link-info-header">广告主链接信息</div>
          </template>
          <el-form ref="formRef" :model="link_form" :rules="rules" label-width="100px">
            <!-- 一行显示4个表单项 -->
            <el-row :gutter="20">
              <el-col :span="4">
                <el-form-item label="渠道：" prop="channel_code">
                  <el-select
                    v-model="advLinkInfo.channel_code"
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
              </el-col>
              <el-col :span="4">
                <el-form-item label="系统类型：" prop="os_type">
                  <el-radio-group v-model="advLinkInfo.os_type">
                    <el-radio :label="1">安卓</el-radio>
                    <el-radio :label="2">IOS</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="应用名称：" prop="app_name">
                  <el-input class="adv-link-item" v-model="advLinkInfo.app_name" placeholder="请输入应用名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="链接标识：" prop="link_code">
                  <el-input class="adv-link-item" v-model="advLinkInfo.link_code" placeholder="请输入链接标识"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="下载链接：" prop="download_link">
              <el-input v-model="advLinkInfo.download_link" maxlength="2000" show-word-limit
                        placeholder="请输入下载链接"/>
            </el-form-item>
            <el-form-item label="点击链接：" prop="click_link">
              <el-input v-model="advLinkInfo.click_link" maxlength="4000" show-word-limit
                        placeholder="请输入点击监测链接"/>
            </el-form-item>
            <el-form-item label="曝光链接：" prop="show_link">
              <el-input v-model="advLinkInfo.show_link" maxlength="4000" show-word-limit
                        placeholder="请输入曝光监测链接"/>
            </el-form-item>
            <el-form-item label="额外信息：" prop="extra_info">
              <el-input
                v-model="advLinkInfo.extra_info"
                type="textarea"
                :rows="3"
                maxlength="2000"
                show-word-limit
                placeholder="请输入应用描述"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">编辑</el-button>
              <el-button>取消</el-button>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="audit-tool-list-content">
      <div class="audit-tool-list">
        <div class="audit-tool-list-header">媒体链接列表</div>
        <ul>
          <li class="audit-tool" v-for="auditTool in auditToolList" :key="auditTool.id"
              @click="handleAuditToolClick(auditTool)">
            <div class="tool-content">{{auditTool.name}}</div>
            <div class="tool-content"><p>{{auditTool.description}}</p></div>
          </li>
        </ul>
        <div class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page="currentPage"
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

  </div>
</template>

<script>
  import {getAdvLink} from "@/api/ad-data";

  export default {
    name: "link-detail",
    props: {
      linkId: Number
    },
    data() {
      return {
        // 折叠面板默认展开item
        collapseName:'first',
        pageNum: 0,
        pageSize: 10,
        total: 0,
        hasNext: false,
        currentPage: 1,
        auditToolList: [],
        /**
         * 广告主链接信息
         */
        advLinkInfo: {},
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
    methods: {
      goBackAdvList() {
        // 回到数据列表页
        this.$router.push({path: '/ad_link'});
      },
      // handlePageChange() {
      //
      // },
      // handleAdopt() {
      //   auditTool({id: this.auditToolInfo.id, status: 1}).then(res => {
      //       if (res != null) {
      //         console.log(res);
      //         this.listAuditTool();
      //       }
      //     }
      //   );
      // },
      // handleReject() {
      //   auditTool({id: this.auditToolInfo.id, status: 2}).then(
      //     res => {
      //       if (res != null) {
      //         console.log(res);
      //         this.listAuditTool();
      //       }
      //     }
      //   );
      // },
      // fetchAuditTool(auditToolId) {
      //   fetchAuditTool(auditToolId).then(res => {
      //     this.auditToolInfo = res.data.data;
      //   });
      // },
      // handleAuditToolClick(auditTool) {
      //   // 首先将列表中的简短信息赋值给待审核对象，然后通过接口查询详细信息后再更新
      //   this.auditToolInfo = auditTool;
      //   this.fetchAuditTool(auditTool.id);
      // },
      // listAuditTool() {
      //   listAuditTool({
      //       pageNum: this.pageNum,
      //       pageSize: this.pageSize,
      //       data: {questionId: 1111}
      //     }
      //   ).then(res => {
      //       if (res.data.data != null) {
      //         this.auditToolList = res.data.data.list;
      //         this.total = res.data.data.total;
      //         this.hasNext = res.data.data.hasNext;
      //         if (this.auditToolList.length > 0) {
      //           this.fetchAuditTool(this.auditToolList[0].id);
      //         }
      //       }
      //     }
      //   );
      // },
      /**
       * 查询广告主链接信息
       */
      queryAdvLink() {
        getAdvLink(this.linkId).then(res => {
          if (res.data.data != null) {
            this.advLinkInfo = res.data.data;
            const os_type = this.advLinkInfo.os_type;
            if (os_type === 1) {
              this.advLinkInfo.os_type = "安卓"
            } else if (os_type === 2) {
              this.advLinkInfo.os_type = "IOS"
            }
          }
        });
      }
    },
    created() {
      this.queryAdvLink();
    }
  }
</script>

<style lang="scss" scoped>

  .audit-tool-wrapper {
  }

  .adv-link-wrapper {
    padding-top: 40px;
  }

  .audit-tool-list-content {
    padding-top: 20px;
    display: flex;
  }

  .audit-tool-list {
    min-width: 584px;
    max-width: 1300px;
  }

  .adv-link-info-header {
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding: 20px 0;
  }

  .audit-tool-list-header {
    font-weight: 600;
    //font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .audit-tool-info {

  }

  .audit-tool-info-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .audit-tool-info-button {
    padding-top: 10px;
  }

  .page-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .audit-tool {
    height: 50px;
    padding-bottom: 10px;
    cursor: default;
  }

  .tool-content {
    cursor: pointer;
  }
</style>
