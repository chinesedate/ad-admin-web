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
          <el-form v-show="advLinkFormShow" :model="advLinkInfo" label-width="100px">
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
              <span class="ellipsis-link">{{advLinkInfo.download_link || '-'}}</span>
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
          <el-form v-show="!advLinkFormShow" ref="formRef" :model="link_form" :rules="rules" label-width="100px">
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
                <el-form-item label="应用名称：" prop="app_name">
                  <el-input class="adv-link-item" v-model="link_form.app_name" placeholder="请输入应用名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
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
            <el-form-item label="额外信息：" prop="extra_info">
              <el-input
                v-model="link_form.extra_info"
                type="textarea"
                :rows="3"
                maxlength="2000"
                show-word-limit
                placeholder="请输入应用描述"
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
  import {getAdvLink, updateAdvLink} from "@/api/ad-data";

  export default {
    name: "link-detail",
    props: {
      linkId: Number
    },
    data() {
      return {
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
        advLinkInfo: {
          channel_name: '',
          channel_code: '',
          os_type: 1,
          os_type_str: '',
          app_name: '',
          link_code: '',
          download_link: '',
          click_link: '',
          show_link: '',
          extra_info: ''
        },
        link_form: {
          app_name: '',
          link_code: '',
          download_link: '',
          click_link: '',
          show_link: '',
          extra_info: ''
        },
        rules: {
          app_name: [
            {required: true, message: '请输入应用名称', trigger: 'blur'}
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
        // 将展示对象中的数据复制都form表单中
        this.link_form.app_name = this.advLinkInfo.app_name;
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
              this.advLinkInfo.link_code = this.link_form.link_code;
              this.advLinkInfo.download_link = this.link_form.download_link;
              this.advLinkInfo.click_link = this.link_form.click_link;
              this.advLinkInfo.show_link = this.link_form.show_link;
              this.advLinkInfo.extra_info = this.link_form.extra_info;
              this.advLinkFormShow = true;
            });
          } else {
            // 校验失败，提示用户
            this.$message.warning('请填写完整且正确的信息');
            return false;
          }
        });
      },
      handlePageChange() {
        this.listAdData()
      },
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
