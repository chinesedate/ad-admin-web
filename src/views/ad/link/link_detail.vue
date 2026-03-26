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
          <!--显示模式-->
          <el-form v-if="advLinkFormShow" ref="formRef" :model="advLinkInfo" label-width="100px">
            <!-- 一行显示4个表单项 -->
            <el-row :gutter="20">
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
              <el-col :span="6">
                <el-form-item label="应用名称：">
                  <span>{{advLinkInfo.app_name || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="链接标识：">
                  <span>{{advLinkInfo.link_code || '-'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="adv-link-form-item" label="下载链接：">
              <span class="ellipsis-link">{{longUrl || '-'}}</span>
            </el-form-item>
            <el-form-item class="adv-link-form-item" label="点击链接：">
              <span>{{advLinkInfo.click_link || '-'}}</span>
            </el-form-item>
            <el-form-item class="adv-link-form-item" label="曝光链接：">
              <span>{{advLinkInfo.show_link || '-'}}</span>
            </el-form-item>
            <el-form-item class="adv-link-form-item" label="额外信息：">
              <span>{{advLinkInfo.extra_info || '-'}}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAdvLinkFormEditClick">编辑</el-button>
            </el-form-item>
          </el-form>
          <!--编辑模式-->
          <el-form v-else ref="formRef" :model="link_form" :rules="rules" label-width="100px">
            <!-- 一行显示4个表单项 -->
            <el-row :gutter="20">
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
              <el-col :span="6">
                <el-form-item label="应用名称：">
                  <span>{{advLinkInfo.app_name || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="链接标识：">
                  <span>{{advLinkInfo.link_code || '-'}}</span>
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
              <el-button @click="handleAdvLinkFormEditCancel" plain>取消</el-button>
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
        longUrl: 'https://www.example.com/very/long/url/that/will/definitely/dd',
        advLinkFormShow: true,
        // 折叠面板默认展开item
        collapseName: 'first',
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
      /**
       * 触发广告主链接进入编辑状态
       */
      handleAdvLinkFormEditClick() {
        this.advLinkFormShow = false;
      },
      /**
       * 广告主链接取消编辑状态
       */
      handleAdvLinkFormEditCancel() {
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
